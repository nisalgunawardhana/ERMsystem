
const {
    sanitizeInput,
    sanitizeReqBody,
    sanitizeObjectId,
    sanitizeParams
} = require('../middlewares/inputSanitizer');

console.log('🔍 Testing Input Sanitizer...\n');

// Test 1: Basic NoSQL injection attempts
console.log('Test 1: Basic NoSQL injection attempts');
const maliciousInputs = [
    { $ne: null },
    { $gt: "" },
    { name: { $regex: "admin" } },
    { $where: "this.name == 'admin'" },
    "{ $ne: null }",
    "$ne",
    "javascript:alert('xss')"
];

maliciousInputs.forEach((input, index) => {
    const sanitized = sanitizeInput(input);
    console.log(`  ${index + 1}. Input: ${JSON.stringify(input)}`);
    console.log(`     Output: ${JSON.stringify(sanitized)}`);
});

console.log('\n');

// Test 2: Valid inputs should remain unchanged
console.log('Test 2: Valid inputs should remain unchanged');
const validInputs = [
    { name: "John Doe", email: "john@example.com" },
    "normal string",
    123,
    true,
    ["array", "values"]
];

validInputs.forEach((input, index) => {
    const sanitized = sanitizeInput(input);
    const unchanged = JSON.stringify(input) === JSON.stringify(sanitized);
    console.log(`  ${index + 1}. Input: ${JSON.stringify(input)}`);
    console.log(`     Unchanged: ${unchanged ? '✅' : '❌'}`);
});

console.log('\n');

// Test 3: ObjectId validation
console.log('Test 3: ObjectId validation');
const objectIdTests = [
    "507f1f77bcf86cd799439011", // Valid ObjectId
    "invalid-id",                 // Invalid ObjectId
    "$ne",                        // Malicious input
    "",                          // Empty string
    null                         // Null value
];

objectIdTests.forEach((input, index) => {
    const sanitized = sanitizeObjectId(input);
    console.log(`  ${index + 1}. Input: ${input}`);
    console.log(`     Output: ${sanitized}`);
});

console.log('\n');

// Test 4: Request body sanitization
console.log('Test 4: Request body sanitization');
const reqBodyTest = {
    name: "John Doe",
    $ne: null,
    filter: { $regex: "admin" },
    validField: "validValue",
    $where: "malicious code"
};

const sanitizedReqBody = sanitizeReqBody(reqBodyTest);
console.log('  Original req.body:', JSON.stringify(reqBodyTest, null, 2));
console.log('  Sanitized req.body:', JSON.stringify(sanitizedReqBody, null, 2));

console.log('\n✅ Input sanitizer tests completed!');
console.log('💡 The sanitizer removes MongoDB operators and dangerous patterns while preserving valid data.');