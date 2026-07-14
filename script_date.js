const fs = require('fs');

const dateSectionStr = `           </AnimatedSection>
        )}

        {data.date && (
           <AnimatedSection direction="up">
              <div className="glass-card-hover" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '20px', padding: '24px', width: '100%', marginBottom: '20px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                  textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative'
              }}>
                 <div style={{ fontSize: '26px', marginBottom: '8px' }}>📅</div>
                 <h4 style={{fontFamily: data.design.font, fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: data.design.textColor}}>¿Cuándo?</h4>
                 <p style={{fontSize: '14px', fontWeight: 500, color: data.design.textColor, textTransform: 'capitalize'}}>
                   {new Date(data.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </p>
                 <p style={{fontSize: '12px', opacity: 0.8, color: data.design.textColor, marginTop: '4px'}}>
                   A las {new Date(data.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
                 </p>
              </div>
           </AnimatedSection>
        )}`;

// For invitation/[slug]/page.tsx
let invPath = 'd:/ia/cuencaolv-app/src/app/invitation/[slug]/page.tsx';
let invContent = fs.readFileSync(invPath, 'utf8');
invContent = invContent.replace(/<\/AnimatedSection>\s*\r?\n\s*\)\}\s*\r?\n\s*<div style=\{\{width:\s*'100%',\s*zIndex:\s*2,\s*position:\s*'relative'\}\}>/,
  dateSectionStr + '\n\n        <div style={{width: \'100%\', zIndex: 2, position: \'relative\'}}>'
);
fs.writeFileSync(invPath, invContent);

// For edit/page.tsx
let editPath = 'd:/ia/cuencaolv-app/src/app/templates/[id]/edit/page.tsx';
let editContent = fs.readFileSync(editPath, 'utf8');
const dateSectionStrEdit = `           </div>
        )}

        {data.date && (
              <div className="glass-card-hover" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '20px', padding: '24px', width: '100%', marginBottom: '20px', boxShadow: '0 8px 20px rgba(221, 165, 165, 0.15)',
                  textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative'
              }}>
                 <div style={{ fontSize: '26px', marginBottom: '8px' }}>📅</div>
                 <h4 style={{fontFamily: data.design.font, fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: data.design.textColor}}>¿Cuándo?</h4>
                 <p style={{fontSize: '14px', fontWeight: 500, color: data.design.textColor, textTransform: 'capitalize'}}>
                   {new Date(data.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </p>
                 <p style={{fontSize: '12px', opacity: 0.8, color: data.design.textColor, marginTop: '4px'}}>
                   A las {new Date(data.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
                 </p>
              </div>
        )}`;

editContent = editContent.replace(/<\/div>\s*\r?\n\s*\)\}\s*\r?\n\s*<div style=\{\{width:\s*'100%',\s*zIndex:\s*2,\s*position:\s*'relative'\}\}>/,
  dateSectionStrEdit + '\n\n                  <div style={{width: \'100%\', zIndex: 2, position: \'relative\'}}>'
);
fs.writeFileSync(editPath, editContent);

console.log('Date section injected.');
