import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useRenovationForm } from './RenovationFormContext';

interface FormNavigationProps {
  onSubmit?: () => void;
  isLastStep?: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({ onSubmit, isLastStep = false }) => {
  const { currentStep, setCurrentStep, totalSteps, canProceed } = useRenovationForm();

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex justify-between items-center pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-border gap-3">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="gap-1.5 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Précédent</span>
        <span className="sm:hidden">Retour</span>
      </Button>

      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={!canProceed}
          className="gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-sm sm:text-base px-3 sm:px-4"
        >
          <span className="hidden sm:inline">Envoyer ma demande</span>
          <span className="sm:hidden">Envoyer</span>
          <Send className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="gap-1.5 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
        >
          <span>Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
