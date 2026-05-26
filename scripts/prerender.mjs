// Post-build static prerender.
// Reads dist/index.html and creates dist/<route>/index.html for each priority
// route with custom <title>, <meta name="description">, Open Graph tags and a
// rich textual content block injected into #root. React replaces that block on
// hydration; crawlers and AI bots without JS see the static HTML.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const DIST = resolve("dist");
const SITE = "https://www.qualirenovation.fr";

if (!existsSync(resolve(DIST, "index.html"))) {
  console.warn("[prerender] dist/index.html not found, skipping.");
  process.exit(0);
}

const baseHtml = readFileSync(resolve(DIST, "index.html"), "utf8");

const LEGAL_FOOTER = `QUALIRENOVATION by QUALICONCEPT — 6 rue d'Armaillé, 75017 Paris — Gérant : Rubens Mimouni — Maître d'œuvre : Carina Nahmani — SIRET : 85286728200034`;

/** @typedef {{path:string,title:string,description:string,ogTitle?:string,ogDescription?:string,body:string,jsonLd?:object,priority?:string}} Route */

/** @type {Route[]} */
const routes = [
  {
    path: "/renovation-complete",
    title: "Rénovation complète d'appartement à Paris | QUALIRENOVATION",
    description:
      "Rénovation complète d'appartement à Paris et Île-de-France. Maîtrise d'œuvre terrain par Carina Nahmani depuis 2009. Devis gratuit.",
    ogTitle: "Rénovation complète d'appartement à Paris",
    ogDescription:
      "Rénovation complète clé en main à Paris et Île-de-France — maîtrise d'œuvre par Carina Nahmani depuis 2009.",
    body: `
      <h1>Rénovation complète d'appartement à Paris</h1>
      <p>QUALIRENOVATION by QUALICONCEPT prend en charge la rénovation complète de votre appartement à Paris, de la conception 2D/3D jusqu'à la livraison clé en main. Carina Nahmani, maître d'œuvre terrain depuis 2009, coordonne tous les corps de métier : électricité, plomberie, parquet, peinture, menuiseries sur mesure, isolation. Gérant : Rubens Mimouni. Zone : Paris intra-muros et Île-de-France.</p>
      <h2>Notre périmètre</h2>
      <ul>
        <li>Conception 2D / 3D et plans techniques</li>
        <li>Coordination de tous les corps d'état</li>
        <li>Suivi de chantier terrain par maître d'œuvre dédié</li>
        <li>Livraison clé en main, PV de réception, garanties</li>
      </ul>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Rénovation complète d'appartement",
      provider: {
        "@type": "LocalBusiness",
        name: "QUALIRENOVATION by QUALICONCEPT",
      },
      areaServed: "Paris, Île-de-France",
      description:
        "Rénovation complète d'appartement clé en main à Paris, maîtrise d'œuvre incluse.",
    },
  },
  {
    path: "/renover-salle-de-bain",
    title: "Rénovation salle de bain Paris | QUALIRENOVATION",
    description:
      "Rénovation de salle de bain haut de gamme à Paris. Conception, coordination artisans, suivi chantier. Devis gratuit.",
    ogTitle: "Rénovation salle de bain Paris",
    ogDescription:
      "Rénovation de salle de bain haut de gamme à Paris. Conception, coordination artisans, suivi chantier.",
    body: `
      <h1>Rénovation de salle de bain à Paris</h1>
      <p>QUALIRENOVATION by QUALICONCEPT réalise la rénovation complète de votre salle de bain à Paris. Carrelage, plomberie, électricité, meubles sur mesure : tout est coordonné par Carina Nahmani, maître d'œuvre depuis 2009. Résultat haut de gamme, livraison clé en main.</p>
      <p>Site spécialisé : <a href="https://renovermasalledebain.com">renovermasalledebain.com</a>.</p>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Rénovation salle de bain Paris",
      provider: {
        "@type": "LocalBusiness",
        name: "QUALIRENOVATION by QUALICONCEPT",
      },
      areaServed: "Paris, Île-de-France",
    },
  },
  {
    path: "/nos-realisations",
    title: "Nos réalisations — Rénovation appartements Paris | QUALIRENOVATION",
    description:
      "Découvrez +200 projets de rénovation d'appartements réalisés à Paris et Île-de-France par QUALIRENOVATION. Photos avant/après.",
    ogTitle: "Nos réalisations — Rénovation appartements Paris",
    ogDescription:
      "+200 projets de rénovation d'appartements à Paris et Île-de-France. Photos avant/après.",
    body: `
      <h1>Nos réalisations à Paris et Île-de-France</h1>
      <p>Depuis 2003, QUALIRENOVATION by QUALICONCEPT a réalisé plus de 200 chantiers de rénovation d'appartements à Paris et en Île-de-France. Chaque projet est suivi par Carina Nahmani, maître d'œuvre terrain, de la conception jusqu'à la livraison.</p>
      <h2>Exemples de projets</h2>
      <ul>
        <li>Rénovation complète d'appartement haussmannien — Paris 17e</li>
        <li>Salle de bain haut de gamme — Neuilly-sur-Seine</li>
        <li>Cuisine sur mesure ouverte — Paris 8e</li>
      </ul>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Rénovation complète d'appartement haussmannien — Paris 17e" },
        { "@type": "ListItem", position: 2, name: "Salle de bain haut de gamme — Neuilly-sur-Seine" },
        { "@type": "ListItem", position: 3, name: "Cuisine sur mesure ouverte — Paris 8e" },
      ],
    },
  },
  {
    path: "/on-parle-de-nous",
    title: "Presse — QUALIRENOVATION dans les médias | 90+ parutions",
    description:
      "QUALIRENOVATION by QUALICONCEPT cité dans Elle Déco, Madame Figaro, Maisons & Travaux, Huffington Post, Castorama 18h39. 90+ parutions depuis 2016.",
    ogTitle: "QUALIRENOVATION dans la presse",
    ogDescription:
      "90+ parutions presse : Elle Déco, Madame Figaro, Maisons & Travaux, Huffington Post, 18h39 by Castorama.",
    body: `
      <h1>QUALIRENOVATION dans la presse</h1>
      <p>Depuis 2016, QUALIRENOVATION by QUALICONCEPT a été citée dans plus de 90 articles de presse spécialisée et grand public : Elle Déco, Madame Figaro, Maisons &amp; Travaux, Huffington Post, 18h39 by Castorama. Best of Houzz 2023.</p>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      mentions: {
        "@type": "Organization",
        name: "QUALIRENOVATION by QUALICONCEPT",
      },
    },
  },
  {
    path: "/guide-travaux",
    title: "Guide travaux rénovation appartement Paris | QUALIRENOVATION",
    description:
      "Tout savoir sur la rénovation d'appartement à Paris : budget, délais, artisans, maîtrise d'œuvre. Guide complet par QUALIRENOVATION.",
    ogTitle: "Guide complet rénovation d'appartement à Paris",
    ogDescription:
      "Budget, délais, artisans, maîtrise d'œuvre : guide complet de la rénovation d'appartement à Paris.",
    body: `
      <h1>Guide complet rénovation d'appartement à Paris</h1>
      <p>Ce guide a été rédigé par Carina Nahmani, maître d'œuvre chez QUALIRENOVATION by QUALICONCEPT, forte de 20 ans d'expérience dans la rénovation d'appartements à Paris depuis 2003.</p>
      <h2>Étapes clés d'une rénovation complète</h2>
      <ol>
        <li>Visite technique et relevé de cotes</li>
        <li>Conception 2D / 3D et choix des matériaux</li>
        <li>Devis détaillé et planning prévisionnel</li>
        <li>Démolition et préparation des supports</li>
        <li>Plomberie, électricité, isolation</li>
        <li>Carrelage, parquet, peinture, menuiserie</li>
        <li>Réception de chantier et livraison clé en main</li>
      </ol>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Rénover un appartement à Paris",
      step: [
        { "@type": "HowToStep", position: 1, name: "Visite technique et relevé de cotes" },
        { "@type": "HowToStep", position: 2, name: "Conception 2D/3D et choix des matériaux" },
        { "@type": "HowToStep", position: 3, name: "Devis détaillé et planning prévisionnel" },
        { "@type": "HowToStep", position: 4, name: "Démolition et préparation des supports" },
        { "@type": "HowToStep", position: 5, name: "Plomberie, électricité, isolation" },
        { "@type": "HowToStep", position: 6, name: "Carrelage, parquet, peinture, menuiserie" },
        { "@type": "HowToStep", position: 7, name: "Réception de chantier et livraison clé en main" },
      ],
    },
  },
  {
    path: "/faq",
    title: "FAQ Rénovation appartement Paris | QUALIRENOVATION",
    description:
      "Questions fréquentes sur la rénovation d'appartement à Paris : budget, délais, maîtrise d'œuvre, devis. Réponses par QUALIRENOVATION.",
    ogTitle: "FAQ Rénovation appartement Paris",
    ogDescription:
      "Budget, délais, maîtrise d'œuvre, devis : réponses aux questions fréquentes sur la rénovation d'appartement à Paris.",
    body: `
      <h1>Questions fréquentes</h1>
      <h2>Qu'est-ce que la maîtrise d'œuvre ?</h2>
      <p>La maîtrise d'œuvre consiste à coordonner tous les artisans de votre chantier. Chez QUALIRENOVATION, c'est Carina Nahmani qui assure ce rôle depuis 2009.</p>
      <h2>Quelle est la zone d'intervention de QUALIRENOVATION ?</h2>
      <p>Paris intra-muros et Île-de-France : Neuilly, Boulogne, Levallois, Issy, Clichy, Courbevoie, Créteil, Ivry, Saint-Cloud.</p>
      <h2>Depuis quand QUALIRENOVATION existe-t-elle ?</h2>
      <p>Premier chantier en 2003, maîtrise d'œuvre terrain depuis 2009, société créée en 2016 par Rubens Mimouni.</p>
      <h2>Quel est le budget moyen d'une rénovation complète à Paris ?</h2>
      <p>Entre 800 € et 1800 €/m² selon le niveau de prestation et les matériaux choisis.</p>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Qu'est-ce que la maîtrise d'œuvre ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La maîtrise d'œuvre consiste à coordonner tous les artisans de votre chantier. Chez QUALIRENOVATION, c'est Carina Nahmani qui assure ce rôle depuis 2009.",
          },
        },
        {
          "@type": "Question",
          name: "Quelle est la zone d'intervention de QUALIRENOVATION ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Paris intra-muros et Île-de-France : Neuilly, Boulogne, Levallois, Issy, Clichy, Courbevoie, Créteil, Ivry, Saint-Cloud.",
          },
        },
        {
          "@type": "Question",
          name: "Depuis quand QUALIRENOVATION existe-t-elle ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Premier chantier en 2003, maîtrise d'œuvre terrain depuis 2009, société créée en 2016 par Rubens Mimouni.",
          },
        },
        {
          "@type": "Question",
          name: "Quel est le budget moyen d'une rénovation complète à Paris ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Entre 800 € et 1800 €/m² selon le niveau de prestation et les matériaux choisis.",
          },
        },
      ],
    },
  },
];

