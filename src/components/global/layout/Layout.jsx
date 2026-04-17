import React, { useEffect } from "react";
import { useAccessibility } from "../../../context/AccessibilityContext.jsx";

export default function Layout({ children }) {
  const { settings } = useAccessibility();

  useEffect(() => {
    document.body.style.fontSize = `${settings.fontSize}px`;
    document.documentElement.style.fontSize = `${settings.fontSize}px`;

    document.body.style.transform = `scale(${settings.zoom})`;
    document.body.style.transformOrigin = "top left";
    document.body.style.width = `${100 / settings.zoom}%`;
  }, [settings]);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="m-auto">{children}</div>
    </div>
  );
}
