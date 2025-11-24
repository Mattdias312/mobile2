const palette = {
    primary: '#6750A4',
    secondary: '#4ECDC4',
    accent: '#FF7A18',
    background: '#F4F5FB',
    surface: '#FFFFFF',
    text: '#1E1E2F',
    muted: '#8A94A6',
    border: '#E2E6F0',
    danger: '#FF5F6D',
    success: '#34C759',
};

export const theme = {
    colors: palette,
    spacing: {
        xs: 6,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 8,
        md: 14,
        lg: 22,
    },
    shadow: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 8,
        },
    },
};

export type Theme = typeof theme;

