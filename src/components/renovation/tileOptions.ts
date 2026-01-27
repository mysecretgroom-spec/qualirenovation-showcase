// Shared tile options for renovation modules
// Import flooring tile images
import carrelageZellige from '@/assets/flooring/carrelage-zellige.jpg';
import carrelageMarbre from '@/assets/flooring/carrelage-marbre.jpg';
import carrelageTravertin from '@/assets/flooring/carrelage-travertin.jpg';
import carrelagePierre from '@/assets/flooring/carrelage-pierre.jpg';
import carrelageCiment from '@/assets/flooring/carrelage-ciment.jpg';
import carrelageBeton from '@/assets/flooring/carrelage-beton.jpg';
import carrelageUnicolore from '@/assets/flooring/carrelage-unicolore.jpg';
import carrelageTerracotta from '@/assets/flooring/carrelage-terracotta.jpg';
import carrelageGresCerame from '@/assets/flooring/carrelage-gres-cerame.jpg';
import carrelageImitationBois from '@/assets/flooring/carrelage-imitation-bois.jpg';
import carrelageHexagonal from '@/assets/flooring/carrelage-hexagonal.jpg';
import carrelageMetro from '@/assets/flooring/carrelage-metro.jpg';
import carrelageMosaique from '@/assets/flooring/carrelage-mosaique.jpg';
import carrelageGrandFormat from '@/assets/flooring/carrelage-grand-format.jpg';
import carrelageCarre from '@/assets/flooring/carrelage-carre.jpg';
import carrelageRectangulaire from '@/assets/flooring/carrelage-rectangulaire.jpg';
import carrelagePetitFormat from '@/assets/flooring/carrelage-petit-format.jpg';

export interface TileOption {
  value: string;
  label: string;
  image?: string;
  emoji?: string;
}

// Types de carrelage - utilisés pour sol et mur
export const tileTypes: TileOption[] = [
  { value: 'zellige', label: 'Zellige', image: carrelageZellige },
  { value: 'marbre', label: 'Effet marbre', image: carrelageMarbre },
  { value: 'travertin', label: 'Travertin', image: carrelageTravertin },
  { value: 'pierre', label: 'Pierre naturelle', image: carrelagePierre },
  { value: 'ciment', label: 'Carreau ciment', image: carrelageCiment },
  { value: 'beton', label: 'Béton ciré', image: carrelageBeton },
  { value: 'unicolore', label: 'Unicolore', image: carrelageUnicolore },
  { value: 'terracotta', label: 'Terracotta', image: carrelageTerracotta },
  { value: 'gres-cerame', label: 'Grès cérame', image: carrelageGresCerame },
  { value: 'imitation-bois', label: 'Imitation bois', image: carrelageImitationBois },
  { value: 'hexagonal', label: 'Hexagonal', image: carrelageHexagonal },
  { value: 'metro', label: 'Métro', image: carrelageMetro },
  { value: 'mosaique', label: 'Mosaïque', image: carrelageMosaique },
  { value: 'a-definir', label: 'À définir', emoji: '❓' },
];

// Formats de carrelage
export const tileFormats: TileOption[] = [
  { value: 'grand-format', label: 'Grand format (60x60+)', image: carrelageGrandFormat },
  { value: 'rectangulaire', label: 'Rectangulaire (30x60)', image: carrelageRectangulaire },
  { value: 'carre', label: 'Carré (30x30)', image: carrelageCarre },
  { value: 'petit-format', label: 'Petit format (10x10)', image: carrelagePetitFormat },
  { value: 'hexagonal', label: 'Hexagonal', image: carrelageHexagonal },
  { value: 'metro', label: 'Métro', image: carrelageMetro },
  { value: 'mosaique', label: 'Mosaïque', image: carrelageMosaique },
  { value: 'a-definir', label: 'À définir', emoji: '❓' },
];

// Version simplifiée pour crédence cuisine (moins d'options)
export const backsplashTileTypes: TileOption[] = [
  { value: 'zellige', label: 'Zellige', image: carrelageZellige },
  { value: 'marbre', label: 'Effet marbre', image: carrelageMarbre },
  { value: 'ciment', label: 'Carreau ciment', image: carrelageCiment },
  { value: 'unicolore', label: 'Unicolore', image: carrelageUnicolore },
  { value: 'metro', label: 'Métro', image: carrelageMetro },
  { value: 'mosaique', label: 'Mosaïque', image: carrelageMosaique },
  { value: 'a-definir', label: 'À définir', emoji: '❓' },
];
