const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/templates/[id]/edit');
const formPath = path.join(dir, 'TemplateForm.tsx');
const pagePath = path.join(dir, 'page.tsx');
const cleanPagePath = path.join(dir, 'page.tsx.clean');

// Fix types in TemplateForm.tsx
let formContent = fs.readFileSync(formPath, 'utf8');
formContent = formContent.replace(/data\.carouselPhotos\.map\(\(photo, i\)/g, 'data.carouselPhotos.map((photo: string, i: number)');
formContent = formContent.replace(/data\.gifts\.map\(\(g, i\)/g, 'data.gifts.map((g: any, i: number)');
formContent = formContent.replace(/data\.itinerary\.map\(\(item: any, i: number\)/g, 'data.itinerary.map((item: any, i: number)');
fs.writeFileSync(formPath, formContent);

// Replace page.tsx with page.tsx.clean
fs.copyFileSync(cleanPagePath, pagePath);
console.log('Fixed types and copied page.tsx');
