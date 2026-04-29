const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir);

files.forEach(file => {
    if (file.endsWith('.js')) {
        const filePath = path.join(routesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove router.use(protect)
        content = content.replace(/router\.use\(protect\);/g, '// router.use(protect);');
        
        // Remove authorize middleware from route definitions
        // Pattern: , authorize(...),
        content = content.replace(/,\s*authorize\([^)]+\)/g, '');

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}: Auth removed.`);
    }
});
