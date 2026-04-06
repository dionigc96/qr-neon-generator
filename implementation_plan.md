# QR Neon Generator - Implementation Plan (Roadmap)

## Fase 0: Infraestructura y Configuración
- ✅ Crear repositorio en GitHub (`dionigc96/qr-neon-generator`).
- ✅ Crear proyecto inicial en Supabase y confirmar costes.
- ✅ Inicializar proyecto Next.js limpio.
- ✅ Definir variables en `globals.css` para el tema "Lumina Onyx" (Dark, Neon Cyan/Magenta y Glassmorphism).

## Fase 1: Arquitectura Base y Diseño UI
- ✅ Diseño de layout general y estructura de componentes de alto nivel.
- ✅ Implementación Mobile-First y Responsive Design completo.
- ✅ Configurar fuentes (Outfit) y metaetiquetas SEO (`layout.tsx`).

## Fase 2: Componentes Core y Navegación
- ✅ Menú de navegación interactivo (Carrusel 13 botones) conectado a estado local.
- ✅ Formularios dinámicos para `URL`, `vCard` y `WiFi` usando `framer-motion` (Animaciones `AnimatePresence`).
- ✅ Generador de previsualización en tiempo real con `qr-code-styling`.
- ✅ Animaciones hover, active, glows y layout adaptativo (Grid vs Flexbox).

## Fase 3: Conexión Backend (Supabase)
- [ ] Configurar Supabase Client en Next.js.
- [ ] Configurar autenticación y tabla principal `qr_codes` (user_id, tipo, data, url_corta).
- [ ] Configurar base de datos para Analíticas (clics, ubicaciones, timestamps).
- [ ] Implementar Storage para guardar archivos (File, MP3, Video).

## Fase 4: Enrutamiento Dinámico de QR
- [ ] Implementar Short-URL Edge Functions/Rutas (`/q/[id]`).
- [ ] Lógica temporal de guardado de analíticas y redirección.
- [ ] Generación real de QR dinámicos apuntando al acortador de URL interno.

## Fase 5: Monetización y Pulido
- [ ] Implementar contenedores finales de Google AdSense.
- [ ] QA exhaustivo (Móvil, Tablet, Desktop).
- [ ] Integración CI/CD y despliegue a producción (Vercel).
