import { Type } from "@google/genai";

export interface CatCustomization {
  color: string;
  pattern: 'solid' | 'tabby' | 'spotted' | 'tuxedo';
  breed: 'shorthair' | 'siamese' | 'persian' | 'maine-coon';
}

export type GameState = 'menu' | 'playing';

export const CAT_COLORS = [
  { name: 'Orange', value: '#d97706' },
  { name: 'Black', value: '#171717' },
  { name: 'White', value: '#f5f5f5' },
  { name: 'Grey', value: '#737373' },
  { name: 'Brown', value: '#78350f' },
  { name: 'Cream', value: '#fef3c7' },
];

export const CAT_PATTERNS = [
  { id: 'solid', name: 'Solid' },
  { id: 'tabby', name: 'Tabby' },
  { id: 'spotted', name: 'Spotted' },
  { id: 'tuxedo', name: 'Tuxedo' },
];

export const CAT_BREEDS = [
  { id: 'shorthair', name: 'Domestic Shorthair' },
  { id: 'siamese', name: 'Siamese' },
  { id: 'persian', name: 'Persian' },
  { id: 'maine-coon', name: 'Maine Coon' },
];
