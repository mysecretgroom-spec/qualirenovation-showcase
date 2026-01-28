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
import { StepGlobalWorksSelection } from './steps/StepGlobalWorksSelection';
import { BathroomModule } from './modules/BathroomModule';
import { KitchenModule } from './modules/KitchenModule';
import { WCModule } from './modules/WCModule';
import { GlobalFlooringModule } from './modules/GlobalFlooringModule';
import { GlobalPaintingModule } from './modules/GlobalPaintingModule';
import { GlobalElectricityModule } from './modules/GlobalElectricityModule';
import { GlobalMouldingsModule } from './modules/GlobalMouldingsModule';
import { GlobalFurnitureModule } from './modules/GlobalFurnitureModule';
import { RoomType, initialBathroomData, initialKitchenData, initialWCData, initialGlobalFlooringData, initialGlobalPaintingData, initialGlobalElectricityData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useLeadContext } from '@/contexts/LeadContext';
import { supabase } from '@/integrations/supabase/client';
import { saveSimulationFilesToClient, extractRoomInspirationImages } from '@/hooks/useSimulationFileSaver';
import { uploadSimulationPDF } from '@/utils/generateSimulationPDF';

const roomLabels: Record<RoomType, string> = {
  'cuisine': 'Cuisine',
  'salle-de-bain': 'Salle de bain',
  'wc': 'WC',
};

// Helper function to format room name with proper numbering
const formatRoomName = (type: RoomType, instanceNumber: number, totalOfType: number): string => {
  const baseName = roomLabels[type];
  if (totalOfType > 1) {
    return `${baseName} ${instanceNumber}`;
  }
  return baseName;
};

interface RenovationFormContentProps {
  isAdminMode?: boolean;
}

