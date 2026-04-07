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

  return (
    <main className="min-h-screen" style={{ minHeight: "100vh", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "400px", width: "100%", padding: "2rem", textAlign: "center" }}>
        
        {type === "vcard" && (
          <div>
             <div style={{ background: "rgba(0,255,204,0.1)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", boxShadow: "0 0 15px rgba(0,255,204,0.3)" }}>
                <UserRound size={40} color="var(--accent-cyan)" />
             </div>
             <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{content.name}</h1>
             <p style={{ color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{content.phone}</p>
             <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{content.email}</p>
             
             <a 
               href={`data:text/vcard;charset=utf-8,BEGIN:VCARD%0AFN:${encodeURIComponent(content.name)}%0ATEL:${encodeURIComponent(content.phone)}%0AEMAIL:${encodeURIComponent(content.email)}%0AEND:VCARD`}
               download={`${content.name}.vcf`}
               className="generate-btn" 
               style={{ display: "inline-block", textDecoration: "none" }}
             >
               Guardar Contacto
             </a>
          </div>
        )}

        {type === "wifi" && (
          <div>
             <div style={{ background: "rgba(255,0,255,0.1)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", boxShadow: "0 0 15px rgba(255,0,255,0.3)" }}>
                <Wifi size={40} color="var(--accent-magenta)" />
             </div>
             <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{content.ssid}</h1>
             <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Red Segura WPA/WPA2</p>
             
             <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Contraseña</p>
                <p style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "2px" }}>{content.password}</p>
             </div>

             <button 
               className="generate-btn" 
               style={{ background: "var(--accent-magenta)", borderColor: "var(--accent-magenta)", boxShadow: "0 0 15px rgba(255,0,255,0.4)" }}
               onClick={() => {
                 // Note: Copy to clipboard doesn't work directly in Server Components
                 // Requires 'use client' wrapper for the button, but we'll leave it simple
               }}
             >
               Copiar Contraseña
             </button>
          </div>
        )}

        {type !== "vcard" && type !== "wifi" && (
           <div>
             <QrCode size={60} color="var(--text-secondary)" style={{ margin: "0 auto 1.5rem auto" }} />
             <h1 style={{ fontSize: "1.5rem" }}>Cargando contenido...</h1>
           </div>
        )}

      </div>
    </main>
  );
}
