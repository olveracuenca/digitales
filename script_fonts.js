const fs = require('fs');

let cssPath = 'd:/ia/cuencaolv-app/src/app/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');
const googleFonts = "@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;700&family=Pacifico&family=Amatic+SC:wght@400;700&family=Montserrat:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');\n";
if(!cssContent.includes('@import url')) {
  fs.writeFileSync(cssPath, googleFonts + cssContent);
}

let editPath = 'd:/ia/cuencaolv-app/src/app/templates/[id]/edit/page.tsx';
let editContent = fs.readFileSync(editPath, 'utf8');

const newOptions = `
                    <option value="serif">Elegante Básica (Serif)</option>
                    <option value="sans-serif">Moderna Básica (Sans-Serif)</option>
                    <option value="'Playfair Display', serif">Clásica (Playfair Display)</option>
                    <option value="'Lora', serif">Sofisticada (Lora)</option>
                    <option value="'Montserrat', sans-serif">Limpia (Montserrat)</option>
                    <option value="'Cinzel', serif">Épica (Cinzel)</option>
                    <option value="'Dancing Script', cursive">Cursiva Romántica (Dancing Script)</option>
                    <option value="'Great Vibes', cursive">Cursiva Elegante (Great Vibes)</option>
                    <option value="'Pacifico', cursive">Cursiva Casual (Pacifico)</option>
                    <option value="'Amatic SC', cursive">Divertida (Amatic SC)</option>
`;

editContent = editContent.replace(/<select name="font"[\s\S]*?<\/select>/, `<select name="font" value={data.design.font} onChange={handleDesignChange} className={styles.input}>${newOptions}</select>`);
editContent = editContent.replace(/<select name="titleFont"[\s\S]*?<\/select>/, `<select name="titleFont" value={data.design.titleFont || data.design.font} onChange={handleDesignChange} className={styles.input}>${newOptions}</select>`);

fs.writeFileSync(editPath, editContent);
console.log('Fonts updated.');
