import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PolitiqueConfidentialite = () => {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité | Qualirénovation</title>
        <meta name="description" content="Politique de confidentialité et protection des données personnelles de Qualirénovation." />
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
            Politique de Confidentialité
          </h1>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-sm text-muted-foreground mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                1. Introduction
              </h2>
              <p>
                QUALICONCEPT, opérant sous la marque commerciale QUALIRÉNOVATION, s'engage à protéger 
                la vie privée des utilisateurs de son site internet et de ses services. La présente 
                politique de confidentialité décrit comment nous collectons, utilisons et protégeons 
                vos données personnelles conformément au Règlement Général sur la Protection des 
                Données (RGPD).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                2. Responsable du traitement
              </h2>
              <p>
                Le responsable du traitement des données personnelles est :
              </p>
              <ul className="list-none mt-4 space-y-2">
                <li><strong>Société :</strong> QUALICONCEPT</li>
                <li><strong>Marque commerciale :</strong> QUALIRÉNOVATION</li>
                <li><strong>Email :</strong> contact@qualirenovation.fr</li>
                <li><strong>Zone d'activité :</strong> Paris et Île-de-France</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                3. Données collectées
              </h2>
              <p>
                Nous collectons les données personnelles suivantes :
              </p>
              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                3.1 Données fournies directement
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Ville du projet</li>
                <li>Description du projet de rénovation</li>
                <li>Budget estimé et délais souhaités</li>
              </ul>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                3.2 Données collectées automatiquement
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adresse IP</li>
                <li>Type de navigateur et système d'exploitation</li>
                <li>Pages visitées et durée de visite</li>
                <li>Source de référencement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                4. Finalités du traitement
              </h2>
              <p>
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Répondre à vos demandes de devis</li>
                <li>Vous contacter concernant votre projet de rénovation</li>
                <li>Établir et suivre les contrats de prestation</li>
                <li>Améliorer nos services et notre site internet</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                5. Base légale du traitement
              </h2>
              <p>
                Le traitement de vos données repose sur :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>L'exécution contractuelle :</strong> pour gérer vos demandes de devis et l'exécution des travaux</li>
                <li><strong>L'intérêt légitime :</strong> pour améliorer nos services et notre communication</li>
                <li><strong>L'obligation légale :</strong> pour respecter nos obligations comptables et fiscales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                6. Durée de conservation
              </h2>
              <p>
                Vos données personnelles sont conservées :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Demandes de devis :</strong> 3 ans à compter de la demande</li>
                <li><strong>Données contractuelles :</strong> 10 ans après la fin du contrat (obligation légale)</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                7. Partage des données
              </h2>
              <p>
                Vos données personnelles peuvent être partagées avec :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Nos sous-traitants et partenaires techniques pour l'exécution des travaux</li>
                <li>Nos prestataires d'hébergement et de services informatiques</li>
                <li>Les autorités compétentes en cas d'obligation légale</li>
              </ul>
              <p className="mt-4">
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                8. Sécurité des données
              </h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                protéger vos données personnelles contre tout accès non autorisé, modification, 
                divulgation ou destruction :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Chiffrement des données en transit (HTTPS)</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Sauvegarde régulière des données</li>
                <li>Hébergement sécurisé</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                9. Vos droits
              </h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : <strong>contact@qualirenovation.fr</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                10. Cookies
              </h2>
              <p>
                Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                Les cookies sont de petits fichiers texte stockés sur votre appareil.
              </p>
              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
                Types de cookies utilisés
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
                <li><strong>Cookies analytiques :</strong> pour comprendre l'utilisation du site</li>
              </ul>
              <p className="mt-4">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                11. Modifications
              </h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications entreront en vigueur dès leur publication sur cette page. 
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                12. Contact et réclamation
              </h2>
              <p>
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
              </p>
              <ul className="list-none mt-4 space-y-2">
                <li><strong>Email :</strong> contact@qualirenovation.fr</li>
              </ul>
              <p className="mt-4">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation 
                auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) : 
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline ml-1">
                  www.cnil.fr
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PolitiqueConfidentialite;
