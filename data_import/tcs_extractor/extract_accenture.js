const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const sourceDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'materials', 'ACCENTURE');
const targetDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'materials', 'ACCENTURE_text');

async function extractText(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    try {
        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else if (ext === '.txt') {
            return fs.readFileSync(filePath, 'utf-8');
        } else {
            return `Cannot extract text from ${ext} file format automatically.`;
        }
    } catch (e) {
        console.error(`Error extracting from ${filePath}:`, e.message);
        return `[Error extracting content: ${e.message}]`;
    }
}

async function processDirectory(dir, currentRelativePath = '') {
    const items = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file === 'index.json') continue;
        
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            const targetDirPath = path.join(targetDir, currentRelativePath, file);
            if (!fs.existsSync(targetDirPath)) {
                fs.mkdirSync(targetDirPath, { recursive: true });
            }
            items.push({
                name: file,
                type: 'folder',
                children: await processDirectory(filePath, path.join(currentRelativePath, file))
            });
        } else {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const newFileName = baseName + '.txt';
            const targetFilePath = path.join(targetDir, currentRelativePath, newFileName);
            const webPath = '/materials/ACCENTURE_text/' + (currentRelativePath ? currentRelativePath.replace(/\\/g, '/') + '/' : '') + newFileName;
            
            console.log(`Processing: ${file}`);
            const textContent = await extractText(filePath);
            
            fs.writeFileSync(targetFilePath, textContent, 'utf-8');
            
            items.push({
                name: baseName,
                type: 'file',
                path: webPath,
                size: Buffer.byteLength(textContent, 'utf8')
            });
        }
    }
    return items;
}

async function run() {
    console.log('Starting Accenture extraction...');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const tree = await processDirectory(sourceDir);
    fs.writeFileSync(path.join(targetDir, 'index.json'), JSON.stringify(tree, null, 2));
    console.log('Finished Accenture extraction! Wrote index.json');
}

run();
