import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CarinIA from "@/components/CarinIA";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";
import Footer from "@/components/Footer";

const faqSections = [
  {
    title: "Pourquoi choisir QualiRénovation ?",
    items: [
      {
        question: "Pourquoi choisir QualiRénovation by QualiConcept ?",
        answer: `Parce qu'un chantier n'est ni un décor ni une promesse commerciale.
C'est une réalité technique, humaine et financière qui doit être anticipée, expliquée et pilotée.

Chez QualiRénovation, nous parlons chantier avant décoration, faisabilité avant projection, méthode avant effet.
Rénover, c'est transformer un lieu de vie : cela mérite du sérieux, de la clarté et du respect.`
      },
      {
        question: "Qu'est-ce qui vous différencie des autres entreprises de rénovation ?",
        answer: `Nous intégrons une maîtrise d'œuvre expérimentée au cœur de l'entreprise et collaborons avec un architecte d'intérieur partenaire.
Cette organisation évite les pertes d'information, les délais inutiles et les projets irréalisables.

Tout ce qui est dessiné est pensé pour être construit.
Quand la technique est maîtrisée, le résultat peut faire rêver — et nos chantiers sont régulièrement mis en avant par la presse.`
      },
      {
        question: "Quelles garanties offrez-vous ?",
        answer: `Tous nos chantiers sont couverts par une assurance décennale en cours de validité.
Un procès-verbal de réception est systématiquement signé en fin de travaux, déclenchant les garanties légales (parfait achèvement, biennale, décennale).

Grâce à une traçabilité complète (situations de chantier, factures, références produits), nous assurons un suivi fiable dans le temps, même plusieurs années après.`
      },
      {
        question: "Proposez-vous un accompagnement déco et conseil ?",
        answer: `Oui.
Nous travaillons avec Thierry, architecte d'intérieur partenaire, notamment pour les projets supérieurs à 35 m².

Son rôle :
• étude des volumes et circulations
• conception de plans précis et exploitables
• anticipation des contraintes techniques
• cohérence entre esthétique et exécution

L'étude de faisabilité et le devis sont gratuits.`,
        link: {
          url: "https://www.instagram.com/p/DMqS40QscJl/",
          label: "Découvrez notre approche en vidéo"
        }
      }
    ]
  },
  {
    title: "Déroulement de votre projet – Phase devis",
    items: [
      {
        question: "Comment se déroule la phase devis chez QualiRénovation ?",
        answer: `La phase devis est une étape déterminante.
Elle conditionne la fiabilité du budget et la sérénité du chantier.

Nous ne chiffrons jamais à l'aveugle.

1. Premier échange (téléphone ou visio)
Compréhension de votre projet, de vos attentes et de vos contraintes.

2. Visite technique sur site
Analyse de l'existant, des accès, de la copropriété et des contraintes réelles.

3. Étude de faisabilité gratuite
Vérification de la faisabilité technique, réglementaire et budgétaire.

4. Au-delà de 35 m² : plans indispensables
Pour les projets de plus de 35 m², et a fortiori pour une rénovation complète, il est impossible d'établir un devis sérieux sans plans précis.
Les volumes évoluent, les réseaux changent, rien n'est figé.

Thierry établit d'abord son devis de mission après une première visite.
Si vous acceptez de collaborer avec lui, je vous présente une fourchette de prix travaux lors du rendez-vous.
Si cette fourchette vous convient, nous poursuivons et j'établis ensuite mon devis détaillé, une fois les plans suffisamment précis.

5. Validation des choix indispensables avant chiffrage
Sanitaires, robinetteries, éléments techniques sont validés en amont.

6. Devis détaillé poste par poste
Basé sur les plans, les choix arrêtés et la réalité du chantier.

7. CGV et attestation de TVA intégrées
Ces documents doivent être lus, acceptés et signés.

8. Signature du devis = engagement contractuel

Un devis précis peut sembler long.
Un devis imprécis coûte toujours plus cher.`
      },
      {
        question: "Pourquoi prévoir un budget plans dès l'achat ?",
        answer: `Dans le cadre d'une rénovation lourde, penser que l'on peut se passer d'un architecte est souvent une fausse économie.
Sauf à avoir le temps, les connaissances et la capacité de produire toutes les pièces nécessaires.

Grâce au volume de chantiers réalisés avec Thierry, vous bénéficiez d'un tarif préférentiel, plus accessible et très efficace.

Et n'oublions pas : le temps, c'est aussi de l'argent.`
      }
    ]
  },
  {
    title: "Nos prestations",
    items: [
      {
        question: "Quels types de travaux réalisez-vous ?",
        answer: `Nous réalisons l'ensemble des travaux de rénovation intérieure, notamment les lots suivants :

• Gros œuvre & structure
• Cloisons, doublages & isolation
• Plomberie & sanitaires
• Chauffage & ventilation
• Électricité
• Menuiseries intérieures & agencements
• Cuisines
• Salles de bain & WC
• Peinture & finitions
• Revêtements de sols
• Staff, moulures & éléments décoratifs
• Verrières & ouvrages métalliques
• Plans de travail en pierre (prestations négociées, réglées directement au prestataire)
• Pose de fenêtres par entreprise RGE (prestations négociées, réglées directement au prestataire)
• Assistance après sinistre
• Conception, pilotage & suivi`
      },
      {
        question: "Quelles sont vos zones d'intervention ?",
        answer: "Nous intervenons principalement à Paris et en Île-de-France."
      }
    ]
  },
  {
    title: "Le rôle du maître d'œuvre",
    items: [
      {
        question: "Pourquoi faire appel à un maître d'œuvre ?",
        answer: `Le maître d'œuvre est le chef d'orchestre du chantier : coordination des entreprises, contrôle qualité, respect du budget et du planning.

Chez QualiRénovation, la maîtrise d'œuvre est intégrée et incluse dans le devis.`,
        link: {
          url: "https://www.houzz.fr/magazine/pourquoi-est-il-judicieux-de-faire-appel-a-un-maitre-d-oeuvre-stsetivw-vs~87724005",
          label: "En savoir plus sur le rôle du maître d'œuvre"
        }
      },
      {
        question: "Qui paie le maître d'œuvre ?",
        answer: `La maîtrise d'œuvre est incluse dans notre devis global.
Aucune facturation séparée.`
      }
    ]
  },
  {
    title: "Suivi de chantier",
    items: [
      {
        question: "Comment se passe le suivi du chantier ?",
        answer: `Le suivi est quotidien :
photos, vidéos, messages via WhatsApp, réunions sur site.

Même à distance, vous suivez votre chantier en temps réel, sans stress inutile.`
      }
    ]
  },
  {
    title: "Budget, paiements et commandes",
    items: [
      {
        question: "Comment garantissez-vous le respect du budget ?",
        answer: `• Devis précis dès le départ
• Aucune plus-value sans accord écrit
• Situation de chantier à chaque appel de fonds`
      },
      {
        question: "Comment se déroulent les appels de fonds ?",
        answer: `Échéancier : 35 % / 30 % / 25 % / 15 % / 5 % à la réception.
Les appels sont anticipés.
Le règlement suivant intervient sous 48 heures, afin d'assurer la continuité du chantier.`
      },
      {
        question: "Comment sont traités les achats de marchandises ?",
        answer: `• Majoration de 10 % sur les marchandises
• Frais de livraison, manutention, nacelles intégrés dès le devis initial
• Aucune commande hors devis`
      }
    ]
  },
  {
    title: "Syndic et voisinage",
    items: [
      {
        question: "Gérez-vous les relations avec le syndic ?",
        answer: `Nous vous accompagnons pour les démarches : avis de travaux, attestations, planning.
Le respect des parties communes et du voisinage est une priorité.`
      }
    ]
  },
  {
    title: "Réception de chantier",
    items: [
      {
        question: "Comment se déroule la réception ?",
        answer: `• Pré-réception environ 15 jours avant la fin
• Liste des éléments à fournir 1 mois à l'avance

Le jour J, le PV de réception est signé, les garanties sont déclenchées…
et idéalement, on sort le champagne 🍾
La réception n'est pas un ring.`
      }
    ]
  },
  {
    title: "Après travaux et litiges",
    items: [
      {
        question: "Que se passe-t-il après les travaux ?",
        answer: `Nous restons disponibles.
Un chantier bien suivi ne s'arrête pas à la remise des clés.`
      },
      {
        question: "Et en cas de désaccord ?",
        answer: `Je privilégie toujours le dialogue, le respect et la transparence.
Pas d'ego, pas de rapport de force : nous avançons ensemble pour la réussite du projet.`
      }
    ]
  }
];

