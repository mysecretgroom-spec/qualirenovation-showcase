import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/WhatsAppButton";

const CGV = () => {
  return (
    <>
      <Helmet>
        <title>Conditions Générales de Vente | Qualirénovation</title>
        <meta name="description" content="Conditions générales de vente de Qualirénovation - Rénovation d'intérieur à Paris et Île-de-France." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container-tight py-12">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>

          <h1 className="font-display text-4xl font-bold text-foreground mb-8">
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-sm text-muted-foreground mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 1 - Objet
              </h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre 
                QUALICONCEPT, société spécialisée dans la rénovation d'intérieur opérant sous la marque 
                commerciale QUALIRÉNOVATION (ci-après "le Prestataire"), et tout client particulier ou 
                professionnel (ci-après "le Client").
              </p>
              <p className="mt-4">
                Toute commande de prestations implique l'acceptation sans réserve des présentes CGV.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 2 - Prestations
              </h2>
              <p>
                Le Prestataire propose des services de rénovation d'intérieur comprenant notamment :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Rénovation complète d'appartements et maisons</li>
                <li>Rénovation de salles de bain et cuisines</li>
                <li>Ouverture et modification de murs porteurs</li>
                <li>Pose de parquet et carrelage</li>
                <li>Travaux de peinture et finitions</li>
                <li>Aménagement et décoration d'intérieur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 3 - Devis et commande
              </h2>
              <p>
                Tout projet débute par une visite technique gratuite sur le lieu des travaux. 
                Un devis détaillé est ensuite établi et transmis au Client. Ce devis est valable 30 jours 
                à compter de sa date d'émission.
              </p>
              <p className="mt-4">
                La commande est considérée comme ferme et définitive après signature du devis par le Client 
                et versement de l'acompte prévu. Le devis signé vaut contrat entre les parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 4 - Prix et paiement
              </h2>
              <p>
                Les prix sont indiqués en euros TTC (toutes taxes comprises). Le taux de TVA applicable 
                dépend de la nature des travaux et de l'ancienneté du bâtiment concerné.
              </p>
              <p className="mt-4">
                Sauf mention contraire, les modalités de paiement sont les suivantes :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>30% à la signature du devis (acompte)</li>
                <li>30% en cours de chantier</li>
                <li>40% à la réception des travaux</li>
              </ul>
              <p className="mt-4">
                Les paiements peuvent être effectués par virement bancaire ou chèque.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 5 - Délais d'exécution
              </h2>
              <p>
                Les délais d'exécution sont mentionnés dans le devis. Ils sont donnés à titre indicatif 
                et peuvent être modifiés en fonction de contraintes techniques imprévues, de conditions 
                météorologiques défavorables ou de modifications demandées par le Client.
              </p>
              <p className="mt-4">
                Tout retard lié à ces circonstances ne pourra donner lieu à des pénalités ou indemnités.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 6 - Réception des travaux
              </h2>
              <p>
                À l'achèvement des travaux, une réception est organisée en présence du Client et du 
                Prestataire. Un procès-verbal de réception est établi, mentionnant les éventuelles 
                réserves du Client.
              </p>
              <p className="mt-4">
                Le Prestataire s'engage à lever les réserves dans un délai raisonnable après la réception.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 7 - Garanties
              </h2>
              <p>
                Le Prestataire est titulaire d'une assurance responsabilité civile professionnelle et 
                d'une garantie décennale couvrant les travaux réalisés conformément à la législation en vigueur.
              </p>
              <p className="mt-4">
                Les garanties légales (garantie de parfait achèvement, garantie biennale, garantie décennale) 
                s'appliquent selon les conditions prévues par le Code civil.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 8 - Annulation et résiliation
              </h2>
              <p>
                En cas d'annulation de la commande par le Client après signature du devis, l'acompte 
                versé restera acquis au Prestataire à titre d'indemnité forfaitaire.
              </p>
              <p className="mt-4">
                Si l'annulation intervient après le début des travaux, le Client devra régler l'intégralité 
                des travaux déjà réalisés ainsi que les matériaux commandés.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 9 - Litiges
              </h2>
              <p>
                En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, 
                le litige sera soumis aux tribunaux compétents de Paris.
              </p>
              <p className="mt-4">
                Le Client peut également recourir à un médiateur de la consommation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 10 - Contact
              </h2>
              <p>
                Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
              </p>
              <ul className="list-none mt-4 space-y-2">
                <li><strong>Email :</strong> contact@qualirenovation.fr</li>
                <li><strong>Zone d'intervention :</strong> Paris et Île-de-France</li>
              </ul>
            </section>
          </div>
        </div>
        <WhatsAppButton />
      </div>
    </>
  );
};

export default CGV;
