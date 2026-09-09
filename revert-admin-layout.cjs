const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

// Remove the useEffect
code = code.replace(
  /\n  \/\/ When entering Admin Panel, default to Light Mode as requested\n  useEffect\(\(\) => \{\n    setTheme\('light'\);\n  \}, \[\]\); \/\/ Run only once on mount/,
  ''
);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
console.log('AdminLayout effect removed');
