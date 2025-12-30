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
}

interface Suggestion {
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string }>;
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

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
    
    // Clear selection if user types
    if (selectedAddress) {
      setSelectedAddress(null);
      onChange(null);
    }

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
    
    // Extract city from context
    let city = '';
    if (suggestion.context) {
      const placeContext = suggestion.context.find(c => c.id.startsWith('place.'));
      if (placeContext) {
        city = placeContext.text;
      }
    }

    const result: AddressResult = {
      address: suggestion.place_name,
      latitude: lat,
      longitude: lng,
      city,
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
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
      
      <div className="relative">
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
          <div className="bg-secondary/50 px-3 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-accent" />
            <span className="truncate">{selectedAddress.address}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
