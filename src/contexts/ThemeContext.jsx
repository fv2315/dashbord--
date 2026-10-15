
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(
    "dashboard-theme",
    "light"
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme debe utilizarse dentro de ThemeProvider"
    );
  }

  return context;
}
