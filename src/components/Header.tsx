"use client";

import { useRef } from "react";
import { QrCode, Wifi, Link, FileText, Database, PanelsTopLeft, FileSpreadsheet, Utensils, Smartphone, LayoutDashboard, Barcode, Music, Video, ChevronLeft, ChevronRight } from "lucide-react";

export type TabType = "url" | "vcard" | "file" | "linkpage" | "form" | "menu" | "appstore" | "landing" | "smarturl" | "gs1" | "mp3" | "video" | "wifi";

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  qrType: "static" | "dynamic";
  setQrType: (type: "static" | "dynamic") => void;
}

export default function Header({ activeTab, setActiveTab, qrType, setQrType }: HeaderProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "url", label: "URL", icon: <Link size={18} /> },
    { id: "vcard", label: "vCard", icon: <Database size={18} /> },
    { id: "file", label: "File", icon: <FileText size={18} /> },
    { id: "linkpage", label: "Link Page", icon: <PanelsTopLeft size={18} /> },
    { id: "form", label: "Google Form", icon: <FileSpreadsheet size={18} /> },
    { id: "menu", label: "Menu", icon: <Utensils size={18} /> },
    { id: "appstore", label: "App stores", icon: <Smartphone size={18} /> },
    { id: "landing", label: "Landing page", icon: <LayoutDashboard size={18} /> },
    { id: "smarturl", label: "Smart URL", icon: <QrCode size={18} /> },
    { id: "gs1", label: "GS1 Digital", icon: <Barcode size={18} /> },
    { id: "mp3", label: "MP3", icon: <Music size={18} /> },
    { id: "video", label: "Video", icon: <Video size={18} /> },
    { id: "wifi", label: "WiFi", icon: <Wifi size={18} /> },
  ];

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <header className="header-container">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <QrCode size={28} color="var(--accent-cyan)" />
        <span style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "1px" }}>QR Neon<span style={{ color: "var(--accent-magenta)" }}>Gen</span></span>
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

      <div className="toggle-container">
        <button 
          onClick={() => setQrType("static")}
          className={`toggle-btn ${qrType === "static" ? "active" : ""}`}
        >
           Static
        </button>
        <button 
           onClick={() => setQrType("dynamic")}
          className={`toggle-btn ${qrType === "dynamic" ? "active" : ""}`}
        >
           Dynamic
        </button>
      </div>
    </header>
  );
}
