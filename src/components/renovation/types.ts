// Types for the renovation form

// Inspiration image uploaded by user
export interface InspirationImage {
  id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
}

export interface RenovationFormData {
  // Socle commun - Votre projet
  propertyType: 'appartement' | 'maison' | '';
  surface: string;
  constructionPeriod: 'avant-1949' | '1949-1974' | '1975-1999' | 'apres-2000' | 'ne-sais-pas' | '';
  city: string;
  
  // Conception & organisation
  hasArchitect: 'oui' | 'non' | 'en-reflexion' | '';
  modifyLayout: 'oui' | 'non' | '';
  uploadedPlan: File | null;
  
  // Type de projet
  projectTypes: string[];
  projectContexts: string[];
  hasDPE: 'oui-transmis' | 'oui-obsolete' | 'non' | 'ne-sais-pas' | '';
  uploadedDPE: File | null;
  
  // Conditions de réalisation
  occupyDuringWorks: 'oui' | 'non' | 'partiellement' | '';
  constraints: string[];
  constraintDetails: string;
  startDate: 'asap' | 'from-date' | 'flexible' | '';
  startDateValue: string;
  endDateMax: string; // Date de fin maximum pour délais impératifs
  
  // Photos d'inspiration
  inspirationImages: InspirationImage[];
  
  // Pièces sélectionnées
  selectedRooms: RoomSelection[];
  
  // Isolation module
  isolation: IsolationData;
  
  // Global works - standalone modules
  needsGlobalPainting: 'oui' | 'non' | '';
  needsGlobalFlooring: 'oui' | 'non' | '';
  needsGlobalElectricity: 'oui' | 'non' | '';
  needsGlobalMouldings: 'oui' | 'non' | '';
  needsGlobalFurniture: 'oui' | 'non' | '';
  globalPainting: GlobalPaintingData;
  globalFlooring: GlobalFlooringData;
  globalElectricity: GlobalElectricityData;
  globalMouldings: GlobalMouldingsData;
  globalFurniture: GlobalFurnitureData;
}

export interface RoomSelection {
  id: string;
  type: RoomType;
  instanceNumber: number;
  data: RoomData;
}

export type RoomType = 
  | 'cuisine'
  | 'salle-de-bain'
  | 'wc';

export interface RoomData {
  bathroomData?: BathroomData;
  kitchenData?: KitchenData;
  wcData?: WCData;
  paintingData?: PaintingData;
  electricityData?: ElectricityData;
  flooringData?: FlooringData;
  mouldingsData?: MouldingsData;
  glassPanelData?: GlassPanelData;
  customFurnitureData?: CustomFurnitureData;
  genericRoomData?: GenericRoomData;
}

// WC module
export interface WCData {
  toiletType: string;
  existingSanibroyeur: string;
  wantHandWash: string;
  handWashType: string;
  faucetFinish: string;
  siphonType: string;
  certaintyLevel: string;
}

export const initialWCData: WCData = {
  toiletType: '',
  existingSanibroyeur: '',
  wantHandWash: '',
  handWashType: '',
  faucetFinish: '',
  siphonType: '',
  certaintyLevel: '',
};

// Bathroom module
export interface BathroomData {
  usage: string[];
  bathroomType: string;
  installationType: string;
  hasWashingMachine: string;
  storageType: string[];
  // Shower options
  showerTrayType: string;
  showerDoorType: string;
  // Bathtub options
  bathtubType: string;
  bathtubScreenType: string;
  // Vanity
  vanityType: string;
  sinkStyle: string; // 'a-poser' | 'encastree' | 'ne-sais-pas'
  vanityCount: string;
  showerFaucetType: string;
  showerHeadStyle: string[];
  faucetFinish: string;
  // Mirror
  mirrorType: string;
  // Toilet
  toiletType: string;
  existingSanibroyeur: string; // 'oui' | 'non' | 'ne-sais-pas' | 'pas-de-wc'
  ambiance: string[];
  certaintyLevel: string;
  // Tile options - now supports multiple selection
  tileTypes: string[];
  tileFormat: string;
  // EGGER references for vessel sink countertop
  eggerReferences: EggerReference[];
}

