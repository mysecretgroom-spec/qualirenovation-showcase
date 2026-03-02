// Import des images Houzz
import appartementTransforme from "@/assets/projects/appartement-transforme.jpg";
import appartementGobelins from "@/assets/projects/appartement-gobelins.jpg";
import f4Gobelins from "@/assets/projects/f4-gobelins.jpg";
import murPorteur from "@/assets/projects/mur-porteur.jpg";
import murPorteur1 from "@/assets/projects/mur-porteur-1.jpg";
import murPorteur2 from "@/assets/projects/mur-porteur-2.jpg";
import murPorteur3 from "@/assets/projects/mur-porteur-3.jpg";
import murPorteur4 from "@/assets/projects/mur-porteur-4.jpg";
import murPorteur5 from "@/assets/projects/mur-porteur-5.jpg";
import murPorteur6 from "@/assets/projects/mur-porteur-6.jpg";
import paris19 from "@/assets/projects/paris-19.jpg";
import laMuette from "@/assets/projects/la-muette.jpg";
import vueEnsemble from "@/assets/projects/vue-ensemble.jpg";
import renovationMaison from "@/assets/projects/renovation-maison.jpg";
import salleBainXxl from "@/assets/projects/salle-bain-xxl.jpg";
import paris13 from "@/assets/projects/paris-13.jpg";
import avantApresSdb from "@/assets/projects/avant-apres-sdb.jpg";
import parlonsProjet from "@/assets/projects/parlons-projet.jpg";

