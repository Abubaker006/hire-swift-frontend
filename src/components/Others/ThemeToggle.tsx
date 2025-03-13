import React from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md shadow-md transition-all duration-300 hover:bg-white/20"
    >
      {theme === "vs-dark" ? (
        <Moon size={18} className="text-white transition-transform scale-100" />
      ) : (
        <Sun
          size={20}
          className="text-white transition-transform scale-110"
        />
      )}
    </button>
  );
};

export default ThemeToggle;
