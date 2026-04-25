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
    avatar: '/Holzen/images/avatar1.jpg',
    lang: 'ES',
  },
  {
    id: 'r2',
    stars: 5,
    text: '"I ordered the Geisha from Jaén and I was speechless. The quality is exceptional, and knowing that every purchase directly supports the producing families makes it even more meaningful. This is what coffee should be."',
    name: 'Luca Bianchi',
    location: 'Milan, Italy',
    avatar: '/Holzen/images/avatar2.jpg',
    lang: 'EN',
  },
  {
    id: 'r3',
    stars: 5,
    text: '"Compré una mezcla andina y quedé sin palabras. La calidad es extraordinaria, pero lo que más me llegó fue la historia de Rosa. Saber que mi compra ayuda directamente a sus hijos en la escuela... eso no tiene precio."',
    name: 'Sophie Müller',
    location: 'Zürich, Alemania',
    avatar: '/Holzen/images/avatar3.jpg',
    lang: 'DE',
  },
  {
    id: 'r4',
    stars: 5,
    text: '"Objednal jsem si Bourbon Natural a byl jsem nadšený. Chuť je komplexní, s tóny švestky a hořké čokolády. Ale co mě opravdu dojalo, byl příběh Edilberta. Tohle není jen káva — je to změna."',
    name: 'Tomáš Novák',
    location: 'Praha, Česká republika',
    avatar: '/Holzen/images/avatar4.jpg',
    lang: 'CS',
  },
  {
    id: 'r5',
    stars: 5,
    text: '"Der Honey Amarillo ist einfach unglaublich. Pfirsich, Karamell, süßes Holz — ich habe noch nie so einen komplexen Kaffee getrunken. Und zu wissen, dass Rosa damit ihre Kinder ernährt, macht jeden Schluck bedeutsamer."',
    name: 'Klaus Weber',
    location: 'München, Deutschland',
    avatar: '/Holzen/images/avatar5.jpeg',
    lang: 'DE',
  },
  {
    id: 'r6',
    stars: 5,
    text: '"Tento káva z Cusca je zázrak. Každý doušek mi připomíná, že za ním stojí skuteční lidé s opravdovými příběhy. Holzen dělá to, co by měl dělat každý obchod — spojuje lidi přes oceány."',
    name: 'Markéta Dvořáková',
    location: 'Brno, Česká republika',
    avatar: '/Holzen/images/avatar6.jpg',
    lang: 'CS',
  },
  {
    id: 'r7',
    stars: 5,
    text: '"The Typica Natural from Ayacucho blew my mind. Cocoa, soft tobacco, dried fruits — it\'s like drinking a story. Manuel\'s resilience is in every cup. I\'ve already ordered three more kilos for my café."',
    name: 'James O\'Brien',
    location: 'Dublin, Ireland',
    avatar: '/Holzen/images/avatar5.jpeg',
    lang: 'EN',
  },
];