// Global module data types
export interface GlobalFlooringData {
  selectedRooms: string[];
  existingAction: 'conserver' | 'remplacer' | 'etudier' | '';
  hasLambourdes: 'oui' | 'non' | 'ne-sais-pas' | '';
  refinishType: string;
  floorType: string;
  tileTypes: string[];
  tileFormat: string;
  layingPattern: string;
  woodType: string;
  plankWidth: string;
  finish: string;
}

export interface GlobalPaintingData {
  selectedRooms: string[];
  surfaces: string[];
  intention: string;
  finish: string;
  hasDefinedColors: string;
  wallCondition: string;
  farrowBallColors: FarrowBallColor[];
}

export interface GlobalElectricityData {
  selectedRooms: string[];
  workType: string[];
  lightingTypes: string[];
  switchStyle: string;
  additionalNeeds: string[];
}

// Global mouldings data
export interface GlobalMouldingsData {
  selectedRooms: string[];
  intention: string;
  style: string;
}

// Global furniture/aménagement data
export interface GlobalFurnitureData {
  selectedRooms: string[];
  furnitureType: string[];
  approach: string;
  description: string;
}

// Kitchen module
export interface EggerReference {
  reference: string;
  decorName?: string;
  imageUrl?: string;
  decorUrl?: string;
  isLoading?: boolean;
  error?: string;
}

export interface PlaniziaReference {
  reference: string;
  productName?: string;
  imageUrl?: string;
  productUrl?: string;
  brand?: string;
  isLoading?: boolean;
  error?: string;
}

export interface FarrowBallColor {
  colorNumber: string;
  colorName: string;
  rooms: string[];
  imageUrl?: string;
  hexColor?: string;
  productUrl?: string;
  isLoading?: boolean;
  error?: string;
  _tempId?: string; // Temporary ID for async update tracking
}

export interface KitchenData {
  usage: string[];
  layoutType: string;
  modifyLayout: string;
  cabinetType: string;
  facadeFinish: string;
  hasHandles: string;
  countertopMaterial: string;
  wantVisualization: string;
  backsplashType: string;
  backsplashTileType: string;
  backsplashTileFormat: string;
  certaintyLevel: string;
  eggerReferences: EggerReference[];
  planiziaReferences: PlaniziaReference[];
}

// Painting module
export interface PaintingData {
  surfaces: string[];
  intention: string;
  finish: string;
  hasDefinedColors: string;
  wallCondition: string;
  farrowBallColors: FarrowBallColor[];
}

// Electricity module
export interface ElectricityData {
  workType: string[];
  lightingTypes: string[];
  switchStyle: string;
  additionalNeeds: string[];
}

// Flooring module
export interface FlooringData {
  floorType: string;
  // Carrelage options - now supports multiple selection
  tileTypes: string[];
  tileFormat: string;
  // Parquet options
  layingPattern: string;
  woodType: string;
  plankWidth: string;
  finish: string;
  existingAction: string;
}

// Mouldings module
export interface MouldingsData {
  intention: string;
  style: string;
}

// Glass panel / Claustra module
export interface GlassPanelData {
  purpose: string[];
  panelType: string;
}

// Custom furniture module
export interface CustomFurnitureData {
  furnitureType: string[];
  approach: string;
  supportLevel: string;
}

// Generic room data
export interface GenericRoomData {
  description: string;
  workTypes: string[];
  certaintyLevel: string;
}

// Isolation module
export interface IsolationData {
  wantIsolation: 'oui' | 'non' | 'ne-sais-pas' | '';
  isolationType: string;
  zones: string[];
  constraints: string[];
  primaryGoal: string;
  supportNeeds: string[];
  wantFinancingInfo: string;
}

export interface FormStep {
  id: string;
  title: string;
  subtitle?: string;
  component: string;
}

