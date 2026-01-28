import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { 
  RenovationFormData, 
  RenovationFormContextType, 
  initialFormData,
  RoomType,
  RoomData,
  RoomSelection,
  initialBathroomData,
  initialKitchenData,
} from './types';
import { useLeadContext, LeadData } from '@/contexts/LeadContext';

const RenovationFormContext = createContext<RenovationFormContextType | undefined>(undefined);

export const useRenovationForm = () => {
  const context = useContext(RenovationFormContext);
  if (!context) {
    throw new Error('useRenovationForm must be used within a RenovationFormProvider');
  }
  return context;
};

interface RenovationFormProviderProps {
  children: React.ReactNode;
}

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper to get initial form data with lead data pre-filled
const getInitialFormDataWithLead = (leadData: LeadData | null): RenovationFormData => {
  if (!leadData) return initialFormData;
  
  return {
    ...initialFormData,
    surface: leadData.surface || '',
    city: leadData.city || '',
  };
};

export const RenovationFormProvider: React.FC<RenovationFormProviderProps> = ({ children }) => {
  const { leadData } = useLeadContext();
  const [formData, setFormData] = useState<RenovationFormData>(() => 
    getInitialFormDataWithLead(leadData)
  );
  const [currentStep, setCurrentStep] = useState(0);

  // Sync lead data when it changes (e.g., coming from quote modal)
  useEffect(() => {
    if (leadData) {
      setFormData(prev => ({
        ...prev,
        surface: leadData.surface || prev.surface,
        city: leadData.city || prev.city,
      }));
    }
  }, [leadData]);

  const updateFormData = useCallback(<K extends keyof RenovationFormData>(
    key: K, 
    value: RenovationFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const addRoom = useCallback((type: RoomType) => {
    setFormData(prev => {
      const existingOfType = prev.selectedRooms.filter(r => r.type === type);
      const instanceNumber = existingOfType.length + 1;
      
      const newRoom: RoomSelection = {
        id: generateId(),
        type,
        instanceNumber,
        data: getInitialRoomData(type),
      };

      return {
        ...prev,
        selectedRooms: [...prev.selectedRooms, newRoom],
      };
    });
  }, []);

  const removeRoom = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms.filter(r => r.id !== id),
    }));
  }, []);

  const updateRoomData = useCallback((id: string, data: Partial<RoomData>) => {
    setFormData(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms.map(room =>
        room.id === id
          ? { ...room, data: { ...room.data, ...data } }
          : room
      ),
    }));
  }, []);

  // Calculate total steps based on selected rooms and global modules
  const totalSteps = useMemo(() => {
    // Base steps: Project info (1) + Conception (1) + Project type (1) + Room selection (1) + Global works selection (1) + Conditions (1) + Summary (1)
    const baseSteps = 7;
    // Add isolation step if applicable
    const isolationStep = formData.projectTypes.includes('dpe') ? 1 : 0;
    // Add one step per selected room
    const roomSteps = formData.selectedRooms.length;
    // Add global module steps
    const globalPaintingStep = formData.needsGlobalPainting === 'oui' ? 1 : 0;
    const globalFlooringStep = formData.needsGlobalFlooring === 'oui' ? 1 : 0;
    const globalElectricityStep = formData.needsGlobalElectricity === 'oui' ? 1 : 0;
    const globalMouldingsStep = formData.needsGlobalMouldings === 'oui' ? 1 : 0;
    const globalFurnitureStep = formData.needsGlobalFurniture === 'oui' ? 1 : 0;
    return baseSteps + isolationStep + roomSteps + globalPaintingStep + globalFlooringStep + globalElectricityStep + globalMouldingsStep + globalFurnitureStep;
  }, [formData.projectTypes, formData.selectedRooms.length, formData.needsGlobalPainting, formData.needsGlobalFlooring, formData.needsGlobalElectricity, formData.needsGlobalMouldings, formData.needsGlobalFurniture]);

  const canProceed = useMemo(() => {
    // Validation logic per step
    switch (currentStep) {
      case 0: // Project info
        return formData.propertyType !== '' && formData.surface !== '' && formData.city !== '';
      case 1: // Conception
        return formData.hasArchitect !== '';
      case 2: // Project type
        return formData.projectTypes.length > 0;
      case 3: // Room selection
        return formData.selectedRooms.length > 0;
      default:
        return true;
    }
  }, [currentStep, formData]);

  const value = useMemo(() => ({
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    totalSteps,
    addRoom,
    removeRoom,
    updateRoomData,
    canProceed,
  }), [formData, updateFormData, currentStep, totalSteps, addRoom, removeRoom, updateRoomData, canProceed]);

  return (
    <RenovationFormContext.Provider value={value}>
      {children}
    </RenovationFormContext.Provider>
  );
};

// Helper to get initial data for each room type
function getInitialRoomData(type: RoomType): RoomData {
  switch (type) {
    case 'salle-de-bain':
      return { bathroomData: { ...initialBathroomData } };
    case 'cuisine':
      return { kitchenData: { ...initialKitchenData } };
    case 'wc':
      return { wcData: { toiletType: '', existingSanibroyeur: '', wantHandWash: '', handWashType: '', faucetFinish: '', siphonType: '', certaintyLevel: '' } };
    default:
      return {};
  }
}
