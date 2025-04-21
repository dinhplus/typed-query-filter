// Debug script to test regex pattern against user names
const users = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
  { name: 'David' },
  { name: 'Eve' }
];

// The regex pattern from our failing test: /^.{4,}.*i/i
const pattern = /^.{4,}.*i/i;

console.log('Testing regex pattern:', pattern);
console.log('---------------------------');

for (const user of users) {
  const result = pattern.test(user.name);
  console.log(`${user.name}: ${result}`);
}

// Test explicitly what each part of the pattern does
console.log('\nTesting pattern components:');
console.log('---------------------------');
for (const user of users) {
  const lengthTest = /^.{4,}/.test(user.name);
  const containsI = /i/i.test(user.name);
  console.log(`${user.name}: length >= 4: ${lengthTest}, contains 'i': ${containsI}`);
}
