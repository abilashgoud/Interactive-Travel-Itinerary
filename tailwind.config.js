/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        'tripcraft-primary': 'hsl(var(--primary))',
        'tripcraft-secondary': 'hsl(var(--secondary))',
        'tripcraft-background': 'hsl(var(--background))',
        'tripcraft-accent': 'hsl(var(--accent))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "subtle-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.7)" },
          "50%": { boxShadow: "0 0 0 10px hsl(var(--primary) / 0)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "subtle-pulse": "subtle-pulse 2s infinite ease-in-out",
      },
      boxShadow: {
        'neumorphic-light': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neumorphic-light-inset': 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
        'neumorphic-dark': '5px 5px 10px #1e293b, -5px -5px 10px #3e4c5b',
        'neumorphic-dark-inset': 'inset 2px 2px 5px #1e293b, inset -2px -2px 5px #3e4c5b',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}