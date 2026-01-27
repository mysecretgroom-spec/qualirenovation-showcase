import React from 'react';
import { useRenovationForm } from './RenovationFormContext';
import { Progress } from '@/components/ui/progress';

export const ProgressBar: React.FC = () => {
  const { currentStep, totalSteps } = useRenovationForm();
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Étape {currentStep + 1} sur {totalSteps}</span>
        <span>{Math.round(progressPercent)}% complété</span>
      </div>
      <Progress value={progressPercent} className="h-2" />
    </div>
  );
};
