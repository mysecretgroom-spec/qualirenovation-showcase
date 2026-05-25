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

/** @typedef {{path:string,title:string,description:string,ogTitle?:string,ogDescription?:string,body:string,priority?:string}} Route */

/** @type {Route[]} */
const routes = [
  {
    path: "/renovation-complete",
    title: "Rénovation complète d'appartement à Paris | QUALIRENOVATION",
    description:
      "Configurez votre projet de rénovation complète d'appartement à Paris. Simulateur en ligne, devis détaillé, suivi par un maître d'œuvre depuis 2003.",
    ogTitle: "Rénovation complète d'appartement à Paris",
    ogDescription:
      "Simulateur de rénovation, devis détaillé et maîtrise d'œuvre à Paris depuis 2003 — QUALIRENOVATION by QUALICONCEPT.",
    body: `
      <h1>Rénovation complète d'appartement à Paris</h1>
      <p>QUALIRENOVATION by QUALICONCEPT accompagne les particuliers dans la rénovation complète d'appartements haut de gamme à Paris et en Île-de-France depuis 2003. Notre simulateur en ligne vous permet de configurer pièce par pièce votre projet — cuisine, salle de bain, WC, séjour, chambres, parquet, peinture, électricité, plomberie, menuiseries.</p>
      <h2>Un projet de rénovation sur-mesure</h2>
      <p>Maître d'œuvre depuis 2003, Carina Nahmani pilote l'ensemble des corps d'état : démolition, maçonnerie, plomberie, électricité, plâtrerie, carrelage, parquet, menuiserie, cuisine équipée, peinture et finitions. Rubens Mimouni assure la gestion de l'entreprise et la relation client.</p>
      <h2>Comment configurer votre projet</h2>
      <ul>
        <li>Sélectionnez les pièces à rénover</li>
        <li>Décrivez les travaux souhaités pour chaque pièce</li>
        <li>Choisissez vos finitions parmi nos catalogues (EGGER, Planizia, Farrow &amp; Ball)</li>
        <li>Téléchargez vos plans et photos d'inspiration</li>
        <li>Recevez un récapitulatif PDF et un devis détaillé sous 48 h</li>
      </ul>
    `,
  },
  {
    path: "/renover-salle-de-bain",
    title: "Rénovation de salle de bain à Paris | QUALIRENOVATION",
    description:
      "Spécialiste de la rénovation de salle de bain à Paris : douche italienne, baignoire, meubles vasques, robinetterie Châtelet. Devis gratuit sous 48 h.",
    ogTitle: "Rénovation de salle de bain à Paris",
    ogDescription:
      "Douches à l'italienne, baignoires, meubles vasques sur-mesure, faïence et robinetterie haut de gamme. Maîtrise d'œuvre dédiée.",
    body: `
      <h1>Rénovation de salle de bain à Paris</h1>
      <p>QUALIRENOVATION conçoit et réalise des salles de bain haut de gamme à Paris et en Île-de-France. Douche à l'italienne, baignoire îlot, meuble vasque sur-mesure, robinetterie Châtelet (chrome, noir mat, laiton brossé), faïence grand format, receveurs extra-plats : nous orchestrons l'ensemble des corps d'état.</p>
      <h2>Notre méthode</h2>
      <ul>
        <li>Visite technique sur place et relevé de cotes</li>
        <li>Conception 2D / 3D de votre future salle de bain</li>
        <li>Sourcing des matériaux : carrelage, sanitaires, robinetterie, meubles</li>
        <li>Coordination plomberie, électricité, carrelage, peinture, menuiserie</li>
        <li>Réception de chantier et garantie décennale</li>
      </ul>
      <p>Découvrez aussi notre site spécialisé : <a href="https://renovermasalledebain.com">renovermasalledebain.com</a>.</p>
    `,
  },
  {
    path: "/nos-realisations",
    title: "Nos réalisations de rénovation à Paris | QUALIRENOVATION",
    description:
      "Découvrez plus de 115 réalisations de rénovation d'appartements à Paris et en Île-de-France : salles de bain, cuisines, rénovations complètes. Lauréat Best of Houzz.",
    ogTitle: "Nos réalisations de rénovation à Paris",
    ogDescription:
      "Plus de 115 projets de rénovation d'appartements à Paris. Salles de bain, cuisines, rénovations complètes. Best of Houzz 2023.",
    body: `
      <h1>Nos réalisations de rénovation à Paris</h1>
      <p>Plus de 115 projets de rénovation d'appartements à Paris et en Île-de-France livrés depuis 2003 par QUALIRENOVATION by QUALICONCEPT. Notre portfolio rassemble des rénovations complètes, des salles de bain haut de gamme, des cuisines sur-mesure, des ouvertures de murs porteurs et des restaurations d'appartements haussmanniens.</p>
      <h2>Types de projets</h2>
      <ul>
        <li>Rénovations complètes d'appartements haussmanniens</li>
        <li>Salles de bain et suites parentales</li>
        <li>Cuisines équipées sur-mesure</li>
        <li>Ouvertures de murs porteurs et démolitions</li>
        <li>Pose et restauration de parquets anciens</li>
      </ul>
      <p>Lauréat Best of Houzz et référencé parmi les meilleurs artisans rénovateurs de Paris.</p>
    `,
  },
  {
    path: "/on-parle-de-nous",
    title: "On parle de nous : presse et médias | QUALIRENOVATION",
    description:
      "Retrouvez les articles de presse mentionnant QUALIRENOVATION : Houzz, Elle Déco, Marie Claire Maison, Huffington Post. Plus de 90 parutions depuis 2009.",
    ogTitle: "QUALIRENOVATION dans la presse",
    ogDescription:
      "Nos rénovations dans Houzz, Elle Déco, Marie Claire Maison, Huffington Post. Plus de 90 parutions presse depuis 2009.",
    body: `
      <h1>QUALIRENOVATION dans la presse</h1>
      <p>Depuis plus de 20 ans, nos réalisations de rénovation d'appartements à Paris sont mises en avant par les plus grands médias déco francophones et internationaux. Plus de 90 parutions presse référencent notre travail de maîtrise d'œuvre.</p>
      <h2>Quelques médias qui nous ont cités</h2>
      <ul>
        <li>Houzz France — Best of Houzz Design &amp; Service</li>
        <li>Elle Décoration</li>
        <li>Marie Claire Maison</li>
        <li>Huffington Post</li>
        <li>Côté Maison</li>
      </ul>
    `,
  },
  {
    path: "/guide-travaux",
    title: "Guide travaux rénovation Paris : conseils et prix | QUALIRENOVATION",
    description:
      "Tout savoir sur la rénovation à Paris : salle de bain, cuisine, parquet, peinture, mur porteur, copropriété. Conseils d'experts et fourchettes de prix 2026.",
    ogTitle: "Guide travaux rénovation à Paris",
    ogDescription:
      "Conseils d'experts et prix indicatifs pour vos travaux de rénovation à Paris : salle de bain, cuisine, parquet, peinture, mur porteur, syndic.",
    body: `
      <h1>Guide travaux rénovation à Paris</h1>
      <p>QUALIRENOVATION partage son expertise de plus de 20 ans pour vous aider à comprendre les étapes, les contraintes et le budget d'un projet de rénovation à Paris. Sept guides thématiques rédigés par notre maître d'œuvre Carina Nahmani.</p>
      <h2>Thèmes couverts</h2>
      <ul>
        <li>Rénovation de salle de bain : de la conception à la livraison</li>
        <li>Rénovation de cuisine : aménagement et installation sur-mesure</li>
        <li>Menuiserie intérieure : portes, placards, dressings</li>
        <li>Parquet et revêtements de sol : pose, restauration, choix des essences</li>
        <li>Peinture et finitions : préparation des supports, choix des teintes</li>
        <li>Ouverture de mur porteur : études béton, IPN, démarches en copropriété</li>
        <li>Travaux en copropriété : autorisations syndic, règlement et voisinage</li>
      </ul>
    `,
  },
  {
    path: "/faq",
    title: "FAQ rénovation à Paris : devis, maître d'œuvre, suivi | QUALIRENOVATION",
    description:
      "Questions fréquentes sur la rénovation à Paris : phase devis, rôle du maître d'œuvre, garanties, suivi de chantier, budget, réception, après-travaux.",
    ogTitle: "FAQ rénovation à Paris",
    ogDescription:
      "Les réponses aux questions les plus posées sur la rénovation à Paris : devis, maître d'œuvre, garanties, suivi de chantier, budget.",
    body: `
      <h1>FAQ rénovation à Paris</h1>
      <p>Vous préparez un projet de rénovation à Paris ? QUALIRENOVATION répond aux questions les plus posées par ses clients depuis plus de 20 ans : phase devis, rôle du maître d'œuvre, garanties (décennale, biennale, parfait achèvement), suivi de chantier, modalités de paiement, démarches en copropriété, réception de chantier et après-travaux.</p>
      <h2>Catégories abordées</h2>
      <ul>
        <li>Pourquoi choisir QualiRénovation</li>
        <li>Déroulement de la phase devis</li>
        <li>Nos prestations et corps d'état couverts</li>
        <li>Rôle du maître d'œuvre</li>
        <li>Suivi de chantier et reporting</li>
        <li>Budget, paiements et commandes</li>
        <li>Syndic et voisinage</li>
        <li>Réception de chantier</li>
        <li>Après travaux et litiges</li>
      </ul>
    `,
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

  // Inject static content into #root for crawlers. React replaces it on mount.
  const staticBlock = `<div id="root"><div data-prerender="${route.path}" style="max-width:760px;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,-apple-system,sans-serif;color:#114a67;line-height:1.6">${route.body.trim()}</div></div>`;
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