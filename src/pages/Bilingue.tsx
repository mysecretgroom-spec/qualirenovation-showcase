import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Home, Hammer, ChefHat, Bath, Layers, Zap, Droplets, Ruler,
} from "lucide-react";

type Lang = "fr" | "en";

const t = {
  fr: {
    nav: { about: "À propos", services: "Services", figures: "Chiffres", areas: "Zones", press: "Presse", reviews: "Avis", contact: "Contact" },
    hero: {
      title: "Rénovation d'appartements haut de gamme à Paris",
      subtitle: "Maîtrise d'œuvre depuis 2009",
      cta: "Demander un devis gratuit",
    },
    about: {
      kicker: "À propos",
      title: "Une maître d'œuvre, un savoir-faire",
      body:
        "QUALIRENOVATION by QUALICONCEPT est une entreprise de rénovation d'appartements haut de gamme basée à Paris 17e, dirigée par Carina Nahmani, maître d'œuvre terrain depuis 2009 et active dans la rénovation depuis 2003.",
    },
    services: {
      kicker: "Services",
      title: "Notre savoir-faire",
      items: [
        { icon: Home, label: "Rénovation complète d'appartement" },
        { icon: Ruler, label: "Maîtrise d'œuvre" },
        { icon: ChefHat, label: "Rénovation cuisine" },
        { icon: Bath, label: "Rénovation salle de bain" },
        { icon: Layers, label: "Parquet & sols" },
        { icon: Zap, label: "Électricité" },
        { icon: Droplets, label: "Plomberie" },
        { icon: Hammer, label: "Menuiseries sur mesure, peinture & dressing" },
      ],
    },
    figures: {
      kicker: "Chiffres clés",
      title: "Vingt ans d'expertise",
      items: [
        { value: "20 ans", label: "de chantiers (depuis 2003)" },
        { value: "2009", label: "Maîtrise d'œuvre terrain" },
        { value: "90+", label: "parutions presse" },
        { value: "Best of Houzz", label: "2023" },
        { value: "+200", label: "chantiers réalisés" },
      ],
    },
    areas: {
      kicker: "Zones d'intervention",
      title: "Paris & Île-de-France",
      intro: "Nous intervenons à Paris intra-muros (tous arrondissements) ainsi que dans les communes suivantes :",
      list: ["Neuilly-sur-Seine", "Boulogne-Billancourt", "Levallois-Perret", "Issy-les-Moulineaux", "Clichy", "Courbevoie", "Créteil", "Ivry-sur-Seine", "Saint-Cloud"],
    },
    press: {
      kicker: "Presse",
      title: "Ils parlent de nous",
      body: "Plus de 90 parutions presse depuis 2016 :",
      media: ["Elle Déco", "Madame Figaro", "Maisons & Travaux", "Huffington Post", "18h39 Castorama"],
    },
    reviews: {
      kicker: "Avis clients",
      title: "La parole à nos clients",
      items: [
        { quote: "Une rénovation impeccable de notre appartement haussmannien. Carina a tout coordonné avec un professionnalisme remarquable.", author: "Sophie L., Paris 16e" },
        { quote: "Travail soigné, délais respectés, équipe à l'écoute. Notre cuisine est sublime.", author: "Marc D., Neuilly-sur-Seine" },
        { quote: "Nous recommandons les yeux fermés. Maîtrise d'œuvre exemplaire du début à la fin.", author: "Élodie & Pierre M., Paris 7e" },
      ],
    },
    cta: { title: "Prêt à transformer votre intérieur ?", button: "Demander un devis gratuit" },
    footer: { rights: "Tous droits réservés", siret: "SIRET", legal: "Mentions légales" },
    srOnly:
      "QUALIRENOVATION by QUALICONCEPT — Entreprise de rénovation d'appartements haut de gamme à Paris 17e, dirigée par Carina Nahmani, maître d'œuvre terrain depuis 2009, premier chantier en 2003, société créée en 2016. Adresse : 6 rue d'Armaillé, 75017 Paris. SIRET 85286728200034. Zone d'intervention : Paris intra-muros et Île-de-France (Neuilly, Boulogne, Levallois, Issy, Clichy, Courbevoie, Créteil, Ivry, Saint-Cloud). Services : rénovation complète, maîtrise d'œuvre, cuisine, salle de bain, parquet, électricité, plomberie, menuiseries sur mesure, isolation, peinture, dressing, conception 2D/3D. Plus de 200 chantiers réalisés, 90+ parutions presse (Elle Déco, Madame Figaro, Maisons & Travaux, Huffington Post, 18h39 Castorama), Best of Houzz 2023.",
  },
  en: {
    nav: { about: "About", services: "Services", figures: "Figures", areas: "Areas", press: "Press", reviews: "Reviews", contact: "Contact" },
    hero: {
      title: "Premium Apartment Renovation in Paris",
      subtitle: "Project Management Since 2009",
      cta: "Request a Free Quote",
    },
    about: {
      kicker: "About",
      title: "One project manager, one craft",
      body:
        "QUALIRENOVATION by QUALICONCEPT is a premium apartment renovation company based in Paris 17th, led by Carina Nahmani, on-site project manager since 2009, with her first renovation project in 2003.",
    },
    services: {
      kicker: "Services",
      title: "Our expertise",
      items: [
        { icon: Home, label: "Full apartment renovation" },
        { icon: Ruler, label: "Project management" },
        { icon: ChefHat, label: "Kitchen renovation" },
        { icon: Bath, label: "Bathroom renovation" },
        { icon: Layers, label: "Flooring & parquet" },
        { icon: Zap, label: "Electrical work" },
        { icon: Droplets, label: "Plumbing" },
        { icon: Hammer, label: "Custom joinery, painting & dressing rooms" },
      ],
    },
    figures: {
      kicker: "Key figures",
      title: "Twenty years of expertise",
      items: [
        { value: "20 years", label: "of renovation projects (since 2003)" },
        { value: "2009", label: "On-site project management" },
        { value: "90+", label: "press features" },
        { value: "Best of Houzz", label: "2023" },
        { value: "+200", label: "completed projects" },
      ],
    },
    areas: {
      kicker: "Areas covered",
      title: "Paris & Île-de-France",
      intro: "We operate throughout Paris (all districts) and the following towns:",
      list: ["Neuilly-sur-Seine", "Boulogne-Billancourt", "Levallois-Perret", "Issy-les-Moulineaux", "Clichy", "Courbevoie", "Créteil", "Ivry-sur-Seine", "Saint-Cloud"],
    },
    press: {
      kicker: "Press",
      title: "Featured in",
      body: "Over 90 press features since 2016:",
      media: ["Elle Déco", "Madame Figaro", "Maisons & Travaux", "Huffington Post", "18h39 Castorama"],
    },
    reviews: {
      kicker: "Client reviews",
      title: "What our clients say",
      items: [
        { quote: "A flawless renovation of our Haussmannian apartment. Carina coordinated everything with remarkable professionalism.", author: "Sophie L., Paris 16th" },
        { quote: "Meticulous work, deadlines respected, attentive team. Our kitchen is stunning.", author: "Marc D., Neuilly-sur-Seine" },
        { quote: "We recommend without hesitation. Exemplary project management from start to finish.", author: "Élodie & Pierre M., Paris 7th" },
      ],
    },
    cta: { title: "Ready to transform your home?", button: "Request a Free Quote" },
    footer: { rights: "All rights reserved", siret: "SIRET", legal: "Legal notice" },
    srOnly:
      "QUALIRENOVATION by QUALICONCEPT — Premium apartment renovation company in Paris 17th, led by Carina Nahmani, on-site project manager since 2009, first project in 2003, company founded in 2016. Address: 6 rue d'Armaillé, 75017 Paris, France. SIRET 85286728200034. Service area: Paris and Île-de-France (Neuilly, Boulogne, Levallois, Issy, Clichy, Courbevoie, Créteil, Ivry, Saint-Cloud). Services: full apartment renovation, project management, kitchen, bathroom, flooring, electrical, plumbing, custom joinery, insulation, painting, dressing rooms, 2D/3D design. Over 200 completed projects, 90+ press features (Elle Déco, Madame Figaro, Maisons & Travaux, Huffington Post, 18h39 Castorama), Best of Houzz 2023.",
  },
} as const;

