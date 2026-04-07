import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "QR Neon Generator - Crea códigos QR dinámicos y trackeables",
  description: "La mejor plataforma SaaS para generar códigos QR Premium, Dinámicos y Analíticos. Genera vCards, Enlaces WIFI, URLs con tracking de estadísticas, totalmente gratis.",
  generator: "Next.js",
  applicationName: "QR Neon Generator",
  referrer: "origin-when-cross-origin",
  keywords: ["Generador QR", "QR Code", "QR Dinámico", "QR Animado", "vCard QR", "WiFi QR", "SaaS", "Creador de QR Profesional", "QR Trackeable"],
  authors: [{ name: "NeonGen", url: "https://qr-neon-generator.com" }],
  creator: "NeonGen Team",
  publisher: "NeonGen Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://qr-neon-generator.com"),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "QR Neon Generator | Crea códigos QR del futuro",
    description: "Crea, gestiona y trackea tus Códigos QR Dinámicos al instante con un diseño Dark Premium.",
    url: "https://qr-neon-generator.com",
    siteName: "QR NeonGen",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QR Neon Generator Preview",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Neon Generator | Crea códigos QR del futuro",
    description: "Crear códigos QR dinámicos, premium y con estadísticas nunca fue tan fácil.",
    creator: "@qrneongen",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-icon.png",
  },
};

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`} 
            crossOrigin="anonymous"
          ></script>
        )}
        <meta name="google-adsense-account" content="ca-pub-6908025438376091" />
      </head>
      <body className={`${outfit.variable} ${outfit.className}`}>
        <LanguageProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "QR Neon Generator",
                "url": "https://qr-neon-generator.com",
                "description": "La mejor plataforma SaaS para generar códigos QR Premium, Dinámicos y Analíticos.",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              })
            }}
          />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
