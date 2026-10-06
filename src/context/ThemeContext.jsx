import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");

        return savedTheme === "dark"
            ? "dark"
            : "light";
    });

    useEffect(() => {
        // HTML
        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        // Body
        document.body.setAttribute(
            "data-theme",
            theme
        );

        // LocalStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light"
                ? "dark"
                : "light"
        );
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
                isDark: theme === "dark",
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
}

