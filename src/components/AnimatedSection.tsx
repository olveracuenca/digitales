"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export default function AnimatedSection({ 
  children, 
  direction = "up",
  enableAnimation = true,
  delay = 0
}: { 
  children: ReactNode; 
  direction?: "up" | "left" | "right" | "none";
  enableAnimation?: boolean;
  delay?: number;
}) {
  if (!enableAnimation || direction === "none") {
    return <>{children}</>;
  }

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      y: direction === "up" ? 50 : 0 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        delay: delay 
      } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
      variants={variants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
