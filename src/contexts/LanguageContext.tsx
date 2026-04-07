"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

export const translations = {
  es: {
    // page.tsx
    hero_title1: "Generador de QR",
    hero_title2: "Avanzado",
    hero_subtitle: "La herramienta definitiva para crear códigos QR dinámicos y trackeables, diseñados para generar el máximo impacto en tu audiencia.",
    // Header.tsx
    url: "Enlace URL",
    vcard: "vCard",
    text: "Texto (SMS)",
    email: "Email",
    whatsapp: "WhatsApp",
    wifi: "Wi-Fi",
    crypto: "Criptomoneda",
    pdf: "PDF",
    mp3: "MP3",
    image: "Imagen",
    video: "Video",
    social: "Redes Sociales",
    app: "App Store",
    linkpage: "Alojamiento Link",
    form: "Formulario",
    menu: "Carta / Menú",
    landing: "Landing Page",
    smarturl: "Smart URL",
    gs1: "GS1 Digital",
    // QRPanel.tsx
    generate: "Generar",
    duration: "Duración del Código QR",
    days30: "30 Días",
    days90: "90 Días",
    unlimited: "Ilimitado",
    gen_btn: "Generar Código QR",
    url_input: "Ingresa la URL completa",
    vcard_name: "Nombre Completo",
    vcard_phone: "Teléfono",
    vcard_email: "Correo Electrónico",
    wifi_ssid: "Nombre de la Red (SSID)",
    wifi_pass: "Contraseña",
    // share/[short_id]/page.tsx
    share_title1: "Tu Código QR",
    share_title2: "Dinámico",
    copy_success: "¡URL copiada al portapapeles!",
    download: "Descargar",
    test_link: "Probar Link",
    // expired/page.tsx
    expired_title: "Enlace Caducado",
    expired_desc: "Este código QR ha superado su fecha de validez y ya no se encuentra disponible.",
    generate_new: "Generar Nuevo QR",
    app_ios: "Enlace App Store (iOS)",
    app_android: "Enlace Google Play (Android)",
    linkpage_title: "Añade múltiples enlaces (Ej: Redes Sociales)",
    file_url: "URL de tu archivo PDF",
    form_url: "URL de tu formulario",
    menu_url: "URL de tu Carta / Menú",
    landing_url: "URL de tu Landing Page",
    smarturl_url: "URL destino inteligente",
    gs1_url: "Datos del código GS1 Digital Link",
    mp3_url: "URL de tu pista de Audio (Spotify, MP3...)",
    video_url: "URL de tu Video (YouTube, Vimeo...)",
  },
  en: {
    // page.tsx
    hero_title1: "Advanced",
    hero_title2: "QR Generator",
    hero_subtitle: "The ultimate tool to create dynamic and trackable QR codes, designed to maximize your audience impact.",
    // Header.tsx
    url: "URL Link",
    vcard: "vCard",
    text: "Text (SMS)",
    email: "Email",
    whatsapp: "WhatsApp",
    wifi: "Wi-Fi",
    crypto: "Cryptocurrency",
    pdf: "PDF",
    mp3: "MP3",
    image: "Image",
    video: "Video",
    social: "Social Media",
    app: "App Store",
    linkpage: "Link Page",
    form: "Google Form",
    menu: "Menu",
    landing: "Landing Page",
    smarturl: "Smart URL",
    gs1: "GS1 Digital",
    // QRPanel.tsx
    generate: "Generate",
    duration: "QR Code Duration",
    days30: "30 Days",
    days90: "90 Days",
    unlimited: "Unlimited",
    gen_btn: "Generate QR Code",
    url_input: "Enter the full URL",
    vcard_name: "Full Name",
    vcard_phone: "Phone Number",
    vcard_email: "Email Address",
    wifi_ssid: "Network Name (SSID)",
    wifi_pass: "Password",
    // share/[short_id]/page.tsx
    share_title1: "Your Dynamic",
    share_title2: "QR Code",
    copy_success: "URL copied to clipboard!",
    download: "Download",
    test_link: "Test Link",
    // expired/page.tsx
    expired_title: "Link Expired",
    expired_desc: "This QR code has exceeded its validity date and is no longer available.",
    generate_new: "Generate New QR",
    app_ios: "App Store Link (iOS)",
    app_android: "Google Play Link (Android)",
    linkpage_title: "Add multiple links (e.g. Socials)",
    file_url: "URL of your PDF file",
    form_url: "URL of your Form",
    menu_url: "URL of your Menu",
    landing_url: "URL of your Landing Page",
    smarturl_url: "Smart target URL",
    gs1_url: "GS1 Digital Link data",
    mp3_url: "URL of your Audio track (Spotify, MP3...)",
    video_url: "URL of your Video (YouTube, Vimeo...)",
  }
};

type Translations = typeof translations.es;

interface LanguageContextProps {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    // Load preference from localStorage on mount
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang && (savedLang === "es" || savedLang === "en")) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "es" ? "en" : "es";
    setLanguage(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
