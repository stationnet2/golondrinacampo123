// Contenido editable del sitio.
// Fotos: archivos locales en src/assets/gallery (subidos desde golondrinasweb.zip).
// Las fotos son archivos PNG locales, en el mismo orden en que aparecen en el sitio.
const files = import.meta.glob<{ default: string }>("../assets/gallery/*.png", {
  eager: true,
  import: "default",
});
const byName = Object.entries(files).map(([path, url]) => ({
  id: path.split("/").pop()!.replace(".png", ""),
  url,
}));
const ordered = [...byName].sort((a, b) => a.id.localeCompare(b.id));

export const photos = ordered.map((p, i) => ({
  src: p.url,
  thumb: p.url,
  alt: `Golondrinas Campo, foto ${i + 1} del alojamiento`,
}));

export const heroImage = photos[0]!.src;

export const facts = [
  { label: "Huéspedes", value: "8" },
  { label: "Dormitorios", value: "4" },
  { label: "Camas", value: "5" },
  { label: "Baños", value: "2" },
];

export const amenities = [
  { title: "Pileta grande", text: "Para los días de calor, rodeada de verde." },
  { title: "Laguna con peces", text: "Acceso al agua y paisaje abierto." },
  { title: "Cancha de tenis", text: "Y también cancha de fútbol para armar partido." },
  { title: "Golfito", text: "Un plan tranquilo para grandes y chicos." },
  { title: "Parrilla y fogón", text: "Lugar para fogatas y asados al aire libre." },
  { title: "Chimenea interior", text: "Noches cálidas adentro de la casa." },
  { title: "Juegos para niños", text: "Espacios pensados para la familia." },
  { title: "Wifi, cocina y estacionamiento", text: "Lo práctico, resuelto en la propiedad." },
];

export const faqs = [
  {
    q: "¿Cómo reservo o consulto disponibilidad?",
    a: "Todas las reservas y consultas se hacen por WhatsApp. Desde cualquier botón “Consultar disponibilidad” abrís una conversación con nosotros, donde ves fechas y precios actualizados.",
  },
  {
    q: "¿Cuántas personas pueden alojarse?",
    a: "La casa recibe hasta 8 huéspedes, con 4 dormitorios, 5 camas y 2 baños.",
  },
  {
    q: "¿Dónde queda exactamente?",
    a: "Está en Brandsen, provincia de Buenos Aires. El mapa de la sección Ubicación muestra el lugar exacto donde está la casa; si querés más indicaciones para llegar, escribinos por WhatsApp.",
  },
  {
    q: "¿Se admiten mascotas, eventos o check-in flexible?",
    a: "Escribinos por WhatsApp y te contamos las reglas de la casa, los horarios de entrada y salida y la política de cancelación antes de reservar.",
  },
  {
    q: "¿Cómo contacto al anfitrión?",
    a: "Por WhatsApp al +54 9 2216 72-8212. Respondemos cualquier duda antes de reservar.",
  },
];

// WhatsApp del anfitrión: +54 9 2216 72-8212
export const WHATSAPP_DISPLAY = "+54 9 2216 72-8212";
export const WHATSAPP_URL = "https://wa.me/5492216728212";
