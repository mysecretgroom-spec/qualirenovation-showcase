import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  emoji?: string;
  image?: string;
  title: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  selected,
  onClick,
  icon,
  emoji,
  image,
  title,
  description,
  disabled = false,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-3 min-h-[80px]',
    md: 'p-4 min-h-[120px]',
    lg: 'p-6 min-h-[160px]',
  };

  const imageSizeClasses = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  };

  // If image is provided, use a different layout
  if (image) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative flex flex-col rounded-lg border-2 transition-all duration-200 overflow-hidden',
          'hover:border-primary/50 hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          selected
            ? 'border-primary shadow-md'
            : 'border-border bg-card',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}

        {/* Image */}
        <div className={cn('w-full overflow-hidden', imageSizeClasses[size])}>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Title overlay */}
        <div className={cn(
          'px-3 py-2 text-center',
          selected ? 'bg-primary/10' : 'bg-card'
        )}>
          <span className={cn(
            'text-sm font-medium',
            selected ? 'text-primary' : 'text-foreground'
          )}>
            {title}
          </span>
          {description && (
            <span className="block text-xs text-muted-foreground mt-0.5">
              {description}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 transition-all duration-200',
        'hover:border-primary/50 hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card',
        disabled && 'opacity-50 cursor-not-allowed',
        sizeClasses[size],
        className
      )}
    >

      {/* Emoji */}
      {emoji && (
        <span className="text-3xl mb-1" role="img" aria-label={title}>
          {emoji}
        </span>
      )}

      {/* Icon */}
      {icon && (
        <div className={cn(
          'flex items-center justify-center',
          selected ? 'text-primary' : 'text-muted-foreground'
        )}>
          {icon}
        </div>
      )}

      {/* Title */}
      <span className={cn(
        'text-sm font-medium text-center',
        selected ? 'text-primary' : 'text-foreground'
      )}>
        {title}
      </span>

      {/* Description */}
      {description && (
        <span className="text-xs text-muted-foreground text-center line-clamp-2">
          {description}
        </span>
      )}
    </button>
  );
};
