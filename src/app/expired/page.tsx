"use client";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ExpiredPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen" style={{ minHeight: "100vh", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "400px", width: "100%", padding: "2rem", textAlign: "center" }}>
        <div style={{ background: "rgba(255, 50, 50, 0.1)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto", boxShadow: "0 0 15px rgba(255, 50, 50, 0.3)" }}>
          <AlertTriangle size={40} color="#ff3333" />
        </div>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{t.expired_title}</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{t.expired_desc}</p>
        <a href="/" className="generate-btn" style={{ display: "inline-block", textDecoration: "none" }}>{t.generate_new}</a>
      </div>
    </main>
  );
}
