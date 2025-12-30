import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Quelles sont vos zones d'intervention ?",
    answer: "Nous intervenons principalement à Paris et dans les Hauts-de-Seine : Neuilly-sur-Seine, Boulogne-Billancourt, Levallois-Perret, Issy-les-Moulineaux, Saint-Cloud, et les communes environnantes."
  },
  {
    question: "Comment se déroule une demande de devis ?",
    answer: "Après réception de votre demande, nous vous contactons pour organiser une visite technique gratuite sur le lieu des travaux. Suite à cette visite, nous établissons un devis détaillé sous 5 à 7 jours ouvrés. Le devis est valable 30 jours."
  },
  {
    question: "Quels types de travaux réalisez-vous ?",
    answer: "Nous réalisons tous types de rénovation d'intérieur : rénovation complète d'appartements, salles de bain, cuisines, ouverture de murs porteurs, pose de parquet et carrelage, peinture et finitions, ainsi que l'aménagement et la décoration."
  },
  {
    question: "Quelle est la durée moyenne d'un chantier ?",
    answer: "La durée dépend de l'ampleur des travaux. Une rénovation de salle de bain prend généralement 2 à 3 semaines. Une rénovation complète d'appartement peut durer de 2 à 4 mois selon la surface et la complexité du projet."
  },
  {
    question: "Êtes-vous assurés pour les travaux ?",
    answer: "Oui, nous disposons d'une assurance responsabilité civile professionnelle et d'une garantie décennale. Ces attestations peuvent vous être fournies sur demande avant le démarrage des travaux."
  },
  {
    question: "Comment sont planifiés les paiements ?",
    answer: "Sauf mention contraire, les paiements s'effectuent en trois fois : 30% à la signature du devis (acompte), 30% en cours de chantier, et 40% à la réception des travaux. Les paiements peuvent être effectués par virement ou chèque."
  },
  {
    question: "Proposez-vous un service de décoration et conseil ?",
    answer: "Oui, nous travaillons en collaboration avec notre partenaire décorateur Qualidéco pour vous accompagner dans vos choix de matériaux, couleurs et aménagements. Ce service peut être inclus ou proposé en option selon votre projet."
  },
  {
    question: "Que se passe-t-il en cas de problème après les travaux ?",
    answer: "Nous assurons un suivi après chantier. La garantie de parfait achèvement couvre tous les désordres pendant 1 an. La garantie biennale couvre les équipements pendant 2 ans. La garantie décennale couvre les gros ouvrages pendant 10 ans."
  }
];

const FAQ = () => {
  // Schema.org FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="container-tight">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Questions fréquentes
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Tout savoir sur nos services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus courantes concernant nos prestations de rénovation.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
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
      </div>
    </section>
  );
};

export default FAQ;
