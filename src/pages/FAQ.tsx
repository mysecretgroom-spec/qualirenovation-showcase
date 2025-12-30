import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CarinIA from "@/components/CarinIA";

const faqSections = [
  {
    title: "Pourquoi choisir Qualirénovation ?",
    items: [
      {
        question: "Qu'est-ce qui vous différencie des autres entreprises de rénovation ?",
        answer: "Chez QualiRénovation by QualiConcept, nous allions maîtrise technique, sens du détail et accompagnement personnalisé. Chaque chantier est piloté comme un projet sur mesure : plans précis, anticipation des contraintes, communication transparente et coordination rigoureuse de tous les corps de métier. Notre objectif est simple : zéro surprise et un résultat parfaitement exécuté."
      },
      {
        question: "Quelles garanties offrez-vous ?",
        answer: "Nous travaillons exclusivement avec des artisans et entreprises disposant des assurances obligatoires : décennale, responsabilité civile et assurances spécifiques à chaque métier. En tant que maître d'œuvre, nous garantissons un suivi rigoureux, la conformité aux normes, la transparence des étapes et la sécurisation de votre projet du début à la fin."
      },
      {
        question: "Proposez-vous un accompagnement déco et conseil ?",
        answer: "Oui. Nous proposons un accompagnement complet : choix des matériaux, couleurs, optimisation des espaces, éclairages, menuiseries, ambiance globale… Nous travaillons également avec un architecte d'intérieur afin de vous fournir des plans 3D et un conseil esthétique cohérent avec votre projet."
      },
      {
        question: "Comment assurez-vous la qualité des travaux ?",
        answer: "Nous ne laissons rien au hasard : sélection d'équipes qualifiées, plans détaillés, suivi quasi quotidien du chantier, contrôles systématiques à chaque étape (structure, plomberie, électricité, étanchéité, finitions) et utilisation de matériaux fiables et conformes aux normes. Notre méthode garantit une exécution dans les règles de l'art et un résultat durable."
      }
    ]
  },
  {
    title: "Déroulement de votre projet",
    items: [
      {
        question: "Comment se déroule une demande de devis ?",
        answer: "La demande commence par une prise de contact et un échange sur votre projet. Nous organisons ensuite une visite sur place pour relever les mesures, analyser les contraintes techniques et comprendre vos besoins. À partir de ces éléments, nous établissons un devis détaillé, clair et transparent, comprenant les travaux, les matériaux et les éventuelles options. Chaque poste est expliqué afin que vous puissiez valider votre projet sereinement."
      },
      {
        question: "Quelle est la durée moyenne d'un chantier ?",
        answer: "La durée dépend naturellement de la nature des travaux. Une rénovation partielle peut durer de 2 à 6 semaines ; une rénovation complète, entre 6 et 12 semaines en moyenne. Nous établissons un planning prévisionnel avant le démarrage et nous nous engageons à le respecter autant que possible, tout en vous tenant informé si une adaptation est nécessaire."
      },
      {
        question: "Comment se passe le suivi du chantier ?",
        answer: "Le suivi est assuré quotidiennement : visite du chantier, coordination des équipes, vérification des étapes clés, résolution des imprévus et contrôle des finitions. Vous recevez des points réguliers, photos, avancées et validations nécessaires. Notre rôle est d'assurer une exécution conforme aux normes, au planning et au projet validé, tout en vous offrant une totale tranquillité d'esprit."
      }
    ]
  },
  {
    title: "Nos prestations",
    items: [
      {
        question: "Quels types de travaux réalisez-vous ?",
        answer: "Nous réalisons tous types de travaux de rénovation : rénovation complète d'appartements et de maisons, création et optimisation d'espaces, salle de bain, cuisine, menuiseries sur mesure, électricité, plomberie, peinture, sols, isolation, faux plafonds, modifications structurelles avec validation BET, et accompagnement déco. Nous gérons l'ensemble du projet du début à la fin pour garantir cohérence, qualité et tranquillité d'esprit."
      },
      {
        question: "Quelles sont vos zones d'intervention ?",
        answer: "Nous intervenons principalement à Paris et dans toute l'Île-de-France : Paris intramuros, Hauts-de-Seine, Val-de-Marne, Seine-Saint-Denis, et communes limitrophes. Pour des projets spécifiques, nous pouvons étudier des interventions au-delà de cette zone."
      },
      {
        question: "Que se passe-t-il en cas de problème après les travaux ?",
        answer: "En cas de problème, vous n'êtes jamais seul. Nous intervenons rapidement pour diagnostiquer, corriger et assurer la bonne tenue de l'ouvrage. Chaque artisan dispose de ses assurances (décennale, RC), et nous restons votre interlocuteur unique pour coordonner les reprises si nécessaire. L'objectif : une résolution simple, rapide et transparente."
      }
    ]
  },
  {
    title: "Le rôle du maître d'œuvre",
    items: [
      {
        question: "Pourquoi faire appel à un maître d'œuvre pour ma rénovation ?",
        answer: "Faire appel à un maître d'œuvre, c'est vous assurer un chantier cadré, organisé et parfaitement exécuté. Nous anticipons les contraintes, coordonnons tous les artisans, vérifions la conformité aux normes et gérons les imprévus pour vous éviter le stress. Vous bénéficiez d'un interlocuteur unique, d'un suivi rigoureux et d'un résultat maîtrisé du début à la fin."
      },
      {
        question: "Comment choisissez-vous les artisans et entreprises qui interviennent sur le chantier ?",
        answer: "Nous travaillons uniquement avec des artisans expérimentés, fiables et assurés (décennale et RC). Chaque partenaire est sélectionné pour son sérieux, la qualité constante de son travail et sa capacité à respecter les délais. C'est grâce à cette exigence que nous pouvons garantir une exécution dans les règles de l'art."
      },
      {
        question: "Comment garantissez-vous le respect du budget ?",
        answer: "Le budget est établi en amont, poste par poste. Nous le suivons tout au long du chantier, validons chaque dépense avec vous et anticipons les éventuels ajustements. Aucune surprise : toutes les décisions sont transparentes et expliquées. L'objectif est simple : respecter votre budget et optimiser chaque euro investi."
      },
      {
        question: "Est-ce que vous vous occupez des autorisations, des relations avec le syndic et du BET ?",
        answer: "Oui. Nous gérons toutes les démarches nécessaires : demandes auprès du syndic, autorisations de travaux, consultations du BET en cas de mur porteur ou d'intervention structurelle, et conformité aux règles de l'immeuble. Vous êtes déchargé de toute la partie administrative et technique, tout en étant sûr que tout est fait dans les règles."
      },
      {
        question: "Comment assurez-vous la coordination entre les différents corps de métier ?",
        answer: "Nous planifions et orchestrons l'intervention de chaque artisan : plombier, électricien, plaquiste, peintre, menuisier, carreleur… Chaque étape est organisée pour éviter les temps morts et garantir une progression fluide du chantier. Le maître d'œuvre vérifie, valide et ajuste au fur et à mesure, ce qui assure une réalisation harmonieuse et conforme."
      }
    ]
  },
  {
    title: "Préparation et suivi du chantier",
    items: [
      {
        question: "Travaillez-vous avec des plans 3D et des visuels avant travaux ?",
        answer: "Oui, nous proposons des plans 3D, des vues réalistes et des plans techniques détaillés. Cela permet de visualiser votre futur intérieur, d'affiner les choix et de valider chaque élément avant lancement. C'est un outil essentiel pour garantir un projet cohérent et éviter les mauvaises surprises."
      },
      {
        question: "Comment gérez-vous les imprévus sur un chantier ?",
        answer: "Les imprévus font partie des travaux, mais notre rôle est de les anticiper et de les résoudre rapidement. Dès qu'un point technique se présente, nous analysons, proposons une solution, validons avec vous et mettons en œuvre sans retarder le planning. Vous êtes informé, mais jamais laissé dans la gestion du problème."
      },
      {
        question: "Est-ce que vous proposez un planning détaillé avant le début des travaux ?",
        answer: "Oui. Avant le démarrage, nous établissons un planning précis avec l'ordre des interventions, les délais de chaque corps d'état et les étapes clés. Cela permet d'avoir une vision claire du déroulement du chantier et d'avancer dans un cadre structuré et maîtrisé."
      },
      {
        question: "Quel est votre processus de réception de chantier ?",
        answer: "À la fin des travaux, nous effectuons une visite complète avec vous : contrôle des finitions, vérification des installations, tests des équipements, et liste des éventuelles petites reprises. Une fois ces points validés, la réception est prononcée. C'est une étape essentielle pour garantir un résultat impeccable."
      },
      {
        question: "Pouvez-vous intervenir si le projet comprend des contraintes techniques complexes ?",
        answer: "Oui. Nous avons l'habitude de gérer des projets avec contraintes : murs porteurs, ventilation, étanchéité, isolation, réseaux, salles de bain techniques, optimisation d'espaces compliqués… Grâce à notre expertise et à nos partenaires (BET, artisans spécialisés), chaque problématique est traitée avec méthode et sécurité."
      }
    ]
  }
];

