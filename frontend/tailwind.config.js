// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal
        'axol-dark': {
          900: '#0A0A0B',  // Fondo más oscuro
          800: '#121214',  // Fondo de componentes
          700: '#1A1A1F',  // Fondo de cards
          600: '#2D2D35',  // Bordes y divisores
        },
        'axol-purple': {
          primary: '#9333EA',    // Morado principal
          glow: '#A855F7',       // Morado para efectos glow
          light: '#C084FC',      // Morado claro para hover
        }
      },
      boxShadow: {
        'neon-sm': '0 0 5px theme(colors.axol-purple.glow)',
        'neon': '0 0 10px theme(colors.axol-purple.glow)',
        'neon-lg': '0 0 15px theme(colors.axol-purple.glow)',
        'neon-xl': '0 0 20px theme(colors.axol-purple.glow)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { 
            boxShadow: '0 0 10px theme(colors.axol-purple.glow)',
          },
          '50%': { 
            boxShadow: '0 0 20px theme(colors.axol-purple.glow)',
          },
        }
      },
    },
  },
  plugins: [],
}