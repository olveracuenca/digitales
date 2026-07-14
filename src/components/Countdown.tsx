"use client";
import { useState, useEffect } from "react";
import styles from "./Countdown.module.css";

export default function Countdown({ 
  targetDate, 
  bgColor, 
  textColor, 
  font 
}: { 
  targetDate: string, 
  bgColor: string, 
  textColor: string, 
  font: string 
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000); // update every second
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.timeBox} style={{ background: bgColor, color: textColor, fontFamily: font, border: '1px solid rgba(255, 255, 255, 0.6)' }}>
        <span>{timeLeft.days.toString().padStart(2, '0')}</span>
        <small style={{ color: textColor }}>Días</small>
      </div>
      <div className={styles.timeBox} style={{ background: bgColor, color: textColor, fontFamily: font, border: '1px solid rgba(255, 255, 255, 0.6)' }}>
        <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
        <small style={{ color: textColor }}>Hrs</small>
      </div>
      <div className={styles.timeBox} style={{ background: bgColor, color: textColor, fontFamily: font, border: '1px solid rgba(255, 255, 255, 0.6)' }}>
        <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <small style={{ color: textColor }}>Min</small>
      </div>
      <div className={styles.timeBox} style={{ background: bgColor, color: textColor, fontFamily: font, border: '1px solid rgba(255, 255, 255, 0.6)' }}>
        <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <small style={{ color: textColor }}>Seg</small>
      </div>
    </div>
  );
}