/**
 * Inject per-route head tags into the base document and replace the empty
 * <div id="root"></div> with a static content block.
 */
function buildPage(route) {
  const canonical = `${SITE}${route.path}`;
  const ogTitle = route.ogTitle ?? route.title;
  const ogDescription = route.ogDescription ?? route.description;

  let html = baseHtml;

  // Replace title.
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);

  // Replace meta description.
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
  );

  // Replace og:title / og:description / og:url if present.
  html = replaceOrInsertOg(html, "og:title", ogTitle);
  html = replaceOrInsertOg(html, "og:description", ogDescription);
  html = replaceOrInsertOg(html, "og:url", canonical);

  // Insert canonical link (replace if already present).
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(
      /<link\s+rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    );
  } else {
    html = html.replace(
      /<\/head>/i,
      `  <link rel="canonical" href="${escapeAttr(canonical)}" />\n  </head>`,
    );
  }

  // Inject per-route JSON-LD into <head>.
  if (route.jsonLd) {
    const jsonLdTag = `<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>`;
    html = html.replace(/<\/head>/i, `  ${jsonLdTag}\n  </head>`);
  }

  // Inject static content into #root for crawlers. React replaces it on mount.
  const srOnly = `<div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${route.body.trim()}<p>${LEGAL_FOOTER}</p></div>`;
  const staticBlock = `<div id="root"><div data-prerender="${route.path}" style="max-width:760px;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,-apple-system,sans-serif;color:#114a67;line-height:1.6">${route.body.trim()}<footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;font-size:0.85rem;color:#475569">${LEGAL_FOOTER}</footer></div>${srOnly}</div>`;
  html = html.replace(/<div\s+id="root"\s*>\s*<\/div>/i, staticBlock);

  return html;
}

function replaceOrInsertOg(html, property, content) {
  const re = new RegExp(`<meta\\s+property="${property}"[^>]*>`, "i");
  const tag = `<meta property="${property}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n  </head>`);
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

for (const route of routes) {
  const outDir = resolve(DIST, route.path.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });
  const outFile = resolve(outDir, "index.html");
  writeFileSync(outFile, buildPage(route));
  console.log(`[prerender] wrote ${outFile}`);
}

console.log(`[prerender] ${routes.length} routes pre-rendered.`);