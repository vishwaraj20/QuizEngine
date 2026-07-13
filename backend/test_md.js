const Latex = require('react-latex-next'); // we can't require react components in simple node script easily
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

let str = "[Q.65] The forwarding table of a router is shown below.\n```\nSubnet Number   | Subnet Mask\n----------------|-----------------\n200.150.0.0     | 255.255.0.0\n```\nA packet addressed";

console.log("DEFAULT MARKDOWN-IT:");
console.log(md.render(str));

let fixedStr = str.replace(/```/g, '\n```\n');
console.log("FIXED MARKDOWN-IT:");
console.log(md.render(fixedStr));