export interface BeforeAfterPair {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  tags?: string[];
  location: string;
  image: string;
  photoCount: number;
  houzzUrl: string;
  year: string;
  budget: string;
  description: string;
  highlights: string[];
  services: string[];
  gallery: string[];
  beforeAfterPairs?: BeforeAfterPair[];
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "appartement-transforme-location",
    title: "Un appartement transformé pour mieux louer : confort et DPE amélioré",
    category: "Rénovation complète",
    location: "Paris",
    image: appartementTransforme,
    photoCount: 27,
    houzzUrl: "https://www.houzz.fr/hznb/projets/un-appartement-transforme-pour-mieux-louer-confort-et-dpe-ameliore-pj-vj~7739460",
    year: "2025",
    budget: "20 001 - 50 000 €",
    description: `Quand on rénove un bien locatif… on rénove aussi la relation avec ses locataires.

Sur ce chantier, l'objectif était simple : remettre l'appartement au goût du jour, améliorer le DPE, sécuriser l'électricité, optimiser l'espace… et offrir un vrai confort de vie aux locataires.

Les travaux réalisés étaient éligibles aux aides de l'État, notamment grâce au remplacement des fenêtres par un poseur RGE. Quand technique et bon sens se rencontrent, ça fait du bien au portefeuille… et au climat !

La vraie transformation s'est jouée sur plusieurs niveaux : un logement bien entretenu apaise les tensions, le dialogue redevient fluide, et les locataires se sentent respectés… et respectent davantage le bien.

Résultat : des locataires ravis, un agent immobilier enthousiaste et un bien qui se loue mieux… et plus cher.`,
    highlights: [
      "Amélioration du DPE",
      "Mise aux normes électriques",
      "Remplacement des fenêtres (RGE)",
      "Cuisine optimisée avec rangements",
      "Suivi quotidien à distance"
    ],
    services: [
      "Électricité",
      "Plomberie",
      "Menuiserie",
      "Peinture",
      "Fenêtres",
      "Cuisine"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/fec19e8209328138_7560-w800-h600-b0-p0--.jpg",
      "https://st.hzcdn.com/fimgs/93a1194e092ebeac_1165-w800-h600-b0-p0--.jpg",
      "https://st.hzcdn.com/fimgs/7fc1d5ab092ebeb3_1165-w800-h600-b0-p0--.jpg",
      "https://st.hzcdn.com/fimgs/22c16159092ebebb_1165-w800-h600-b0-p0--.jpg",
      "https://st.hzcdn.com/fimgs/de316252092ebec1_1170-w800-h600-b0-p0--.jpg",
      "https://st.hzcdn.com/fimgs/7a81fff9092ebec9_1181-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 2,
    slug: "appartement-parisien-gobelins",
    title: "Réinventer un appartement parisien pour des clients en province",
    category: "Rénovation complète",
    location: "Paris - Gobelins",
    image: appartementGobelins,
    photoCount: 7,
    houzzUrl: "https://www.houzz.fr/hznb/projets/reinventer-un-appartement-parisien-pour-des-clients-en-province-pj-vj~7738195",
    year: "2024",
    budget: "20 001 - 50 000 €",
    description: `Un projet mené intégralement à distance pour des propriétaires résidant en province.

Grâce à notre méthodologie de suivi quotidien (photos, rapports, visioconférences), nous avons transformé cet appartement parisien sans que les propriétaires aient besoin de se déplacer.

Une coordination parfaite entre les différents corps de métiers a permis de respecter les délais et le budget initial.`,
    highlights: [
      "Gestion à distance complète",
      "Suivi photos quotidien",
      "Respect des délais",
      "Coordination multi-corps de métiers"
    ],
    services: [
      "Maçonnerie",
      "Plomberie",
      "Électricité",
      "Peinture",
      "Parquet"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/a411346609288c80_5090-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 3,
    slug: "f4-gobelins-reorchestre",
    title: "Au Gobelins : F4 entièrement réorchestré",
    category: "Rénovation complète",
    location: "Paris - Gobelins",
    image: f4Gobelins,
    photoCount: 12,
    houzzUrl: "https://www.houzz.fr/hznb/projets/au-gobelins-cet-ancien-f4-a-ete-entierement-reorchestre-pour-offrir-une-nouvel-pj-vj~7738188",
    year: "2024",
    budget: "50 001 - 100 000 €",
    description: `Cet ancien F4 a été entièrement réorchestré pour offrir une nouvelle vie à cet appartement parisien typique.

Repenser les volumes, optimiser la circulation, moderniser les installations tout en préservant le charme de l'ancien : voilà le défi relevé par notre équipe.

Une rénovation qui marie harmonieusement le cachet parisien traditionnel et les exigences du confort moderne.`,
    highlights: [
      "Redistribution des espaces",
      "Préservation du cachet ancien",
      "Optimisation de la lumière naturelle",
      "Modernisation des installations"
    ],
    services: [
      "Architecture intérieure",
      "Maçonnerie",
      "Plomberie",
      "Électricité",
      "Menuiserie",
      "Peinture"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/b6917218092883c5_2908-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 4,
    slug: "ouverture-mur-porteur",
    title: "Ouverture de mur porteur : ouvrir deux pièces en toute sécurité",
    category: "Rénovation complète",
    location: "Paris",
    image: murPorteur,
    photoCount: 6,
    houzzUrl: "https://www.houzz.fr/hznb/projets/vous-voulez-ouvrir-deux-pieces-mais-zut-il-y-a-un-mur-porteur-pj-vj~7738106",
    year: "2024",
    budget: "10 001 - 20 000 €",
    description: `Vous voulez ouvrir deux pièces… mais zut : il y a un mur porteur. Que faire ? On vous explique tout.

Ouvrir un mur porteur dans l'haussmannien : tout sauf un détail. Créer une grande pièce de vie en ouvrant un salon sur une salle à manger est un rêve courant… mais dans l'ancien, rien ne s'improvise.

Avant le premier coup de marteau, tout se joue dans la préparation : étude de faisabilité par un BET structure, validation obligatoire en Assemblée Générale, état des lieux d'huissier chez les voisins et anticipation de la logistique des structures métalliques. Sans ces étapes, on ne fait tout simplement pas.

Sur le chantier, la rigueur est absolue : pose des étais, sécurisation complète, ouverture maîtrisée, traitement anticorrosion des structures conformément aux règles de l'art, protection et nettoyage des parties communes, information régulière des copropriétaires (parce qu'un chantier, ça s'entend).

Dans les immeubles haussmanniens, une ouverture implique souvent plusieurs postes complémentaires : raccords de parquet (ici avec des orientations différentes en pointe de Hongrie), choix de solutions adaptées comme des lames droites, du carrelage ou des carreaux de ciment, et reprise des moulures et corniches existantes, réalisées avec un travail très minutieux.

Les assurances sont fournies à l'AG et au BET, et après travaux, le visa de conformité du BET vient valider l'ensemble et protéger aussi bien la copropriété que le client.

Notre mission sur ce projet : ouvrir le salon sur la salle à manger pour créer une grande pièce de vie lumineuse intégrant la cuisine, tout en respectant la structure, l'esthétique et l'âme du lieu.

Un projet technique, exigeant, mais passionnant. Découvrez le travail de nos équipes… et dites-nous ce que vous en pensez.`,
    highlights: [
      "Étude de faisabilité par BET structure",
      "Validation en Assemblée Générale",
      "Pose d'étais et sécurisation complète",
      "Traitement anticorrosion des structures",
      "Raccords de parquet en pointe de Hongrie",
      "Reprise des moulures et corniches",
      "Visa de conformité du BET"
    ],
    services: [
      "Étude structure",
      "Maçonnerie",
      "Métallerie",
      "Parquet",
      "Moulures",
      "Peinture",
      "Finitions"
    ],
    gallery: [
      murPorteur1,
      murPorteur2,
      murPorteur3,
      murPorteur4,
      murPorteur5,
      murPorteur6
    ]
  },
  {
    id: 5,
    slug: "paris-19-ancien-contemporain",
    title: "Paris 19 – De l'ancien au contemporain : une rénovation sur-mesure",
    category: "Rénovation complète",
    location: "Paris 19ème",
    image: paris19,
    photoCount: 28,
    houzzUrl: "https://www.houzz.fr/hznb/projets/paris-19-de-l-ancien-au-contemporain-une-renovation-sur-mesure-pj-vj~7704321",
    year: "2025",
    budget: "20 001 - 50 000 €",
    description: `Quand les sinistres s'accumulent, on peut soit réparer à l'identique… soit transformer l'épreuve en opportunité. C'est le choix qu'a fait notre cliente après avoir subi deux dégâts des eaux.

Chez QualiRénovation by QualiConcept, nous avons coordonné et réalisé l'ensemble du projet, en collaboration avec notre partenaire design Thierry – P3D Concept.

Les points forts du projet : une chambre optimisée avec tête de lit sur mesure et dressings IKEA parfaitement intégrés, une cuisine ouverte sur le salon pour plus de convivialité et de lumière, une mini salle de bain astucieuse qui combine design et fonctionnalité.

Un traitement complet des isolations : isolation thermique avec Actis Hybris 31, isolation acoustique avec Renomince contre les nuisances voisines, isolation phonique des plafonds avec IBR 100, isolation sous parquet contre les remontées capillaires.`,
    highlights: [
      "Chambre avec tête de lit sur mesure",
      "Cuisine ouverte sur salon",
      "Mini salle de bain design",
      "Isolation thermique Actis Hybris 31",
      "Isolation acoustique Renomince",
      "Isolation phonique plafonds IBR 100"
    ],
    services: [
      "Conception 3D",
      "Isolation thermique",
      "Isolation phonique",
      "Plomberie",
      "Électricité",
      "Menuiserie sur mesure",
      "Carrelage",
      "Peinture"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/4dc1578808c9f80a_9144-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 6,
    slug: "projet-la-muette",
    title: "Projet La Muette",
    category: "Rénovation complète",
    location: "Paris 16ème",
    image: laMuette,
    photoCount: 8,
    houzzUrl: "https://www.houzz.fr/hznb/projets/projet-la-muette-pj-vj~7738134",
    year: "2024",
    budget: "50 001 - 100 000 €",
    description: `Dans le prestigieux quartier de La Muette, ce projet de rénovation d'exception combine élégance parisienne et modernité.

Chaque détail a été pensé pour créer un intérieur raffiné : matériaux nobles, finitions soignées, et une attention particulière portée à la lumière naturelle.

Un projet qui reflète l'exigence de qualité de QualiRénovation dans les quartiers les plus prisés de Paris.`,
    highlights: [
      "Quartier prestigieux Paris 16ème",
      "Matériaux nobles",
      "Finitions haut de gamme",
      "Optimisation lumière naturelle"
    ],
    services: [
      "Architecture intérieure",
      "Menuiserie sur mesure",
      "Parquet",
      "Peinture décorative",
      "Électricité"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/0e818fee09285e79_3364-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 7,
    slug: "vue-ensemble-entreprise",
    title: "Vue d'ensemble de l'entreprise",
    category: "Rénovation complète",
    location: "Paris",
    image: vueEnsemble,
    photoCount: 10,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
    year: "2024",
    budget: "Variable",
    description: `Découvrez l'ensemble de nos réalisations à travers ce portfolio qui illustre notre savoir-faire en rénovation d'intérieur.

De la simple rénovation de salle de bain à la transformation complète d'appartements, nous intervenons sur tous types de projets avec la même exigence de qualité.`,
    highlights: [
      "Portfolio complet",
      "Diversité des projets",
      "Expertise multi-domaines"
    ],
    services: [
      "Rénovation complète",
      "Salle de bain",
      "Cuisine",
      "Peinture",
      "Parquet"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/ec1517930646743b_3311-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 8,
    slug: "renovation-maison-spectaculaire",
    title: "Rénovation d'une maison : un projet ambitieux pour un résultat spectaculaire",
    category: "Rénovation complète",
    location: "Île-de-France",
    image: renovationMaison,
    photoCount: 15,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
    year: "2024",
    budget: "100 001 - 200 000 €",
    description: `Un projet ambitieux de rénovation de maison en Île-de-France. 

De la conception à la réalisation, chaque étape a été orchestrée pour aboutir à un résultat spectaculaire qui dépasse les attentes initiales des propriétaires.

Une transformation complète qui redonne vie à cette maison tout en respectant son caractère.`,
    highlights: [
      "Rénovation complète maison",
      "Projet ambitieux",
      "Résultat spectaculaire",
      "Respect du caractère existant"
    ],
    services: [
      "Maçonnerie",
      "Couverture",
      "Isolation",
      "Plomberie",
      "Électricité",
      "Menuiserie",
      "Carrelage",
      "Peinture"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/0d01a3a206ba3b97_0996-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 9,
    slug: "salle-bain-xxl-luxe",
    title: "Une Salle de Bain XXL pour Monsieur : Élégance Pratique et Luxe Moderne",
    category: "Salle de Bain",
    location: "Paris",
    image: salleBainXxl,
    photoCount: 12,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
    year: "2024",
    budget: "20 001 - 50 000 €",
    description: `Une salle de bain XXL conçue spécialement pour Monsieur, alliant élégance pratique et luxe moderne.

Grands volumes, matériaux nobles, douche à l'italienne spacieuse et double vasque : tous les codes du luxe contemporain sont réunis dans cette réalisation d'exception.

Une attention particulière a été portée à l'ergonomie et au confort d'utilisation au quotidien.`,
    highlights: [
      "Grande surface optimisée",
      "Douche à l'italienne XL",
      "Double vasque",
      "Matériaux nobles",
      "Éclairage d'ambiance"
    ],
    services: [
      "Plomberie",
      "Carrelage grand format",
      "Menuiserie sur mesure",
      "Électricité",
      "Peinture"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/58f1457f06ba3094_8188-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 10,
    slug: "elegance-moderne-paris-13",
    title: "L'Élégance Moderne Au Cœur de Paris 13",
    category: "Rénovation complète",
    location: "Paris 13ème",
    image: paris13,
    photoCount: 20,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
    year: "2024",
    budget: "50 001 - 100 000 €",
    description: `Au cœur du 13ème arrondissement de Paris, cette rénovation incarne l'élégance moderne.

Un travail minutieux sur les volumes, la lumière et les matériaux pour créer un intérieur contemporain et chaleureux.

Chaque espace a été repensé pour optimiser le confort de vie tout en préservant une esthétique épurée.`,
    highlights: [
      "Design contemporain",
      "Optimisation des volumes",
      "Travail sur la lumière",
      "Matériaux de qualité"
    ],
    services: [
      "Architecture intérieure",
      "Plomberie",
      "Électricité",
      "Menuiserie",
      "Parquet",
      "Peinture"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/27a15d0e06ba2e2e_7557-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 11,
    slug: "avant-apres-salle-bain-ivoire",
    title: "AVANT/APRÈS : Élégante Salle de Bain Ivoire et Laiton Brossé",
    category: "Salle de Bain",
    location: "Paris",
    image: avantApresSdb,
    photoCount: 8,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
    year: "2024",
    budget: "15 001 - 25 000 €",
    description: `Une transformation spectaculaire d'une salle de bain vieillissante en un espace élégant aux tons ivoire et aux accents laiton brossé.

Le choix des coloris chauds et des finitions métalliques crée une atmosphère à la fois luxueuse et apaisante.

Un parfait exemple de notre capacité à sublimer les espaces existants.`,
    highlights: [
      "Transformation AVANT/APRÈS",
      "Tons ivoire chaleureux",
      "Accents laiton brossé",
      "Atmosphère luxueuse"
    ],
    services: [
      "Plomberie",
      "Carrelage",
      "Peinture",
      "Robinetterie haut de gamme",
      "Accessoires"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/2191bdcc06ba27e0_6017-w800-h600-b0-p0--.jpg"
    ]
  },
  {
    id: 12,
    slug: "parlons-de-votre-projet",
    title: "Parlons de votre projet !",
    category: "Rénovation complète",
    location: "Paris & Île-de-France",
    image: parlonsProjet,
    photoCount: 5,
    houzzUrl: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
    year: "2024",
    budget: "Sur devis",
    description: `Vous avez un projet de rénovation en tête ? Parlons-en ensemble !

Chez QualiRénovation by QualiConcept, nous vous accompagnons de A à Z : de la conception à la réalisation, en passant par le sourcing des matériaux et la coordination des artisans.

Consultation gratuite, devis détaillé sous 48h, suivi quotidien de votre chantier. Contactez-nous pour donner vie à vos projets.`,
    highlights: [
      "Consultation gratuite",
      "Devis sous 48h",
      "Accompagnement complet",
      "Suivi quotidien"
    ],
    services: [
      "Conseil",
      "Conception",
      "Réalisation",
      "Coordination",
      "Suivi chantier"
    ],
    gallery: [
      "https://st.hzcdn.com/fimgs/72e11a7706b9bbe0_8392-w800-h600-b0-p0--.jpg"
    ]
  }
];

export const categories = ["Tous", "Rénovation complète", "Salle de Bain", "Cuisine", "Salon", "Chambre", "Menuiserie", "Parquet", "Boiseries murale"];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(p => p.slug === slug);
};

export const getRelatedProjects = (currentSlug: string, limit: number = 3): Project[] => {
  const currentProject = getProjectBySlug(currentSlug);
  if (!currentProject) return projects.slice(0, limit);
  
  return projects
    .filter(p => p.slug !== currentSlug && p.category === currentProject.category)
    .slice(0, limit);
};
