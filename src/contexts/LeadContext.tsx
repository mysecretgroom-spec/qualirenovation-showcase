import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface LeadData {
  id?: string; // quote_request id from database
  clientId?: string; // client id for admin simulations
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  surface: string;
  budget: string;
  timeline: string;
  message: string;
  isAdminSimulation?: boolean;
}

interface LeadContextType {
  leadData: LeadData | null;
  setLeadData: (data: LeadData) => void;
  clearLeadData: () => void;
  hasLead: boolean;
  initFromAdminSession: () => boolean;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const useLeadContext = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeadContext must be used within a LeadProvider');
  }
  return context;
};

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leadData, setLeadDataState] = useState<LeadData | null>(null);

  const setLeadData = useCallback((data: LeadData) => {
    setLeadDataState(data);
  }, []);

  const clearLeadData = useCallback(() => {
    setLeadDataState(null);
    // Also clear admin session data
    sessionStorage.removeItem('admin_simulation_client');
  }, []);

  // Initialize lead data from admin session storage
  const initFromAdminSession = useCallback((): boolean => {
    const adminClientData = sessionStorage.getItem('admin_simulation_client');
    if (adminClientData) {
      try {
        const parsed = JSON.parse(adminClientData);
        setLeadDataState({
          id: parsed.quoteRequestId || undefined,
          clientId: parsed.clientId,
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          address: parsed.address || '',
          city: parsed.city || '',
          postalCode: parsed.postalCode || '',
          surface: parsed.surface || '',
          budget: '',
          timeline: '',
          message: '',
          isAdminSimulation: true,
        });
        return true;
      } catch (e) {
        console.error('Error parsing admin simulation data:', e);
        sessionStorage.removeItem('admin_simulation_client');
      }
    }
    return false;
  }, []);

  return (
    <LeadContext.Provider value={{ 
      leadData, 
      setLeadData, 
      clearLeadData, 
      hasLead: !!leadData,
      initFromAdminSession,
    }}>
      {children}
    </LeadContext.Provider>
  );
};