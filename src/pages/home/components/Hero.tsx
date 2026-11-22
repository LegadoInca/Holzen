import { useTranslation } from 'react-i18next';
import CoffeeBeanHero from '@/components/ui/coffee-bean-hero';

// ─────────────────────────────────────────────────────────────
// Hero: grano de café 3D (WebGL) controlado por scroll.
// 4 escenas: portada → origen → proceso (el grano se tuesta) → titular + botones.
// Velocidad del scroll: prop `sceneScroll` (más bajo = más rápido).
// ─────────────────────────────────────────────────────────────
// Logo del hero: versión con "coffee" en blanco (el navbar usa holzen-logo.png)
const LOGO = '/Holzen/images/holzen-logo-coffee-blanco.png';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const Hero = () => {
  const { t } = useTranslation();

  return (
    <CoffeeBeanHero
      id="hero"
      logo={LOGO}
      textureFront="/Holzen/images/bean/front.webp"
      textureBack="/Holzen/images/bean/back.webp"
      wordColor="#26E237"
      pourVideo="/Holzen/videos/del-grano-pour.mp4"
      pourVideoMobile="/Holzen/videos/del-grano-pour-mobile.mp4"
      pourPoster="/Holzen/images/pour-poster.jpg"
      sceneScroll={0.75}
      onPrimary={() => scrollTo('products')}
      onSecondary={() => scrollTo('farmers')}
      copy={{
        eyebrow: t('hero_eyebrow'),
        word: 'HOLZEN',
        desc: t('hero_desc'),
        scroll: t('bean_scroll'),
        originLabel: t('bean_origin_label'),
        originTitle: t('bean_origin_title'),
        originMeta: t('bean_origin_meta'),
        processLabel: t('bean_process_label'),
        steps: [t('bean_step1'), t('bean_step2'), t('bean_step3')],
        title: t('hero_subtitle'),
        ctaPrimary: t('hero_cta_primary'),
        ctaSecondary: t('hero_cta_secondary'),
      }}
    />
  );
};

export default Hero;
