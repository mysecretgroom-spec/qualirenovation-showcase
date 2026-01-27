import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Plus, Trash2, Loader2, Image as ImageIcon, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface ReferenceItem {
  reference: string;
  isLoading?: boolean;
  imageUrl?: string;
  error?: string;
  decorName?: string;
  decorUrl?: string;
  productName?: string;
  productUrl?: string;
  brand?: string;
  colorName?: string;
  colorNumber?: string;
  hexColor?: string;
  rooms?: string[];
}

interface ReferenceInputProps {
  type: 'egger' | 'planizia' | 'farrow-ball';
  title: string;
  catalogUrl: string;
  catalogLabel: string;
  placeholder: string;
  formatHint: React.ReactNode;
  formatExamples: string[];
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  references: ReferenceItem[];
  onRemove: (index: number | string) => void;
  disabled?: boolean;
  // Optional room selection for painting
  rooms?: { id: string; label: string }[];
  selectedRooms?: string[];
  onToggleRoom?: (roomId: string) => void;
}

export const ReferenceInput: React.FC<ReferenceInputProps> = ({
  type,
  title,
  catalogUrl,
  catalogLabel,
  placeholder,
  formatHint,
  formatExamples,
  value,
  onChange,
  onAdd,
  references,
  onRemove,
  disabled,
  rooms,
  selectedRooms,
  onToggleRoom,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  const getSuccessCount = () => references.filter(r => r.imageUrl || r.hexColor).length;
  const getErrorCount = () => references.filter(r => r.error && !r.isLoading).length;
  const getLoadingCount = () => references.filter(r => r.isLoading).length;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      
      {/* Catalog link */}
      <a 
        href={catalogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline transition-colors text-sm"
      >
        <ExternalLink className="w-4 h-4" />
        {catalogLabel}
      </a>
      
      {/* Instructions card */}
      <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            {formatHint}
          </div>
        </div>
        
        {/* Examples */}
        <div className="flex flex-wrap gap-2">
          {formatExamples.map((example, i) => (
            <Badge key={i} variant="secondary" className="font-mono text-xs">
              {example}
            </Badge>
          ))}
        </div>
        
        {/* Input row */}
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 font-mono"
            disabled={disabled}
          />
          <Button 
            type="button" 
            onClick={onAdd}
            disabled={!value.trim() || disabled}
            size="icon"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Room selection for Farrow & Ball */}
        {rooms && rooms.length > 0 && onToggleRoom && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pièce(s) concernée(s) :</p>
            <div className="flex flex-wrap gap-2">
              {rooms.map((room) => (
                <Badge
                  key={room.id}
                  variant={selectedRooms?.includes(room.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => onToggleRoom(room.id)}
                >
                  {room.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Status summary */}
      {references.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{references.length} référence(s)</span>
          {getSuccessCount() > 0 && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-3 h-3" /> {getSuccessCount()} trouvée(s)
            </span>
          )}
          {getLoadingCount() > 0 && (
            <span className="flex items-center gap-1 text-primary">
              <Loader2 className="w-3 h-3 animate-spin" /> {getLoadingCount()} en cours
            </span>
          )}
          {getErrorCount() > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertCircle className="w-3 h-3" /> {getErrorCount()} non trouvée(s)
            </span>
          )}
        </div>
      )}
      
      {/* References list */}
      {references.length > 0 && (
        <div className="space-y-2">
          {references.map((ref, index) => (
            <div 
              key={`${ref.reference}-${index}`}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                ref.error && !ref.isLoading 
                  ? 'bg-destructive/5 border-destructive/30' 
                  : ref.imageUrl || ref.hexColor
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    : 'bg-muted/50'
              }`}
            >
              {/* Image preview */}
              <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                {ref.isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : ref.imageUrl ? (
                  <img 
                    src={ref.imageUrl} 
                    alt={ref.decorName || ref.productName || ref.colorName || ref.reference}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
                      const fallback = document.createElement('div');
                      fallback.innerHTML = '❌';
                      fallback.className = 'text-2xl';
                      (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                    }}
                  />
                ) : ref.hexColor ? (
                  <div 
                    className="w-full h-full"
                    style={{ backgroundColor: ref.hexColor }}
                    title={ref.hexColor}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              
              {/* Reference info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm font-mono">{ref.reference}</p>
                {ref.decorName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {ref.decorName.replace(ref.reference, '').trim()}
                  </p>
                )}
                {ref.productName && (
                  <p className="text-xs text-muted-foreground truncate">{ref.productName}</p>
                )}
                {ref.brand && (
                  <p className="text-xs text-muted-foreground">{ref.brand}</p>
                )}
                {ref.colorName && ref.colorNumber && (
                  <p className="text-xs text-muted-foreground">
                    N° {ref.colorNumber} - {ref.colorName}
                  </p>
                )}
                {ref.hexColor && (
                  <p className="text-xs text-muted-foreground font-mono">{ref.hexColor}</p>
                )}
                {ref.error && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {ref.error}
                  </p>
                )}
                {!ref.isLoading && !ref.imageUrl && !ref.hexColor && !ref.error && (
                  <p className="text-xs text-muted-foreground">Recherche en attente...</p>
                )}
                
                {/* Links */}
                {ref.decorUrl && (
                  <a 
                    href={ref.decorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Voir sur EGGER <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {ref.productUrl && type === 'planizia' && (
                  <a 
                    href={ref.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Voir sur Planizia <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {ref.productUrl && type === 'farrow-ball' && (
                  <a 
                    href={ref.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    Voir sur Farrow & Ball <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {/* Room badges for Farrow & Ball */}
                {ref.rooms && ref.rooms.length > 0 && rooms && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ref.rooms.map((roomId) => {
                      const room = rooms.find(r => r.id === roomId);
                      return room ? (
                        <Badge key={roomId} variant="secondary" className="text-xs">
                          {room.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              {/* Status icon */}
              <div className="flex-shrink-0">
                {!ref.isLoading && (ref.imageUrl || ref.hexColor) && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
              
              {/* Remove button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(type === 'egger' ? ref.reference : index)}
                className="flex-shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Help alert for errors */}
      {getErrorCount() > 0 && (
        <Alert variant="destructive" className="bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Certaines références n'ont pas été trouvées. Vérifiez l'orthographe et le format, 
            ou consultez le catalogue officiel pour trouver la bonne référence.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
