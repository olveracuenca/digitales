const fs = require('fs');

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

// 1. Move titleFont from Design & Style to Main Info
// We'll remove the titleFont group from around line 476
const titleFontGroupRegex = /<div className=\{styles\.inputGroup\}>\s*<label>Tipo de Letra del Título<\/label>\s*<select name="titleFont"[\s\S]*?<\/select>\s*<\/div>/;
const match = editContent.match(titleFontGroupRegex);

if (match) {
  editContent = editContent.replace(titleFontGroupRegex, '');
  
  // Insert it after Título del Evento in Main Info
  const insertTarget = '<input type="text" name="title" value={data.title} onChange={handleChange} className={styles.input} />\n              </div>';
  
  const newTitleFontGroup = `
              <div className={styles.inputGroup} style={{marginTop: '1rem'}}>
                <label>Tipo de Letra del Título</label>
                <select name="titleFont" value={data.design.titleFont || data.design.font} onChange={handleDesignChange} className={styles.input}>
${newOptions}
                </select>
              </div>`;
              
  editContent = editContent.replace(insertTarget, insertTarget + newTitleFontGroup);
}

// 2. Update quote font options
editContent = editContent.replace(/<select name="font" value=\{data\.quote\.font\}[\s\S]*?<\/select>/, 
  `<select name="font" value={data.quote.font} onChange={handleQuoteChange} className={styles.input} style={{padding:'0.5rem'}}>\n${newOptions.replace(/<option/g, '                          <option')}\n                        </select>`
);

// 3. Update countdown font options
editContent = editContent.replace(/<select name="font" value=\{data\.countdownDesign\.font\}[\s\S]*?<\/select>/, 
  `<select name="font" value={data.countdownDesign.font} onChange={handleCountdownDesignChange} className={styles.input} style={{marginTop:'0.5rem'}}>\n${newOptions.replace(/<option/g, '                          <option')}\n                        </select>`
);

fs.writeFileSync(editPath, editContent);
console.log('UI structure and remaining font dropdowns updated.');
