const waitOn = require('wait-on');
const axios = require('axios');

// Check if emulator hub is ready (most reliable method)
const checkEmulatorHub = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:4400/emulators', {
      timeout: 5000,
    });
    console.log('✅ Emulator Hub ready');
    return response.data;
  } catch (error) {
    throw new Error('Emulator Hub not ready yet');
  }
};

// Check individual emulators
const checkIndividualEmulators = async () => {
  const checks = [
    { name: 'Auth', url: 'http://127.0.0.1:9099' },
    { name: 'Functions', url: 'http://127.0.0.1:5001/flare-7091a/us-central1' },
  ];

  for (const check of checks) {
    try {
      await axios.get(check.url, { timeout: 5000 });
      console.log(`✅ ${check.name} emulator ready`);
    } catch (error) {
      // For Functions, a 404 is actually OK - it means the endpoint exists
      if (check.name === 'Functions' && error.response?.status === 404) {
        console.log('✅ Functions emulator ready');
        continue;
      }
      throw new Error(`${check.name} emulator not ready: ${error.message}`);
    }
  }
};

const waitForEmulators = async (maxAttempts = 30, delay = 2000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Checking emulators... Attempt ${attempt}/${maxAttempts}`);

    try {
      await checkEmulatorHub();
      await checkIndividualEmulators();
      console.log('🎉 All emulators are ready!');
      return true;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error('❌ Failed to start emulators within timeout');
        throw error;
      }
      console.log(`⏳ Emulators not ready, waiting ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

waitForEmulators()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to start emulators:', error.message);
    process.exit(1);
  });
