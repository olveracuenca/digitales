const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/templates/[id]/edit');
const formPath = path.join(dir, 'TemplateForm.tsx');
const previewPath = path.join(dir, 'TemplatePreview.tsx');

// Get original content from Git
const originalContent = execSync('git show HEAD:"src/app/templates/[id]/edit/page.tsx"').toString();
const lines = originalContent.split('\n');

// Find boundaries
const formStartIdx = lines.findIndex(l => l.includes('{/* Form Panel */}'));
const previewStartIdx = lines.findIndex(l => l.includes('{/* Live Preview Panel */}'));
const layoutEndIdx = lines.findIndex((l, i) => i > previewStartIdx && l.includes('{/* Share Modal */}'));

// EXTRACT FORM
const formLines = lines.slice(formStartIdx + 1, previewStartIdx - 2); // Exclude the comments and div wrapper of page

let formContent = `import React from 'react';
import styles from "./editor.module.css";
import { Save, Image as ImageIcon, Eye, EyeOff, Palette, MapPin } from "lucide-react";
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

// Fix types in Form
formContent = formContent.replace(/data\.carouselPhotos\.map\(\(photo, i\)/g, 'data.carouselPhotos.map((photo: string, i: number)');
formContent = formContent.replace(/data\.gifts\.map\(\(g, i\)/g, 'data.gifts.map((g: any, i: number)');
formContent = formContent.replace(/data\.itinerary\.map\(\(item: any, i: number\)/g, 'data.itinerary.map((item: any, i: number)');

fs.writeFileSync(formPath, formContent);

// EXTRACT PREVIEW
const previewLines = lines.slice(previewStartIdx + 1, layoutEndIdx - 3);

let previewContent = `import React from 'react';
import styles from "./editor.module.css";
import { MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import AutoCarousel from "@/components/AutoCarousel";
import FallingIcons from "@/components/FallingIcons";
import AudioPlayer from "@/components/AudioPlayer";
import Countdown from "@/components/Countdown";
import { TemplateData } from './types';

export default function TemplatePreview({ id, data }: { id: string, data: TemplateData }) {
  return (
    <>
${previewLines.join('\n')}
    </>
  );
}
`;

fs.writeFileSync(previewPath, previewContent);

console.log("Extraction and fixes applied cleanly!");
