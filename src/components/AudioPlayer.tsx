"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Pause } from "lucide-react";
import styles from "./AudioPlayer.module.css";

export default function AudioPlayer({ src, isAbsolute = false }: { src: string, isAbsolute?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Attempt autoplay when component mounts
    if (audioRef.current && src) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        // Autoplay blocked by browser policy (expected on modern browsers unless user interacted)
        console.log("Autoplay was prevented by browser. User must interact first.");
      });
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button 
        onClick={togglePlay} 
        className={styles.playerBtn}
        style={{
          position: isAbsolute ? "absolute" : "fixed",
          bottom: "2rem",
          left: "2rem"
        }}
      >
        {isPlaying ? <Pause size={20} /> : <Music size={20} />}
      </button>
    </>
  );
}
