/**
 * Test Gemini API Connection - Ultra Simple
 */

console.log("🔍 Testing Gemini API Setup...\n");

// Test 1: Check if dotenv is working
require("dotenv").config();
const apiKey = process.env.GEMINI_API_KEY;

console.log("📋 Environment Check:");
console.log("   GEMINI_API_KEY:", apiKey ? "✅ Set" : "❌ Not set");

if (!apiKey) {
  console.log("❌ Cannot proceed without API key");
  process.exit(1);
}

// Test 2: Check if package is installed
try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  console.log("   @google/generative-ai package: ✅ Installed");

  // Test 3: Try to initialize
  console.log("\n📡 Testing Gemini initialization...");
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log("   Gemini client: ✅ Initialized");

  // Test 4: Try basic API call
  console.log("   Testing API call...");
  testAPI(genAI);
} catch (error) {
  console.log("   @google/generative-ai package: ❌ Error");
  console.log("   Error:", error.message);
}

async function testAPI(genAI) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      "Say 'Hello World' and nothing else."
    );
    const response = await result.response;
    const text = response.text().trim();

    console.log("   API Response: ✅ Success");
    console.log("   Response:", text);

    if (text.includes("Hello World")) {
      console.log("\n🎉 Gemini API is working perfectly!");
    } else {
      console.log("\n⚠️ API is working but response is unexpected");
    }
  } catch (error) {
    console.log("   API Response: ❌ Failed");
    console.log("   Error:", error.message);

    if (error.message.includes("API_KEY")) {
      console.log("\n💡 API Key Issues:");
      console.log("   1. The API key might be invalid");
      console.log("   2. The key might not have Gemini API access");
      console.log("   3. Check Google Cloud Console for restrictions");
    } else if (error.message.includes("quota")) {
      console.log("\n💡 Quota Issues:");
      console.log("   1. You might have exceeded your daily quota");
      console.log("   2. Wait a few hours and try again");
    }
  }
}
