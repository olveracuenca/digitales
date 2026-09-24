"use client";

import React from "react";

export interface SafeIconProps {
  icon?: string | null;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SafeIcon: Renderizador seguro e inteligente de iconos.
 * Soporta:
 * 1. Etiquetas HTML como <i class="fa-solid fa-list"></i> o <svg>...</svg>
 * 2. Clases directas de FontAwesome como "fa-solid fa-ring" o "fa-champagne-glasses"
 * 3. Emojis nativos o caracteres unicode (💍, 🥂, 🍽️, 📋, etc.)
 * 4. Normaliza clases Pro obsoletas a sus equivalentes gratuitos en FontAwesome (ej. fa-rings -> fa-ring).
 */
export function SafeIcon({ icon, fallback = "✨", className, style }: SafeIconProps) {
  if (!icon || !icon.trim()) {
    return (
      <span className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }}>
        {fallback}
      </span>
    );
  }

  let str = icon.trim();

  // Normalizaciones de nombres comunes de FontAwesome para asegurar compatibilidad
  str = str.replace(/\bfa-rings\b/g, "fa-ring");
  str = str.replace(/\bfa-glass-cheers\b/g, "fa-champagne-glasses");
  str = str.replace(/\bfa-cutlery\b/g, "fa-utensils");

  // 1. Si es etiqueta HTML como <i class="..."></i> o <svg>...</svg>
  if (str.startsWith("<") && str.endsWith(">")) {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          ...style,
        }}
        dangerouslySetInnerHTML={{ __html: str }}
      />
    );
  }

  // 2. Si el usuario escribió la clase de FontAwesome directamente sin etiquetas (ej. "fa-solid fa-ring")
  if (str.includes("fa-")) {
    const fullClass =
      str.includes("fa-solid") || str.includes("fa-regular") || str.includes("fa-brands")
        ? str
        : `fa-solid ${str}`;

    return (
      <i
        className={`${fullClass} ${className || ""}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          ...style,
        }}
      />
    );
  }

  // 3. Emojis o texto simple
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        ...style,
      }}
    >
      {str}
    </span>
  );
}

export default SafeIcon;
