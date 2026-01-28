import React from 'react';
import { cn } from '@/lib/utils';
import { SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  onSkip?: () => void;
  showSkip?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  hint,
  children,
  className,
  onSkip,
  showSkip = false,
}) => {
  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-foreground">
            {title}
          </h2>
          {showSkip && onSkip && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground text-xs sm:text-sm gap-1.5 self-start sm:self-auto"
            >
              <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Passer cette section</span>
              <span className="sm:hidden">Passer</span>
            </Button>
          )}
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-sm sm:text-lg">
            {subtitle}
          </p>
        )}
        {hint && (
          <p className="text-xs sm:text-sm text-muted-foreground/80 italic">
            💡 {hint}
          </p>
        )}
      </div>
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </div>
  );
};
