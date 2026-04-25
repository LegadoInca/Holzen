export const heroSlides = [
  {
    type: 'video' as const,
    src: '/Holzen/videos/hero4.mp4',
  },
  {
    type: 'video' as const,
    src: '/Holzen/videos/hero5.mp4',
  },
  {
    type: 'image' as const,
    src: '/Holzen/images/hero1.jpg',
  },
  {
    type: 'image' as const,
    src: '/Holzen/images/hero2.jpg',
  },
  {
    type: 'image' as const,
    src: '/Holzen/images/hero6.jpg',
  },
];

export interface Producer {
  name: string;
  location: string;
  story: string;
  image: string;
}

export interface Product {
  id: string;
  tag: string;
  stock: number;
  overlayName: string;
  overlayOrigin: string;
  overlayPrice: string;
  detailTag: string;
  detailName: string;
  notes: string;
  specs: { label: string; value: string }[];
  image: string;
  priceNum: number;
  priceLabel: string;
  ctaLabel: string;
  producer: Producer & { storyTitle: string };
}

export const products: Product[] = [
  {
    id: 'chuncho',
    tag: 'Variedad Nativa',
    stock: 3,
    overlayName: 'Caturra del Cusco',
    overlayOrigin: 'Quillabamba, Cusco · 1,200 msnm',
    overlayPrice: 'desde $7.10 / kg',
    detailTag: 'Quillabamba · Cusco · Perú',
    detailName: 'Caturra Washed',
    notes: 'Frutas rojas · Jazmín · Panela',
    specs: [
      { label: 'Variedad', value: 'Caturra nativo' },
      { label: 'Proceso', value: 'Lavado 72h' },
      { label: 'Altitud', value: '1,200 msnm' },
      { label: 'Humedad', value: '\u2264 7%' },
      { label: 'Precio', value: '$7.10 / kg' },
    ],
    image: '/Holzen/images/product1.jpeg',
    priceNum: 28,
    priceLabel: '$28.00/kg',
    ctaLabel: 'Beber su café',
    producer: {
      name: 'Lucía Quispe',
      location: 'Quillabamba, Cusco',
      storyTitle: 'El renacer de Lucía',
      story: 'A los 19 años, una helada arrasó con toda su cosecha en una sola noche. Sin crédito, sin seguro, sin nadie que la respaldara, Lucía decidió no rendirse. Aprendió sola el proceso de lavado observando a sus vecinos y leyendo lo que encontraba. Tres años después, su Caturra Washed es el más solicitado por tostadoras especializadas en Alemania y Países Bajos. Hoy entrena a otras mujeres de su comunidad. "Perdí todo en una noche. Pero esa noche también me enseñó que yo era más fuerte que mi miedo."',
      image: '/Holzen/images/farmer1.jpg',
    },
  },
  {
    id: 'bourbon',
    tag: 'Microlote',
    stock: 5,
    overlayName: 'Bourbon Rojo Natural',
    overlayOrigin: 'San Martín, Perú · 1,600 msnm',
    overlayPrice: 'desde $6.40 / kg',
    detailTag: 'San Martín · Perú',
    detailName: 'Bourbon Natural',
    notes: 'Ciruela · Chocolate negro · Miel',
    specs: [
      { label: 'Variedad', value: 'Bourbon Rojo' },
      { label: 'Proceso', value: 'Natural 10 días' },
      { label: 'Altitud', value: '1,600 msnm' },
      { label: 'Humedad', value: '\u2264 7%' },
      { label: 'Precio', value: '$6.40 / kg' },
    ],
    image: '/Holzen/images/product2.jpg',
    priceNum: 24,
    priceLabel: '$24.00/kg',
    ctaLabel: 'Generar impacto',
    producer: {
      name: 'Edilberto Rojas',
      location: 'Tarapoto, San Martín',
      storyTitle: 'El despertar de Edilberto',
      story: 'Volvió de las fuerzas armadas con las manos vacías y una parcela abandonada que nadie quería. Durante dos años trabajó solo, de madrugada, antes de que saliera el sol, convirtiendo ese terreno en 3 hectáreas de cafetal. No tenía maquinaria, no tenía préstamos. Solo voluntad. Su Bourbon Natural financió la educación universitaria de sus cuatro hijos. "Mis hijos no van a heredar deudas. Van a heredar dignidad."',
      image: '/Holzen/images/farmer2.jpeg',
    },
  },
  {
    id: 'monzon',
    tag: 'Selección Especial',
    stock: 2,
    overlayName: 'Monzón Heritage',
    overlayOrigin: 'Valle Monzón, Huánuco · 900 msnm',
    overlayPrice: 'desde $6.30 / kg',
    detailTag: 'Valle Monzón · Huánuco',
    detailName: 'Honey Amarillo',
    notes: 'Durazno · Caña · Madera dulce',
    specs: [
      { label: 'Variedad', value: 'Caturra Amarillo' },
      { label: 'Proceso', value: 'Honey 7 días' },
      { label: 'Altitud', value: '900 msnm' },
      { label: 'Humedad', value: '\u2264 7.5%' },
      { label: 'Precio', value: '$6.30 / kg' },
    ],
    image: '/Holzen/images/product3.jpg',
    priceNum: 22,
    priceLabel: '$22.00/kg',
    ctaLabel: 'Apoyar su historia',
    producer: {
      name: 'Rosa Panduro',
      location: 'Valle Monzón, Huánuco',
      storyTitle: 'La fuerza de Rosa',
      story: 'Madre soltera de tres hijos, heredó una deuda y una parcela que nadie quería tocar. Sin dinero para pagar jornaleros, aprendió el secado solar artesanal observando a sus vecinos durante meses. Hoy produce uno de los cafés Honey más complejos del Perú, sin intermediarios, exportando directamente a Europa. Cada saco lleva su nombre. "Nadie me regaló nada. Pero tampoco nadie me quitó las ganas."',
      image: '/Holzen/images/farmer3.jpeg',
    },
  },
  {
    id: 'geisha',
    tag: 'Alta Gama',
    stock: 4,
    overlayName: 'Geisha de Jaén',
    overlayOrigin: 'Jaén, Cajamarca · 1,800 msnm',
    overlayPrice: 'desde $10.00 / kg',
    detailTag: 'Jaén · Cajamarca · Perú',
    detailName: 'Geisha Washed',
    notes: 'Bergamota · Flor blanca · Limón',
    specs: [
      { label: 'Variedad', value: 'Geisha' },
      { label: 'Proceso', value: 'Lavado 48h' },
      { label: 'Altitud', value: '1,800 msnm' },
      { label: 'Humedad', value: '\u2264 6.5%' },
      { label: 'Precio', value: '$10.00 / kg' },
    ],
    image: '/Holzen/images/product4.jpg',
    priceNum: 38,
    priceLabel: '$38.00/kg',
    ctaLabel: 'Beber su café',
    producer: {
      name: 'Segundo Herrera',
      location: 'Jaén, Cajamarca',
      storyTitle: 'La ruptura de Segundo',
      story: 'Creció viendo a su padre entregar sacos de café a intermediarios que pagaban lo mínimo y se llevaban lo máximo. A los 28 años decidió que esa cadena terminaba con él. Aprendió catación de forma autodidacta, certificó su finca con estándares internacionales y comenzó a exportar directamente. Hoy su Geisha Washed llega a Japón, Suecia y Dinamarca con su nombre impreso en el saco. "Mi padre nunca supo a quién le vendía. Yo sí sé a quién le vendo."',
      image: '/Holzen/images/farmer4.jpeg',
    },
  },
  {
    id: 'pampas',
    tag: 'Resistencia',
    stock: 6,
    overlayName: 'Pampas Alto',
    overlayOrigin: 'Ayacucho · 2,200 msnm',
    overlayPrice: 'desde $7.70 / kg',
    detailTag: 'Valle del Pampas · Ayacucho',
    detailName: 'Typica Natural',
    notes: 'Cacao · Tabaco suave · Frutos secos',
    specs: [
      { label: 'Variedad', value: 'Typica' },
      { label: 'Proceso', value: 'Natural 12 días' },
      { label: 'Altitud', value: '2,200 msnm' },
      { label: 'Humedad', value: '\u2264 7%' },
      { label: 'Precio', value: '$7.70 / kg' },
    ],
    image: '/Holzen/images/product5.jpeg',
    priceNum: 30,
    priceLabel: '$30.00/kg',
    ctaLabel: 'Apoyar su historia',
    producer: {
      name: 'Manuel Ccahuana',
      location: 'Ayacucho, Valle del Pampas',
      storyTitle: 'La resistencia de Manuel',
      story: 'En los años 90, el terrorismo arrasó su comunidad en el Valle del Pampas. Manuel perdió a su padre y a tres vecinos en una sola semana. Durante años, esas tierras fueron sinónimo de miedo y abandono. Hoy, a los 54 años, Manuel cultiva café en esos mismos campos. Cada saco que exporta es un acto de resistencia, de memoria y de paz. "Sembrar aquí donde todo fue destruido es mi forma de decir: seguimos vivos."',
      image: '/Holzen/images/farmer5.jpg',
    },
  },
  {
    id: 'esperanza',
    tag: 'Origen Directo',
    stock: 3,
    overlayName: 'La Esperanza',
    overlayOrigin: 'Cusco · Finca La Esperanza · 2,800 msnm',
    overlayPrice: 'desde $9.10 / kg',
    detailTag: 'Finca La Esperanza · Cusco',
    detailName: 'Caturra Washed',
    notes: 'Naranja · Caramelo · Almendra',
    specs: [
      { label: 'Variedad', value: 'Caturra' },
      { label: 'Proceso', value: 'Lavado 60h' },
      { label: 'Altitud', value: '2,800 msnm' },
      { label: 'Humedad', value: '\u2264 6.8%' },
      { label: 'Precio', value: '$9.10 / kg' },
    ],
    image: '/Holzen/images/product6.jpg',
    priceNum: 34,
    priceLabel: '$34.00/kg',
    ctaLabel: 'Generar impacto',
    producer: {
      name: 'Rosa Quispe',
      location: 'Cusco, Finca La Esperanza',
      storyTitle: 'La esperanza de Rosa',
      story: 'Rosa escapó de una relación violenta con tres hijos pequeños — Lucía de 4, Ander de 6 y Mateo de 8 años. Llegó a Cusco con lo puesto, sin dinero, sin red de apoyo, sin plan. Una vecina le enseñó a cultivar café. Hoy su finca, que ella misma bautizó "La Esperanza", financia la escuela de sus tres hijos y exporta directamente a Europa. "Mis hijos me ven trabajar y saben que rendirse no es una opción."',
      image: '/Holzen/images/farmer6.jpg',
    },
  },
];

