import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Wifi, UserRound, QrCode } from "lucide-react";

export default async function QRViewPage({
  params,
}: {
  params: Promise<{ short_id: string }>;
}) {
  const { short_id } = await params;

  const { data: qrData, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("short_id", short_id)
    .single();

  if (error || !qrData) {
    return notFound();
  }

  const { type, content } = qrData;
  const themeColor = content.themeColor || "#00ffcc";
  
  // Helper to get translucent version of theme color
  const getTranslucent = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <main className="min-h-screen" style={{ minHeight: "100vh", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "400px", width: "100%", padding: "2rem", textAlign: "center", borderTop: `4px solid ${themeColor}` }}>
        
        {type === "vcard" && (
          <div>
             <div style={{ background: getTranslucent(themeColor, 0.1), width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", boxShadow: `0 0 15px ${getTranslucent(themeColor, 0.3)}` }}>
                <UserRound size={40} color={themeColor} />
             </div>
             <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{content.name}</h1>
             <p style={{ color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{content.phone}</p>
             <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{content.email}</p>
             
             <a 
               href={`data:text/vcard;charset=utf-8,BEGIN:VCARD%0AFN:${encodeURIComponent(content.name)}%0ATEL:${encodeURIComponent(content.phone)}%0AEMAIL:${encodeURIComponent(content.email)}%0AEND:VCARD`}
               download={`${content.name}.vcf`}
               className="generate-btn" 
               style={{ display: "inline-block", textDecoration: "none", background: themeColor, borderColor: themeColor, color: "#000", fontWeight: "bold" }}
             >
               Guardar Contacto
             </a>
          </div>
        )}

        {type === "wifi" && (
          <div>
             <div style={{ background: getTranslucent(themeColor, 0.1), width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", boxShadow: `0 0 15px ${getTranslucent(themeColor, 0.3)}` }}>
                <Wifi size={40} color={themeColor} />
             </div>
             <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{content.ssid}</h1>
             <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Red Segura WPA/WPA2</p>
             
             <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Contraseña</p>
                <p style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "2px" }}>{content.password}</p>
             </div>

             <button 
               className="generate-btn" 
               style={{ background: themeColor, borderColor: themeColor, boxShadow: `0 0 15px ${getTranslucent(themeColor, 0.4)}`, color: "#000", fontWeight: "bold" }}
             >
               Copiar Contraseña
             </button>
          </div>
        )}

        {type === "linkpage" && content.links && (
          <div>
             {content.profileImage ? (
                <img src={content.profileImage} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 1rem auto", border: `3px solid ${themeColor}`, boxShadow: `0 0 20px ${getTranslucent(themeColor, 0.3)}` }} />
             ) : (
                <div style={{ background: getTranslucent(themeColor, 0.1), width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", boxShadow: `0 0 15px ${getTranslucent(themeColor, 0.3)}` }}>
                   <QrCode size={40} color={themeColor} />
                </div>
             )}
             <h1 style={{ fontSize: "1.8rem", marginBottom: content.bio ? "0.5rem" : "2rem" }}>Mis Enlaces</h1>
             {content.bio && <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "1.05rem" }}>{content.bio}</p>}
             
             <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {content.links.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="generate-btn"
                    style={{ 
                      textDecoration: "none", 
                      background: "rgba(255,255,255,0.05)", 
                      border: `1px solid ${getTranslucent(themeColor, 0.3)}`, 
                      color: "var(--text-primary)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {link.title || "Enlace"}
                  </a>
                ))}
             </div>
          </div>
        )}

        {type !== "vcard" && type !== "wifi" && type !== "linkpage" && (
           <div>
             <QrCode size={60} color={themeColor} style={{ margin: "0 auto 1.5rem auto" }} />
             <h1 style={{ fontSize: "1.5rem" }}>Cargando contenido...</h1>
           </div>
        )}

      </div>
    </main>
  );
}
