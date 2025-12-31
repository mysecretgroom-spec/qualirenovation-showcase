import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Search, X } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwcHlxdWFsaXJlbm92IiwiYSI6ImNtanQ3aThpbzFxamozZHNkYWZ2Mmo3dnMifQ.91-sJuk41-nRTKs0OGYDfQ';

interface AddressResult {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  postalCode?: string;
}

interface Suggestion {
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string; short_code?: string }>;
  text?: string;
  address?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (result: AddressResult | null) => void;
  error?: string;
  className?: string;
}

const AddressAutocomplete = ({ value, onChange, error, className }: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Sync query with external value (for browser autofill)
  useEffect(() => {
    if (value && value !== query && !hasInteracted) {
      setQuery(value);
      // Notify parent of the pre-filled value
      onChange({
        address: value,
        latitude: 0,
        longitude: 0,
      });
    }
  }, [value]);

  // Initialize map when address is selected
  useEffect(() => {
    if (!mapContainer.current || !selectedAddress) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [selectedAddress.longitude, selectedAddress.latitude],
      zoom: 15,
      interactive: false,
    });

    marker.current = new mapboxgl.Marker({ color: '#C9A96E' })
      .setLngLat([selectedAddress.longitude, selectedAddress.latitude])
      .addTo(map.current);

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, [selectedAddress]);

  const searchAddress = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${MAPBOX_TOKEN}&country=fr&language=fr&types=address,place&limit=5`
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
    setHasInteracted(true);
    
    // Clear selection if user types, but still pass the raw value
    if (selectedAddress) {
      setSelectedAddress(null);
    }
    
    // Pass manual input as partial result (no coordinates)
    onChange({
      address: newValue,
      latitude: 0,
      longitude: 0,
    });

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 300);
  };

  const handleSelect = (suggestion: Suggestion) => {
    const [lng, lat] = suggestion.center;
    
    console.log('[AddressAutocomplete] Selected suggestion:', JSON.stringify(suggestion, null, 2));
    
    // Extract city and postal code from context with multiple fallbacks
    let city = '';
    let postalCode = '';
    
    if (suggestion.context && Array.isArray(suggestion.context)) {
      // Try to find city (place, locality, or district)
      const placeContext = suggestion.context.find(c => 
        c.id.startsWith('place.') || 
        c.id.startsWith('locality.') || 
        c.id.startsWith('district.')
      );
      
      // Try to find postal code
      const postcodeContext = suggestion.context.find(c => c.id.startsWith('postcode.'));
      
      if (placeContext) {
        city = placeContext.text;
      }
      if (postcodeContext) {
        postalCode = postcodeContext.text;
      }
      
      // Fallback: try to extract from place_name if context doesn't have what we need
      if (!city || !postalCode) {
        // place_name format is usually: "123 Rue Example, 75001 Paris, France"
        const parts = suggestion.place_name.split(',').map(p => p.trim());
        
        if (!postalCode && parts.length >= 2) {
          // Look for postal code pattern in the second-to-last part (before country)
          const addressPart = parts[parts.length - 2] || parts[1];
          const postalMatch = addressPart.match(/\b(\d{5})\b/);
          if (postalMatch) {
            postalCode = postalMatch[1];
          }
        }
        
        if (!city && parts.length >= 2) {
          // City is usually after the postal code
          const addressPart = parts[parts.length - 2] || parts[1];
          const cityMatch = addressPart.match(/\d{5}\s+(.+)/);
          if (cityMatch) {
            city = cityMatch[1].trim();
          } else if (!addressPart.match(/^\d+/)) {
            // If no postal code pattern, use the whole part as city
            city = addressPart;
          }
        }
      }
    }

    console.log('[AddressAutocomplete] Extracted - City:', city, 'PostalCode:', postalCode);

    const result: AddressResult = {
      address: suggestion.place_name,
      latitude: lat,
      longitude: lng,
      city,
      postalCode,
    };

    setQuery(suggestion.place_name);
    setSelectedAddress(result);
    setSuggestions([]);
    setIsOpen(false);
    onChange(result);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedAddress(null);
    setSuggestions([]);
    onChange(null);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside the entire container
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
    <div className={className}>
      <label htmlFor="address-input" className="block text-sm font-medium text-foreground mb-1.5">
        Adresse du chantier *
      </label>
      
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            id="address-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            className={`w-full pl-10 pr-10 py-2.5 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
              error ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Rechercher une adresse..."
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
          <ul className="absolute z-50 w-full mt-1 bg-card border border-input rounded-sm shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-secondary transition-colors flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>{suggestion.place_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {/* Mini map */}
      {selectedAddress && (
        <div className="mt-3 rounded-sm overflow-hidden border border-input">
          <div 
            ref={mapContainer} 
            className="h-32 w-full"
            style={{ minHeight: '128px' }}
          />
          <div className="bg-secondary/50 px-3 py-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
              <span className="truncate">{selectedAddress.address}</span>
            </div>
            {(selectedAddress.postalCode || selectedAddress.city) && (
              <div className="text-sm font-medium text-foreground mt-1 ml-[18px]">
                {selectedAddress.postalCode} {selectedAddress.city}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