export interface Farmer {
  tag: string;
  tagIcon: string;
  name: string;
  location: string;
  story: string;
  image: string;
  index: string;
  stat: string;
  statLabel: string;
}

export const farmers: Farmer[] = [
  {
    tag: 'Quillabamba · Cusco',
    tagIcon: 'ri-seedling-line',
    name: 'Lucía Quispe',
    location: 'Valle del Urubamba · 1,200 msnm',
    story: 'A los 19 años perdió su cosecha entera por una helada. Sin crédito, sin apoyo, decidió aprender sola el proceso natural. Hoy su Caturra es el más solicitado por tostadoras en Alemania y Países Bajos.',
    image: '/Holzen/images/farmer1.jpg',
    index: '01',
    stat: '3×',
    statLabel: 'ingresos en 4 años',
  },
  {
    tag: 'San Martín · Perú',
    tagIcon: 'ri-heart-line',
    name: 'Edilberto Rojas',
    location: 'Tarapoto · 850 msnm',
    story: 'Exmilitar que volvió a su tierra con las manos vacías. Convirtió una parcela abandonada en un cafetal de 3 hectáreas trabajando solo, de madrugada, durante dos años. Su café financió la educación de sus cuatro hijos.',
    image: '/Holzen/images/farmer2.jpeg',
    index: '02',
    stat: '3 ha',
    statLabel: 'cultivadas desde cero',
  },
  {
    tag: 'Valle Monzón · Huánuco',
    tagIcon: 'ri-sun-line',
    name: 'Rosa Panduro',
    location: 'Valle Monzón · 900 msnm',
    story: 'Madre soltera de tres hijos, heredó una deuda y una parcela descuidada. Aprendió el secado solar artesanal observando a sus vecinos. Hoy produce uno de los cafés naturales más complejos del Perú, sin intermediarios.',
    image: '/Holzen/images/farmer3.jpeg',
    index: '03',
    stat: '100%',
    statLabel: 'venta directa al exterior',
  },
  {
    tag: 'Jaén · Cajamarca',
    tagIcon: 'ri-leaf-line',
    name: 'Segundo Herrera',
    location: 'Jaén · 1,400 msnm',
    story: 'Creció viendo a su padre vender café a precios de miseria a intermediarios locales. A los 28 años decidió romper esa cadena: aprendió catación, certificó su finca y comenzó a exportar directamente. Hoy su café llega a Japón y Suecia con su nombre en el saco.',
    image: '/Holzen/images/farmer4.jpeg',
    index: '04',
    stat: '12 países',
    statLabel: 'destinos de exportación',
  },
  {
    tag: 'Ayacucho · Valle del Pampas',
    tagIcon: 'ri-shield-line',
    name: 'Manuel Ccahuana',
    location: 'Ayacucho · 2,200 msnm',
    story: 'En los 90, el terrorismo destruyó su comunidad. Manuel perdió a su padre y a tres vecinos en una semana. Hoy, a los 54 años, cultiva café donde antes solo había miedo. Cada saco que exporta es un acto de resistencia y de paz.',
    image: '/Holzen/images/farmer5.jpg',
    index: '05',
    stat: '54 años',
    statLabel: 'de resistencia',
  },
  {
    tag: 'Cusco · Finca La Esperanza',
    tagIcon: 'ri-heart-line',
    name: 'Rosa Quispe',
    location: 'Cusco · 2,800 msnm',
    story: 'Rosa escapó de una relación violenta con tres hijos pequeños — Lucía de 4, Ander de 6 y Mateo de 8 años. Sin dinero ni red de apoyo, llegó a Cusco con lo puesto. Aprendió a cultivar café de la mano de una vecina. Hoy su finca financia la escuela de sus tres hijos y exporta directamente a Europa. "Mis hijos me ven trabajar y saben que rendirse no es una opción."',
    image: '/Holzen/images/farmer6.jpg',
    index: '06',
    stat: '3 hijos',
    statLabel: 'en la escuela gracias al café',
  },
  {
    tag: 'San Martín · Alto Huallaga',
    tagIcon: 'ri-seedling-line',
    name: 'Julia Flores',
    location: 'San Martín · 1,900 msnm',
    story: 'Hace tres años, Julia cultivaba coca porque no había otra opción. Hoy cultiva café premium con certificación de origen. "El café me devolvió el orgullo", dice en el audio que recibirás con tu pedido. Su historia es el futuro del Perú.',
    image: '/Holzen/images/farmer7.jpeg',
    index: '07',
    stat: '100%',
    statLabel: 'café certificado de origen',
  },
];

