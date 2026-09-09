const fs = require('fs');
let code = fs.readFileSync('src/context/DataContext.tsx', 'utf8');

// For add*:
code = code.replace(/const add([a-zA-Z]+) = useCallback\(\((.*?)\) => {([\s\S]*?)setData\(\(prev\) => \(\{([\s\S]*?)\}\)\);\s*saveContentItemToApi\((.*?)\);\s*return \5;\s*\}, \[\]\);/g, 
  "const add$1 = useCallback(async ($2) => {$3await saveContentItemToApi($5);\n    setData((prev) => ({$4}));\n    return $5;\n  }, []);");

// For update*:
code = code.replace(/const update([a-zA-Z]+) = useCallback\(\((id: string, updates: Partial<.*?>)\) => {([\s\S]*?)setData\(\(prev\) => {([\s\S]*?)if \(updatedItem\) {\s*saveContentItemToApi\(updatedItem\);\s*}\s*return \{ \.\.\.prev, ([a-z]+): (.*?) \};\s*}\);\s*\}, \[\]\);/g, 
  "const update$1 = useCallback(async ($2) => {$3\n    // Get the previous array to find the item\n    let updatedItem = null;\n    setData((prev) => {\n$4      if (updatedItem) { /* We found it */ }\n      return prev; // don't update yet\n    });\n    // WAIT we cannot do it this way easily without breaking the closure.\n    // Let's just fix it by returning a promise or refactoring.\n});");

fs.writeFileSync('src/context/DataContext.tsx', code);
