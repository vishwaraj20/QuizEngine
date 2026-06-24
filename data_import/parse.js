const fs = require('fs');

const content = fs.readFileSync('raw.txt', 'utf8');

const passage = `In the tireless pursuit of achievement, the contrast between hard work and smart work appears not simply as a preference but as a subtle interplay within human productivity. Hard work—linked with sustained effort, unwavering perseverance, and sheer diligence—has long been praised as the foundation of accomplishment. Stories and biographies often glorify the individual who relies on grit and time to reach goals. Yet in a world shaped by precision tools, automation, and mental efficiency, these older assumptions are increasingly questioned. By contrast, smart work emphasizes strategic deployment of effort—using reflection, optimal resource use, and careful situational judgment. It attempts to reduce waste in labour while boosting returns on both thought and action. Smart workers examine systems, identify bottlenecks, and exploit tools—digital platforms or networks—to accelerate results. They step off the treadmill of one-direction exertion by embedding intelligence into execution. Still, praising smart work alone creates its own weakness. Intelligence without discipline often ends in shallowness—a surface-level capability that collapses under prolonged pressure. In the same way, relentless hard work without strategic course-correction can cause exhaustion and low effectiveness. Thus, modern success demands a blend: the wise worker mixes determination with strategy, working not only harder but better. The contrast is therefore not an either-or divide but a complementary relationship. Treating either extreme as ideal ignores the complex realities of performance. In today’s demanding landscape, the combined force of persistence and precision makes outcomes sustainable and impact stronger. Success, ultimately, is not produced by blind toil or cleverness alone, but by intelligent perseverance.`;

const questions = [];
const parts = ('\n' + content).split(/\nQ(\d+)\.\s*/);

for (let i = 1; i < parts.length; i += 2) {
    const qId = parseInt(parts[i]);
    let qBlock = parts[i+1];
    
    // Extract Ans.(...)
    const ansMatch = qBlock.match(/Ans\.\(([a-d])\)/i);
    let correct = 'A';
    if (ansMatch) {
        correct = ansMatch[1].toUpperCase();
        qBlock = qBlock.slice(0, ansMatch.index).trim();
    }
    
    // find options (a) ... (b) ... (c) ... (d) ...
    const optRegex = /\n\s*\([a-d]\)\s*/gi;
    const optMatches = [];
    let match;
    while ((match = optRegex.exec('\n' + qBlock)) !== null) {
        optMatches.push(match);
    }
    
    const options = { A: '', B: '', C: '', D: '' };
    let qText = qBlock;
    
    if (optMatches.length === 4) {
        qText = ('\n' + qBlock).slice(0, optMatches[0].index).trim();
        options.A = ('\n' + qBlock).slice(optMatches[0].index + optMatches[0][0].length, optMatches[1].index).trim();
        options.B = ('\n' + qBlock).slice(optMatches[1].index + optMatches[1][0].length, optMatches[2].index).trim();
        options.C = ('\n' + qBlock).slice(optMatches[2].index + optMatches[2][0].length, optMatches[3].index).trim();
        options.D = ('\n' + qBlock).slice(optMatches[3].index + optMatches[3][0].length).trim();
    }
    
    // Check passage
    if (qText.includes("Read the following passage") || [84, 85, 86, 87, 88].includes(qId)) {
        const qLines = qText.split('\n');
        const actualQ = qLines[0].trim();
        qText = `${passage}<br><br>${actualQ}`;
    } else {
        qText = qText.replace(/\n/g, ' ');
    }
    
    questions.push({
        id: qId,
        question: qText,
        options: options,
        correct: correct,
        explanation: `Option ${correct} is the correct answer.`
    });
}

fs.writeFileSync('output.json', JSON.stringify({ questions }, null, 2));
