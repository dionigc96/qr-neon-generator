"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeStyling from "qr-code-styling";
import { TabType } from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface QRPanelProps {
  activeTab: TabType;
}

export default function QRPanel({ activeTab }: QRPanelProps) {
  const { t } = useLanguage();
  const [url, setUrl] = useState("https://ejemplo.com");
  const [vcardData, setVcardData] = useState({ name: "", phone: "", email: "" });
  const [wifiData, setWifiData] = useState({ ssid: "", password: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [expiration, setExpiration] = useState<number>(30); // 30, 90 o 0 (Ilimitado)

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
    
    // El QR siempre es dinámico por defecto (si ya se generó su URL corta)
    if (generatedUrl) {
      qrCode.update({ data: generatedUrl });
      return;
    }

    let data = "https://ejemplo.com";
    if (activeTab === "url") data = url || "https://ejemplo.com";
    else if (activeTab === "vcard") data = `BEGIN:VCARD\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nEND:VCARD`;
    else if (activeTab === "wifi") data = `WIFI:T:WPA;S:${wifiData.ssid};P:${wifiData.password};;`;
    else data = `${activeTab.toUpperCase()} Placeholder`;

    qrCode.update({ data });
  }, [activeTab, url, vcardData, wifiData, qrCode, generatedUrl]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedUrl(null);
    try {
      let contentData: any = {};
      if (activeTab === "url") contentData = { url };
      else if (activeTab === "vcard") contentData = { ...vcardData };
      else if (activeTab === "wifi") contentData = { ...wifiData };
      else contentData = { placeholder: true };
      
      const short_id = Math.random().toString(36).substring(2, 8);
      
      let expires_at = null;
      if (expiration > 0) {
        const date = new Date();
        date.setDate(date.getDate() + expiration);
        expires_at = date.toISOString();
      }
      
      const { data, error } = await supabase
        .from('qr_codes')
        .insert([
          {
            type: activeTab,
            content: contentData,
            short_id: short_id,
            is_dynamic: true,
            expires_at: expires_at
          }
        ])
        .select()
        .single();
        
      if (error) {
        console.error("Error al guardar en Supabase:", error);
        alert("Ocurrió un error guardando tu código QR.");
        return;
      }
      
      const shareUrl = `${window.location.origin}/share/${short_id}`;
      // Set the dynamic tracking URL for the local preview
      setGeneratedUrl(`${window.location.origin}/q/${short_id}`);
      
      // Abre en nueva pestaña la vista de compartir/descargar el QR
      window.open(shareUrl, '_blank');
      
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderInputs = () => {
    if (activeTab === "url") {
      return (
        <div className="input-group">
          <label>{t.url || "URL"}</label>
          <input 
            type="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            className="custom-input"
            placeholder={t.url_input || "Ingresa la URL"}
          />
          <button style={{color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "left", textDecoration: "underline", marginTop: "0.5rem"}}>Subir una imagen para extraer la URL</button>
        </div>
      );
    }
    if (activeTab === "vcard") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="input-group">
            <label>{t.vcard_name || "Nombre Completo"}</label>
            <input type="text" placeholder="John Doe" value={vcardData.name} onChange={(e) => setVcardData({...vcardData, name: e.target.value})} className="custom-input" />
          </div>
          <div className="input-group">
            <label>{t.vcard_phone || "Teléfono"}</label>
            <input type="tel" placeholder="+34 600..." value={vcardData.phone} onChange={(e) => setVcardData({...vcardData, phone: e.target.value})} className="custom-input" />
          </div>
          <div className="input-group">
            <label>{t.vcard_email || "Correo Electrónico"}</label>
            <input type="email" placeholder="john@example.com" value={vcardData.email} onChange={(e) => setVcardData({...vcardData, email: e.target.value})} className="custom-input" />
          </div>
        </div>
      );
    }
    if (activeTab === "wifi") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="input-group">
            <label>{t.wifi_ssid || "Nombre de la Red (SSID)"}</label>
            <input type="text" placeholder="MiWifi_5G" value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} className="custom-input" />
          </div>
          <div className="input-group">
            <label>{t.wifi_pass || "Contraseña"}</label>
            <input type="password" placeholder="********" value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} className="custom-input" />
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
          {t.generate || "Generar"} <span className="text-gradient" style={{ textTransform: "uppercase" }}>{activeTab}</span>
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

        {/* UI Selector de Expiración */}
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem"}}>
            {t.duration || "Duración del Código QR"}
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
             <button 
                onClick={() => setExpiration(30)}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${expiration === 30 ? 'var(--accent-cyan)' : '#333'}`, background: expiration === 30 ? 'rgba(0, 255, 204, 0.1)' : 'var(--surface)', color: expiration === 30 ? 'var(--accent-cyan)' : '#fff', cursor: 'pointer', transition: 'all 0.2s ease' }}
             >{t.days30 || "30 Días"}</button>
             <button 
                onClick={() => setExpiration(90)}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${expiration === 90 ? 'var(--accent-cyan)' : '#333'}`, background: expiration === 90 ? 'rgba(0, 255, 204, 0.1)' : 'var(--surface)', color: expiration === 90 ? 'var(--accent-cyan)' : '#fff', cursor: 'pointer', transition: 'all 0.2s ease' }}
             >{t.days90 || "90 Días"}</button>
             <button 
                onClick={() => setExpiration(0)}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${expiration === 0 ? 'var(--accent-cyan)' : '#333'}`, background: expiration === 0 ? 'rgba(0, 255, 204, 0.1)' : 'var(--surface)', color: expiration === 0 ? 'var(--accent-cyan)' : '#fff', cursor: 'pointer', transition: 'all 0.2s ease' }}
             >{t.unlimited || "Ilimitado"}</button>
          </div>
        </div>

        <button 
          className="generate-btn" 
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ opacity: isGenerating ? 0.7 : 1, cursor: isGenerating ? "wait" : "pointer" }}
        >
          {isGenerating ? "Procesando..." : (t.gen_btn || "Generar Código QR")}
        </button>
      </div>

      <div className="preview-container">
        <div ref={qrRef} className="qr-wrapper" />
      </div>

    </motion.div>
  );
}
