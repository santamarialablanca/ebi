# Sistema EBI · Santa María La Blanca

Landing estática que presenta **Sistema EBI**: una propuesta de personalización de la enseñanza en Santa María La Blanca, basada en criterios, principios, seis etapas (metáfora de la raíz al fruto) y seis competencias.

## Contenido

- **Dos criterios**: Perfil de aprendizaje y relaciones significativas  
- **Cuatro principios**: Planificación centrada en el alumno, comunidad de aprendizaje, fortalecimiento docente, transformación curricular  
- **Seis etapas**: Raíz, Tallo, Nudo, Rama, Flor, Fruto (con acceso rápido por pills y tarjetas expandibles)  
- **Seis competencias**: Personal y social, Iniciativa y autonomía, Digital, Comunicativa, Artística, Científica (definiciones expandibles)

## Cómo ver el proyecto

Abre `index.html` en el navegador (no requiere servidor). Para servir localmente:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node (npx)
npx serve .
```

Luego visita `http://localhost:8000` (o el puerto que uses).

## Estructura de archivos

- `index.html` — Estructura y contenido (nav fija, hero, secciones, footer)
- `styles.css` — Estilos (diseño futurista + paleta colegio y etapas)
- `script.js` — Scroll suave, revelado al scroll, navegación activa, botones “Ver detalle” / “Ver más” en etapas y competencias, blur en nav al hacer scroll
- `img/` — Imágenes de apoyo (guías, competencias, etc.)

## Diseño

El diseño es **futurista** (inspirado en `old/styles.css`), con colores corporativos del colegio y colores propios por etapa.

### Diseño futurista (estilo old/styles.css)

- **Fondo oscuro**: body y main con `#293345` y gradiente radial tipo parallax.
- **Nav fija**: barra superior con logo EBI e iconos (Criterios, Principios, Etapas, Competencias, Objetivo); al hacer scroll se aplica blur y borde (clase `nav-fixed--scrolled`).
- **Hero**: gradientes con `#970036` y `#293345`, logo circular claro, título y subtítulo; sensación de parallax.
- **Secciones**: bloques con fondo claro (`#fafaf7`) en `.section-bg` y `.section-bg-alt` (tipo “glass”), sobre el fondo oscuro del main.
- **Cards**: estilo glass (fondo semitransparente oscuro, borde sutil) en zonas oscuras; en secciones claras, tarjetas blancas con sombra.

En **móvil** (< 720px) los enlaces de la nav fija se ocultan y solo se muestra el logo.

### Colores corporativos del colegio

| Uso | Color |
|-----|--------|
| Fondos oscuros, nav, footer | `#293345` |
| Texto claro, fondos de secciones claras | `#fafaf7` |
| Acentos (botones “Ver detalle” / “Ver más”, bordes al hover, focus, CTA final, logo de la nav) | `#970036` |

### Colores por etapa (pills y tarjetas)

Los pills de “Acceso rápido” y las tarjetas de cada etapa usan estos pares (fondo claro + acento):

| Etapa | Colores aplicados |
|-------|--------------------|
| Raíz | `#F7E8B8` / `#E3C34A` (infantil) |
| Tallo | `#C8E4E2` / `#5FAFA8` (escuelita) |
| Nudo | `#C7D6E2` / `#6E8FAF` (primaria) |
| Rama | `#F3C1AF` / `#E17A55` (secundaria) |
| Flor | `#F3C1AF` / `#E17A55` (secundaria) |
| Fruto | `#D6CCE7` / `#8C7CB8` (fp) |

## Accesibilidad

- Enlace “Ir al contenido principal” (skip link)
- Navegación por teclado y `:focus-visible` con contorno corporativo
- Etapas y competencias expandibles con `aria-expanded` y `aria-controls`
- Respeto a `prefers-reduced-motion` (sin animaciones si el usuario lo indica)
- Contraste y tamaños mínimos para lectura

## Tecnologías

- HTML5
- CSS3 (variables, grid, flexbox, `backdrop-filter`)
- JavaScript vanilla (sin dependencias)
- Fuentes: [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), [Fraunces](https://fonts.google.com/specimen/Fraunces); iconos [Font Awesome 6](https://fontawesome.com/)
