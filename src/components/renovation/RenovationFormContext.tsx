import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { 
  RenovationFormData, 
  RenovationFormContextType, 
  initialFormData,
  RoomType,
  RoomData,
  RoomSelection,
  initialBathroomData,
  initialKitchenData
} from './types';

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

export const RenovationFormProvider: React.FC<RenovationFormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<RenovationFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);

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

  // Calculate total steps based on selected rooms
  const totalSteps = useMemo(() => {
    // Base steps: Project info (1) + Conception (1) + Project type (1) + Room selection (1) + Conditions (1) + Summary (1)
    const baseSteps = 6;
    // Add isolation step if applicable
    const isolationStep = formData.projectTypes.includes('dpe') ? 1 : 0;
    // Add one step per selected room
    const roomSteps = formData.selectedRooms.length;
    return baseSteps + isolationStep + roomSteps;
  }, [formData.projectTypes, formData.selectedRooms.length]);

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
    case 'salon-sejour':
    case 'chambre':
    case 'entree-couloir':
    case 'bureau':
      return {
        paintingData: { surfaces: [], intention: '', finish: '', hasDefinedColors: '', wallCondition: '', farrowBallColors: [] },
        flooringData: { floorType: '', tileType: '', tileFormat: '', layingPattern: '', woodType: '', plankWidth: '', finish: '', existingAction: '' },
        electricityData: { workType: [], switchStyle: '', additionalNeeds: [] },
      };
    case 'wc':
      return {
        genericRoomData: { description: '', workTypes: [], certaintyLevel: '' },
      };
    case 'dressing-rangements':
      return {
        customFurnitureData: { furnitureType: [], approach: '', supportLevel: '' },
      };
    default:
      return {
        genericRoomData: { description: '', workTypes: [], certaintyLevel: '' },
      };
  }
}
