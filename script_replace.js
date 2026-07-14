const fs = require('fs');
const files = [
  'd:/ia/cuencaolv-app/src/app/invitation/[slug]/page.tsx',
  'd:/ia/cuencaolv-app/src/app/templates/[id]/edit/page.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  const replacementLine = '<div className="glass-card-hover" style={{\n                            backgroundColor: ' + "'rgba(255, 255, 255, 0.55)'";
  content = content.replace(/<div\s+style=\{\{\r?\n\s*backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.55\)'/g, replacementLine);
  
  const replacementSingle = '<div className="glass-card-hover" style={{ backgroundColor: ' + "'rgba(255, 255, 255, 0.55)'";
  content = content.replace(/<div\s+style=\{\{\s*backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.55\)'/g, replacementSingle);
  
  fs.writeFileSync(file, content);
});
console.log('Done replacing!');
