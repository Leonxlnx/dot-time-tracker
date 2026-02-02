export const theme = {
  colors: {
    background: '#000000',
    surface: '#0A0A0A',
    surfaceGlass: 'rgba(255, 255, 255, 0.06)',
    surfaceHover: 'rgba(255, 255, 255, 0.1)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.45)',
    textTertiary: 'rgba(255, 255, 255, 0.2)',

    // Dot color presets
    dotPresets: {
      default: {
        passed: '#FFFFFF',
        empty: 'rgba(255, 255, 255, 0.08)',
        today: '#D4AF37', // Champagne Gold
      },
      ocean: {
        passed: '#38BDF8',
        empty: 'rgba(56, 189, 248, 0.1)',
        today: '#0EA5E9',
      },
      mint: {
        passed: '#34D399',
        empty: 'rgba(52, 211, 153, 0.1)',
        today: '#10B981',
      },
      rose: {
        passed: '#FB7185',
        empty: 'rgba(251, 113, 133, 0.1)',
        today: '#F43F5E',
      },
      purple: {
        passed: '#A78BFA',
        empty: 'rgba(167, 139, 250, 0.1)',
        today: '#8B5CF6',
      },
    },

    border: 'rgba(255, 255, 255, 0.08)',
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  // Responsive dot sizing
  dots: {
    gap: {
      month: 6,
      year: 3,
      life: 5,
    },
    size: {
      month: { min: 32, max: 44 },
      year: { min: 8, max: 14 },
      life: { min: 20, max: 32 },
    },
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 44,
    hero: 72,
  },
  borderRadius: {
    sm: 8,
    md: 14,
    lg: 22,
    xl: 28,
    full: 999,
  },
  shadows: {
    none: {},
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    glass: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 10,
    },
    glow: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 6,
    },
  },
  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
    spring: {
      damping: 15,
      stiffness: 150,
    },
  },
};

export type Theme = typeof theme;
export type DotColorPreset = keyof typeof theme.colors.dotPresets;
