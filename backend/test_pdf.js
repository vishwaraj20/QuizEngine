const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('../data/gate_extracted/cse 2023.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('pdf_output.txt', data.text);
    console.log('PDF extracted to pdf_output.txt');
    console.log('Number of pages:', data.numpages);
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
