const str1 = '${a^m b^n \\mid 1 \\le m \\text{ and } n < m\\}$';
const str2 = '${a, b}$';

function sanitize(str) {
  return str.replace(/(?<!\\)\$\{/g, '$\\{').replace(/(?<!\\)\}\$/g, '\\}$');
}

console.log('str1:', sanitize(str1));
console.log('str2:', sanitize(str2));
