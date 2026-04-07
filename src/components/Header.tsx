"use client";

import { useRef } from "react";
import { QrCode, Wifi, Link, FileText, Database, PanelsTopLeft, FileSpreadsheet, Utensils, Smartphone, LayoutDashboard, Barcode, Music, Video, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export type TabType = "url" | "vcard" | "file" | "linkpage" | "form" | "menu" | "appstore" | "landing" | "smarturl" | "gs1" | "mp3" | "video" | "wifi";

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { t, language, toggleLanguage } = useLanguage();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "url", label: t.url || "URL", icon: <Link size={18} /> },
    { id: "vcard", label: t.vcard || "vCard", icon: <Database size={18} /> },
    { id: "file", label: t.pdf || "File", icon: <FileText size={18} /> },
    { id: "linkpage", label: t.linkpage || "Link Page", icon: <PanelsTopLeft size={18} /> },
    { id: "form", label: t.form || "Google Form", icon: <FileSpreadsheet size={18} /> },
    { id: "menu", label: t.menu || "Menu", icon: <Utensils size={18} /> },
    { id: "appstore", label: t.app || "App stores", icon: <Smartphone size={18} /> },
    { id: "landing", label: t.landing || "Landing page", icon: <LayoutDashboard size={18} /> },
    { id: "smarturl", label: t.smarturl || "Smart URL", icon: <QrCode size={18} /> },
    { id: "gs1", label: t.gs1 || "GS1 Digital", icon: <Barcode size={18} /> },
    { id: "mp3", label: t.mp3 || "MP3", icon: <Music size={18} /> },
    { id: "video", label: t.video || "Video", icon: <Video size={18} /> },
    { id: "wifi", label: t.wifi || "WiFi", icon: <Wifi size={18} /> },
  ];

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <header className="header-container">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <QrCode size={28} color="var(--accent-cyan)" />
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "1px" }}>QR Neon<span style={{ color: "var(--accent-magenta)" }}>Gen</span></span>
        </div>
        <button 
          onClick={toggleLanguage}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.8rem", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease" }}
        >
          <Globe size={16} />
          <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{language.toUpperCase()}</span>
        </button>
      </div>

      <div className="nav-wrapper">
        <button className="nav-arrow left" onClick={() => scroll("left")}>
          <ChevronLeft size={24} />
        </button>
        
        <nav className="nav-carousel" ref={carouselRef}>
          {navItems.map((item) => (
            <button 
              key={item.id} 
               onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="nav-arrow right" onClick={() => scroll("right")}>
          <ChevronRight size={24} />
        </button>
      </div>

    </header>
  );
}
