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
  const [appStoreData, setAppStoreData] = useState({ ios: "", android: "" });
  const [linkPageData, setLinkPageData] = useState([{ title: "Mi Enlace", url: "https://" }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [expiration, setExpiration] = useState<number>(30); // 30, 90 o 0 (Ilimitado)
  const [themeColor, setThemeColor] = useState("#00ffcc");
  const [linkPageBio, setLinkPageBio] = useState("");
  const [linkPageImage, setLinkPageImage] = useState<string | null>(null);

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
    if (activeTab === "url" || ["file", "form", "menu", "landing", "smarturl", "gs1", "mp3", "video"].includes(activeTab)) {
      data = url || "https://ejemplo.com";
    } else if (activeTab === "vcard") {
      data = `BEGIN:VCARD\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nEND:VCARD`;
    } else if (activeTab === "wifi") {
      data = `WIFI:T:WPA;S:${wifiData.ssid};P:${wifiData.password};;`;
    } else if (activeTab === "appstore") {
      data = appStoreData.ios || appStoreData.android || "https://ejemplo.com";
    } else if (activeTab === "linkpage") {
      data = linkPageData[0]?.url || "https://ejemplo.com";
    } else {
      data = `${activeTab.toUpperCase()} Placeholder`;
    }

    qrCode.update({ data, dotsOptions: { color: themeColor } });
  }, [activeTab, url, vcardData, wifiData, appStoreData, linkPageData, qrCode, generatedUrl, themeColor]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        // Reduce file size with jpeg and 0.7 quality targeting < 20KB
        setLinkPageImage(canvas.toDataURL("image/jpeg", 0.7));
      };
      if (event.target?.result) img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedUrl(null);
    try {
      let contentData: any = {};
      if (["url", "file", "form", "menu", "landing", "smarturl", "gs1", "mp3", "video"].includes(activeTab)) {
        contentData = { url };
      } else if (activeTab === "vcard") {
        contentData = { ...vcardData };
      } else if (activeTab === "wifi") {
        contentData = { ...wifiData };
      } else if (activeTab === "appstore") {
        contentData = { ...appStoreData };
      } else if (activeTab === "linkpage") {
        contentData = { links: linkPageData, bio: linkPageBio, profileImage: linkPageImage };
      } else {
        contentData = { placeholder: true };
      }
      contentData.themeColor = themeColor;
      
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
    if (activeTab === "appstore") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="input-group">
            <label>{t.app_ios || "Enlace App Store (iOS)"}</label>
            <input type="url" placeholder="https://apps.apple.com/..." value={appStoreData.ios} onChange={(e) => setAppStoreData({...appStoreData, ios: e.target.value})} className="custom-input" />
          </div>
          <div className="input-group">
            <label>{t.app_android || "Enlace Google Play (Android)"}</label>
            <input type="url" placeholder="https://play.google.com/..." value={appStoreData.android} onChange={(e) => setAppStoreData({...appStoreData, android: e.target.value})} className="custom-input" />
          </div>
        </div>
      );
    }
    
    if (activeTab === "linkpage") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
             {linkPageImage ? (
                <img src={linkPageImage} alt="Profile" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${themeColor}` }} />
             ) : (
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--text-secondary)" }}>
                   <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Foto</span>
                </div>
             )}
             <div style={{ flex: 1 }}>
                <label style={{color: "var(--text-secondary)", fontSize: "0.85rem", display: "block", marginBottom: "0.3rem"}}>Foto de Perfil</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }} />
             </div>
          </div>
          
          <div className="input-group">
            <input type="text" placeholder="Escribe una pequeña bio o descripción..." value={linkPageBio} onChange={(e) => setLinkPageBio(e.target.value)} className="custom-input" />
          </div>

          <label style={{color: "var(--text-secondary)", fontSize: "0.9rem"}}>{t.linkpage_title || "Añade múltiples enlaces (Ej: Redes Sociales)"}</label>
          {linkPageData.map((link, idx) => (
            <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
              <input type="text" placeholder="Título" value={link.title} onChange={(e) => {
                const newLinks = [...linkPageData];
                newLinks[idx].title = e.target.value;
                setLinkPageData(newLinks);
              }} className="custom-input" style={{flex: 1}} />
              <input type="url" placeholder="URL" value={link.url} onChange={(e) => {
                const newLinks = [...linkPageData];
                newLinks[idx].url = e.target.value;
                setLinkPageData(newLinks);
              }} className="custom-input" style={{flex: 2}} />
            </div>
          ))}
          {linkPageData.length < 5 && (
            <button onClick={() => setLinkPageData([...linkPageData, {title: "", url: ""}])} style={{ color: "var(--accent-cyan)", textDecoration: "underline", fontSize: "0.85rem", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              + Añadir otro enlace
            </button>
          )}
        </div>
      );
    }

    // Formularios genéricos que requieren solo de un enlace adaptado al contexto
    if (["file", "form", "menu", "landing", "smarturl", "gs1", "mp3", "video"].includes(activeTab)) {
       let specialLabel = "URL de destino";
       let specialPlaceholder = "https://ejemplo.com";
       
       if (activeTab === "file") { specialLabel = "URL de tu archivo PDF"; specialPlaceholder = "https://tudrive.com/archivo.pdf"; }
       if (activeTab === "form") { specialLabel = "URL de tu formulario"; specialPlaceholder = "https://forms.google.com/..."; }
       if (activeTab === "menu") { specialLabel = "URL de tu Carta / Menú"; specialPlaceholder = "https://turestaurante.com/menu"; }
       if (activeTab === "video") { specialLabel = "URL de YouTube, Vimeo..."; specialPlaceholder = "https://youtube.com/watch?v=..."; }
       if (activeTab === "mp3") { specialLabel = "URL de Spotify, SoundCloud..."; specialPlaceholder = "https://spotify.com/track/..."; }
       
       return (
         <div className="input-group">
           <label>{(t as any)[`${activeTab}_url`] || specialLabel}</label>
           <input 
             type="url" 
             value={url} 
             onChange={(e) => setUrl(e.target.value)}
             className="custom-input"
             placeholder={specialPlaceholder}
           />
           <button style={{color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "left", textDecoration: "underline", marginTop: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0}}>
             Alojamiento en nuestros servidores disponible próximamente 🔒
           </button>
         </div>
       );
    }

    return null;
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

        {/* UI Selector de Expiración y Color */}
        <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          
          <div style={{ flex: "1 1 200px" }}>
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

          <div style={{ flex: "0 0 auto" }}>
            <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem"}}>
              Color del Tema
            </label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
               <input 
                  type="color" 
                  value={themeColor} 
                  onChange={(e) => setThemeColor(e.target.value)}
                  style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "8px", cursor: "pointer", background: "none" }}
               />
               <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase" }}>{themeColor}</span>
            </div>
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