const allFaqItems = faqSections.flatMap(section => section.items);

const FAQPage = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>FAQ Rénovation Paris | Maître d'œuvre, Devis, Suivi Chantier | Qualirénovation</title>
        <meta name="description" content="20 questions sur la rénovation à Paris : rôle du maître d'œuvre, garanties décennales, suivi de chantier, plans 3D, coordination artisans et respect du budget. Devis gratuit." />
        <meta name="keywords" content="FAQ rénovation Paris, maître d'œuvre rénovation, suivi chantier, coordination artisans, plans 3D rénovation, devis rénovation appartement, garantie décennale, BET mur porteur, réception chantier, budget rénovation Île-de-France" />
        <link rel="canonical" href="https://qualirenovation.fr/faq" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container-tight py-12">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>

          <div className="text-center mb-12">
            <span className="text-gold font-medium text-sm uppercase tracking-wider">
              Questions fréquentes
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Tout savoir sur nos services
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Retrouvez les réponses aux questions les plus courantes concernant nos prestations de rénovation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {section.items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`section-${sectionIndex}-item-${index}`}
                    className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-gold hover:no-underline py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Vous avez une autre question ?
            </p>
            <Link to="/#contact">
              <Button className="bg-gold hover:bg-gold-dark text-primary">
                Contactez-nous
              </Button>
            </Link>
          </div>
        </div>
        <CarinIA />
      </div>
    </>
  );
};

export default FAQPage;
