/**
 * Master Test Suite for Nexume Backend
 * Runs all essential API tests in sequence
 */

const { execSync } = require("child_process");
const fs = require("fs");

const testFiles = [
  "test-user-apis.js",
  "test-job-apis.js",
  "test-resume-apis.js",
  "test-resume-processing.js",
  "test-enhanced-matching.js",
  "test-gemini.js",
];

console.log("🧪 Running Nexume Backend Test Suite\n");
console.log("=".repeat(50));

let passed = 0;
let failed = 0;

for (const testFile of testFiles) {
  try {
    console.log(`\n📋 Running ${testFile}...`);
    console.log("-".repeat(30));

    if (fs.existsSync(testFile)) {
      execSync(`node ${testFile}`, { stdio: "inherit" });
      console.log(`✅ ${testFile} completed`);
      passed++;
    } else {
      console.log(`⚠️  ${testFile} not found - skipping`);
    }
  } catch (error) {
    console.error(`❌ ${testFile} failed`);
    failed++;
  }

  console.log("-".repeat(30));
}

console.log("\n" + "=".repeat(50));
console.log(`🏁 Test Suite Complete`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(
  `📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
);
console.log("=".repeat(50));
