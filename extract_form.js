const { execSync } = require('child_process');
const fs = require('fs');

const originalContent = execSync('git show HEAD:"src/app/templates/[id]/edit/page.tsx"').toString();
const lines = originalContent.split('\n');

const formLines = lines.slice(429, 980);

const formContent = `import React from 'react';
import styles from "./editor.module.css";
import { Save, Image as ImageIcon, Eye, EyeOff, Palette } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';
import { TemplateData } from './types';

export default function TemplateForm({ 
  id, data, setData, saving, handleSave, toggleVisibility, handleChange, handleDesignChange, 
  handleCountdownDesignChange, handleEmojiChange, handleQuoteChange, handleUploadSuccess, 
  removeCarouselPhoto, addGift, updateGift, removeGift, addItineraryItem, updateItineraryItem, 
  removeItineraryItem 
}: any) {
  return (
    <>
${formLines.join('\n')}
    </>
  );
}
`;

fs.writeFileSync('src/app/templates/[id]/edit/TemplateForm.tsx', formContent);
