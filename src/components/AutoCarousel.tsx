"use client";

import { useState, useEffect } from "react";

export default function AutoCarousel({ photos }: { photos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    
    // Auto-advance every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "250px", overflow: "hidden", borderRadius: "12px", background: "rgba(0,0,0,0.1)" }}>
      {photos.map((url, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: currentIndex === i ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: currentIndex === i ? 1 : 0
          }}
        >
          <img 
            src={url} 
            alt={`Foto ${i}`} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
      ))}
      {/* Indicator dots */}
      <div style={{ position: "absolute", bottom: "10px", width: "100%", display: "flex", justifyContent: "center", gap: "6px", zIndex: 10 }}>
        {photos.map((_, i) => (
          <div 
            key={i} 
            style={{ 
              width: "6px", 
              height: "6px", 
              borderRadius: "50%", 
              background: currentIndex === i ? "white" : "rgba(255,255,255,0.4)",
              transition: "background 0.3s ease"
            }} 
          />
        ))}
      </div>
    </div>
  );
}
