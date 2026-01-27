import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { Button } from '@/components/ui/button';
import { RoomType } from '../types';
import { CheckCircle, Building2, Home, Palette, Users, MapPin, Calendar, MessageSquare } from 'lucide-react';

const roomLabels: Record<RoomType, string> = {
  'cuisine': 'Cuisine',
  'salle-de-bain': 'Salle de bain',
  'wc': 'WC',
  'salon-sejour': 'Salon / Séjour',
  'chambre': 'Chambre',
  'entree-couloir': 'Entrée / Couloir',
  'dressing-rangements': 'Dressing / Rangements',
  'bureau': 'Bureau',
  'autre': 'Autre pièce',
};

interface StepSummaryProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const StepSummary: React.FC<StepSummaryProps> = ({ onSubmit, isSubmitting }) => {
  const { formData } = useRenovationForm();

  const projectTypeLabels: Record<string, string> = {
    'dpe': 'Amélioration DPE',
    'confort': 'Travaux de confort',
    'esthetique': 'Projet esthétique',
    'global': 'Rénovation globale',
    'valorisation': 'Valorisation immobilière',
    'remise-etat': 'Remise en état',
    'accompagnement': 'Accompagnement demandé',
  };

  const occupyLabels: Record<string, string> = {
    'oui': 'Oui',
    'non': 'Non',
    'partiellement': 'Partiellement',
  };

  const startDateLabels: Record<string, string> = {
    'asap': 'Le plus tôt possible',
    'from-date': `À partir du ${formData.startDateValue}`,
    'flexible': 'Flexible',
  };

  return (
    <FormSection
      title="Récapitulatif de votre projet"
      subtitle="Vérifiez les informations avant de nous envoyer votre demande"
    >
      {/* Project overview */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {formData.propertyType === 'appartement' ? (
              <Building2 className="w-5 h-5 text-primary" />
            ) : (
              <Home className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {formData.propertyType === 'appartement' ? 'Appartement' : 'Maison'} de {formData.surface} m²
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formData.city}
            </p>
          </div>
        </div>

        {/* Project types */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Type de projet
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.projectTypes.map((type) => (
              <span 
                key={type}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {projectTypeLabels[type] || type}
              </span>
            ))}
          </div>
        </div>

        {/* Rooms */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Pièces à rénover ({formData.selectedRooms.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.selectedRooms.map((room) => (
              <span 
                key={room.id}
                className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
              >
                {roomLabels[room.type]}
                {room.instanceNumber > 1 && ` #${room.instanceNumber}`}
              </span>
            ))}
          </div>
        </div>

        {/* Architect */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Architecte
          </h4>
          <p className="text-foreground">
            {formData.hasArchitect === 'oui' 
              ? 'Travaille déjà avec un architecte' 
              : formData.hasArchitect === 'en-reflexion'
              ? 'En cours de réflexion'
              : 'Pas d\'architecte'}
          </p>
        </div>

        {/* Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Occupation pendant travaux
            </h4>
            <p className="text-foreground">
              {occupyLabels[formData.occupyDuringWorks] || '-'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date de démarrage
            </h4>
            <p className="text-foreground">
              {startDateLabels[formData.startDate] || '-'}
            </p>
          </div>
        </div>

        {/* Isolation */}
        {formData.isolation.wantIsolation === 'oui' && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              🌡️ Isolation thermique
            </h4>
            <p className="text-foreground">
              Projet d'isolation inclus
            </p>
          </div>
        )}
      </div>

      {/* Reassurance message */}
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-foreground">
              <strong>Prochaine étape :</strong> Nous analysons votre projet et vous recontactons sous 48h 
              pour organiser une visite technique gratuite et sans engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="pt-6">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="w-full md:w-auto gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Envoi en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Envoyer ma demande de projet
            </>
          )}
        </Button>
      </div>
    </FormSection>
  );
};
