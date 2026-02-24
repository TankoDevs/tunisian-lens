import fs from 'fs';
const raw = fs.readFileSync('lint_fresh.json');
const content = raw.toString('utf8').replace(/^\uFEFF/, '');
const report = JSON.parse(content);
let totalErrors = 0;
report.forEach(file => {
    if (file.errorCount > 0) {
        totalErrors += file.errorCount;
        file.messages.forEach(msg => {
            if (msg.severity === 2) {
                console.log(`${file.filePath}:${msg.line} - ${msg.ruleId}: ${msg.message}`);
            }
        });
    }
});
console.log(`\nTotal errors: ${totalErrors}`);
