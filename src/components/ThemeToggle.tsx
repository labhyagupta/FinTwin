import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border shadow-sm
        bg-white dark:bg-[#1D2A1F]
        text-[#1F2D20] dark:text-[#EEF4EB]
        border-[#E3E9DA] dark:border-[#2F4433]
        hover:border-[#FACC15] dark:hover:border-[#FEF08A]
        hover:bg-[#FEF9C3]/40 dark:hover:bg-[#253829]"
      title={`Currently in ${isLight ? 'Light' : 'Dark'} mode. Click to toggle.`}
    >
      {isLight ? (
        <>
          {/* Sun icon */}
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" stroke="currentColor" fill="#FEF08A" />
            <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
          </svg>
          <span className="font-medium">Light</span>
        </>
      ) : (
        <>
          {/* Moon icon */}
          <svg className="w-4 h-4 text-[#FEF08A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" fill="#FEF08A" fillOpacity="0.3" />
          </svg>
          <span className="font-medium">Dark</span>
        </>
      )}
    </button>
  );
};
