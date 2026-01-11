import { useTheme } from "../../theme/useTheme";
import "./AppHeader.css";

export function AppHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="app-header">
      <h1 className="app-title">Prompt Manager</h1>

      <button className="theme-toggle" onClick={toggle}>
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </header>
  );
}