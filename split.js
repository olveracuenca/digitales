const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src/app/templates/[id]/edit/page.tsx');
const formPath = path.join(__dirname, 'src/app/templates/[id]/edit/TemplateForm.tsx');
const previewPath = path.join(__dirname, 'src/app/templates/[id]/edit/TemplatePreview.tsx');
const newPagePath = path.join(__dirname, 'src/app/templates/[id]/edit/page.tsx.new');

const content = fs.readFileSync(pagePath, 'utf8');
const lines = content.split('\n');

// Find boundaries
const formStartIdx = lines.findIndex(l => l.includes(' {/* Form Panel */}'));
const previewStartIdx = lines.findIndex(l => l.includes(' {/* Live Preview Panel */}'));
const layoutEndIdx = lines.findIndex((l, i) => i > previewStartIdx && l.includes('</AdminLayout>'));

// Extract Form content
const formContent = lines.slice(formStartIdx, previewStartIdx).join('\n');
fs.writeFileSync(formPath, `import React from 'react';
import styles from "./editor.module.css";
import { Save, Image as ImageIcon, MapPin, Clock, Gift, MessageCircle, Eye, EyeOff, Palette, Share2, Copy, Music, Type, ArrowLeft, Check, Upload, Trash2, Smartphone, Download, Map as MapIcon, Plus } from "lucide-react";
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
${formContent}
    </>
  );
}
`);

// Extract Preview content
const previewContent = lines.slice(previewStartIdx, layoutEndIdx - 1).join('\n'); // -1 to exclude the closing div of editorLayout
fs.writeFileSync(previewPath, `import React from 'react';
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
${previewContent}
    </>
  );
}
`);

// Create new page.tsx
const pageTop = lines.slice(0, formStartIdx - 1).join('\n');
// We need to fix imports in page.tsx
const finalPageContent = pageTop.replace('import { useState, use, useEffect } from "react";', `import { useState, use, useEffect } from "react";
import TemplateForm from './TemplateForm';
import TemplatePreview from './TemplatePreview';
import { getDefaultData } from './defaults';
import { TemplateData } from './types';`)
.replace(/const getDefaultData = .*?};\n\n/s, '') // Remove the function definition (we moved it)
+ `
        <TemplateForm 
          id={id} data={data} setData={setData} saving={saving} handleSave={handleSave} 
          toggleVisibility={toggleVisibility} handleChange={handleChange} handleDesignChange={handleDesignChange} 
          handleCountdownDesignChange={handleCountdownDesignChange} handleEmojiChange={handleEmojiChange} 
          handleQuoteChange={handleQuoteChange} handleUploadSuccess={handleUploadSuccess} 
          removeCarouselPhoto={removeCarouselPhoto} addGift={addGift} updateGift={updateGift} 
          removeGift={removeGift} addItineraryItem={addItineraryItem} updateItineraryItem={updateItineraryItem} 
          removeItineraryItem={removeItineraryItem}
        />
        <TemplatePreview id={id} data={data} />
      </div>
    </AdminLayout>
  );
}
`;

fs.writeFileSync(newPagePath, finalPageContent);
console.log("Extraction complete.");
