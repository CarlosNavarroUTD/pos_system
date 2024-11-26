// components/Button.jsx
export const Button = ({ children, className, ...props }) => (
    <button 
      className={`bg-axol-purple-primary hover:bg-axol-purple-light text-white px-4 py-2 rounded-md shadow-neon hover:shadow-neon-lg transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );