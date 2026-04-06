"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeStyling from "qr-code-styling";
import { TabType } from "@/components/Header";

interface QRPanelProps {
  activeTab: TabType;
  qrType: "static" | "dynamic";
}

export default function QRPanel({ activeTab, qrType }: QRPanelProps) {
  const [url, setUrl] = useState("https://ejemplo.com");
  const [vcardData, setVcardData] = useState({ name: "", phone: "", email: "" });
  const [wifiData, setWifiData] = useState({ ssid: "", password: "" });

  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode] = useState<QRCodeStyling>(
    typeof window !== "undefined"
      ? new QRCodeStyling({
          width: 250,
          height: 250,
          data: "https://ejemplo.com",
          dotsOptions: { color: "#00ffcc", type: "rounded" },
          backgroundOptions: { color: "transparent" },
          cornersSquareOptions: { color: "#ff00ff", type: "extra-rounded" }
        })
      : (null as any)
  );

  useEffect(() => {
    if (qrRef.current && qrCode) {
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  useEffect(() => {
    if (!qrCode) return;
    let data = "https://ejemplo.com";
    if (activeTab === "url") data = url || "https://ejemplo.com";
    else if (activeTab === "vcard") data = `BEGIN:VCARD\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nEND:VCARD`;
    else if (activeTab === "wifi") data = `WIFI:T:WPA;S:${wifiData.ssid};P:${wifiData.password};;`;
    else data = `${activeTab.toUpperCase()} Placeholder`;

    qrCode.update({ data });
  }, [activeTab, url, vcardData, wifiData, qrCode]);

  const renderInputs = () => {
    if (activeTab === "url") {
      return (
        <div className="input-group">
          <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>Ingresa tu enlace</label>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="custom-input"
            placeholder="https://tu-enlace.com"
          />
          <button style={{color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "left", textDecoration: "underline", marginTop: "0.5rem"}}>Subir una imagen para extraer la URL</button>
        </div>
      );
    }
    if (activeTab === "vcard") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="input-group">
            <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>Nombre completo</label>
            <input type="text" value={vcardData.name} onChange={(e) => setVcardData({...vcardData, name: e.target.value})} className="custom-input" placeholder="Juan Pérez" />
          </div>
          <div className="input-group">
            <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>Teléfono</label>
            <input type="tel" value={vcardData.phone} onChange={(e) => setVcardData({...vcardData, phone: e.target.value})} className="custom-input" placeholder="+34 600 000 000" />
          </div>
          <div className="input-group">
            <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>Email</label>
            <input type="email" value={vcardData.email} onChange={(e) => setVcardData({...vcardData, email: e.target.value})} className="custom-input" placeholder="juan@ejemplo.com" />
          </div>
        </div>
      );
    }
    if (activeTab === "wifi") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="input-group">
            <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>Nombre de la Red (SSID)</label>
            <input type="text" value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} className="custom-input" placeholder="Mi_WIFI_5G" />
          </div>
          <div className="input-group">
            <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>Contraseña</label>
            <input type="password" value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} className="custom-input" placeholder="********" />
          </div>
        </div>
      );
    }
    return (
      <div className="input-group">
         <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>Configuración de {activeTab.toUpperCase()}</label>
         <div className="custom-input" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            Sube tu archivo o configura aquí. (Próximamente Fase 3)
         </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="glass-panel qr-panel" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container">
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          Generar <span className="text-gradient" style={{ textTransform: "uppercase" }}>{activeTab}</span> {qrType === "dynamic" ? "Dinámico" : "QR"}
        </h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            style={{ width: "100%" }}
          >
            {renderInputs()}
          </motion.div>
        </AnimatePresence>

        <button className="generate-btn">
          Generate QR Code
        </button>
      </div>

      <div className="preview-container">
        <div ref={qrRef} className="qr-wrapper" />
      </div>

    </motion.div>
  );
}
