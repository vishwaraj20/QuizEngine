const str = '${a^m b^n \\mid 1 \\le m \\text{ and } n < m\\}$';
const san = str.replace(/\$\{/g, '$\\{').replace(/\}\$/g, '\\}$');
console.log(san);
