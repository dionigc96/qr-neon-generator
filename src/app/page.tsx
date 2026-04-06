"use client";

import { useState } from "react";
import Header, { TabType } from "@/components/Header";
import QRPanel from "@/components/QRPanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("url");
  const [qrType, setQrType] = useState<"static" | "dynamic">("static");

  return (
    <main className="main-layout">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} qrType={qrType} setQrType={setQrType} />
      <QRPanel activeTab={activeTab} qrType={qrType} />
      
      {/* Placeholder para Google AdSense */}
      <div className="glass-panel" style={{ width: "100%", padding: "1rem", textAlign: "center", color: "var(--text-secondary)", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Espacio publicitario patrocinado (AdSense Placeholder)
      </div>
    </main>
  );
}
