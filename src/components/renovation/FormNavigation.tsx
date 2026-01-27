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
    <div className="flex justify-between items-center pt-8 border-t border-border">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Précédent
      </Button>

      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={!canProceed}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          Envoyer ma demande
          <Send className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="gap-2"
        >
          Suivant
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
