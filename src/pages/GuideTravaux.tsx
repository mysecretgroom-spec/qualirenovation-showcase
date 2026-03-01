import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";
import { 
  Bath, ChefHat, Hammer, Paintbrush, Layers, DoorOpen, Building2, 
  ArrowRight, CheckCircle, AlertTriangle, Clock, FileText, ChevronDown
} from "lucide-react";

interface GuideSection {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  intro: string;
  content: { heading: string; text: string }[];
  tips: string[];
  faq: { q: string; a: string }[];
}

const guides: GuideSection[] = [
  {
    id: "salle-de-bain",
    icon: Bath,
    title: "Rénovation Salle de Bain",
    subtitle: "De la conception à la livraison",
    intro: "La salle de bain est l'une des pièces les plus techniques à rénover. Entre plomberie, étanchéité, carrelage et électricité, chaque détail compte pour un résultat durable et esthétique.",
    content: [
      {
        heading: "Les étapes clés",
        text: "Une rénovation de salle de bain réussie passe par plusieurs phases : la dépose de l'existant, la reprise de la plomberie et de l'électricité, l'étanchéité (SPEC), la pose du carrelage mural et au sol, l'installation des équipements sanitaires et enfin les finitions. Comptez en moyenne 3 à 5 semaines de travaux pour une salle de bain complète."
      },
      {
        heading: "Douche à l'italienne ou baignoire ?",
        text: "La douche à l'italienne séduit par son esthétique épurée et son accessibilité. Elle nécessite un receveur extra-plat ou un système d'étanchéité SPEC avec pente intégrée. La baignoire, quant à elle, reste prisée pour le confort et la détente. Les baignoires îlot apportent une touche haut de gamme. Le choix dépend de votre espace, de vos habitudes et de la configuration technique."
      },
      {
        heading: "Matériaux et tendances",
        text: "Les carreaux grand format, le zellige, le béton ciré et le terrazzo dominent les tendances actuelles. Pour la robinetterie, les finitions laiton brossé, noir mat et or brossé apportent du caractère. Les meubles suspendus facilitent l'entretien et donnent une impression d'espace. Pensez aussi à l'éclairage LED intégré aux miroirs pour une ambiance soignée."
      }
    ],
    tips: [
      "Prévoyez un budget de 800 à 1 500 €/m² selon le niveau de finition",
      "L'étanchéité SPEC est obligatoire sous douche – exigez un PV de réception",
      "Vérifiez que l'évacuation existante permet une douche à l'italienne",
      "Un VMC performant est indispensable pour éviter l'humidité"
    ],
    faq: [
      { q: "Combien coûte une rénovation de salle de bain à Paris ?", a: "Le budget moyen se situe entre 8 000 € et 25 000 € selon la surface (4 à 10 m²), le niveau de gamme des matériaux et la complexité des travaux de plomberie." },
      { q: "Faut-il un permis pour rénover sa salle de bain ?", a: "Non, une rénovation intérieure de salle de bain ne nécessite pas de permis de construire. En revanche, en copropriété, une déclaration préalable auprès du syndic est généralement requise." },
      { q: "Quelle durée pour rénover une salle de bain ?", a: "Comptez 3 à 5 semaines en moyenne pour une rénovation complète, incluant dépose, plomberie, étanchéité, carrelage et pose des équipements." }
    ]
  },
  {
    id: "cuisine",
    icon: ChefHat,
    title: "Rénovation Cuisine",
    subtitle: "Aménagement et installation sur mesure",
    intro: "La cuisine est le cœur de la maison. Sa rénovation demande une réflexion approfondie sur l'ergonomie, les matériaux et l'implantation pour allier fonctionnalité et esthétique au quotidien.",
    content: [
      {
        heading: "Choisir son implantation",
        text: "L'implantation dépend de la surface et de la forme de votre cuisine. La cuisine en L optimise l'espace dans les pièces ouvertes. La cuisine en U offre un maximum de rangement. L'îlot central crée une zone conviviale pour cuisiner et recevoir. La cuisine linéaire convient aux espaces étroits comme les studios parisiens. Le triangle d'activité (cuisson, lavage, stockage) doit être respecté pour une ergonomie optimale."
      },
      {
        heading: "Plans de travail et façades",
        text: "Le quartz reste la référence pour sa résistance et son entretien facile. La céramique grand format offre un rendu moderne et une dureté exceptionnelle. Le bois massif apporte chaleur et authenticité mais demande un entretien régulier. Pour les façades, les finitions mates dominent les tendances, suivies du laqué pour un rendu plus contemporain. Les façades bois ou effet matière créent des ambiances nature ou industrielles."
      },
      {
        heading: "Crédence et électroménager",
        text: "La crédence protège les murs et participe au design. Les carreaux de métro, le verre laqué et la crédence pleine hauteur sont les options les plus populaires. Côté électroménager, les appareils encastrés offrent une intégration parfaite. Prévoyez les branchements électriques et les arrivées d'eau dès la phase de conception."
      }
    ],
    tips: [
      "Prévoyez 1 000 à 2 000 €/m² pose comprise selon le niveau de gamme",
      "Anticipez les raccordements électriques (hotte, four, lave-vaisselle)",
      "Vérifiez la portance du sol si vous optez pour un îlot en pierre",
      "Un éclairage plan de travail est indispensable pour le confort"
    ],
    faq: [
      { q: "Combien coûte une rénovation de cuisine complète ?", a: "Pour une cuisine équipée de 8 à 15 m², comptez entre 10 000 € et 35 000 € tout compris (meubles, électroménager, plomberie, électricité, revêtements)." },
      { q: "Peut-on ouvrir la cuisine sur le salon ?", a: "Oui, c'est très courant à Paris. Si le mur est porteur, il faut une étude structure par un BET et la pose d'une poutre IPN. Comptez 3 000 à 8 000 € pour cette opération." },
      { q: "Quelle durée pour rénover une cuisine ?", a: "Comptez 4 à 6 semaines en moyenne, entre la dépose, les travaux de plomberie/électricité, la pose des meubles et les finitions." }
    ]
  },
  {
    id: "menuiserie",
    icon: DoorOpen,
    title: "Menuiserie Intérieure",
    subtitle: "Portes, placards et aménagements sur mesure",
    intro: "La menuiserie intérieure structure vos espaces et apporte du caractère à votre intérieur. Des portes aux dressings, en passant par les bibliothèques et les verrières, chaque élément contribue à l'harmonie de votre habitat.",
    content: [
      {
        heading: "Portes intérieures",
        text: "Le choix des portes impacte considérablement le style de votre intérieur. Les portes affleurantes (filomuro) offrent un rendu contemporain en s'intégrant parfaitement au mur. Les portes à galandage coulissent dans la cloison et libèrent de l'espace. Les portes à âme pleine offrent une meilleure isolation phonique, essentielle dans les chambres. Les finitions laquées, en chêne naturel ou peintes s'adaptent à tous les styles."
      },
      {
        heading: "Dressings et rangements",
        text: "Le dressing sur mesure optimise chaque centimètre. Les systèmes de rangement modulaires permettent d'adapter l'agencement à vos besoins : penderies, tiroirs, étagères, casiers à chaussures. En sous-pente, les placards sur mesure exploitent les volumes perdus. Les façades coulissantes avec miroir intégré agrandissent visuellement l'espace."
      },
      {
        heading: "Verrières et claustra",
        text: "La verrière d'atelier reste un incontournable de la rénovation parisienne. Elle laisse passer la lumière tout en séparant les espaces. Les versions acier offrent des profils fins et élégants. Les claustras bois-métal créent une séparation plus légère et modulable. Ces éléments sont parfaits entre cuisine et salon, ou pour délimiter une entrée."
      }
    ],
    tips: [
      "Optez pour des portes à âme pleine (40 mm min.) pour l'isolation phonique",
      "Prévoyez 15 cm minimum de profondeur pour un placard fonctionnel",
      "Une verrière en acier nécessite un support maçonné solide",
      "Les boiseries moulurées rehaussent les intérieurs haussmanniens"
    ],
    faq: [
      { q: "Combien coûte une verrière d'atelier ?", a: "Comptez entre 1 500 € et 4 000 € pour une verrière standard (3 à 5 panneaux) pose comprise, selon le matériau (acier, aluminium) et les dimensions." },
      { q: "Quel budget pour un dressing sur mesure ?", a: "Un dressing sur mesure coûte entre 2 000 € et 8 000 € selon la taille, les matériaux et le niveau de finition (tiroirs, éclairage LED, accessoires)." },
      { q: "Peut-on poser des portes sans changer les huisseries ?", a: "Oui, si les huisseries (bâtis) sont en bon état et aux bonnes dimensions. Un ajustement est souvent nécessaire dans les immeubles anciens où les murs ne sont pas d'aplomb." }
    ]
  },
  {
    id: "parquet",
    icon: Layers,
    title: "Parquet & Revêtements de Sol",
    subtitle: "Pose, restauration et choix des matériaux",
    intro: "Le revêtement de sol définit l'atmosphère de chaque pièce. Parquet massif, contrecollé, carrelage ou sol souple : chaque option a ses avantages en fonction de l'usage, du budget et du style recherché.",
    content: [
      {
        heading: "Types de parquet",
        text: "Le parquet massif (16 à 23 mm) est le plus noble : il peut être poncé et rénové plusieurs fois. Le parquet contrecollé (couche d'usure de 2,5 à 6 mm) offre un excellent rapport qualité/prix et une pose plus rapide. Le stratifié imite le bois à moindre coût mais ne peut être rénové. À Paris, le chêne domine le marché avec ses déclinaisons : clair, moyen, foncé, blanchi ou fumé."
      },
      {
        heading: "Motifs de pose",
        text: "La pose à l'anglaise (lames droites) est la plus courante et la plus économique. Le point de Hongrie (chevrons à 45° ou 60°) apporte un cachet classique très prisé dans les appartements haussmanniens. La pose en bâton rompu crée un motif géométrique élégant. Les lames larges (180 mm+) agrandissent visuellement l'espace, tandis que les lames étroites conviennent aux petites pièces."
      },
      {
        heading: "Carrelage et alternatives",
        text: "Le grès cérame imitation bois offre la résistance du carrelage avec l'esthétique du parquet, idéal pour les pièces humides. Le carrelage grand format (60×120 cm, 80×80 cm) donne une impression de grandeur. Le terrazzo, le zellige et les carreaux de ciment apportent du caractère. Pour les sols souples, le vinyle LVT offre confort acoustique et facilité d'entretien."
      }
    ],
    tips: [
      "En rénovation, vérifiez l'état du support (ragréage souvent nécessaire)",
      "Prévoyez 5 à 10 % de chutes en plus selon le motif de pose",
      "Un parquet contrecollé peut se poser sur plancher chauffant",
      "Le carrelage grand format nécessite un sol parfaitement plan (tolérance 3 mm sous la règle de 2 m)"
    ],
    faq: [
      { q: "Parquet massif ou contrecollé ?", a: "Le massif est plus durable (poncé 5 à 7 fois) mais plus cher et contraignant à poser. Le contrecollé offre un excellent compromis avec une couche d'usure en bois noble, une pose plus rapide et une compatibilité avec le chauffage au sol." },
      { q: "Combien coûte la pose de parquet à Paris ?", a: "Comptez 40 à 70 €/m² pour un contrecollé pose comprise, 80 à 150 €/m² pour un massif. La pose en point de Hongrie ajoute 20 à 30 % au budget." },
      { q: "Peut-on mettre du parquet dans une salle de bain ?", a: "Le teck ou l'ipé résistent bien à l'humidité. Le parquet contrecollé avec finition huilée et joints pontés est aussi envisageable. Sinon, optez pour un carrelage imitation bois." }
    ]
  },
  {
    id: "peinture",
    icon: Paintbrush,
    title: "Peinture & Finitions",
    subtitle: "Couleurs, finitions et préparation des supports",
    intro: "La peinture est le moyen le plus rapide et le plus efficace de transformer un intérieur. Une préparation soignée des supports et un choix de finition adapté garantissent un résultat professionnel et durable.",
    content: [
      {
        heading: "Préparation des supports",
        text: "80 % de la réussite d'une peinture se joue dans la préparation. En rénovation à Paris, les murs anciens nécessitent souvent un décapage, un rebouchage des fissures, un enduit de lissage et une sous-couche adaptée. Les plafonds avec moulures demandent un travail minutieux de ponçage et de garnissage. Un lessivage complet des surfaces est indispensable avant toute application."
      },
      {
        heading: "Types de finition",
        text: "Le mat offre un rendu élégant et masque les imperfections mais est sensible aux traces. Le velours (satin mat) combine esthétique et résistance, idéal pour les pièces de vie. Le satiné résiste bien aux lavages et convient aux pièces humides et aux boiseries. Le brillant, plus rare en décoration intérieure, est réservé aux boiseries et moulures pour un effet laqué."
      },
      {
        heading: "Tendances et couleurs",
        text: "Les teintes sourdes et naturelles dominent : vert sauge, terracotta, bleu nuit, gris chaud. Les peintures écoresponsables (faibles COV, biosourcées) gagnent du terrain. Les effets matière (béton ciré, chaux, badigeon) apportent de la profondeur aux murs. Les marques haut de gamme comme Farrow & Ball ou Ressource offrent des teintes d'une profondeur inégalée."
      }
    ],
    tips: [
      "Comptez 2 couches minimum + 1 sous-couche pour un résultat optimal",
      "La peinture velours est le meilleur compromis esthétique/entretien",
      "Protégez soigneusement sols et menuiseries avant de peindre",
      "Laissez sécher 24h entre chaque couche pour un rendu parfait"
    ],
    faq: [
      { q: "Combien coûte la peinture d'un appartement ?", a: "Comptez 25 à 45 €/m² de surface au sol pour un appartement complet (murs + plafonds), soit 2 500 à 6 000 € pour un 80 m². Les peintures haut de gamme et les effets décoratifs augmentent le budget." },
      { q: "Quelle peinture pour les pièces humides ?", a: "Utilisez une peinture satinée spéciale pièces humides avec traitement anti-moisissures. Les marques professionnelles proposent des formulations spécifiques pour salles de bain et cuisines." },
      { q: "Faut-il peindre ou tapisser ?", a: "La peinture offre plus de flexibilité et est plus facile à retoucher. Le papier peint apporte de la texture et du motif mais demande un support parfait. Les deux peuvent se combiner : un mur d'accent en papier peint et le reste en peinture." }
    ]
  },
  {
    id: "mur-porteur",
    icon: Hammer,
    title: "Ouverture Mur Porteur & Démolition",
    subtitle: "Études structure, IPN et démarches",
    intro: "L'ouverture d'un mur porteur est l'un des travaux les plus impactants pour transformer un appartement. C'est aussi l'un des plus encadrés : une étude structure par un bureau d'études (BET) est obligatoire, et l'accord du syndic est nécessaire en copropriété.",
    content: [
      {
        heading: "Étude structure et faisabilité",
        text: "Avant toute ouverture, un bureau d'études techniques (BET) réalise un diagnostic de la structure existante. Il détermine le type de mur (porteur, semi-porteur, cloison), analyse les charges à reprendre et dimensionne les éléments de renfort (poutre IPN, HEA ou HEB). Cette étude coûte entre 800 et 2 000 € et conditionne la faisabilité du projet. Elle est exigée par le syndic et l'assurance décennale."
      },
      {
        heading: "Déroulement des travaux",
        text: "L'ouverture se fait par étapes strictes : étaiement provisoire de la structure, découpe progressive du mur, mise en place de la poutre métallique (IPN), scellement et finitions. Les travaux durent généralement 3 à 5 jours. Le bruit et les vibrations sont importants : informez vos voisins et respectez les horaires de chantier imposés par le règlement de copropriété."
      },
      {
        heading: "Démolition et évacuation",
        text: "La démolition de cloisons non porteuses est plus simple mais nécessite quand même une attention particulière : repérage des réseaux (électricité, plomberie, gaz) encastrés, protection des sols et des menuiseries. L'évacuation des gravats en région parisienne se fait par bennes ou big bags, avec un coût de 200 à 500 € selon le volume. En immeuble sans ascenseur, le portage manuel augmente significativement le budget."
      }
    ],
    tips: [
      "L'étude BET est obligatoire et doit être faite AVANT tout travail",
      "En copropriété, l'accord de l'AG est requis (majorité absolue art. 25)",
      "Souscrivez une assurance dommages-ouvrage pour vous protéger",
      "Les IPN doivent être posées par un professionnel qualifié et assuré"
    ],
    faq: [
      { q: "Combien coûte l'ouverture d'un mur porteur ?", a: "Comptez entre 3 000 et 10 000 € tout compris (étude BET + travaux + finitions) selon la portée de l'ouverture, l'épaisseur du mur et les contraintes d'accès. Les murs en pierre de taille sont plus coûteux que les murs en brique." },
      { q: "Faut-il l'accord du syndic ?", a: "Oui, en copropriété, l'ouverture d'un mur porteur touche aux parties communes (structure de l'immeuble). Il faut une autorisation en assemblée générale à la majorité absolue (art. 25 loi du 10 juillet 1965)." },
      { q: "Quels sont les risques sans étude structure ?", a: "Sans étude BET, vous risquez un affaissement de la structure, des fissures chez les voisins, et l'absence de couverture par l'assurance. En cas de sinistre, votre responsabilité personnelle est engagée. C'est aussi un motif de refus de vente lors d'une transaction." }
    ]
  },
  {
    id: "syndic-copropriete",
    icon: Building2,
    title: "Travaux en Copropriété & Syndic",
    subtitle: "Démarches, autorisations et réglementation",
    intro: "Rénover en copropriété implique des démarches spécifiques auprès du syndic et de l'assemblée générale. Bien connaître les règles évite les blocages et les conflits de voisinage.",
    content: [
      {
        heading: "Quels travaux nécessitent une autorisation ?",
        text: "Tous les travaux touchant aux parties communes ou à l'aspect extérieur de l'immeuble nécessitent une autorisation en AG : ouverture de mur porteur, modification des canalisations communes, changement de fenêtres (si différent du modèle existant), pose de climatisation extérieure. Les travaux strictement privatifs (peinture, changement de sol, remplacement de sanitaires) ne nécessitent généralement pas d'autorisation, mais le règlement de copropriété peut prévoir des restrictions."
      },
      {
        heading: "Procédure et délais",
        text: "Pour obtenir une autorisation, vous devez soumettre votre demande au syndic avec les documents techniques (plans, étude BET si mur porteur, devis). Le syndic inscrit le point à l'ordre du jour de la prochaine AG. Les AG se tenant généralement une fois par an, anticipez votre demande 2 à 3 mois avant. En cas d'urgence, une AG extraordinaire peut être convoquée à vos frais (800 à 2 000 €)."
      },
      {
        heading: "Règles de chantier en copropriété",
        text: "Le règlement de copropriété fixe les horaires de travaux autorisés (généralement 8h-20h en semaine, 9h-12h le samedi). Informez vos voisins par courrier avant le début des travaux. Protégez les parties communes (ascenseur, couloirs, cage d'escalier). L'entreprise doit souscrire une assurance responsabilité civile couvrant les dommages aux tiers et aux parties communes."
      }
    ],
    tips: [
      "Anticipez vos demandes d'autorisation 3 à 6 mois avant les travaux",
      "Faites constater l'état des parties communes avant et après le chantier",
      "Prévenez vos voisins directs par courrier recommandé",
      "Conservez tous les PV d'AG et autorisations pour une future revente"
    ],
    faq: [
      { q: "Peut-on commencer les travaux avant l'AG ?", a: "Non, sauf pour les travaux strictement privatifs ne touchant ni aux parties communes ni à l'aspect extérieur. Commencer des travaux soumis à autorisation sans accord de l'AG expose à une remise en état à vos frais sur décision du tribunal." },
      { q: "Que faire si le syndic refuse mes travaux ?", a: "Le syndic ne peut pas refuser seul : c'est l'AG qui vote. Si l'AG refuse, vous pouvez contester la décision en justice dans un délai de 2 mois. Un avocat spécialisé en copropriété peut vous conseiller sur les chances de succès." },
      { q: "Mon voisin se plaint du bruit des travaux, que faire ?", a: "Respectez scrupuleusement les horaires du règlement de copropriété. Informez du planning de travaux et de la durée prévue. Si nécessaire, proposez un constat d'huissier préventif pour l'état de son logement. En cas de litige, le syndic peut servir de médiateur." }
    ]
  }
];

