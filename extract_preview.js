const { execSync } = require('child_process');
const fs = require('fs');

const originalContent = execSync('git show HEAD:"src/app/templates/[id]/edit/page.tsx"').toString();
const lines = originalContent.split('\n');

// In original page.tsx, TemplatePreview is inside page.tsx
// Let's find the boundaries dynamically
const startIdx = lines.findIndex(l => l.includes('{/* Live Preview Panel */}'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('{/* Share Modal */}'));

// Lines inside live preview panel, we need to extract what goes inside TemplatePreview.
// Wait, the original code had:
// {/* Live Preview Panel */}
// <div className={styles.previewPanel}>
// ...
// </div>
// {/* Share Modal */}

// We need to return exactly that content.
const previewLines = lines.slice(startIdx, endIdx);

const previewContent = `import React from 'react';
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

fs.writeFileSync('src/app/templates/[id]/edit/TemplatePreview.tsx', previewContent);
