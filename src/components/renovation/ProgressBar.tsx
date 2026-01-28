import React from 'react';
import { useRenovationForm } from './RenovationFormContext';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

// Estimate time per step type (in minutes)
const STEP_TIMES = {
  base: 1, // Project info, conception, project type, room selection
  room: 2, // Per room module
  conditions: 1,
  isolation: 1,
  summary: 1,
};

export const ProgressBar: React.FC = () => {
  const { currentStep, totalSteps, formData } = useRenovationForm();
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  // Calculate estimated time remaining
  const calculateTimeEstimate = () => {
    const roomCount = formData.selectedRooms.length;
    const hasIsolation = formData.projectTypes.includes('dpe');
    
    // Total estimated time for whole form
    const baseStepsTime = 4 * STEP_TIMES.base; // 4 base steps
    const roomsTime = roomCount * STEP_TIMES.room;
    const conditionsTime = STEP_TIMES.conditions;
    const isolationTime = hasIsolation ? STEP_TIMES.isolation : 0;
    const summaryTime = STEP_TIMES.summary;
    
    const totalTime = baseStepsTime + roomsTime + conditionsTime + isolationTime + summaryTime;
    
    // Calculate remaining time based on current step
    const completedRatio = currentStep / totalSteps;
    const remainingTime = Math.ceil(totalTime * (1 - completedRatio));
    
    return remainingTime;
  };

  const remainingMinutes = calculateTimeEstimate();

  const formatTime = (minutes: number) => {
    if (minutes <= 1) return '~1 min';
    if (minutes < 5) return `~${minutes} min`;
    return `~${Math.ceil(minutes / 5) * 5} min`;
  };

  return (
    <div className="w-full space-y-1.5 sm:space-y-2">
      <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground">
        <span>Étape {currentStep + 1}/{totalSteps}</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(remainingMinutes)} restantes
          </span>
          <span className="text-xs sm:text-sm">{Math.round(progressPercent)}%</span>
        </div>
      </div>
      <Progress value={progressPercent} className="h-1.5 sm:h-2" />
    </div>
  );
};
