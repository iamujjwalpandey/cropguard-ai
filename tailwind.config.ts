import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        crop: {
          black: '#020805',
          deep: '#031b12',
          panel: '#062317',
          emerald: '#16f66a',
          neon: '#52ff7a',
          lime: '#b8ff5c',
          gold: '#f4b63f',
          danger: '#ff5050'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        glow: '0 0 40px rgba(22, 246, 106, 0.22)',
        'glow-lg': '0 0 80px rgba(22, 246, 106, 0.25)',
        panel: '0 20px 80px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'radial-emerald': 'radial-gradient(circle at top, rgba(22,246,106,0.22), transparent 35%)',
        'premium-gradient': 'linear-gradient(135deg, rgba(22,246,106,0.95), rgba(72,255,122,0.75), rgba(10,148,62,0.95))',
        'glass-gradient': 'linear-gradient(135deg, rgba(7,35,23,0.84), rgba(2,13,8,0.62))'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-110%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(110%)', opacity: '0' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 18px rgba(22,246,106,0.22)' },
          '50%': { boxShadow: '0 0 36px rgba(22,246,106,0.48)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '80px 80px' }
        }
      },
      animation: {
        scan: 'scan 2.8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        gridMove: 'gridMove 18s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
