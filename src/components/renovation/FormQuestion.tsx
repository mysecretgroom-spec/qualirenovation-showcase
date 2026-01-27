import React from 'react';
import { cn } from '@/lib/utils';

interface FormQuestionProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormQuestion: React.FC<FormQuestionProps> = ({
  label,
  required = false,
  hint,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-1">
        <label className="block text-base font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {hint && (
          <p className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
      {children}
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
