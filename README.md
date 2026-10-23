# Café Joplin · web (demo para el cliente)

Propuesta de web para Café Joplin (C. Romero Leal, 3, Mérida · 607 68 07 87). Parte del modelo [ÁNCORA Fisioterapia](https://github.com/danielduranmoya-spec/ancora-fisio), la tarifa *Landing page*.

Demo: https://danielduranmoya-spec.github.io/web-cafe-joplin/ (con `noindex`: no sale en Google)

```
web-cafe-joplin/
├── index.html        ← la web (estructura y textos)
├── style.css         ← estilos: colores, tipografías y espaciado al principio, en :root
├── script.js         ← teléfono, WhatsApp, horario y carta (CONFIG y CARTA)
├── aviso-legal.html  ← plantilla: completa los campos [PENDIENTE]
├── privacidad.html   ← plantilla: completa los campos [PENDIENTE]
├── cookies.html      ← qué guarda la web y qué servicios externos usa
└── favicon.svg
```

## Secciones

1. **Inicio**: titular, WhatsApp y teléfono, y la ficha con la nota de Google (4,6 · 1.146 reseñas).
2. **La carta**: cinco pestañas (desayunos, Del Cáucaso, cocina casera, postres, tés y vinos). Al cambiar de pestaña cambian los platos y el mensaje de WhatsApp.
3. **El sitio**: lo que repiten las reseñas.
4. **Dudas frecuentes**.
5. **Dónde estamos**: dirección, aviso «Abierto ahora / Cerrado», horario y mapa.

## Pendiente de confirmar con el local

- **Horario**: el de la web es orientativo, sacado de fichas públicas. Cambiarlo en `CONFIG.horario` (`script.js`) y en la tabla `.hours` (`index.html`), y quitar la nota «Horario orientativo».
- **Carta y precios**: los platos vienen de la carta publicada en internet, sin precios. Ajustar en `CARTA` (`script.js`). La sección «Del Cáucaso» también está escrita en `index.html` para que se vea sin JavaScript.
- **WhatsApp**: se usa el mismo número del teléfono. Confirmar que tiene WhatsApp.
- **Reservas**: confirmar si aceptan reservas, porque la sección de dudas lo menciona.
- **Fotos**: la demo no lleva fotos del local. Pedirlas o hacerlas en la visita.
- **Textos legales**: titular, NIF y correo en `aviso-legal.html` y `privacidad.html`.
- Al pasar a web real: quitar la barra «Propuesta» (`.concept-bar`), el `noindex` del `<head>` y el crédito del pie si el cliente lo prefiere.

## Publicar cambios

GitHub Pages desde la rama `main` (carpeta raíz). Cada `git push` a `main` actualiza la web en uno o dos minutos.
