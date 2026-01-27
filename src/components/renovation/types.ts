// Types for the renovation form

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
  
  // Pièces sélectionnées
  selectedRooms: RoomSelection[];
  
  // Isolation module
  isolation: IsolationData;
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
  | 'wc'
  | 'salon-sejour'
  | 'chambre'
  | 'entree-couloir'
  | 'dressing-rangements'
  | 'bureau'
  | 'autre';

export interface RoomData {
  bathroomData?: BathroomData;
  kitchenData?: KitchenData;
  paintingData?: PaintingData;
  electricityData?: ElectricityData;
  flooringData?: FlooringData;
  mouldingsData?: MouldingsData;
  glassPanelData?: GlassPanelData;
  customFurnitureData?: CustomFurnitureData;
  genericRoomData?: GenericRoomData;
}

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
  toiletType: string;
  ambiance: string[];
  certaintyLevel: string;
  // Tile options
  tileType: string;
  tileFormat: string;
  // EGGER references for vessel sink countertop
  eggerReferences: EggerReference[];
}

// Kitchen module
export interface EggerReference {
  reference: string;
  imageUrl?: string;
  isLoading?: boolean;
  error?: string;
}

export interface FarrowBallColor {
  colorNumber: string;
  colorName: string;
  rooms: string[];
  imageUrl?: string;
  hexColor?: string;
  isLoading?: boolean;
  error?: string;
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
  switchStyle: string;
  additionalNeeds: string[];
}

// Flooring module
export interface FlooringData {
  floorType: string;
  // Carrelage options
  tileType: string;
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
  toiletType: '',
  ambiance: [],
  certaintyLevel: '',
  tileType: '',
  tileFormat: '',
  eggerReferences: [],
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
