/**
 * Charte graphique officielle - Au Cœur du Vodun
 * Vert profond (#17372D) : Tradition, nature et sérénité.
 * Or traditionnel (#D3B36A) : Prestige et spiritualité.
 * Ivoire (#F6F2E9) : Clarté et lisibilité.
 * Terre cuite (#A65C3A) : Ancrage culturel.
 */

const tintColorLight = '#17372D';
const tintColorDark = '#D3B36A';

export const VodunPalette = {
  primary: '#17372D',      // Vert profond
  gold: '#D3B36A',         // Or traditionnel
  goldLight: '#F3E5C2',    // Or doux
  ivory: '#F6F2E9',        // Ivoire / fond naturel
  terracotta: '#A65C3A',   // Terre cuite
  surface: '#FFFFFF',      // Surface blanche
  textPrimary: '#152721',  // Texte foncé
  textMuted: '#687B72',    // Texte atténué
  border: '#E3DDD0',       // Bordure douce
  success: '#2E7D32',      // Succès / statut confirmé
  warning: '#D87A00',      // En attente
};

export default {
  light: {
    text: VodunPalette.textPrimary,
    background: VodunPalette.ivory,
    surface: VodunPalette.surface,
    tint: VodunPalette.primary,
    gold: VodunPalette.gold,
    terracotta: VodunPalette.terracotta,
    border: VodunPalette.border,
    tabIconDefault: '#9FAFA6',
    tabIconSelected: VodunPalette.primary,
  },
  dark: {
    text: '#F6F2E9',
    background: '#0F231D',
    surface: '#17372D',
    tint: VodunPalette.gold,
    gold: VodunPalette.gold,
    terracotta: VodunPalette.terracotta,
    border: '#24453A',
    tabIconDefault: '#5F796F',
    tabIconSelected: VodunPalette.gold,
  },
};
