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
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
            {title}
          </h2>
          {showSkip && onSkip && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground text-sm gap-1.5"
            >
              <SkipForward className="w-4 h-4" />
              Passer cette section
            </Button>
          )}
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-lg">
            {subtitle}
          </p>
        )}
        {hint && (
          <p className="text-sm text-muted-foreground/80 italic">
            💡 {hint}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};
