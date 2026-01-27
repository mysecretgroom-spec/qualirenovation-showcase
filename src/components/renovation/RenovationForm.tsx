import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RenovationFormProvider, useRenovationForm } from './RenovationFormContext';
import { ProgressBar } from './ProgressBar';
import { FormNavigation } from './FormNavigation';
import { StepProjectInfo } from './steps/StepProjectInfo';
import { StepConception } from './steps/StepConception';
import { StepProjectType } from './steps/StepProjectType';
import { StepRoomSelection } from './steps/StepRoomSelection';
import { StepConditions } from './steps/StepConditions';
import { StepIsolation } from './steps/StepIsolation';
import { StepSummary } from './steps/StepSummary';
import { BathroomModule } from './modules/BathroomModule';
import { KitchenModule } from './modules/KitchenModule';
import { CustomFurnitureModule } from './modules/CustomFurnitureModule';
import { GenericRoomModule } from './modules/GenericRoomModule';
import { RoomType, initialBathroomData, initialKitchenData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useLeadContext } from '@/contexts/LeadContext';
import { supabase } from '@/integrations/supabase/client';

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

// Helper function to format room name with proper numbering
const formatRoomName = (type: RoomType, instanceNumber: number, totalOfType: number): string => {
  const baseName = roomLabels[type];
  if (totalOfType > 1) {
    return `${baseName} ${instanceNumber}`;
  }
  return baseName;
};

const RenovationFormContent: React.FC = () => {
  const { formData, currentStep, setCurrentStep } = useRenovationForm();
  const { leadData, clearLeadData } = useLeadContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save simulation to database
      const simulationData = {
        quote_request_id: leadData?.id || null,
        property_type: formData.propertyType || null,
        surface: formData.surface || null,
        construction_period: formData.constructionPeriod || null,
        city: formData.city || null,
        has_architect: formData.hasArchitect || null,
        modify_layout: formData.modifyLayout || null,
        project_types: formData.projectTypes,
        project_contexts: formData.projectContexts,
        has_dpe: formData.hasDPE || null,
        occupy_during_works: formData.occupyDuringWorks || null,
        constraints: formData.constraints,
        constraint_details: formData.constraintDetails || null,
        start_date: formData.startDate || null,
        start_date_value: formData.startDateValue || null,
        end_date_max: formData.endDateMax || null,
        selected_rooms: JSON.parse(JSON.stringify(formData.selectedRooms)),
        isolation_data: JSON.parse(JSON.stringify(formData.isolation)),
      };

      const { error } = await supabase
        .from('renovation_simulations')
        .insert([simulationData]);

      if (error) {
        console.error('Error saving simulation:', error);
        throw error;
      }
      
      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontactons sous 48h pour organiser une visite technique.",
      });

      // Clear lead data and redirect
      clearLeadData();
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip current section handler
  const handleSkipSection = () => {
    setCurrentStep(currentStep + 1);
  };

  // Calculate step configuration
  const stepConfig = useMemo(() => {
    const steps: { id: string; component: React.ReactNode; isSkippable?: boolean }[] = [
      { id: 'project-info', component: <StepProjectInfo /> },
      { id: 'conception', component: <StepConception /> },
      { id: 'project-type', component: <StepProjectType /> },
      { id: 'room-selection', component: <StepRoomSelection /> },
    ];

    // Add room modules
    formData.selectedRooms.forEach((room) => {
      // Count how many rooms of this type exist
      const totalOfType = formData.selectedRooms.filter(r => r.type === room.type).length;
      const roomName = formatRoomName(room.type, room.instanceNumber, totalOfType);
      
      let component: React.ReactNode;

      switch (room.type) {
        case 'salle-de-bain':
          component = (
            <BathroomModule
              key={room.id}
              roomId={room.id}
              roomName={roomName}
              data={room.data.bathroomData || initialBathroomData}
              onSkip={handleSkipSection}
            />
          );
          break;
        case 'cuisine':
          component = (
            <KitchenModule
              key={room.id}
              roomId={room.id}
              roomName={roomName}
              data={room.data.kitchenData || initialKitchenData}
              onSkip={handleSkipSection}
            />
          );
          break;
        case 'dressing-rangements':
          component = (
            <CustomFurnitureModule
              key={room.id}
              roomId={room.id}
              roomName={roomName}
              data={room.data.customFurnitureData || { furnitureType: [], approach: '', supportLevel: '' }}
              onSkip={handleSkipSection}
            />
          );
          break;
        default:
          component = (
            <GenericRoomModule
              key={room.id}
              roomId={room.id}
              roomName={roomName}
              instanceNumber={room.instanceNumber}
              data={room.data.genericRoomData || { description: '', workTypes: [], certaintyLevel: '' }}
              onSkip={handleSkipSection}
            />
          );
      }

      steps.push({ id: `room-${room.id}`, component, isSkippable: true });
    });

    // Add isolation step if DPE is selected
    if (formData.projectTypes.includes('dpe')) {
      steps.push({ id: 'isolation', component: <StepIsolation /> });
    }

    // Add conditions step
    steps.push({ id: 'conditions', component: <StepConditions /> });

    return steps;
  }, [formData.selectedRooms, formData.projectTypes]);

  // Add summary step separately since it needs the handleSubmit function
  const allSteps = useMemo(() => {
    return [
      ...stepConfig,
      { 
        id: 'summary', 
        component: <StepSummary onSubmit={handleSubmit} isSubmitting={isSubmitting} /> 
      }
    ];
  }, [stepConfig, isSubmitting]);

  const currentStepConfig = allSteps[currentStep];
  const isLastStep = currentStep === allSteps.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-8 md:py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <ProgressBar />
        </div>

        {/* Current step content */}
        <div className="animate-fade-in">
          {currentStepConfig?.component}
        </div>

        {/* Navigation - hide on summary step as it has its own button */}
        {!isLastStep && (
          <FormNavigation />
        )}
      </div>
    </div>
  );
};

export const RenovationForm: React.FC = () => {
  return (
    <RenovationFormProvider>
      <RenovationFormContent />
    </RenovationFormProvider>
  );
};
