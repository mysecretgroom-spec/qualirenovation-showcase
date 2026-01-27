import { useMemo } from 'react';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  quote_request_id: string | null;
}

interface DuplicateInfo {
  clientId: string;
  clientName: string;
  matchingFields: string[];
  matchScore: number;
}

// Normalize string for comparison
const normalize = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Check if two emails match
const emailsMatch = (email1: string | null, email2: string | null): boolean => {
  const e1 = normalize(email1);
  const e2 = normalize(email2);
  return e1 !== '' && e2 !== '' && e1 === e2;
};

// Check if names are similar (first + last name in any order)
const namesMatch = (name1: string | null, name2: string | null): boolean => {
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  if (n1 === '' || n2 === '') return false;
  if (n1 === n2) return true;
  
  // Split names and check if all parts are present
  const parts1 = n1.split(' ').filter(p => p.length > 1);
  const parts2 = n2.split(' ').filter(p => p.length > 1);
  
  if (parts1.length === 0 || parts2.length === 0) return false;
  
  // Check if at least 2 parts match (first + last name)
  const matchingParts = parts1.filter(p1 => parts2.some(p2 => p1 === p2 || p1.includes(p2) || p2.includes(p1)));
  return matchingParts.length >= 2 || (parts1.length === 1 && parts2.length === 1 && parts1[0] === parts2[0]);
};

// Check if addresses match
const addressesMatch = (addr1: string | null, addr2: string | null, city1: string | null, city2: string | null): boolean => {
  const a1 = normalize(addr1);
  const a2 = normalize(addr2);
  const c1 = normalize(city1);
  const c2 = normalize(city2);
  
  // City must match
  if (c1 !== '' && c2 !== '' && c1 !== c2) {
    // Check if one city contains the other (e.g., "Paris" vs "Paris 16")
    if (!c1.includes(c2) && !c2.includes(c1)) return false;
  }
  
  // If we have addresses, check if they're similar
  if (a1 !== '' && a2 !== '') {
    // Extract street number and name
    const streetParts1 = a1.split(',')[0] || a1;
    const streetParts2 = a2.split(',')[0] || a2;
    return streetParts1 === streetParts2 || streetParts1.includes(streetParts2) || streetParts2.includes(streetParts1);
  }
  
  // If only cities, they must match exactly
  return c1 !== '' && c1 === c2;
};

// Check if phones match (normalize phone formats)
const phonesMatch = (phone1: string | null, phone2: string | null): boolean => {
  const normalizePhone = (p: string | null): string => {
    if (!p) return '';
    return p.replace(/[\s\.\-\(\)]/g, '').replace(/^(\+33|0033)/, '0');
  };
  const p1 = normalizePhone(phone1);
  const p2 = normalizePhone(phone2);
  return p1 !== '' && p2 !== '' && p1 === p2;
};

export const findDuplicates = (quote: QuoteRequest, clients: Client[]): DuplicateInfo | null => {
  // Skip if already converted to this client
  const existingClient = clients.find(c => c.quote_request_id === quote.id);
  if (existingClient) return null;
  
  for (const client of clients) {
    const matchingFields: string[] = [];
    let score = 0;
    
    // Email match is a strong indicator
    if (emailsMatch(quote.email, client.email)) {
      matchingFields.push('email');
      score += 3;
    }
    
    // Phone match is a strong indicator
    if (phonesMatch(quote.phone, client.phone)) {
      matchingFields.push('téléphone');
      score += 3;
    }
    
    // Name match
    if (namesMatch(quote.name, client.name)) {
      matchingFields.push('nom');
      score += 2;
    }
    
    // Address match (for same worksite)
    if (addressesMatch(quote.address, client.address, quote.city, client.city)) {
      matchingFields.push('adresse chantier');
      score += 2;
    }
    
    // Require at least 2 different matching criteria OR email OR phone
    if (score >= 3 && matchingFields.length >= 1) {
      return {
        clientId: client.id,
        clientName: client.name,
        matchingFields,
        matchScore: score,
      };
    }
  }
  
  return null;
};

export const useDuplicateDetection = (quotes: QuoteRequest[], clients: Client[]) => {
  const duplicatesMap = useMemo(() => {
    const map = new Map<string, DuplicateInfo>();
    
    for (const quote of quotes) {
      const duplicate = findDuplicates(quote, clients);
      if (duplicate) {
        map.set(quote.id, duplicate);
      }
    }
    
    return map;
  }, [quotes, clients]);
  
  return {
    duplicatesMap,
    hasDuplicates: duplicatesMap.size > 0,
    getDuplicate: (quoteId: string) => duplicatesMap.get(quoteId) || null,
  };
};
