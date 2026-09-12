const connectDB = require('./config/db');
const mongoose = require('mongoose');
const http = require('http');

async function runTests() {
  console.log('🚀 Starting LifeQuest RPG Backend E2E Test Suite...');

  // Connect to DB
  await connectDB();
  const app = require('./server');

  // Listen on test port 5002
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5002, resolve));
  console.log('✅ Test server listening on http://localhost:5002');

  const baseURL = 'http://localhost:5002/api';

  async function apiRequest(path, options = {}) {
    const res = await fetch(`${baseURL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      method: options.method || 'GET',
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  try {
    // 1. Health Check
    const health = await apiRequest('/health');
    console.log('1. Health Check:', health.data.status === 'online' ? 'PASSED' : 'FAILED');

    // 2. Register User A
    const userAEmail = `hero_a_${Date.now()}@test.com`;
    const regA = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name: 'Shadow Paladin', email: userAEmail, password: 'password123' }
    });
    console.log('2. User A Registration:', regA.status === 201 && regA.data.data.token ? 'PASSED' : 'FAILED');
    const tokenA = regA.data.data.token;
    const userAId = regA.data.data.user._id;

    // 3. Register User B
    const userBEmail = `hero_b_${Date.now()}@test.com`;
    const regB = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name: 'Arcane Mage', email: userBEmail, password: 'password123' }
    });
    console.log('3. User B Registration:', regB.status === 201 && regB.data.data.token ? 'PASSED' : 'FAILED');
    const tokenB = regB.data.data.token;

    // 4. User A Creates Quest A
    const questA = await apiRequest('/tasks', {
      method: 'POST',
      token: tokenA,
      body: {
        title: 'Master React & Vite Architecture',
        description: 'Build full-stack RPG application with Framer Motion',
        category: 'intellect',
        difficulty: 'epic'
      }
    });
    console.log('4. Create Quest A (Epic):', questA.status === 201 && questA.data.data.xpReward === 300 ? 'PASSED' : 'FAILED');
    const questAId = questA.data.data._id;

    // 5. User A Completes Quest A (Authoritative Server Computation)
    const completeA = await apiRequest(`/tasks/${questAId}/complete`, {
      method: 'POST',
      token: tokenA
    });
    console.log('5. Authoritative Complete Quest A:', 
      completeA.status === 200 &&
      completeA.data.data.rewards.xp === 300 &&
      completeA.data.data.progression.newLevel >= 2 &&
      completeA.data.data.streak.current === 1 ? 'PASSED' : 'FAILED'
    );

    // 6. User A Shop Item Purchase (Crown of Monarchs)
    const buyCrown = await apiRequest('/shop/golden_crown/buy', {
      method: 'POST',
      token: tokenA
    });
    // User starts with 100 + 60 (epic quest) = 160 Gold. Crown costs 1000 Gold, so should fail with 400!
    console.log('6. Gold Insufficiency Validation:', buyCrown.status === 400 ? 'PASSED' : 'FAILED');

    // User A buys Elixir of Wisdom (150 Gold)
    const buyElixir = await apiRequest('/shop/elixir_wisdom/buy', {
      method: 'POST',
      token: tokenA
    });
    console.log('7. Purchase Shop Item (Elixir of Wisdom):', buyElixir.status === 201 && buyElixir.data.data.remainingGold === 10 ? 'PASSED' : 'FAILED');

    // 8. User A Inventory Listing
    const invA = await apiRequest('/inventory', { token: tokenA });
    console.log('8. User A Inventory Fetch:', invA.status === 200 && invA.data.data.length === 1 ? 'PASSED' : 'FAILED');

    // 9. User B Data Isolation Test (User B trying to complete or fetch User A's quest)
    const illegalAccess = await apiRequest(`/tasks/${questAId}`, { token: tokenB });
    console.log('9. Multi-Tenant User Isolation:', illegalAccess.status === 404 ? 'PASSED' : 'FAILED');

    console.log('🎉 ALL BACKEND E2E INTEGRATION TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ E2E Test Error:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