const allFaqItems = faqSections.flatMap(section => section.items);

const FAQPage = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToSection = (index: string) => {
    const i = parseInt(index);
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
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
        <title>FAQ Rénovation Paris | Maître d'œuvre, Devis, Suivi Chantier | QualiRénovation</title>
        <meta name="description" content="Questions fréquentes sur la rénovation à Paris : phase devis, rôle du maître d'œuvre, garanties, suivi de chantier, budget et réception. Entreprise de rénovation et maîtrise d'œuvre." />
        <meta name="keywords" content="FAQ rénovation Paris, maître d'œuvre rénovation, suivi chantier, phase devis rénovation, garantie décennale, budget rénovation, réception chantier, QualiRénovation" />
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
              FAQ – Rénovation à Paris
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              QualiRénovation by QualiConcept
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Entreprise de rénovation – Maître d'œuvre – Suivi de chantier
            </p>
          </div>

          {/* Menu déroulant de navigation */}
          <div className="max-w-3xl mx-auto mb-10">
            <Select onValueChange={scrollToSection}>
              <SelectTrigger className="w-full bg-card border-border text-foreground font-display font-semibold">
                <SelectValue placeholder="Accéder à une section…" />
              </SelectTrigger>
              <SelectContent>
                {faqSections.map((section, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex} ref={el => { sectionRefs.current[sectionIndex] = el; }} className="mb-12 scroll-mt-24">
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
                        <div className="whitespace-pre-line">{item.answer}</div>
                        {item.link && (
                          <a
                            href={item.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-dark font-medium transition-colors"
                          >
                            {item.link.label}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            {/* Conclusion */}
            <div className="mt-16 p-8 bg-card border border-border rounded-lg text-center">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Rénover, ce n'est pas seulement transformer un espace.<br />
                C'est assumer des choix, une méthode et une responsabilité.
              </p>
              <p className="text-foreground font-medium mb-6">
                Si notre philosophie vous parle, prenez rendez-vous pour votre projet et échangeons ensemble.
              </p>
              <p className="text-muted-foreground italic text-sm">
                Un chantier réussi n'est pas celui qui impressionne le jour J,<br />
                mais celui qui reste juste, solide et serein dans le temps.
              </p>
            </div>
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
        <Footer />
        <CarinIA />
        <WhatsAppButton />
        <CallButton />
      </div>
    </>
  );
};

export default FAQPage;
