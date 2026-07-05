"use client";

import { useEffect, useState } from "react";
import styles from "./FallingIcons.module.css";

export default function FallingIcons({ iconString = "✨ 💖 🌸 💍 🥂" }: { iconString?: string }) {
  const [icons, setIcons] = useState<{ id: number; left: number; delay: number; duration: number; size: number; content: string }[]>([]);

  useEffect(() => {
    // Split by space, or just use characters if no spaces. 
    // Safest way to split emojis is by treating it as an array if separated by spaces.
    let iconList = iconString.trim().split(/\s+/);
    if (iconList.length === 0 || iconList[0] === "") {
      iconList = ["✨", "💖"];
    }

    const count = 15;
    const newIcons = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      size: 0.8 + Math.random() * 1.2,
      content: iconList[Math.floor(Math.random() * iconList.length)]
    }));
    
    setIcons(newIcons);
  }, [iconString]);

  return (
    <div className={styles.container}>
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={styles.icon}
          style={{
            left: `${icon.left}%`,
            animationDelay: `${icon.delay}s`,
            animationDuration: `${icon.duration}s`,
            fontSize: `${icon.size}rem`,
          }}
        >
          {icon.content}
        </div>
      ))}
    </div>
  );
}
