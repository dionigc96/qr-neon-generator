"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Copy, Download, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ShareQRPage() {
  const params = useParams();
  const short_id = params.short_id as string;
  const shortUrl = typeof window !== "undefined" ? `${window.location.origin}/q/${short_id}` : "";
  const { t } = useLanguage();

  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode] = useState<QRCodeStyling>(
    typeof window !== "undefined"
      ? new QRCodeStyling({
          width: 300,
          height: 300,
          data: shortUrl,
          dotsOptions: { color: "#00ffcc", type: "rounded" },
          backgroundOptions: { color: "transparent" },
          cornersSquareOptions: { color: "#ff00ff", type: "extra-rounded" }
        })
      : (null as any)
  );

  useEffect(() => {
    if (qrRef.current && qrCode && shortUrl) {
      qrCode.update({ data: shortUrl });
      qrCode.append(qrRef.current);
    }
  }, [qrCode, shortUrl]);

  const handleDownload = () => {
    if (qrCode) {
      qrCode.download({ name: `qr-${short_id}`, extension: "png" });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert(t.copy_success || "¡URL copiada al portapapeles!");
  };

  return (
    <main className="min-h-screen" style={{ minHeight: "100vh", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "450px", width: "100%", padding: "2.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>{t.share_title1} <span className="text-gradient">{t.share_title2}</span></h1>
        
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem", display: "inline-block", marginBottom: "2rem", boxShadow: "0 0 20px rgba(0,255,204,0.1)" }}>
           <div ref={qrRef} />
        </div>

        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "1rem", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shortUrl}
          </span>
          <button onClick={copyToClipboard} style={{ background: "transparent", border: "none", color: "var(--accent-cyan)", cursor: "pointer", marginLeft: "1rem" }}>
            <Copy size={20} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="generate-btn" onClick={handleDownload} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Download size={20} />
            {t.download}
          </button>
          
          <a href={`/q/${short_id}`} target="_blank" rel="noopener noreferrer" className="generate-btn" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "transparent", border: "1px solid var(--accent-magenta)", color: "#fff", textDecoration: "none" }}>
            <ExternalLink size={20} />
            {t.test_link}
          </a>
        </div>
      </div>
    </main>
  );
}
