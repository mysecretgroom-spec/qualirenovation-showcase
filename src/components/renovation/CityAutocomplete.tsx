import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, X } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwcHlxdWFsaXJlbm92IiwiYSI6ImNtanQ3aThpbzFxamozZHNkYWZ2Mmo3dnMifQ.91-sJuk41-nRTKs0OGYDfQ';

interface Suggestion {
  place_name: string;
  text: string;
  context?: Array<{ id: string; text: string }>;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  className?: string;
}

export const CityAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Ex: Paris 16ème, Neuilly-sur-Seine...",
  className 
}: CityAutocompleteProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Sync with external value
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${MAPBOX_TOKEN}&country=fr&language=fr&types=place,locality,neighborhood&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setIsOpen(true);
    } catch (err) {
      console.error('Geocoding error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchCities(newValue);
    }, 300);
  };

  const handleSelect = (suggestion: Suggestion) => {
    // Format city name - use text for short name or extract from place_name
    let cityName = suggestion.text;
    
    // Add arrondissement if it's Paris, Lyon, or Marseille
    if (suggestion.context) {
      const placeContext = suggestion.context.find(c => c.id.startsWith('place.'));
      if (placeContext && ['Paris', 'Lyon', 'Marseille'].includes(placeContext.text)) {
        // It's an arrondissement
        cityName = `${suggestion.text}, ${placeContext.text}`;
      }
    }

    setQuery(cityName);
    setSuggestions([]);
    setIsOpen(false);
    onChange(cityName);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    onChange('');
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-muted-foreground animate-pulse" />
          </div>
        )}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-popover border border-input rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-start gap-2"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{suggestion.place_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