const GuideTravaux: React.FC = () => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Schema.org FAQ markup
  const allFaqs = guides.flatMap(g => g.faq.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  })));

  return (
    <>
      <Helmet>
        <title>Guide Travaux Rénovation Paris | Conseils & Prix 2025</title>
        <meta 
          name="description" 
          content="Guide complet de rénovation à Paris : salle de bain, cuisine, parquet, peinture, mur porteur, menuiserie. Conseils, prix et démarches en copropriété." 
        />
        <link rel="canonical" href="https://qualirenovation.fr/guide-travaux" />
        <meta name="robots" content="index, follow" />
        
        <meta property="og:title" content="Guide Travaux Rénovation Paris | Qualirénovation" />
        <meta property="og:description" content="Tout savoir sur la rénovation à Paris : salle de bain, cuisine, parquet, peinture, mur porteur, syndic. Conseils d'experts et prix." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://qualirenovation.fr/guide-travaux" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": allFaqs
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          {/* Hero */}
          <section className="bg-primary text-primary-foreground py-16 md:py-24">
            <div className="container-tight text-center px-4">
              <span className="text-accent font-medium text-xs tracking-widest uppercase mb-4 block">
                Guide pratique
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-6">
                Guide Travaux de Rénovation
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
                Tout ce que vous devez savoir avant de rénover votre appartement à Paris. 
                Conseils d'experts, prix indicatifs et démarches administratives.
              </p>

              {/* TOC */}
              <nav className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto" aria-label="Sommaire">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70 mb-4">Sommaire</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {guides.map((g) => (
                    <a
                      key={g.id}
                      href={`#${g.id}`}
                      className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-accent transition-colors p-2 rounded-md hover:bg-primary-foreground/5"
                    >
                      <g.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-left">{g.title.replace("Rénovation ", "").replace("Ouverture ", "")}</span>
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </section>

          {/* Guide Sections */}
          {guides.map((guide, idx) => (
            <section
              key={guide.id}
              id={guide.id}
              className={`py-16 md:py-20 ${idx % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}
            >
              <div className="container-tight px-4">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <guide.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                      {guide.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">{guide.subtitle}</p>
                  </div>
                </div>

                {/* Intro */}
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
                  {guide.intro}
                </p>

                {/* Content blocks */}
                <div className="space-y-8 mb-10">
                  {guide.content.map((block) => (
                    <div key={block.heading}>
                      <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-3">
                        {block.heading}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{block.text}</p>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-10">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    Nos conseils
                  </h3>
                  <ul className="space-y-3">
                    {guide.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FAQ */}
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Questions fréquentes
                  </h3>
                  <div className="space-y-3">
                    {guide.faq.map((item) => {
                      const faqId = `${guide.id}-${item.q.slice(0, 20)}`;
                      const isOpen = openFaq === faqId;
                      return (
                        <div key={faqId} className="border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleFaq(faqId)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                          >
                            <span className="font-medium text-sm text-foreground pr-4">{item.q}</span>
                            <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* CTA – Manifeste */}
          <section className="bg-primary text-primary-foreground py-16 md:py-24">
            <div className="container-tight px-4 max-w-3xl mx-auto">
              <div className="space-y-6 text-center">
                <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed italic">
                  Rénover, ce n'est pas seulement transformer un espace.
                  <br />
                  C'est assumer des choix, une méthode et une responsabilité.
                </p>
                <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed">
                  Si notre philosophie vous parle, prenez rendez-vous pour votre projet et échangeons ensemble.
                </p>
                <p className="text-primary-foreground/70 text-sm md:text-base leading-relaxed">
                  Un chantier réussi n'est pas celui qui impressionne le jour J,
                  <br className="hidden sm:block" />
                  mais celui qui reste juste, solide et serein dans le temps.
                </p>

                {/* Signature */}
                <p className="font-script text-2xl md:text-3xl text-accent pt-4">
                  Carina N.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Demander un devis gratuit
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Link
                  to="/renovation-complete"
                  className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 text-primary-foreground px-8 py-3.5 rounded-sm font-medium hover:bg-primary-foreground/20 transition-colors"
                >
                  Configurer mon projet
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      <QuoteModal 
        open={showQuoteModal} 
        onOpenChange={setShowQuoteModal}
        showConfigurationOption={true}
      />
    </>
  );
};

export default GuideTravaux;
