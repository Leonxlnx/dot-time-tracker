export const theme = {
  colors: {
    background: '#000000',
    surface: '#080808',
    surfaceElevated: '#0F0F0F',
    surfaceGlass: 'rgba(255, 255, 255, 0.04)',
    surfaceHover: 'rgba(255, 255, 255, 0.08)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.5)',
    textTertiary: 'rgba(255, 255, 255, 0.25)',

    // Premium minimalist dot color presets
    // Passed = subtle gray, Empty = barely visible, Today = accent
    dotPresets: {
      default: {
        passed: 'rgba(255, 255, 255, 0.55)',
        empty: 'rgba(255, 255, 255, 0.08)',
        today: '#C9A962', // Muted gold
      },
      silver: {
        passed: 'rgba(255, 255, 255, 0.45)',
        empty: 'rgba(255, 255, 255, 0.06)',
        today: '#E8E8E8', // Silver white
      },
      ocean: {
        passed: 'rgba(255, 255, 255, 0.45)',
        empty: 'rgba(255, 255, 255, 0.06)',
        today: '#64B5F6', // Soft blue
      },
      mint: {
        passed: 'rgba(255, 255, 255, 0.45)',
        empty: 'rgba(255, 255, 255, 0.06)',
        today: '#81C784', // Soft green
      },
      rose: {
        passed: 'rgba(255, 255, 255, 0.45)',
        empty: 'rgba(255, 255, 255, 0.06)',
        today: '#E57373', // Soft rose
      },
      purple: {
        passed: 'rgba(255, 255, 255, 0.45)',
        empty: 'rgba(255, 255, 255, 0.06)',
        today: '#B39DDB', // Soft lavender
      },
    },

    border: 'rgba(255, 255, 255, 0.06)',
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
  dots: {
    // Smaller dots with more spacing for premium feel
    gapRatio: 0.5, // Gap = 50% of dot size
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
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  animation: {
    fast: 120,
    normal: 220,
    slow: 350,
    spring: {
      damping: 18,
      stiffness: 180,
    },
  },
};

export type Theme = typeof theme;
export type DotColorPreset = keyof typeof theme.colors.dotPresets;
