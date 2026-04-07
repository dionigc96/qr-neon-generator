"use client";

import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
  className?: string;
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
  className = "",
}: AdBannerProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err: any) {
      console.error("AdSense Error: ", err.message);
    }
  }, []);

  // Si no hay ID de cliente de AdSense, mostramos un banner "Placeholder" en desarrollo
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  
  if (!clientId) {
    return (
      <div className={`glass-panel ${className}`} style={{ width: "100%", padding: "1rem", textAlign: "center", color: "var(--text-secondary)", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Espacio publicitario patrocinado (Falta configurar NEXT_PUBLIC_ADSENSE_CLIENT_ID)
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
    />
  );
}
