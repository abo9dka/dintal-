import {
    FiMoon,
    FiSun,
} from "react-icons/fi";

import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
                isDark
                    ? "التبديل إلى النمط المشمش"
                    : "التبديل إلى النمط الداكن"
            }
            title={
                isDark
                    ? "النمط المشمش"
                    : "النمط الداكن"
            }
        >
            {isDark ? (
                <FiSun size={18} />
            ) : (
                <FiMoon size={18} />
            )}
        </button>
    );
}

export default ThemeToggle;