// Form context
export interface RenovationFormContextType {
  formData: RenovationFormData;
  updateFormData: <K extends keyof RenovationFormData>(key: K, value: RenovationFormData[K]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  addRoom: (type: RoomType) => void;
  removeRoom: (id: string) => void;
  updateRoomData: (id: string, data: Partial<RoomData>) => void;
  canProceed: boolean;
}

// Initial form data
export const initialFormData: RenovationFormData = {
  propertyType: '',
  surface: '',
  constructionPeriod: '',
  city: '',
  hasArchitect: '',
  modifyLayout: '',
  uploadedPlan: null,
  projectTypes: [],
  projectContexts: [],
  hasDPE: '',
  uploadedDPE: null,
  occupyDuringWorks: '',
  constraints: [],
  constraintDetails: '',
  startDate: '',
  startDateValue: '',
  endDateMax: '',
  inspirationImages: [],
  selectedRooms: [],
  isolation: {
    wantIsolation: '',
    isolationType: '',
    zones: [],
    constraints: [],
    primaryGoal: '',
    supportNeeds: [],
    wantFinancingInfo: '',
  },
  // Global works
  needsGlobalPainting: '',
  needsGlobalFlooring: '',
  needsGlobalElectricity: '',
  needsGlobalMouldings: '',
  needsGlobalFurniture: '',
  globalPainting: {
    selectedRooms: [],
    surfaces: [],
    intention: '',
    finish: '',
    hasDefinedColors: '',
    wallCondition: '',
    farrowBallColors: [],
  },
  globalFlooring: {
    selectedRooms: [],
    existingAction: '',
    hasLambourdes: '',
    refinishType: '',
    floorType: '',
    tileTypes: [],
    tileFormat: '',
    layingPattern: '',
    woodType: '',
    plankWidth: '',
    finish: '',
  },
  globalElectricity: {
    selectedRooms: [],
    workType: [],
    lightingTypes: [],
    switchStyle: '',
    additionalNeeds: [],
  },
  globalMouldings: {
    selectedRooms: [],
    intention: '',
    style: '',
  },
  globalFurniture: {
    selectedRooms: [],
    furnitureType: [],
    approach: '',
    description: '',
  },
};

// Initial bathroom data
export const initialBathroomData: BathroomData = {
  usage: [],
  bathroomType: '',
  installationType: '',
  hasWashingMachine: '',
  storageType: [],
  showerTrayType: '',
  showerDoorType: '',
  bathtubType: '',
  bathtubScreenType: '',
  vanityType: '',
  sinkStyle: '',
  vanityCount: '',
  showerFaucetType: '',
  showerHeadStyle: [],
  faucetFinish: '',
  mirrorType: '',
  toiletType: '',
  existingSanibroyeur: '',
  ambiance: [],
  certaintyLevel: '',
  tileTypes: [],
  tileFormat: '',
  eggerReferences: [],
};

// Initial global flooring data
export const initialGlobalFlooringData: GlobalFlooringData = {
  selectedRooms: [],
  existingAction: '',
  hasLambourdes: '',
  refinishType: '',
  floorType: '',
  tileTypes: [],
  tileFormat: '',
  layingPattern: '',
  woodType: '',
  plankWidth: '',
  finish: '',
};

// Initial global painting data
export const initialGlobalPaintingData: GlobalPaintingData = {
  selectedRooms: [],
  surfaces: [],
  intention: '',
  finish: '',
  hasDefinedColors: '',
  wallCondition: '',
  farrowBallColors: [],
};

// Initial global electricity data
export const initialGlobalElectricityData: GlobalElectricityData = {
  selectedRooms: [],
  workType: [],
  lightingTypes: [],
  switchStyle: '',
  additionalNeeds: [],
};

// Initial kitchen data
export const initialKitchenData: KitchenData = {
  usage: [],
  layoutType: '',
  modifyLayout: '',
  cabinetType: '',
  facadeFinish: '',
  hasHandles: '',
  countertopMaterial: '',
  wantVisualization: '',
  backsplashType: '',
  backsplashTileType: '',
  backsplashTileFormat: '',
  certaintyLevel: '',
  eggerReferences: [],
  planiziaReferences: [],
};

// Initial painting data
export const initialPaintingData: PaintingData = {
  surfaces: [],
  intention: '',
  finish: '',
  hasDefinedColors: '',
  wallCondition: '',
  farrowBallColors: [],
};
