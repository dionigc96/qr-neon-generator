# EQUIPO MULTI-AGENTE: QR NEON GENERATOR

El sistema operará bajo los siguientes roles especializados para construir una plataforma SaaS de generación de códigos QR (Estáticos y Dinámicos) con enfoque Mobile-First, alta optimización SEO y monetización mediante AdSense.

* **Agente 1: Arquitecto & DevOps (Director de Proyecto)**
  - Tareas iniciales: 
    1. Utilizar GitHub MCP para crear el repositorio público (`qr-neon-gen`).
    2. Utilizar Supabase MCP para crear el proyecto y configurar la base de datos y el Storage.
  - Tarea Estructural: Diseñar la base de datos para soportar múltiples tipos de payloads (URLs, vCards enteras, enlaces a archivos en Storage). Definir la arquitectura en Next.js (App Router) con TypeScript.

* **Agente 2: Diseñador UI/UX (Conexión Stitch)**
  - Tarea: Generar el sistema de diseño usando SIEMPRE Google Stitch.
  - Estilo Visual: Diseño moderno, soporte nativo para Dark/Light Mode. Usar una paleta oscura con acentos de color Neón vibrantes (cian, magenta o verde lima) para destacar botones y acciones.
  - Requisitos Funcionales de Interfaz:
    1. Un menú/carrusel horizontal superior intuitivo con iconos para las opciones: URL, vCard, File, Link Page, Google Form, Menu, App stores, Landing page, Smart URL, GS1 Digital, MP3, Video, Wifi.
    2. Un selector (Toggle) visualmente claro entre "Static QR" y "Dynamic QR".
    3. Un campo de input que incluya la opción de "Subir una imagen para extraer la URL".
    4. Un panel de personalización visual (Logo en el centro, colores, formas).
    5. Reservar un espacio (Placeholder) elegante para banners publicitarios de Google AdSense integrados en la UI.
  - Requisito estructural: Patrón estricto Mobile-First que escale a escritorio.

* **Agente 3: Desarrollador Frontend (Especialista SEO & UI)**
  - Tarea: Construir la interfaz en Next.js basada en los tokens de Stitch.
  - Reglas técnicas:
    1. Implementar la librería `qr-code-styling` para generar los QRs en el cliente permitiendo personalización avanzada (logos, colores, patrones).
    2. Crear formularios dinámicos que cambien según la pestaña seleccionada (ej. si elige vCard, mostrar campos de Nombre, Teléfono, Email; si elige WiFi, mostrar SSID y Password).
    3. Añadir animaciones fluidas al interactuar con el panel usando Framer Motion.
    4. Optimización SEO Técnica: Metadata dinámica, Open Graph y semantic HTML para rankear la web en primera página.

* **Agente 4: Desarrollador Backend (Especialista en QR Dinámicos)**
  - Tarea: Conectar Next.js con Supabase (Base de datos, Auth y Storage).
  - Lógica Core: 
    1. QR Estáticos: Procesamiento 100% en cliente.
    2. QR Dinámicos: Construir un acortador de URLs interno (`tudominio.com/q/[id]`). Guardar la URL de destino en Supabase, registrar las analíticas (clics, fecha, ubicación) y redirigir.
    3. Archivos: Configurar Supabase Storage para alojar los PDF (Menús/Files), MP3 y Vídeos que los usuarios suban para generar sus QR.