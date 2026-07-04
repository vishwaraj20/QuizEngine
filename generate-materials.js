const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'frontend', 'public', 'materials', 'TCS');

function walkDir(dir) {
    const result = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'index.json') continue;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            result.push({
                name: file,
                type: 'folder',
                children: walkDir(filePath)
            });
        } else {
            const relativePath = filePath.split(path.sep + 'public' + path.sep)[1].replace(/\\/g, '/');
            result.push({
                name: file,
                type: 'file',
                path: '/' + relativePath,
                size: stat.size
            });
        }
    }
    return result;
}

const data = walkDir(rootDir);
fs.writeFileSync(path.join(rootDir, 'index.json'), JSON.stringify(data, null, 2));
console.log('Successfully generated index.json');
