/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cabinet Grotesk"', 'Syne', '"Plus Jakarta Sans"', 'sans-serif'],
        grotesk: ['"Cabinet Grotesk"', 'Syne', 'sans-serif'],
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'inner-glow-hover': 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'inner-subtle': 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
      colors: {
        canvas: "#000000",
        surface: {
          DEFAULT: "#0C0D0E",
          elevated: "#15171A",
        },
        edge: "#22252A",
        alabaster: "#F4F4F6",
        mist: "#9FA4B2",
        lemon: {
          DEFAULT: "#E2F952",
          hover: "#D2EA32",
          light: "#F0FD88",
          dark: "#B8D924",
          muted: "rgba(226, 249, 82, 0.12)",
        },
        sidi: {
          DEFAULT: "#E2F952",
          azure: "#3884E6",
          light: "#38BDF8",
          dark: "#0369A1",
        },
        ochre: {
          DEFAULT: "#E2F952",
          light: "#F0FD88",
          dark: "#B8D924",
          pure: "#D99B56",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sand: {
          50: '#FAF6F1',
          100: '#F3ECE2',
          200: '#E8DCC8',
          300: '#D6C3B3',
          400: '#C8A97E',
          500: '#B8925E',
          600: '#A07A48',
          700: '#7D5F38',
          800: '#5C4528',
          900: '#3B2C1A',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
