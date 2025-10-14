import fetch from 'node-fetch';
import assert from 'assert';

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let userId = '';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to retry a fetch operation
const retryFetch = async (url, options = {}, maxRetries = 3, delayMs = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delayMs}ms...`);
      await wait(delayMs);
    }
  }
  throw lastError;
};

const testEndpoints = async () => {
  try {
    // Wait for server to be ready
    await wait(2000);
    // 1. Health Check
    console.log('\n1. Testing Health Check...');
    const healthResponse = await retryFetch(`${BASE_URL}/health`);
    console.log('Health Check Response:', await healthResponse.json());

    // 2. User Registration
    console.log('\n2. Testing User Registration...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123!'
      })
    });
    const registerData = await registerResponse.json();
    console.log('Registration Response:', registerData);
    authToken = registerData.token;

    // 3. User Login
    console.log('\n3. Testing User Login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'Password123!'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);
    authToken = loginData.token;

    // 4. Save Game Progress
    console.log('\n4. Testing Game Progress Save...');
    const gameResponse = await fetch(`${BASE_URL}/games/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        game: 'nback',
        score: 100,
        timeSpent: 300
      })
    });
    console.log('Game Progress Save Response:', await gameResponse.json());

    // 5. Create Journal Entry
    console.log('\n5. Testing Journal Entry Creation...');
    const journalResponse = await fetch(`${BASE_URL}/journal/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Test Journal Entry',
        content: 'This is a test journal entry',
        mood: 'good',
        tags: ['test', 'first-entry']
      })
    });
    console.log('Journal Entry Response:', await journalResponse.json());

    // 6. Create Community
    console.log('\n6. Testing Community Creation...');
    const communityResponse = await fetch(`${BASE_URL}/communities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Test Community',
        description: 'A test community for digital wellness'
      })
    });
    const communityData = await communityResponse.json();
    console.log('Community Creation Response:', communityData);

    // 7. Create Community Post
    console.log('\n7. Testing Community Post Creation...');
    const postResponse = await fetch(`${BASE_URL}/communities/${communityData._id}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        content: 'This is a test post in the community'
      })
    });
    console.log('Community Post Response:', await postResponse.json());

    // 8. Get User Profile
    console.log('\n8. Testing Get User Profile...');
    const profileResponse = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('User Profile Response:', await profileResponse.json());

    // 9. Update User Profile
    console.log('\n9. Testing Profile Update...');
    const updateResponse = await fetch(`${BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Updated Test User',
        preferences: {
          notifications: true,
          theme: 'dark'
        }
      })
    });
    console.log('Profile Update Response:', await updateResponse.json());

    // 10. Get Game Progress
    console.log('\n10. Testing Get Game Progress...');
    const progressResponse = await fetch(`${BASE_URL}/games/progress/nback`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('Game Progress Response:', await progressResponse.json());

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test Error:', error);
  }
};

testEndpoints();