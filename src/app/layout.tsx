import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "QR Neon Generator - Crea códigos QR dinámicos y estáticos",
  description: "Plataforma SaaS para generar códigos QR Premium, Dinámicos y Estáticos orientada a Mobile-First. Genera vCards, Enlaces WIFI, PDFs y URLs con estadísticas.",
  keywords: ["Generador QR", "QR Code", "QR Dinámico", "vCard QR", "WiFi QR", "SaaS", "Mobile First"],
  openGraph: {
    title: "QR Neon Generator | Códigos QR del futuro",
    description: "Crea, gestiona y trackea tus Códigos QR Dinámicos al instante con un diseño Dark Premium.",
    type: "website",
    url: "https://qr-neon-generator.test/",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${outfit.className}`}>
        {children}
      </body>
    </html>
  );
}
