export const theme = {
  colors: {
    background: '#000000',
    surface: '#0C0C0C',
    surfaceElevated: '#141414',
    surfaceGlass: 'rgba(255, 255, 255, 0.03)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.55)',
    textTertiary: 'rgba(255, 255, 255, 0.3)',

    // Monochrome color system - all dots same color, today has ring
    dotPresets: {
      gold: {
        accent: '#C9A962',
        passed: '#C9A962',
        empty: 'rgba(255, 255, 255, 0.06)',
      },
      silver: {
        accent: '#A0A0A0',
        passed: '#A0A0A0',
        empty: 'rgba(255, 255, 255, 0.06)',
      },
      white: {
        accent: '#FFFFFF',
        passed: '#FFFFFF',
        empty: 'rgba(255, 255, 255, 0.06)',
      },
      blue: {
        accent: '#5B9BD5',
        passed: '#5B9BD5',
        empty: 'rgba(255, 255, 255, 0.06)',
      },
      green: {
        accent: '#6ABF69',
        passed: '#6ABF69',
        empty: 'rgba(255, 255, 255, 0.06)',
      },
      rose: {
        accent: '#D4767C',
        passed: '#D4767C',
        empty: 'rgba(255, 255, 255, 0.06)',
      },
      lavender: {
        accent: '#9D8EC9',
        passed: '#9D8EC9',
        empty: 'rgba(255, 255, 255, 0.06)',
      },
      coral: {
        accent: '#E07B53',
        passed: '#E07B53',
        empty: 'rgba(255, 255, 255, 0.06)',
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
    gapRatio: 0.35, // Gap = 35% of dot size for tighter but clean look
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 44,
    hero: 80,
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
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.6,
      shadowRadius: 30,
      elevation: 16,
    },
  },
  animation: {
    fast: 150,
    normal: 280,
    slow: 400,
    spring: {
      damping: 20,
      stiffness: 200,
    },
  },
};

export type Theme = typeof theme;
export type DotColorPreset = keyof typeof theme.colors.dotPresets;
