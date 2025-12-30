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
        answer: "Notre approche repose sur trois piliers : un interlocuteur unique tout au long du projet, une équipe d'artisans qualifiés et fidèles, et un suivi rigoureux de chaque chantier. Nous privilégions la qualité à la quantité, avec un nombre limité de projets simultanés pour garantir notre disponibilité."
      },
      {
        question: "Quelles garanties offrez-vous ?",
        answer: "Nous disposons d'une assurance responsabilité civile professionnelle et d'une garantie décennale. La garantie de parfait achèvement couvre tous les désordres pendant 1 an, la garantie biennale couvre les équipements pendant 2 ans, et la garantie décennale couvre les gros ouvrages pendant 10 ans."
      },
      {
        question: "Proposez-vous un accompagnement déco et conseil ?",
        answer: "Oui, nous travaillons en collaboration avec notre partenaire décorateur Qualidéco pour vous accompagner dans vos choix de matériaux, couleurs et aménagements. Ce service personnalisé vous aide à créer un intérieur qui vous ressemble tout en optimisant votre budget."
      },
      {
        question: "Comment assurez-vous la qualité des travaux ?",
        answer: "Chaque chantier est supervisé par notre équipe avec des points d'étape réguliers. Nous travaillons avec des artisans fidèles depuis des années, formés à nos exigences de qualité. Un contrôle final est effectué avant la réception des travaux."
      }
    ]
  },
  {
    title: "Déroulement de votre projet",
    items: [
      {
        question: "Comment se déroule une demande de devis ?",
        answer: "Après réception de votre demande, nous vous contactons pour organiser une visite technique gratuite sur le lieu des travaux. Suite à cette visite, nous établissons un devis détaillé sous 5 à 7 jours ouvrés. Le devis est valable 30 jours."
      },
      {
        question: "Quelle est la durée moyenne d'un chantier ?",
        answer: "La durée dépend de l'ampleur des travaux. Une rénovation de salle de bain prend généralement 2 à 3 semaines. Une rénovation complète d'appartement peut durer de 2 à 4 mois selon la surface et la complexité du projet."
      },
      {
        question: "Comment se passe le suivi du chantier ?",
        answer: "Vous bénéficiez d'un interlocuteur unique tout au long du projet. Nous organisons des points réguliers pour vous tenir informé de l'avancement et validons ensemble chaque étape clé. Vous pouvez nous joindre facilement par téléphone ou email."
      }
    ]
  },
  {
    title: "Nos prestations",
    items: [
      {
        question: "Quels types de travaux réalisez-vous ?",
        answer: "Nous réalisons tous types de rénovation d'intérieur : rénovation complète d'appartements, salles de bain, cuisines, ouverture de murs porteurs, pose de parquet et carrelage, peinture et finitions, ainsi que l'aménagement et la décoration."
      },
      {
        question: "Quelles sont vos zones d'intervention ?",
        answer: "Nous intervenons principalement à Paris et dans les Hauts-de-Seine : Neuilly-sur-Seine, Boulogne-Billancourt, Levallois-Perret, Issy-les-Moulineaux, Saint-Cloud, et les communes environnantes."
      },
      {
        question: "Que se passe-t-il en cas de problème après les travaux ?",
        answer: "Nous assurons un suivi après chantier et restons joignables pour toute question. En cas de désordre, nos garanties vous protègent : parfait achèvement (1 an), biennale (2 ans) et décennale (10 ans)."
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
        <title>FAQ - Questions Fréquentes sur la Rénovation | Qualirénovation Paris</title>
        <meta name="description" content="Retrouvez les réponses aux questions les plus fréquentes sur nos services de rénovation d'intérieur à Paris et Île-de-France. Devis gratuit, garanties décennales." />
        <meta name="keywords" content="FAQ rénovation, questions rénovation appartement, devis rénovation Paris, garantie décennale, rénovation salle de bain questions" />
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
