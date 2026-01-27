import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  hint,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          {title}
        </h2>
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