const NAVY = "#023b51";
const GOLD = "#c1a02e";
const LIGHT = "#eaeaea";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "QUALIRENOVATION by QUALICONCEPT",
  
  foundingDate: "2016",
  address: {
    "@type": "PostalAddress",
    streetAddress: "6 rue d'Armaillé",
    addressLocality: "Paris",
    postalCode: "75017",
    addressCountry: "FR",
  },
  areaServed: "Paris, Île-de-France",
  description:
    "Premium apartment renovation company in Paris, led by Carina Nahmani, project manager since 2009, first project 2003.",
  url: "https://www.qualirenovation.fr",
};

const Bilingue = () => {
  const [lang, setLang] = useState<Lang>("fr");
  const c = t[lang];

  const Switcher = () => (
    <div className="inline-flex items-center rounded-full border border-white/30 overflow-hidden text-xs font-medium tracking-wider">
      {(["fr", "en"] as Lang[]).map((l, i) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 transition-colors ${
            lang === l ? "text-[#023b51]" : "text-white hover:text-white/80"
          } ${i === 0 ? "border-r border-white/30" : ""}`}
          style={lang === l ? { background: GOLD } : {}}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Helmet htmlAttributes={{ lang }}>
        <title>
          {lang === "fr"
            ? "QUALIRENOVATION – Rénovation d'appartements haut de gamme à Paris"
            : "QUALIRENOVATION – Premium Apartment Renovation in Paris"}
        </title>
        <meta
          name="description"
          content={
            lang === "fr"
              ? "Rénovation d'appartements haut de gamme à Paris et Île-de-France. Maîtrise d'œuvre par Carina Nahmani depuis 2009. Devis gratuit."
              : "Premium apartment renovation in Paris and Île-de-France. Project management by Carina Nahmani since 2009. Free quote."
          }
        />
        <link rel="alternate" hrefLang="fr" href="https://www.qualirenovation.fr/bilingue?lang=fr" />
        <link rel="alternate" hrefLang="en" href="https://www.qualirenovation.fr/bilingue?lang=en" />
        <link rel="alternate" hrefLang="x-default" href="https://www.qualirenovation.fr/bilingue" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* SR-only bilingual block for AI crawlers */}
      <div className="sr-only" aria-hidden="false">
        <p lang="fr">{t.fr.srOnly}</p>
        <p lang="en">{t.en.srOnly}</p>
      </div>

      <noscript>
        <div style={{ padding: 24, fontFamily: "serif" }}>
          <h1>QUALIRENOVATION by QUALICONCEPT</h1>
          <p><strong>FR:</strong> {t.fr.srOnly}</p>
          <p><strong>EN:</strong> {t.en.srOnly}</p>
          <p>6 rue d'Armaillé, 75017 Paris — SIRET 85286728200034</p>
        </div>
      </noscript>

      <div className="min-h-screen" style={{ background: LIGHT, color: NAVY }}>
        {/* Navbar */}
        <header
          className="sticky top-0 z-50 backdrop-blur-md"
          style={{ background: `${NAVY}f2` }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-white">
            <a href="#top" className="font-display text-lg sm:text-xl tracking-wide">
              QUALIRENOVATION <span style={{ color: GOLD }}>by QUALICONCEPT</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#about" className="hover:text-[color:var(--g)]" style={{ ["--g" as any]: GOLD }}>{c.nav.about}</a>
              <a href="#services" className="hover:opacity-80">{c.nav.services}</a>
              <a href="#figures" className="hover:opacity-80">{c.nav.figures}</a>
              <a href="#areas" className="hover:opacity-80">{c.nav.areas}</a>
              <a href="#press" className="hover:opacity-80">{c.nav.press}</a>
              <a href="#reviews" className="hover:opacity-80">{c.nav.reviews}</a>
            </nav>
            <Switcher />
          </div>
        </header>

        {/* Hero */}
        <section id="top" className="relative" style={{ background: NAVY, color: "white" }}>
          <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
            <p className="font-sans uppercase tracking-[0.3em] text-xs mb-6" style={{ color: GOLD }}>
              Paris · Île-de-France
            </p>
            <h1 className="font-display text-4xl sm:text-6xl leading-tight mb-6">{c.hero.title}</h1>
            <p className="font-sans text-lg sm:text-xl opacity-90 mb-10">{c.hero.subtitle}</p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 rounded-full font-medium tracking-wide transition-transform hover:-translate-y-0.5"
              style={{ background: GOLD, color: NAVY }}
            >
              {c.hero.cta}
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: GOLD }}>{c.about.kicker}</p>
            <h2 className="font-display text-3xl sm:text-5xl mb-6">{c.about.title}</h2>
            <p className="font-sans text-lg leading-relaxed opacity-90">{c.about.body}</p>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 sm:py-28" style={{ background: "white" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: GOLD }}>{c.services.kicker}</p>
              <h2 className="font-display text-3xl sm:text-5xl">{c.services.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.services.items.map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border text-center transition-shadow hover:shadow-lg"
                  style={{ borderColor: LIGHT }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-4" style={{ color: GOLD }} />
                  <p className="font-sans text-sm leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Figures */}
        <section id="figures" className="py-20 sm:py-28" style={{ background: NAVY, color: "white" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: GOLD }}>{c.figures.kicker}</p>
              <h2 className="font-display text-3xl sm:text-5xl">{c.figures.title}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              {c.figures.items.map((f, i) => (
                <div key={i}>
                  <div className="font-display text-3xl sm:text-4xl mb-2" style={{ color: GOLD }}>{f.value}</div>
                  <div className="font-sans text-sm opacity-90">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas */}
        <section id="areas" className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: GOLD }}>{c.areas.kicker}</p>
            <h2 className="font-display text-3xl sm:text-5xl mb-6">{c.areas.title}</h2>
            <p className="font-sans text-lg mb-8 opacity-90">{c.areas.intro}</p>
            <ul className="flex flex-wrap justify-center gap-3">
              {c.areas.list.map((city) => (
                <li
                  key={city}
                  className="px-4 py-2 rounded-full font-sans text-sm border"
                  style={{ borderColor: NAVY, color: NAVY, background: "white" }}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Press */}
        <section id="press" className="py-20 sm:py-28" style={{ background: "white" }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: GOLD }}>{c.press.kicker}</p>
            <h2 className="font-display text-3xl sm:text-5xl mb-6">{c.press.title}</h2>
            <p className="font-sans text-lg mb-10 opacity-90">{c.press.body}</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {c.press.media.map((m) => (
                <span key={m} className="font-display text-xl sm:text-2xl italic" style={{ color: NAVY }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: GOLD }}>{c.reviews.kicker}</p>
              <h2 className="font-display text-3xl sm:text-5xl">{c.reviews.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {c.reviews.items.map((r, i) => (
                <figure key={i} className="p-8 rounded-lg" style={{ background: "white", borderTop: `3px solid ${GOLD}` }}>
                  <blockquote className="font-display text-lg italic leading-relaxed mb-4">
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="font-sans text-sm opacity-70">— {r.author}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-20 sm:py-28 text-center" style={{ background: NAVY, color: "white" }}>
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-display text-3xl sm:text-5xl mb-8">{c.cta.title}</h2>
            <a
              href="mailto:contact@qualiconcept.fr"
              className="inline-block px-10 py-4 rounded-full font-medium tracking-wide transition-transform hover:-translate-y-0.5"
              style={{ background: GOLD, color: NAVY }}
            >
              {c.cta.button}
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12" style={{ background: "#011d28", color: "white" }}>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-display text-lg mb-3">QUALIRENOVATION by QUALICONCEPT</div>
              <p className="opacity-80">6 rue d'Armaillé<br />75017 Paris, France</p>
              <p className="opacity-80 mt-2">{c.footer.siret} : 85286728200034</p>
            </div>
            <div>
              <div className="font-medium mb-3" style={{ color: GOLD }}>Navigation</div>
              <ul className="space-y-2 opacity-80">
                <li><a href="#about">{c.nav.about}</a></li>
                <li><a href="#services">{c.nav.services}</a></li>
                <li><a href="#press">{c.nav.press}</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4">
              <Switcher />
              <p className="opacity-60 text-xs">
                © {new Date().getFullYear()} QUALIRENOVATION — {c.footer.rights}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Bilingue;