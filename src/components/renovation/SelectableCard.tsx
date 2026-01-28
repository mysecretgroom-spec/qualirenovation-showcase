import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  emoji?: string;
  image?: string;
  title: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  selected,
  onClick,
  icon,
  emoji,
  image,
  title,
  description,
  badge,
  disabled = false,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-2 sm:p-3 min-h-[60px] sm:min-h-[80px]',
    md: 'p-2.5 sm:p-4 min-h-[80px] sm:min-h-[120px]',
    lg: 'p-3 sm:p-6 min-h-[100px] sm:min-h-[160px]',
    xl: 'p-3 sm:p-6 min-h-[120px] sm:min-h-[200px]',
    xxl: 'p-4 sm:p-6 min-h-[160px] sm:min-h-[280px]',
  };

  const imageSizeClasses = {
    sm: 'h-14 sm:h-20',
    md: 'h-20 sm:h-28',
    lg: 'h-28 sm:h-40',
    xl: 'h-36 sm:h-52',
    xxl: 'h-44 sm:h-64',
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
            ? 'border-foreground ring-2 ring-foreground shadow-lg'
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

        {/* Recommendation badge */}
        {badge && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs font-medium">
              ✓ {badge}
            </Badge>
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
          'px-2 sm:px-3 py-1.5 sm:py-2 text-center',
          selected ? 'bg-primary/10' : 'bg-card'
        )}>
          <span className={cn(
            'text-xs sm:text-sm font-medium line-clamp-2',
            selected ? 'text-primary' : 'text-foreground'
          )}>
            {title}
          </span>
          {description && (
            <span className="hidden sm:block text-xs text-muted-foreground mt-0.5">
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
          ? 'border-foreground ring-2 ring-foreground bg-primary/5 shadow-lg'
          : 'border-border bg-card',
        disabled && 'opacity-50 cursor-not-allowed',
        sizeClasses[size],
        className
      )}
    >

      {/* Emoji */}
      {emoji && (
        <span className="text-xl sm:text-3xl mb-0.5 sm:mb-1" role="img" aria-label={title}>
          {emoji}
        </span>
      )}

      {/* Icon */}
      {icon && (
        <div className={cn(
          'flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6',
          selected ? 'text-primary' : 'text-muted-foreground'
        )}>
          {icon}
        </div>
      )}

      {/* Title */}
      <span className={cn(
        'text-xs sm:text-sm font-medium text-center line-clamp-2',
        selected ? 'text-primary' : 'text-foreground'
      )}>
        {title}
      </span>

      {/* Description */}
      {description && (
        <span className="hidden sm:block text-xs text-muted-foreground text-center line-clamp-2">
          {description}
        </span>
      )}
    </button>
  );
};
