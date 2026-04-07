"use client";

import { useState } from "react";
import Header, { TabType } from "@/components/Header";
import QRPanel from "@/components/QRPanel";

import AdBanner from "@/components/AdBanner";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("url");

  return (
    <main className="main-layout">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <QRPanel activeTab={activeTab} />
      
      {/* Banner Publicitario Dinámico Central */}
      <AdBanner 
        dataAdSlot="1234567890" 
        dataAdFormat="auto" 
        dataFullWidthResponsive={true} 
      />
    </main>
  );
}
