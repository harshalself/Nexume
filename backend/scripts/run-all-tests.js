/**
 * Master Test Suite for Nexume Backend
 * Runs all API tests in optimized sequence
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Test files in logical execution order
const testFiles = [
  "test-user-apis.js",
  "test-job-apis.js",
  "test-resume-apis.js",
  "test-resume-processing.js",
  "test-enhanced-matching.js",
  "test-candidates-apis.js",
  "test-analytics-apis.js",
  "test-gemini.js",
];

console.log("🧪 Nexume Backend Test Suite\n");
console.log("=".repeat(50));

let passed = 0;
let failed = 0;
const results = [];

for (const testFile of testFiles) {
  try {
    console.log(`\n📋 Running ${testFile}...`);
    console.log("-".repeat(30));

    const testPath = path.join(__dirname, testFile);
    if (fs.existsSync(testPath)) {
      execSync(`node ${testFile}`, { stdio: "inherit", cwd: __dirname });
      console.log(`✅ ${testFile} completed`);
      passed++;
      results.push({ test: testFile, status: "PASSED" });
    } else {
      console.log(`⚠️  ${testFile} not found - skipping`);
      results.push({ test: testFile, status: "SKIPPED" });
    }
  } catch (error) {
    console.error(`❌ ${testFile} failed`);
    failed++;
    results.push({ test: testFile, status: "FAILED" });
  }
  console.log("-".repeat(30));
}

// Summary
console.log("\n" + "=".repeat(50));
console.log(`🏁 Test Suite Complete`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(
  `📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
);
console.log("=".repeat(50));

// Detailed results
console.log("\n📋 Detailed Results:");
results.forEach(({ test, status }) => {
  const emoji = status === "PASSED" ? "✅" : status === "FAILED" ? "❌" : "⚠️";
  console.log(`${emoji} ${test} - ${status}`);
});

process.exit(failed > 0 ? 1 : 0);