export const processSteps = [
  {
    n: '01',
    icon: 'ri-plant-line',
    title: 'Cosecha Selectiva',
    subtitle: 'Selección a mano',
    desc: 'Solo cerezas en su punto óptimo de madurez. Cada una seleccionada a mano por nuestros productores.',
    tags: ['100% Manual', 'Madurez óptima'],
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776587469/search-image_42_hmzrcw.jpg',
    color: '#c9a96e',
  },
  {
    n: '02',
    icon: 'ri-flask-line',
    title: 'Procesado Artesanal',
    subtitle: 'Fermentación controlada',
    desc: '48-72 horas de procesado controlado. El proceso que desarrolla los precursores de sabor únicos del café peruano.',
    tags: ['48-72 horas', 'Fermentación'],
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776587471/search-image_41_urgfv0.jpg',
    color: '#a07850',
  },
  {
    n: '03',
    icon: 'ri-sun-line',
    title: 'Secado Solar',
    subtitle: 'Bajo el sol andino',
    desc: 'Bajo el sol andino durante 7 a 10 días. Humedad final ≤7%. Sin secado artificial que altere el perfil sensorial.',
    tags: ['7-10 días', '≤7% humedad'],
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776587465/search-image_44_z7z667.jpg',
    color: '#d4a853',
  },
  {
    n: '04',
    icon: 'ri-shield-check-line',
    title: 'Control & Envío',
    subtitle: 'Certificado EUDR',
    desc: 'Análisis de laboratorio, certificados EUDR y empaque en sacos GrainPro. De Lima a tu destino en Europa.',
    tags: ['Cert. EUDR', 'GrainPro'],
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776587467/search-image_43_py8fo5.jpg',
    color: '#8b6340',
  },
];
