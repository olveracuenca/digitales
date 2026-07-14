const fs = require('fs');
let invPath = 'd:/ia/cuencaolv-app/src/app/invitation/[slug]/page.tsx';
let invContent = fs.readFileSync(invPath, 'utf8');

const metadataImport = 'import type { Metadata, ResolvingMetadata } from "next";\n';
const metadataFunc = `export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  if (!invitation) return {};
  
  try {
    const data = JSON.parse(invitation.data);
    const title = data.title || 'Estás Invitado';
    const description = data.subtitle || 'Te invitamos a acompañarnos en este día especial.';
    const image = data.mainPhoto || '';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [image] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : [],
      }
    };
  } catch(e) {
    return {};
  }
}

`;

invContent = metadataImport + invContent.replace('export default async function PublicInvitation', metadataFunc + 'export default async function PublicInvitation');
fs.writeFileSync(invPath, invContent);
console.log('Metadata added.');
