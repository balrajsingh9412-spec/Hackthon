const jwt = require('jsonwebtoken');

// Authorized internal Security Audit Suite
async function runSecurityAudit() {
  console.log('🛡️ Starting LifeQuest RPG Security Audit Suite...');
  const baseURL = 'http://localhost:5000/api';

  async function req(path, options = {}) {
    const res = await fetch(`${baseURL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      method: options.method || 'GET',
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    let data;
    try { data = await res.json(); } catch(e) { data = {}; }
    return { status: res.status, data };
  }

  const results = [];

  // Helper logger
  function record(testName, passed, severity, notes) {
    results.push({ testName, passed, severity, notes });
    console.log(`${passed ? '✅' : '❌'} [${severity}] ${testName}: ${passed ? 'PASSED' : 'FAILED'} (${notes})`);
  }

  try {
    // 1. Missing Authentication Token
    const noAuth = await req('/tasks');
    record('Missing Auth Token Handling', noAuth.status === 401, 'High', `HTTP ${noAuth.status}`);

    // 2. Malformed / Fake JWT Token
    const fakeJWT = await req('/tasks', { token: 'invalid.jwt.token.string' });
    record('Malformed JWT Token Handling', fakeJWT.status === 401, 'High', `HTTP ${fakeJWT.status}`);

    // 3. JWT Token Tampering (Signed with incorrect secret)
    const tamperedToken = jwt.sign({ id: '507f1f77bcf86cd799439011' }, 'wrong_secret_key');
    const tamperedRes = await req('/tasks', { token: tamperedToken });
    record('JWT Tampering Protection', tamperedRes.status === 401, 'Critical', `HTTP ${tamperedRes.status}`);

    // Create User A and User B
    const userAEmail = `audit_a_${Date.now()}@test.com`;
    const userBEmail = `audit_b_${Date.now()}@test.com`;

    const regA = await req('/auth/register', { method: 'POST', body: { name: 'User A', email: userAEmail, password: 'password123' } });
    const regB = await req('/auth/register', { method: 'POST', body: { name: 'User B', email: userBEmail, password: 'password123' } });

    const tokenA = regA.data.data.token;
    const tokenB = regB.data.data.token;

    // 4. Authorization / IDOR Protection
    const questA = await req('/tasks', { method: 'POST', token: tokenA, body: { title: 'User A Confidential Quest', category: 'intellect', difficulty: 'easy' } });
    const questAId = questA.data.data._id;

    // User B attempts to access User A's quest
    const idorRead = await req(`/tasks/${questAId}`, { token: tokenB });
    record('IDOR Read Prevention', idorRead.status === 404, 'Critical', `HTTP ${idorRead.status} - Scoped user query`);

    const idorDelete = await req(`/tasks/${questAId}`, { method: 'DELETE', token: tokenB });
    record('IDOR Delete Prevention', idorDelete.status === 404, 'Critical', `HTTP ${idorDelete.status}`);

    // 5. Quest Completion Race Condition (Atomic Execution)
    // 10 concurrent requests to complete Quest A simultaneously!
    const questRace = await req('/tasks', { method: 'POST', token: tokenA, body: { title: 'Concurrent Race Quest', category: 'vitality', difficulty: 'epic' } });
    const raceQuestId = questRace.data.data._id;

    const concurrentCompletes = await Promise.all(
      Array.from({ length: 10 }).map(() => req(`/tasks/${raceQuestId}/complete`, { method: 'POST', token: tokenA }))
    );

    const successCount = concurrentCompletes.filter(r => r.status === 200).length;
    const duplicateCount = concurrentCompletes.filter(r => r.status === 400).length;

    record(
      'Quest Completion Race Condition Mitigation',
      successCount === 1 && duplicateCount === 9,
      'Critical',
      `Successes: ${successCount}, Duplicates Blocked: ${duplicateCount}`
    );

    // 6. Gold Purchase Race Condition (Atomic Deductions)
    // User A has 100 Gold + 60 (easy quest) + 300 (epic race quest) = 460 Gold.
    // Mystic Avatar costs 400 Gold. Send 5 simultaneous purchase requests!
    const concurrentBuys = await Promise.all(
      Array.from({ length: 5 }).map(() => req('/shop/mystic_avatar/buy', { method: 'POST', token: tokenA }))
    );

    const buySuccessCount = concurrentBuys.filter(r => r.status === 201).length;
    const buyFailCount = concurrentBuys.filter(r => r.status === 400).length;

    record(
      'Gold Purchase Race Condition Mitigation',
      buySuccessCount === 1 && buyFailCount === 4,
      'Critical',
      `Purchases Succeeded: ${buySuccessCount}, Insufficient Gold Blocked: ${buyFailCount}`
    );

    // 7. Input Validation & Injection Protection
    const malformedBody = await req('/tasks', { method: 'POST', token: tokenA, body: { title: '', difficulty: 'epic' } });
    record('Input Validation (Empty Title)', malformedBody.status === 400, 'Medium', `HTTP ${malformedBody.status}`);

    console.log('\n🔒 SECURITY AUDIT SUMMARY COMPLETE!');
    return results;
  } catch (err) {
    console.error('Security audit error:', err);
  }
}

runSecurityAudit();
