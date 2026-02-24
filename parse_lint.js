import fs from 'fs';
const raw = fs.readFileSync('lint_report_utf8.json');
const content = raw.toString('utf8').replace(/^\uFEFF/, '');
const report = JSON.parse(content);
report.forEach(file => {
    if (file.errorCount > 0) {
        file.messages.forEach(msg => {
            if (msg.severity === 2) {
                console.log(`${file.filePath}:${msg.line}:${msg.column} - ${msg.ruleId}: ${msg.message}`);
            }
        });
    }
});
