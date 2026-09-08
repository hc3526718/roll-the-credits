// Genre/Tone combo system (GDT-style genre-topic compatibility)

import { FilmGenre, FilmTone, ComboRating } from './types-gdt';

// Define which genre+tone combos are great/good/neutral/poor
export const COMBO_RATINGS: ComboRating[] = [
  // Action combos
  { genre: 'Action', tone: 'Gritty', rating: 'great', audienceBoost: 20, qualityBoost: 15 },
  { genre: 'Action', tone: 'Modern', rating: 'good', audienceBoost: 15, qualityBoost: 10 },
  { genre: 'Action', tone: 'Uplifting', rating: 'neutral', audienceBoost: 5, qualityBoost: 5 },
  { genre: 'Action', tone: 'Whimsical', rating: 'poor', audienceBoost: -10, qualityBoost: -15 },
  
  // Drama combos
  { genre: 'Drama', tone: 'Serious', rating: 'great', audienceBoost: 15, qualityBoost: 20 },
  { genre: 'Drama', tone: 'Gritty', rating: 'good', audienceBoost: 12, qualityBoost: 15 },
  { genre: 'Drama', tone: 'Nostalgic', rating: 'good', audienceBoost: 10, qualityBoost: 12 },
  { genre: 'Drama', tone: 'Whimsical', rating: 'poor', audienceBoost: -8, qualityBoost: -12 },
  
  // Comedy combos
  { genre: 'Comedy', tone: 'Whimsical', rating: 'great', audienceBoost: 18, qualityBoost: 15 },
  { genre: 'Comedy', tone: 'Satirical', rating: 'great', audienceBoost: 15, qualityBoost: 18 },
  { genre: 'Comedy', tone: 'Uplifting', rating: 'good', audienceBoost: 12, qualityBoost: 10 },
  { genre: 'Comedy', tone: 'Dark', rating: 'neutral', audienceBoost: 5, qualityBoost: 8 },
  { genre: 'Comedy', tone: 'Gritty', rating: 'poor', audienceBoost: -10, qualityBoost: -10 },
  
  // Horror combos
  { genre: 'Horror', tone: 'Dark', rating: 'great', audienceBoost: 20, qualityBoost: 18 },
  { genre: 'Horror', tone: 'Gritty', rating: 'good', audienceBoost: 15, qualityBoost: 12 },
  { genre: 'Horror', tone: 'Experimental', rating: 'good', audienceBoost: 10, qualityBoost: 15 },
  { genre: 'Horror', tone: 'Uplifting', rating: 'poor', audienceBoost: -15, qualityBoost: -20 },
  
  // Thriller combos
  { genre: 'Thriller', tone: 'Dark', rating: 'great', audienceBoost: 18, qualityBoost: 15 },
  { genre: 'Thriller', tone: 'Gritty', rating: 'great', audienceBoost: 16, qualityBoost: 14 },
  { genre: 'Thriller', tone: 'Serious', rating: 'good', audienceBoost: 12, qualityBoost: 12 },
  { genre: 'Thriller', tone: 'Whimsical', rating: 'poor', audienceBoost: -12, qualityBoost: -15 },
  
  // Romance combos
  { genre: 'Romance', tone: 'Uplifting', rating: 'great', audienceBoost: 18, qualityBoost: 15 },
  { genre: 'Romance', tone: 'Nostalgic', rating: 'good', audienceBoost: 15, qualityBoost: 12 },
  { genre: 'Romance', tone: 'Whimsical', rating: 'good', audienceBoost: 12, qualityBoost: 10 },
  { genre: 'Romance', tone: 'Gritty', rating: 'poor', audienceBoost: -8, qualityBoost: -10 },
  
  // Sci-Fi combos
  { genre: 'Sci-Fi', tone: 'Modern', rating: 'great', audienceBoost: 20, qualityBoost: 18 },
  { genre: 'Sci-Fi', tone: 'Experimental', rating: 'good', audienceBoost: 15, qualityBoost: 20 },
  { genre: 'Sci-Fi', tone: 'Dark', rating: 'good', audienceBoost: 14, qualityBoost: 15 },
  { genre: 'Sci-Fi', tone: 'Nostalgic', rating: 'poor', audienceBoost: -5, qualityBoost: -8 },
  
  // Fantasy combos
  { genre: 'Fantasy', tone: 'Whimsical', rating: 'great', audienceBoost: 20, qualityBoost: 18 },
  { genre: 'Fantasy', tone: 'Classic', rating: 'good', audienceBoost: 15, qualityBoost: 15 },
  { genre: 'Fantasy', tone: 'Dark', rating: 'good', audienceBoost: 14, qualityBoost: 14 },
  { genre: 'Fantasy', tone: 'Gritty', rating: 'neutral', audienceBoost: 8, qualityBoost: 8 },
  
  // Documentary combos
  { genre: 'Documentary', tone: 'Serious', rating: 'great', audienceBoost: 12, qualityBoost: 25 },
  { genre: 'Documentary', tone: 'Experimental', rating: 'good', audienceBoost: 10, qualityBoost: 20 },
  { genre: 'Documentary', tone: 'Uplifting', rating: 'good', audienceBoost: 15, qualityBoost: 12 },
  { genre: 'Documentary', tone: 'Whimsical', rating: 'poor', audienceBoost: -10, qualityBoost: -15 },
  
  // Musical combos
  { genre: 'Musical', tone: 'Uplifting', rating: 'great', audienceBoost: 20, qualityBoost: 18 },
  { genre: 'Musical', tone: 'Whimsical', rating: 'good', audienceBoost: 18, qualityBoost: 15 },
  { genre: 'Musical', tone: 'Classic', rating: 'good', audienceBoost: 15, qualityBoost: 15 },
  { genre: 'Musical', tone: 'Dark', rating: 'neutral', audienceBoost: 8, qualityBoost: 10 }
];

export function getComboRating(genre: FilmGenre, tone: FilmTone): ComboRating | null {
  const match = COMBO_RATINGS.find(c => c.genre === genre && c.tone === tone);
  
  // If no specific rating defined, return neutral
  if (!match) {
    return {
      genre,
      tone,
      rating: 'neutral',
      audienceBoost: 0,
      qualityBoost: 0
    };
  }
  
  return match;
}

export function getComboDescription(rating: 'great' | 'good' | 'neutral' | 'poor'): string {
  const descriptions = {
    'great': '⭐ Excellent pairing! Critics and audiences love this combo.',
    'good': '✓ Solid choice. This combination works well.',
    'neutral': '○ Acceptable. Nothing special but not harmful.',
    'poor': '✗ Risky pairing. This combo may hurt your scores.'
  };
  return descriptions[rating];
}

export function getAvailableGenres(unlocked: FilmGenre[]): FilmGenre[] {
  return unlocked;
}

export function getAvailableTones(unlocked: FilmTone[]): FilmTone[] {
  return unlocked;
}
