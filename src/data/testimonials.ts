export interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  projectType?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Joel M.",
    role: "Rénovation complète appartement",
    rating: 5,
    text: "J'ai confié la rénovation complète de mon appartement à louer à QualiRénovation by QualiConcept, et sincèrement… quel bonheur. Carina a commencé par rencontrer mes locataires pour comprendre leur mode de vie. Résultat : un projet pensé intelligemment, des travaux bien coordonnés et un appartement qui a pris une vraie valeur. Je recommande vivement !",
    date: "Décembre 2024",
    projectType: "Rénovation appartement"
  },
  {
    id: 2,
    name: "Olivier G.",
    role: "Rénovation salle de bain",
    rating: 5,
    text: "J'ai sollicité Carina de QUALIRENOVATION pour la rénovation de ma salle de bain. En moins de deux semaines, j'ai reçu une évaluation détaillée et un devis. La rénovation a été complète : plomberie, électricité, remplacement de la baignoire par une douche. Le résultat dépasse mes attentes initiales.",
    date: "Octobre 2024",
    projectType: "Salle de bain"
  },
  {
    id: 3,
    name: "Marie C.",
    role: "Transformation salle de bains et chambre",
    rating: 5,
    text: "Je recommande avec beaucoup d'enthousiasme les prestations de QualiConcept. Carina a géré mon chantier avec beaucoup de professionnalisme et de rigueur. Le chantier a été livré dans le délai imparti, avec un sens du détail et des finitions soignées.",
    date: "Septembre 2024",
    projectType: "Salle de bains et chambre"
  },
  {
    id: 4,
    name: "Yoann de M.",
    role: "Rénovation complète appartement",
    rating: 5,
    text: "Je ne peux que recommander avec enthousiasme Qualirenovation et sa 'bonne fée' Carina, joignable aux heures les plus improbables et toujours sur le pont pour trouver des solutions. Elle a supervisé toute la rénovation intérieure avec une efficacité redoutable.",
    date: "Juillet 2024",
    projectType: "Rénovation complète"
  },
  {
    id: 5,
    name: "Patricia G.",
    role: "Rénovation deux pièces",
    rating: 5,
    text: "Je dois à Carina la réussite des travaux de rénovation de mon deux pièces où tout était à refaire du sol au plafond ! Je me suis entièrement reposée sur son savoir-faire. Avec Carina, qui maîtrise tous les corps de métier, pas un problème qui n'ait sa solution.",
    date: "Juillet 2024",
    projectType: "Rénovation complète"
  },
  {
    id: 6,
    name: "Sylvie B.",
    role: "Rénovation cuisine et salle de bain",
    rating: 5,
    text: "Excellente expérience avec QualiRénovation ! Carina est une professionnelle hors pair qui a su transformer notre appartement. Sa réactivité, son écoute et sa capacité à trouver des solutions à chaque problème sont remarquables. Le résultat est magnifique.",
    date: "Juin 2024",
    projectType: "Cuisine et salle de bain"
  },
  {
    id: 7,
    name: "Philippe D.",
    role: "Rénovation appartement haussmannien",
    rating: 5,
    text: "Nous avons fait appel à Carina pour rénover notre appartement haussmannien. Son expertise et son sens du détail ont été précieux. Elle a su préserver le cachet de l'ancien tout en apportant une touche de modernité. Travail impeccable !",
    date: "Mai 2024",
    projectType: "Appartement haussmannien"
  },
  {
    id: 8,
    name: "Nathalie L.",
    role: "Rénovation salle de bain luxe",
    rating: 5,
    text: "Carina a transformé notre salle de bain en un véritable espace bien-être. Son œil d'experte pour les matériaux et les finitions a fait toute la différence. Nous sommes ravis du résultat et de son accompagnement tout au long du projet.",
    date: "Avril 2024",
    projectType: "Salle de bain"
  },
  {
    id: 9,
    name: "Marc R.",
    role: "Ouverture mur porteur",
    rating: 5,
    text: "Projet complexe d'ouverture de mur porteur mené de main de maître par l'équipe de QualiRénovation. Carina a coordonné l'architecte, l'ingénieur structure et les artisans avec un professionnalisme exemplaire. Aucune mauvaise surprise !",
    date: "Mars 2024",
    projectType: "Structure"
  },
  {
    id: 10,
    name: "Caroline H.",
    role: "Rénovation complète F3",
    rating: 5,
    text: "De la conception à la réalisation, Carina nous a accompagnés avec patience et expertise. Notre F3 a été complètement transformé en 3 mois. Les artisans sont qualifiés et respectueux. Je recommande sans hésitation.",
    date: "Février 2024",
    projectType: "Rénovation complète"
  },
  {
    id: 11,
    name: "Jean-Pierre M.",
    role: "Rénovation cuisine équipée",
    rating: 5,
    text: "Notre cuisine a été entièrement refaite par QualiRénovation. Du sur-mesure de qualité, des finitions parfaites et un respect des délais. Carina a été d'une aide précieuse pour le choix des matériaux et l'optimisation de l'espace.",
    date: "Janvier 2024",
    projectType: "Cuisine"
  },
  {
    id: 12,
    name: "Sophie V.",
    role: "Rénovation appartement Paris 16",
    rating: 5,
    text: "Carina a su comprendre nos besoins et proposer des solutions créatives pour notre appartement. Son réseau d'artisans est fiable et compétent. Le chantier s'est déroulé sans accroc et le résultat est au-delà de nos espérances.",
    date: "Décembre 2023",
    projectType: "Rénovation complète"
  },
  {
    id: 13,
    name: "Thomas B.",
    role: "Rénovation salle de bain PMR",
    rating: 5,
    text: "Nous avions besoin d'adapter notre salle de bain pour une personne à mobilité réduite. Carina a proposé des solutions pratiques et esthétiques. Le résultat est fonctionnel, sécurisé et vraiment beau. Merci pour ce travail remarquable.",
    date: "Novembre 2023",
    projectType: "Salle de bain PMR"
  },
  {
    id: 14,
    name: "Isabelle F.",
    role: "Rénovation studio Paris",
    rating: 5,
    text: "Mon petit studio parisien a été complètement optimisé par QualiRénovation. Carina a su exploiter chaque centimètre carré avec intelligence. Les rangements sont nombreux et le résultat est lumineux et moderne.",
    date: "Octobre 2023",
    projectType: "Studio"
  },
  {
    id: 15,
    name: "Laurent P.",
    role: "Rénovation appartement locatif",
    rating: 5,
    text: "J'ai confié la rénovation de mon appartement locatif à Carina. Elle a su respecter le budget tout en proposant des finitions de qualité. Le bien s'est loué immédiatement après les travaux. Excellent investissement !",
    date: "Septembre 2023",
    projectType: "Appartement locatif"
  },
  {
    id: 16,
    name: "Catherine D.",
    role: "Rénovation chambre parentale",
    rating: 5,
    text: "Notre chambre parentale avec dressing et salle de bain attenante a été magnifiquement rénovée. Carina a créé un véritable cocon. Son sens de l'harmonie des couleurs et des matériaux est remarquable.",
    date: "Août 2023",
    projectType: "Chambre"
  },
  {
    id: 17,
    name: "François G.",
    role: "Rénovation appartement années 70",
    rating: 5,
    text: "Notre appartement datant des années 70 a été complètement modernisé par QualiRénovation. Carina a su conserver certains éléments d'époque tout en apportant le confort moderne. Un travail d'équilibriste réussi !",
    date: "Juillet 2023",
    projectType: "Rénovation complète"
  },
  {
    id: 18,
    name: "Marie-Claire T.",
    role: "Rénovation salle de bain italienne",
    rating: 5,
    text: "La douche à l'italienne de nos rêves est enfin réalité grâce à Carina ! Elle a géré tous les aspects techniques (étanchéité, pente, etc.) avec expertise. Le carrelage grand format est magnifique. Parfait !",
    date: "Juin 2023",
    projectType: "Salle de bain"
  },
  {
    id: 19,
    name: "Antoine L.",
    role: "Rénovation duplex",
    rating: 5,
    text: "Rénovation complète de notre duplex avec création d'un escalier sur mesure. Carina a coordonné une équipe de plus de 10 corps de métier sans fausse note. Son organisation est impressionnante.",
    date: "Mai 2023",
    projectType: "Duplex"
  },
  {
    id: 20,
    name: "Valérie M.",
    role: "Rénovation cuisine ouverte",
    rating: 5,
    text: "Nous rêvions d'une cuisine ouverte sur le salon. Carina a concrétisé ce projet en gérant l'ouverture du mur et la création d'une cuisine moderne et fonctionnelle. Le résultat transforme notre quotidien !",
    date: "Avril 2023",
    projectType: "Cuisine"
  },
  {
    id: 21,
    name: "Nicolas R.",
    role: "Rénovation appartement investissement",
    rating: 5,
    text: "En tant qu'investisseur, j'apprécie le professionnalisme de Carina qui comprend les enjeux de rentabilité. Elle propose des solutions qualitatives à prix maîtrisé. Plusieurs appartements rénovés avec succès !",
    date: "Mars 2023",
    projectType: "Investissement locatif"
  },
  {
    id: 22,
    name: "Béatrice C.",
    role: "Rénovation entrée et couloir",
    rating: 5,
    text: "Même pour un 'petit' projet comme notre entrée et couloir, Carina s'est investie avec le même sérieux. Nouveau sol, éclairage repensé, rangements optimisés : un vrai plus pour notre appartement.",
    date: "Février 2023",
    projectType: "Entrée"
  },
  {
    id: 23,
    name: "Didier H.",
    role: "Rénovation salle de bain double vasque",
    rating: 5,
    text: "Installation d'une double vasque dans notre salle de bain familiale. Carina a trouvé la solution parfaite malgré l'espace limité. Les enfants sont ravis et nous aussi ! Travail soigné.",
    date: "Janvier 2023",
    projectType: "Salle de bain"
  },
  {
    id: 24,
    name: "Anne-Sophie B.",
    role: "Rénovation appartement Art Déco",
    rating: 5,
    text: "Notre appartement Art Déco nécessitait une rénovation respectueuse de son style. Carina a parfaitement compris l'enjeu et a su moderniser tout en préservant les moulures et les parquets d'origine.",
    date: "Décembre 2022",
    projectType: "Appartement Art Déco"
  },
  {
    id: 25,
    name: "Pierre-Yves L.",
    role: "Rénovation électrique complète",
    rating: 5,
    text: "Mise aux normes électrique complète de notre appartement ancien. Carina a coordonné les travaux avec efficacité, minimisant les dégâts sur les murs. Électricité refaite à neuf et tableaux aux normes.",
    date: "Novembre 2022",
    projectType: "Électricité"
  },
  {
    id: 26,
    name: "Martine V.",
    role: "Rénovation salle de bain seniors",
    rating: 5,
    text: "Adaptation de notre salle de bain pour nos parents âgés. Carina a proposé des équipements adaptés tout en conservant une esthétique moderne. Barres de maintien, siège de douche intégré... Tout y est !",
    date: "Octobre 2022",
    projectType: "Salle de bain seniors"
  },
  {
    id: 27,
    name: "Éric D.",
    role: "Rénovation cuisine professionnelle",
    rating: 5,
    text: "En tant que chef cuisinier, j'avais des exigences particulières pour ma cuisine personnelle. Carina a su intégrer des équipements semi-professionnels dans un design élégant. Un plaisir au quotidien !",
    date: "Septembre 2022",
    projectType: "Cuisine"
  },
  {
    id: 28,
    name: "Sandrine P.",
    role: "Rénovation chambre enfants",
    rating: 5,
    text: "Création de deux espaces distincts dans la chambre de nos enfants. Carina a imaginé une solution ingénieuse avec des rangements sur mesure. Les enfants adorent leur nouvelle chambre !",
    date: "Août 2022",
    projectType: "Chambre enfants"
  },
  {
    id: 29,
    name: "Christophe M.",
    role: "Rénovation plomberie complète",
    rating: 5,
    text: "Remplacement complet de la plomberie de notre appartement (colonnes incluses après accord copropriété). Carina a géré les relations avec le syndic et les voisins. Travail transparent et professionnel.",
    date: "Juillet 2022",
    projectType: "Plomberie"
  },
  {
    id: 30,
    name: "Dominique L.",
    role: "Rénovation salon séjour",
    rating: 5,
    text: "Réaménagement complet de notre salon-séjour avec création d'un coin bureau. Nouveau parquet, peintures, éclairages... Carina a orchestré le tout en un temps record. Bravo !",
    date: "Juin 2022",
    projectType: "Salon"
  },
  {
    id: 31,
    name: "Stéphanie R.",
    role: "Rénovation salle de bain zen",
    rating: 5,
    text: "J'avais envie d'une salle de bain ambiance spa. Carina a créé exactement l'atmosphère recherchée : bois, pierre naturelle, douche de pluie... Un vrai havre de paix. Merci infiniment !",
    date: "Mai 2022",
    projectType: "Salle de bain"
  },
  {
    id: 32,
    name: "Gilles B.",
    role: "Rénovation appartement Neuilly",
    rating: 5,
    text: "Rénovation haut de gamme de notre appartement à Neuilly. Carina a su trouver des artisans à la hauteur de nos exigences. Matériaux nobles, finitions impeccables. Une vraie réussite.",
    date: "Avril 2022",
    projectType: "Rénovation luxe"
  },
  {
    id: 33,
    name: "Muriel T.",
    role: "Rénovation toilettes",
    rating: 5,
    text: "Même pour des toilettes, Carina apporte son expertise ! WC suspendu, lave-mains design, carrelage graphique... Nos toilettes sont devenues une pièce à part entière. Excellent travail.",
    date: "Mars 2022",
    projectType: "Toilettes"
  },
  {
    id: 34,
    name: "Jacques F.",
    role: "Rénovation appartement Paris 13",
    rating: 5,
    text: "Deuxième collaboration avec QualiRénovation après un premier chantier réussi. Carina connaît nos goûts et nos exigences. Le résultat est encore une fois parfait. Fidélité bien placée !",
    date: "Février 2022",
    projectType: "Rénovation complète"
  },
  {
    id: 35,
    name: "Christine G.",
    role: "Rénovation cuisine américaine",
    rating: 4,
    text: "Création d'une cuisine américaine avec îlot central. Quelques ajustements ont été nécessaires mais Carina a toujours été réactive. Le résultat final est conforme à nos attentes.",
    date: "Janvier 2022",
    projectType: "Cuisine"
  },
  {
    id: 36,
    name: "Olivier P.",
    role: "Rénovation salle de bain marbre",
    rating: 5,
    text: "Salle de bain entièrement en marbre, un rêve devenu réalité grâce à Carina. Elle a géré l'approvisionnement des plaques, la découpe sur mesure et la pose. Un travail d'orfèvre !",
    date: "Décembre 2021",
    projectType: "Salle de bain"
  },
  {
    id: 37,
    name: "Pascale D.",
    role: "Rénovation appartement familial",
    rating: 5,
    text: "Rénovation de notre appartement familial pour accueillir un troisième enfant. Carina a optimisé l'espace avec brio. Chaque enfant a maintenant son coin et les rangements sont nombreux.",
    date: "Novembre 2021",
    projectType: "Appartement familial"
  },
  {
    id: 38,
    name: "Bernard C.",
    role: "Rénovation bureau à domicile",
    rating: 5,
    text: "Avec le télétravail, j'avais besoin d'un vrai bureau à domicile. Carina a transformé notre chambre d'amis en espace de travail fonctionnel tout en conservant un canapé-lit. Parfait !",
    date: "Octobre 2021",
    projectType: "Bureau"
  },
  {
    id: 39,
    name: "Véronique H.",
    role: "Rénovation parquet et peintures",
    rating: 5,
    text: "Ponçage et vitrification de nos parquets anciens + peintures complètes. Carina a coordonné les interventions pour minimiser la gêne. Notre appartement a retrouvé tout son éclat.",
    date: "Septembre 2021",
    projectType: "Parquet et peintures"
  },
  {
    id: 40,
    name: "Michel B.",
    role: "Rénovation salle de bain contemporaine",
    rating: 5,
    text: "Notre vieille salle de bain des années 80 a fait peau neuve ! Carina a créé un espace contemporain et lumineux. Meuble vasque suspendu, grand miroir rétroéclairé... Superbe transformation.",
    date: "Août 2021",
    projectType: "Salle de bain"
  },
  {
    id: 41,
    name: "Annie M.",
    role: "Rénovation appartement Paris 19",
    rating: 5,
    text: "Première rénovation d'appartement pour nous, Carina nous a guidés pas à pas. Son expérience nous a évité bien des erreurs. Le résultat correspond exactement à ce que nous voulions.",
    date: "Juillet 2021",
    projectType: "Rénovation complète"
  },
  {
    id: 42,
    name: "Patrick V.",
    role: "Rénovation cave en buanderie",
    rating: 5,
    text: "Transformation de notre cave en buanderie fonctionnelle. Carina a géré les contraintes d'humidité et de ventilation. Machines à laver et sèche-linge en sous-sol, quel gain de place !",
    date: "Juin 2021",
    projectType: "Cave"
  },
  {
    id: 43,
    name: "Corinne L.",
    role: "Rénovation salle de bain noir et blanc",
    rating: 5,
    text: "Salle de bain graphique noir et blanc comme je la voulais ! Carina a su doser les contrastes et apporter de la chaleur avec des touches de bois. Un vrai magazine déco !",
    date: "Mai 2021",
    projectType: "Salle de bain"
  },
  {
    id: 44,
    name: "Alain R.",
    role: "Rénovation appartement location saisonnière",
    rating: 5,
    text: "Préparation de mon appartement pour la location saisonnière. Carina a su créer un intérieur attractif et résistant. Les premiers locataires sont enchantés et les réservations affluent !",
    date: "Avril 2021",
    projectType: "Location saisonnière"
  },
  {
    id: 45,
    name: "Danielle G.",
    role: "Rénovation cuisine et cellier",
    rating: 5,
    text: "Rénovation de la cuisine avec création d'un cellier attenant. Carina a optimisé chaque espace de rangement. Électroménager encastré, plan de travail généreux... Un bonheur au quotidien.",
    date: "Mars 2021",
    projectType: "Cuisine"
  },
  {
    id: 46,
    name: "Robert T.",
    role: "Rénovation appartement La Muette",
    rating: 5,
    text: "Rénovation de notre pied-à-terre parisien dans le 16ème. Carina a su travailler à distance avec efficacité (nous vivons en province). Confiance totale et résultat impeccable.",
    date: "Février 2021",
    projectType: "Rénovation complète"
  },
  {
    id: 47,
    name: "Monique P.",
    role: "Rénovation salle de bain parentale",
    rating: 5,
    text: "Création d'une salle de bain parentale attenante à notre chambre. Carina a géré les travaux de plomberie et cloisonnement avec brio. Notre suite parentale est maintenant complète !",
    date: "Janvier 2021",
    projectType: "Salle de bain"
  },
  {
    id: 48,
    name: "Hervé D.",
    role: "Rénovation appartement DPE",
    rating: 4,
    text: "Rénovation axée sur l'amélioration du DPE : isolation, fenêtres, VMC... Carina a coordonné les différents corps de métier. Quelques retards mais résultat satisfaisant et DPE amélioré.",
    date: "Décembre 2020",
    projectType: "Rénovation énergétique"
  },
  {
    id: 49,
    name: "Jacqueline B.",
    role: "Rénovation dressing sur mesure",
    rating: 5,
    text: "Création d'un dressing sur mesure dans notre chambre. Carina a fait intervenir un menuisier talentueux qui a su exploiter chaque recoin. Penderies, tiroirs, étagères... Tout y est !",
    date: "Novembre 2020",
    projectType: "Dressing"
  },
  {
    id: 50,
    name: "Yves M.",
    role: "Rénovation salle de bain avec baignoire îlot",
    rating: 5,
    text: "Installation d'une baignoire îlot, le rêve de ma femme ! Carina a géré les contraintes techniques (renfort de plancher, plomberie). Le résultat est spectaculaire. Merci !",
    date: "Octobre 2020",
    projectType: "Salle de bain"
  },
  {
    id: 51,
    name: "Françoise C.",
    role: "Rénovation appartement Charenton",
    rating: 5,
    text: "Rénovation complète de notre appartement à Charenton. Malgré la distance (nous vivons à l'étranger), Carina a géré le chantier avec des comptes-rendus réguliers. Parfait du début à la fin.",
    date: "Septembre 2020",
    projectType: "Rénovation complète"
  },
  {
    id: 52,
    name: "Georges L.",
    role: "Rénovation cuisine et salle à manger",
    rating: 5,
    text: "Ouverture entre cuisine et salle à manger pour créer un grand espace de vie. Carina a parfaitement géré l'ouverture du mur et l'harmonisation des deux espaces. Transformation réussie !",
    date: "Août 2020",
    projectType: "Cuisine"
  },
  {
    id: 53,
    name: "Hélène R.",
    role: "Rénovation première salle de bain",
    rating: 5,
    text: "Notre première rénovation de salle de bain avec Carina. Elle nous a rassurés et guidés tout au long du projet. Trois ans après, la salle de bain est toujours aussi belle. On recommande !",
    date: "Juillet 2020",
    projectType: "Salle de bain"
  }
];

// Statistiques des avis
export const testimonialStats = {
  totalReviews: 53,
  averageRating: 4.5,
  platform: "Houzz",
  skills: 4.5,
  communication: 4.4,
  valueForMoney: 4.4
};
