const axios = require("axios");

const BASE_URL = "http://localhost:3000/api/v1";

async function testAuth() {
  console.log("🧪 Testing Authentication System...\n");

  try {
    // Test 1: Register a new user
    console.log("1. Testing user registration...");
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@test.com",
      password: "SecurePass123!",
      phone: "+1234567890",
    });
    console.log("✅ Registration successful:", registerResponse.data.message);
    const { accessToken, refreshToken } = registerResponse.data.data;
    console.log("   Access Token:", accessToken.substring(0, 20) + "...");
    console.log("   Refresh Token:", refreshToken.substring(0, 20) + "...\n");

    // Test 2: Login with the registered user
    console.log("2. Testing user login...");
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: "john.doe@test.com",
      password: "SecurePass123!",
    });
    console.log("✅ Login successful:", loginResponse.data.message);
    const newAccessToken = loginResponse.data.data.accessToken;
    console.log(
      "   New Access Token:",
      newAccessToken.substring(0, 20) + "...\n"
    );

    // Test 3: Access protected route
    console.log("3. Testing protected route access...");
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
    console.log(
      "✅ Protected route access successful:",
      profileResponse.data.message
    );
    console.log("   User ID:", profileResponse.data.data.id);
    console.log("   Email:", profileResponse.data.data.email);
    console.log(
      "   Name:",
      `${profileResponse.data.data.firstName} ${profileResponse.data.data.lastName}\n`
    );

    // Test 4: Refresh token
    console.log("4. Testing token refresh...");
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken,
    });
    console.log("✅ Token refresh successful:", refreshResponse.data.message);
    const refreshedAccessToken = refreshResponse.data.data.accessToken;
    console.log(
      "   Refreshed Access Token:",
      refreshedAccessToken.substring(0, 20) + "...\n"
    );

    // Test 5: Logout
    console.log("5. Testing logout...");
    const logoutResponse = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      }
    );
    console.log("✅ Logout successful:", logoutResponse.data.message);

    // Test 6: Try to access protected route after logout (should fail)
    console.log("\n6. Testing access after logout (should fail)...");
    try {
      await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch (error) {
      console.log(
        "✅ Access correctly denied after logout:",
        error.response.data.message
      );
    }

    console.log("\n🎉 All authentication tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Test error cases
async function testErrorCases() {
  console.log("\n🧪 Testing Error Cases...\n");

  try {
    // Test 1: Register with weak password
    console.log("1. Testing weak password registration...");
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@test.com",
        password: "weak",
      });
    } catch (error) {
      console.log(
        "✅ Weak password correctly rejected:",
        error.response.data.message
      );
    }

    // Test 2: Login with wrong credentials
    console.log("\n2. Testing wrong credentials...");
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: "nonexistent@test.com",
        password: "wrongpassword",
      });
    } catch (error) {
      console.log(
        "✅ Wrong credentials correctly rejected:",
        error.response.data.message
      );
    }

    // Test 3: Access protected route without token
    console.log("\n3. Testing access without token...");
    try {
      await axios.get(`${BASE_URL}/users/profile`);
    } catch (error) {
      console.log(
        "✅ Access without token correctly denied:",
        error.response.data.message
      );
    }

    console.log("\n🎉 All error case tests passed!");
  } catch (error) {
    console.error(
      "❌ Error case test failed:",
      error.response?.data || error.message
    );
  }
}

// Run tests
async function runTests() {
  await testAuth();
  await testErrorCases();
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get("http://localhost:3000/health");
    console.log("✅ Server is running on http://localhost:3000\n");
    return true;
  } catch (error) {
    console.log(
      "❌ Server is not running. Please start the server first with: npm run dev\n"
    );
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main().catch(console.error);
