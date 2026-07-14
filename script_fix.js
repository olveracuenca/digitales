const fs = require('fs');
let content = fs.readFileSync('src/app/invitation/[slug]/page.tsx', 'utf8');

const replacementTop = `
  let dbPass: any = null;
  let guestPassProp: any = undefined;

  if (typeof sp.t === 'string') {
    dbPass = await prisma.guestPass.findUnique({
      where: { id: sp.t }
    });
    if (dbPass) {
      guestPassProp = { id: dbPass.id, name: dbPass.name, passCount: dbPass.passCount };
      confirmMsg = encodeURIComponent(\`¡Hola! Confirmo la asistencia de \${dbPass.name}\${dbPass.passCount ? \` (\${dbPass.passCount} pases)\` : ''} a \${eventTitle}. ¡Ahí nos vemos!\`);
      declineMsg = encodeURIComponent(\`¡Hola! Lamentablemente la familia/invitado \${dbPass.name} no podrá asistir a \${eventTitle}. ¡Gracias por la invitación!\`);
    }
  } else if (typeof sp.p === 'string') {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(sp.p)));
      if (decoded.n) {
        guestPassProp = { id: "", name: decoded.n, passCount: decoded.q ? parseInt(String(decoded.q)) || 1 : 1 };
        confirmMsg = encodeURIComponent(\`¡Hola! Confirmo la asistencia de \${decoded.n}\${decoded.q ? \` (\${decoded.q} pases)\` : ''} a \${eventTitle}. ¡Ahí nos vemos!\`);
        declineMsg = encodeURIComponent(\`¡Hola! Lamentablemente la familia/invitado \${decoded.n} no podrá asistir a \${eventTitle}. ¡Gracias por la invitación!\`);
      }
    } catch (e) {
      // Ignore
    }
  } else if (typeof sp.n === 'string') {
    guestPassProp = { id: "", name: sp.n, passCount: sp.q ? parseInt(String(sp.q)) || 1 : 1 };
    confirmMsg = encodeURIComponent(\`¡Hola! Confirmo la asistencia de \${sp.n}\${sp.q ? \` (\${sp.q} pases)\` : ''} a \${eventTitle}. ¡Ahí nos vemos!\`);
    declineMsg = encodeURIComponent(\`¡Hola! Lamentablemente la familia/invitado \${sp.n} no podrá asistir a \${eventTitle}. ¡Gracias por la invitación!\`);
  }

  const cleanPhone = String(data.whatsapp || data.phone || "").replace(/\\D/g, '');
`;

content = content.replace(/let dbPass:[\s\S]*?declineMsg = encodeURIComponent[\s\S]*?}\s*}\s*\n/, replacementTop + '\n');

// Fix simple wa.me links
content = content.replace(/https:\/\/wa\.me\/\$\{data\.phone\}/g, 'https://wa.me/${cleanPhone}');
content = content.replace(/https:\/\/wa\.me\/\$\{data\.whatsapp\}/g, 'https://wa.me/${cleanPhone}');

// Fix guestPass in RsvpForms
content = content.replace(/guestPass=\{dbPass \|\| undefined\}/g, 'guestPass={guestPassProp}');
content = content.replace(/guestPass=\{typeof sp\.t === 'string' && dbPass \? \{ id: dbPass\.id, name: dbPass\.name, passCount: dbPass\.passCount \} : undefined\}/g, 'guestPass={guestPassProp}');

// Fix whatsapp prop in RsvpForms to use cleanPhone
content = content.replace(/number: data\.whatsapp \|\| data\.phone \|\| ""/g, 'number: cleanPhone');
content = content.replace(/number: data\.whatsapp/g, 'number: cleanPhone');

fs.writeFileSync('src/app/invitation/[slug]/page.tsx', content);