const RenovationFormContent: React.FC<RenovationFormContentProps> = ({ isAdminMode = false }) => {
  const { formData, currentStep, setCurrentStep, updateFormData } = useRenovationForm();
  const { leadData, clearLeadData } = useLeadContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save simulation to database
      const simulationDataForDB = {
        quote_request_id: leadData?.id || null,
        client_id: leadData?.clientId || null, // Support admin mode with client_id
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

      const { error: dbError } = await supabase
        .from('renovation_simulations')
        .insert([simulationDataForDB]);

      if (dbError) {
        console.error('Error saving simulation:', dbError);
        throw dbError;
      }

      // Save uploaded files and generate PDF if we have a clientId (admin mode)
      if (leadData?.clientId) {
        const roomInspirationImages = extractRoomInspirationImages(formData.selectedRooms);
        
        // Save inspiration images, plan, and DPE
        const { savedCount } = await saveSimulationFilesToClient({
          clientId: leadData.clientId,
          inspirationImages: formData.inspirationImages,
          uploadedPlan: formData.uploadedPlan,
          uploadedDPE: formData.uploadedDPE,
          roomInspirationImages,
        });
        
        if (savedCount > 0) {
          console.log(`Saved ${savedCount} files to client documents`);
        }
        
        // Generate and upload comprehensive PDF
        const pdfResult = await uploadSimulationPDF(leadData.clientId, {
          leadData,
          formData,
          includeImages: true,
        });
        
        if (pdfResult.success) {
          console.log('PDF generated and saved to client documents');
        }
      }

      // Send email recap to team
      if (leadData) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-simulation-recap', {
            body: {
              leadData: {
                id: leadData.id,
                name: leadData.name,
                email: leadData.email,
                phone: leadData.phone,
                address: leadData.address,
                city: leadData.city,
                postalCode: leadData.postalCode,
                surface: leadData.surface,
                budget: leadData.budget,
                timeline: leadData.timeline,
                message: leadData.message,
              },
              simulationData: {
                propertyType: formData.propertyType,
                surface: formData.surface,
                constructionPeriod: formData.constructionPeriod,
                city: formData.city,
                hasArchitect: formData.hasArchitect,
                modifyLayout: formData.modifyLayout,
                projectTypes: formData.projectTypes,
                projectContexts: formData.projectContexts,
                hasDPE: formData.hasDPE,
                occupyDuringWorks: formData.occupyDuringWorks,
                constraints: formData.constraints,
                constraintDetails: formData.constraintDetails,
                startDate: formData.startDate,
                startDateValue: formData.startDateValue,
                endDateMax: formData.endDateMax,
                selectedRooms: formData.selectedRooms,
                isolation: formData.isolation,
              },
            },
          });

          if (emailError) {
            console.error('Error sending email recap:', emailError);
            // Don't throw - email is secondary, DB save succeeded
          }
        } catch (emailErr) {
          console.error('Error calling email function:', emailErr);
        }
      }
      
      toast({
        title: isAdminMode ? "Simulation enregistrée !" : "Demande envoyée !",
        description: isAdminMode 
          ? "La simulation a été sauvegardée dans la fiche client."
          : "Nous vous recontactons sous 48h pour organiser une visite technique.",
      });

      // Clear lead data and redirect
      clearLeadData();
      navigate(isAdminMode ? '/admin/clients' : '/');
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
        case 'wc':
          component = (
            <WCModule
              key={room.id}
              roomId={room.id}
              roomName={roomName}
              data={room.data.wcData || initialWCData}
              onSkip={handleSkipSection}
            />
          );
          break;
      }

      steps.push({ id: `room-${room.id}`, component, isSkippable: true });
    });

    // Add global works selection step after rooms
    steps.push({ id: 'global-works-selection', component: <StepGlobalWorksSelection /> });

    // Add global modules based on user selection
    if (formData.needsGlobalPainting === 'oui') {
      steps.push({
        id: 'global-painting',
        component: (
          <GlobalPaintingModule
            data={formData.globalPainting || initialGlobalPaintingData}
            onUpdate={(updates) => updateFormData('globalPainting', { ...formData.globalPainting, ...updates })}
            onSkip={handleSkipSection}
          />
        ),
        isSkippable: true,
      });
    }

    if (formData.needsGlobalFlooring === 'oui') {
      steps.push({
        id: 'global-flooring',
        component: (
          <GlobalFlooringModule
            data={formData.globalFlooring || initialGlobalFlooringData}
            onUpdate={(updates) => updateFormData('globalFlooring', { ...formData.globalFlooring, ...updates })}
            onSkip={handleSkipSection}
          />
        ),
        isSkippable: true,
      });
    }

    if (formData.needsGlobalElectricity === 'oui') {
      steps.push({
        id: 'global-electricity',
        component: (
          <GlobalElectricityModule
            data={formData.globalElectricity || initialGlobalElectricityData}
            onUpdate={(updates) => updateFormData('globalElectricity', { ...formData.globalElectricity, ...updates })}
            onSkip={handleSkipSection}
          />
        ),
        isSkippable: true,
      });
    }

    if (formData.needsGlobalMouldings === 'oui') {
      steps.push({
        id: 'global-mouldings',
        component: (
          <GlobalMouldingsModule
            data={formData.globalMouldings || { selectedRooms: [], intention: '', style: '' }}
            onUpdate={(updates) => updateFormData('globalMouldings', { ...formData.globalMouldings, ...updates })}
          />
        ),
        isSkippable: true,
      });
    }

    if (formData.needsGlobalFurniture === 'oui') {
      steps.push({
        id: 'global-furniture',
        component: (
          <GlobalFurnitureModule
            data={formData.globalFurniture || { selectedRooms: [], furnitureType: [], approach: '', description: '' }}
            onUpdate={(updates) => updateFormData('globalFurniture', { ...formData.globalFurniture, ...updates })}
          />
        ),
        isSkippable: true,
      });
    }

    // Add isolation step if DPE is selected
    if (formData.projectTypes.includes('dpe')) {
      steps.push({ id: 'isolation', component: <StepIsolation /> });
    }

    // Add conditions step
    steps.push({ id: 'conditions', component: <StepConditions /> });

    return steps;
  }, [formData.selectedRooms, formData.projectTypes, formData.needsGlobalPainting, formData.needsGlobalFlooring, formData.needsGlobalElectricity, formData.needsGlobalMouldings, formData.needsGlobalFurniture, formData.globalPainting, formData.globalFlooring, formData.globalElectricity, formData.globalMouldings, formData.globalFurniture]);

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
      <div className="container-tight py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        {/* Progress bar */}
        <div className="mb-4 sm:mb-8">
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

interface RenovationFormProps {
  isAdminMode?: boolean;
}

export const RenovationForm: React.FC<RenovationFormProps> = ({ isAdminMode = false }) => {
  return (
    <RenovationFormProvider>
      <RenovationFormContent isAdminMode={isAdminMode} />
    </RenovationFormProvider>
  );
};
