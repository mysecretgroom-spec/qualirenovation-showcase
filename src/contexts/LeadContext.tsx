import React, { createContext, useContext, useState, useCallback } from 'react';

export interface LeadData {
  id?: string; // quote_request id from database
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
}

interface LeadContextType {
  leadData: LeadData | null;
  setLeadData: (data: LeadData) => void;
  clearLeadData: () => void;
  hasLead: boolean;
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
  }, []);

  return (
    <LeadContext.Provider value={{ 
      leadData, 
      setLeadData, 
      clearLeadData, 
      hasLead: !!leadData 
    }}>
      {children}
    </LeadContext.Provider>
  );
};
