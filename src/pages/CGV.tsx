import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/WhatsAppButton";

const CGV = () => {
  return (
    <>
      <Helmet>
        <title>Conditions Générales de Vente | QualiRénovation</title>
        <meta name="description" content="Conditions générales de vente de QualiRénovation - Entreprise de rénovation d'intérieur à Paris et Île-de-France." />
        <link rel="canonical" href="https://qualirenovation.fr/cgv" />
        <meta name="robots" content="noindex, follow" />
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
              QUALIRENOVATION by Qualiconcept - EURL au capital de 3 000,00 € | RCS PARIS - SIRET 85286728200034 - NAF 43.99C - TVA FR72852867282
            </p>

            {/* Article 1 - Objet */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 1 - Objet
              </h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre le Prestataire et le Client. Elles sont applicables à toutes les prestations de services et ventes de biens réalisées par le Prestataire pour le Client.
              </p>
            </section>

            {/* Article 2 - Acceptation des CGV */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 2 - Acceptation des Conditions Générales de Vente
              </h2>
              <p>
                Toute commande passée auprès du Prestataire implique l'acceptation sans réserve des présentes CGV par le Client. Les CGV prévalent sur tout autre document du Client, notamment sur ses propres conditions générales d'achat.
              </p>
            </section>

            {/* Article 3 - Commandes */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 3 - Commandes
              </h2>
              <p>
                Les commandes doivent être confirmées par écrit par le Client (bon de commande, devis signé, etc.). Le Prestataire se réserve le droit de refuser toute commande pour des motifs légitimes.
              </p>
            </section>

            {/* Article 4 - Prix */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 4 - Prix
              </h2>
              <p>
                Les prix des services et des biens sont indiqués en euros hors taxes (HT) et toutes taxes comprises (TTC). Les prix applicables sont ceux en vigueur au jour de la commande. Les frais de déplacement, d'hébergement, et autres frais annexes ne sont pas inclus dans le prix et seront facturés en sus.
              </p>
            </section>

            {/* Article 5 - Modalités de Paiement */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 5 - Modalités de Paiement
              </h2>
              <p>
                Le paiement des factures s'effectue selon les modalités convenues dans le devis ou le bon de commande.
              </p>
              <p className="mt-4">
                Les acomptes sont payables d'avance sur les prestations à réaliser après réception de la situation de chantier, dans un délai de 5 jours pour éviter de perdre du temps sur l'avancement du chantier.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Acompte 1</strong> - Au démarrage du chantier : <strong>30% TTC</strong></li>
                <li><strong>Acompte 2</strong> - Une fois l'acompte 1 consommé : <strong>20%</strong></li>
                <li><strong>Acompte 3</strong> - Une fois l'acompte 2 consommé : <strong>15%</strong></li>
                <li><strong>Acompte 4</strong> - Une fois l'acompte 3 consommé : <strong>15%</strong></li>
                <li><strong>Acompte 5</strong> - Une fois l'acompte 4 consommé : <strong>15%</strong></li>
                <li><strong>Paiement final</strong> - À la réception des travaux : <strong>5%</strong></li>
              </ul>
            </section>

            {/* Article 6 - Pénalités de Retard de paiement */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 6 - Pénalités de Retard de Paiement
              </h2>
              <p>
                En cas de retard de paiement, des pénalités de retard calculées au taux de trois fois le taux d'intérêt légal seront automatiquement et de plein droit acquises au Prestataire, sans formalité aucune ni mise en demeure préalable. Une indemnité forfaitaire pour frais de recouvrement de 40 euros sera également due.
              </p>
            </section>

            {/* Article 7 - Clause d'Annulation */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 7 - Clause d'Annulation
              </h2>
              
              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                Droit de Rétractation
              </h3>
              <p>
                Conformément à la législation en vigueur, le Client dispose d'un délai de <strong>14 jours calendaires</strong> à compter de la date de signature du devis de rénovation pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p className="mt-4">
                Pour exercer ce droit de rétractation, le Client doit notifier sa décision par écrit (lettre recommandée avec accusé de réception et courrier électronique à <a href="mailto:gestion@qualiconcept.fr" className="text-primary hover:underline">gestion@qualiconcept.fr</a>) à l'adresse suivante : <strong>6 Rue d'Armaillé, 75017 Paris</strong>.
              </p>
              <p className="mt-4">
                En cas de rétractation, la Société s'engage à rembourser tous les paiements reçus sans retard excessif et, en tout état de cause, au plus tard 30 jours à compter de la réception de la notification de rétractation. Le remboursement sera effectué en utilisant le même moyen de paiement que celui utilisé pour la transaction initiale, sauf accord différent avec le Client.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                Annulation Impossible dans les 3 Jours Précédant le Début des Travaux
              </h3>
              <p>
                Le Client reconnaît et accepte que toute annulation du devis dans les <strong>3 jours calendaires</strong> précédant la date prévue pour le début des travaux ne sera pas acceptée. Aucune demande d'annulation pendant cette période ne pourra être considérée valide.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                Annulation Avant le Début des Travaux
              </h3>
              <p>
                Si le Client souhaite annuler le devis après l'expiration du délai de rétractation de 14 jours mais avant le début des travaux, il devra notifier cette annulation par écrit (lettre recommandée avec accusé de réception ou courrier électronique). Cette annulation entraînera les pénalités suivantes :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Une pénalité équivalente à <strong>30%</strong> du montant total du devis pour les travaux déjà réalisés, y compris la main-d'œuvre et les matériaux utilisés.</li>
                <li>Une pénalité équivalente à <strong>20%</strong> du montant total du devis pour les matériaux spécifiques commandés pour le chantier, même s'ils n'ont pas été utilisés.</li>
              </ul>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                Annulation Après le Début des Travaux
              </h3>
              <p>
                Si le Client souhaite annuler le devis après le début des travaux, il devra notifier cette annulation par écrit (lettre recommandée avec accusé de réception ou courrier électronique). Cette annulation entraînera les pénalités contractuelles suivantes :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Paiement intégral des travaux déjà réalisés, y compris la main-d'œuvre et les matériaux utilisés.</li>
                <li>Paiement intégral des matériaux spécifiques commandés pour le chantier, même s'ils n'ont pas été utilisés.</li>
                <li>Une pénalité équivalente à <strong>15%</strong> du montant total du devis comme pénalité pour rupture anticipée du contrat.</li>
                <li>Frais de mobilisation et de démobilisation de l'équipement et des équipes : <strong>1 000 €</strong>.</li>
                <li>Compensation pour la perte de bénéfice attendue calculée sur la base des travaux non réalisés : <strong>15%</strong>.</li>
                <li>Indemnités compensatoires pour les frais de gestion et administratifs : <strong>500 €</strong>.</li>
              </ul>
            </section>

            {/* Article 8 - Travaux Complémentaires */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 8 - Travaux Complémentaires
              </h2>
              <p>
                Les travaux complémentaires, définis comme ceux non inclus dans le devis initial mais nécessaires à la solidité et à la conformité de l'ouvrage, doivent faire l'objet d'un avenant écrit au contrat initial, spécifiant les nouvelles modalités de livraison et leurs conséquences sur les délais.
              </p>
            </section>

            {/* Article 9 - Pénalités de Retard de Livraison */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 9 - Pénalités de Retard de Livraison
              </h2>
              <p>
                Conformément à la norme AFNOR NF P03-001 pour les marchés de travaux privés :
              </p>
              
              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                1. Pénalités de Retard
              </h3>
              <p>
                Les pénalités de retard de travaux sont dues automatiquement après <strong>30 jours de retard</strong>, sauf en cas de :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Intempéries</li>
                <li>Travaux supplémentaires</li>
                <li>Responsabilités du client (commande non validée ou livrée tardivement)</li>
                <li>Retards dus au syndic ou aux autorisations administratives</li>
                <li>Retards de livraison imputables aux fournisseurs des produits commandés</li>
              </ul>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                2. Norme AFNOR NF P03-001
              </h3>
              <p>
                Les modalités de calcul et d'application des pénalités de retard seront conformes à la norme AFNOR NF P03-001 pour les marchés de travaux privés, sauf dispositions contraires spécifiées dans le contrat.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                3. Cas Particuliers
              </h3>
              <p>
                Le délai de livraison peut être prolongé dans les situations suivantes :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>En cas de commande non validée ou livrée tardivement par le client.</li>
                <li>Lorsque notre travail dépend du travail d'un intervenant missionné par le client.</li>
                <li>En cas de retard imputable au syndic ou aux autorisations administratives nécessaires pour l'exécution des travaux.</li>
                <li>En cas de retard de livraison des produits commandés par nos fournisseurs.</li>
              </ul>
            </section>

            {/* Article 10 - Réserve de Propriété */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 10 - Réserve de Propriété
              </h2>
              <p>
                Conformément à l'article 2367 du Code civil français, le Prestataire conserve la propriété des biens et des prestations fournies jusqu'au règlement complet du solde par le Client. En cas de non-paiement, le Prestataire se réserve le droit de demander la restitution des biens fournis.
              </p>
              <p className="mt-4">
                Si les produits fournis ne peuvent être retournés au Prestataire et donc ne peuvent donner lieu à un remboursement, le Client en assume l'entière responsabilité. Le Client sera alors tenu de régler le matériel dans son intégralité. De plus, une majoration de <strong>20%</strong> (sur le montant HT) sera appliquée en dédommagement pour le Prestataire.
              </p>
              <p className="mt-4">
                En acceptant cette clause, le Client reconnaît avoir pris connaissance des conditions ci-dessus et s'engage à respecter les termes de paiement et les éventuelles conséquences en cas de non-respect de ces obligations.
              </p>
            </section>

            {/* Article 11 - Autorisation d'Utilisation des Images */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Article 11 - Autorisation d'Utilisation des Images et Renonciation aux Droits d'Image
              </h2>
              <p>
                Conformément à l'article 9 du Code civil français, qui stipule que "chacun a droit au respect de sa vie privée", le Client autorise par la présente la société Qualiconcept à prendre et à utiliser des photographies et des vidéos du chantier, incluant, sans s'y limiter, toutes les parties et tous les aspects du chantier.
              </p>
              <p className="mt-4">
                Cette autorisation comprend l'utilisation de ces images et vidéos à des fins de promotion, de marketing et de communication sur internet, y compris sur les sites web, les réseaux sociaux et autres plateformes en ligne de Qualiconcept.
              </p>
              <p className="mt-4">
                Le Client renonce à toute réclamation, poursuite ou demande de compensation relative aux droits d'image, y compris, mais sans s'y limiter, les réclamations pour violation du droit à la vie privée, diffamation, ou toute autre cause d'action liée à l'utilisation desdites images et vidéos par Qualiconcept. Le Client comprend et accepte que ces images et vidéos peuvent être utilisées indéfiniment et à la discrétion de Qualiconcept.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Contact
              </h2>
              <p>
                Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
              </p>
              <ul className="list-none mt-4 space-y-2">
                <li><strong>Société :</strong> QUALIRENOVATION by Qualiconcept</li>
                <li><strong>Adresse :</strong> 6 Rue d'Armaillé, 75017 Paris</li>
                <li><strong>Email :</strong> <a href="mailto:gestion@qualiconcept.fr" className="text-primary hover:underline">gestion@qualiconcept.fr</a></li>
                <li><strong>SIRET :</strong> 85286728200034</li>
                <li><strong>TVA :</strong> FR72852867282</li>
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