export interface Review {
  id: string;
  stars: number;
  text: string;
  name: string;
  location: string;
  avatar: string;
  lang: string;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    stars: 5,
    text: '"Pedí el Chuncho Washed y fue una revelación. Nunca pensé que un café pudiera tener notas tan claras de jazmín y fruta roja. Saber que detrás hay una historia real de Lucía lo hace todo más especial."',
    name: 'Fiona Hernández',
    location: 'Ciudad de México, México',
    avatar: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776606027/113ea2fd0927e6437254e64282f14bc9_vtkmgw.jpg',
    lang: 'ES',
  },
  {
    id: 'r2',
    stars: 5,
    text: '"I ordered the Geisha from Jaén and I was speechless. The quality is exceptional, and knowing that every purchase directly supports the producing families makes it even more meaningful. This is what coffee should be."',
    name: 'Luca Bianchi',
    location: 'Milan, Italy',
    avatar: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776606025/search-image_46_sovthv.jpg',
    lang: 'EN',
  },
  {
    id: 'r3',
    stars: 5,
    text: '"Compré una mezcla andina y quedé sin palabras. La calidad es extraordinaria, pero lo que más me llegó fue la historia de Rosa. Saber que mi compra ayuda directamente a sus hijos en la escuela... eso no tiene precio."',
    name: 'Sophie Müller',
    location: 'Zürich, Alemania',
    avatar: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776605979/search-image_45_svxidl.jpg',
    lang: 'DE',
  },
  {
    id: 'r4',
    stars: 5,
    text: '"Objednal jsem si Bourbon Natural a byl jsem nadšený. Chuť je komplexní, s tóny švestky a hořké čokolády. Ale co mě opravdu dojalo, byl příběh Edilberta. Tohle není jen káva — je to změna."',
    name: 'Tomáš Novák',
    location: 'Praha, Česká republika',
    avatar: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776563097/9e826c618a9df4ce90d55ed97435a4f2_hepkyp.jpg',
    lang: 'CS',
  },
  {
    id: 'r5',
    stars: 5,
    text: '"Der Honey Amarillo ist einfach unglaublich. Pfirsich, Karamell, süßes Holz — ich habe noch nie so einen komplexen Kaffee getrunken. Und zu wissen, dass Rosa damit ihre Kinder ernährt, macht jeden Schluck bedeutsamer."',
    name: 'Klaus Weber',
    location: 'München, Deutschland',
    avatar: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776563097/5c38c7ba39008d6bd40e141f53bd791c_dz8jdu.jpg',
    lang: 'DE',
  },
  {
    id: 'r6',
    stars: 5,
    text: '"Tento káva z Cusca je zázrak. Každý doušek mi připomíná, že za ním stojí skuteční lidé s opravdovými příběhy. Holzen dělá to, co by měl dělat každý obchod — spojuje lidi přes oceány."',
    name: 'Markéta Dvořáková',
    location: 'Brno, Česká republika',
    avatar: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776563097/49c9046fe95f72b159f80d83c67d29d4_lnehtn.jpg',
    lang: 'CS',
  },
  {
    id: 'r7',
    stars: 5,
    text: '"The Typica Natural from Ayacucho blew my mind. Cocoa, soft tobacco, dried fruits — it\'s like drinking a story. Manuel\'s resilience is in every cup. I\'ve already ordered three more kilos for my café."',
    name: 'James O\'Brien',
    location: 'Dublin, Ireland',
    avatar: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776563097/5c38c7ba39008d6bd40e141f53bd791c_dz8jdu.jpg',
    lang: 'EN',
  },
];
