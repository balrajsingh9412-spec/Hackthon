const baseURL = 'http://localhost:5000/api';

async function timedFetch(url, options = {}) {
  const start = performance.now();
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      method: options.method || 'GET',
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const duration = performance.now() - start;
    let data;
    try { data = await res.json(); } catch(e) { data = {}; }
    return { status: res.status, duration, ok: res.ok, data };
  } catch (err) {
    const duration = performance.now() - start;
    return { status: 0, duration, ok: false, error: err.message };
  }
}

async function runVirtualUser(userIdx) {
  const email = `load_user_${Date.now()}_${userIdx}_${Math.random().toString(36).substring(7)}@test.com`;
  const name = `Hero_${userIdx}`;
  const password = 'Password123!';
  const metrics = [];

  // Step 1: Register (User starts with 100 Gold)
  const regRes = await timedFetch(`${baseURL}/auth/register`, {
    method: 'POST',
    body: { name, email, password }
  });
  metrics.push(regRes);

  if (!regRes.ok || !regRes.data?.data?.token) {
    return metrics;
  }
  const token = regRes.data.data.token;

  await new Promise(r => setTimeout(r, 20 + Math.random() * 30));

  // Step 2: Fetch Profile
  const meRes = await timedFetch(`${baseURL}/auth/me`, { token });
  metrics.push(meRes);

  // Step 3: Fetch Quests
  const questsRes = await timedFetch(`${baseURL}/tasks`, { token });
  metrics.push(questsRes);

  // Step 4: Create Epic Quest (+60 Gold -> 160 Gold Total)
  const createRes = await timedFetch(`${baseURL}/tasks`, {
    method: 'POST',
    token,
    body: {
      title: `Load Test Quest by ${name}`,
      description: 'Simulating concurrent load performance test',
      category: 'intellect',
      difficulty: 'epic'
    }
  });
  metrics.push(createRes);

  const taskId = createRes.data?.data?._id;

  if (taskId) {
    await new Promise(r => setTimeout(r, 10 + Math.random() * 20));

    // Step 5: Complete Quest (User now has 160 Gold)
    const completeRes = await timedFetch(`${baseURL}/tasks/${taskId}/complete`, {
      method: 'POST',
      token
    });
    metrics.push(completeRes);
  }

  // Step 6: Fetch Shop Catalog
  const shopRes = await timedFetch(`${baseURL}/shop`, { token });
  metrics.push(shopRes);

  // Step 7: Purchase Elixir of Wisdom (Costs 150 Gold, User has 160 Gold -> Subelement 201 Created)
  const buyRes = await timedFetch(`${baseURL}/shop/elixir_wisdom/buy`, {
    method: 'POST',
    token
  });
  metrics.push(buyRes);

  // Step 8: Fetch Inventory
  const invRes = await timedFetch(`${baseURL}/inventory`, { token });
  metrics.push(invRes);

  return metrics;
}

async function runStage(userCount) {
  console.log(`\n⚡ Running Load Stage: ${userCount} Concurrent Users...`);
  const startTime = performance.now();

  const userPromises = [];
  for (let i = 0; i < userCount; i++) {
    const delay = Math.floor(i * 15);
    const p = new Promise(resolve => setTimeout(resolve, delay)).then(() => runVirtualUser(i));
    userPromises.push(p);
  }

  const results = await Promise.all(userPromises);
  const totalDurationSec = (performance.now() - startTime) / 1000;

  const allRequests = results.flat();
  const totalReqs = allRequests.length;
  const successfulReqs = allRequests.filter(r => r.ok).length;
  const failedReqs = totalReqs - successfulReqs;
  const errorRate = ((failedReqs / totalReqs) * 100).toFixed(2);

  const durations = allRequests.map(r => r.duration).sort((a, b) => a - b);
  const avgLatency = (durations.reduce((a, b) => a + b, 0) / (durations.length || 1)).toFixed(2);
  const medianP50 = durations[Math.floor(durations.length * 0.50)]?.toFixed(2) || '0';
  const p95 = durations[Math.floor(durations.length * 0.95)]?.toFixed(2) || '0';
  const p99 = durations[Math.floor(durations.length * 0.99)]?.toFixed(2) || '0';
  const rps = (totalReqs / totalDurationSec).toFixed(2);

  console.log(`   └─ Users: ${userCount} | Total Requests: ${totalReqs} | RPS: ${rps}`);
  console.log(`   └─ Avg: ${avgLatency}ms | P50: ${medianP50}ms | P95: ${p95}ms | P99: ${p99}ms | Error Rate: ${errorRate}%`);

  return {
    userCount,
    totalReqs,
    rps,
    avgLatency,
    medianP50,
    p95,
    p99,
    errorRate,
    durationSec: totalDurationSec.toFixed(2)
  };
}

async function startFullLoadTest() {
  console.log('=================================================================');
  console.log('🔥 LIFEQUEST RPG — 100 CONCURRENT USERS LOAD & STRESS TEST SUITE');
  console.log('=================================================================');

  const stages = [10, 25, 50, 75, 100, 150];
  const summary = [];

  for (const count of stages) {
    const stageResult = await runStage(count);
    summary.push(stageResult);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n📊 LOAD TEST SUMMARY TABLE:');
  console.table(summary);
  return summary;
}

if (require.main === module) {
  startFullLoadTest();
}

module.exports = { startFullLoadTest };
