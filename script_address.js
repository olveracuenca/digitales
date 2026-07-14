const fs = require('fs');

let editPath = 'd:/ia/cuencaolv-app/src/app/templates/[id]/edit/page.tsx';
let editContent = fs.readFileSync(editPath, 'utf8');

// Add address to getDefaultData base
editContent = editContent.replace(
  /location:\s*""/,
  'location: "",\n      address: ""'
);

// Add input field for address in the editor
editContent = editContent.replace(
  /<textarea name="location".*?\/>/,
  `$&
                    <label style={{fontSize:'0.875rem', display: 'block', marginTop: '0.5rem'}}>Dirección específica:</label>
                    <textarea name="address" value={data.address} onChange={handleChange} className={styles.input} rows={2} style={{marginTop:'0.5rem', marginBottom:'1rem'}} placeholder="Ej. Av. Siempre Viva 123" />`
);

// Add address rendering in edit/page.tsx preview
editContent = editContent.replace(
  /<p style=\{\{fontSize:\s*'13px',\s*fontWeight:\s*500,\s*lineHeight:\s*1\.4,\s*marginBottom:\s*'4px'\}\}>\{data\.location\}<\/p>/g,
  `<p style={{fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '2px'}}>{data.location}</p>
                           {data.address && <p style={{fontSize: '12px', fontWeight: 400, opacity: 0.9, lineHeight: 1.3, marginBottom: '4px'}}>{data.address}</p>}`
);

fs.writeFileSync(editPath, editContent);

let invPath = 'd:/ia/cuencaolv-app/src/app/invitation/[slug]/page.tsx';
let invContent = fs.readFileSync(invPath, 'utf8');
invContent = invContent.replace(
  /<p style=\{\{fontSize:\s*'13px',\s*fontWeight:\s*500,\s*lineHeight:\s*1\.4,\s*marginBottom:\s*'4px'\}\}>\{data\.location\}<\/p>/g,
  `<p style={{fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '2px'}}>{data.location}</p>
                           {data.address && <p style={{fontSize: '12px', fontWeight: 400, opacity: 0.9, lineHeight: 1.3, marginBottom: '4px'}}>{data.address}</p>}`
);
fs.writeFileSync(invPath, invContent);

console.log('Address section added.');
