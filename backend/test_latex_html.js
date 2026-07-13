const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Latex = require('react-latex-next').default;

const html = ReactDOMServer.renderToString(React.createElement(Latex, null, "Hello <b>world</b> $x^2$"));
console.log(html);
