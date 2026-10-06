import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const response = await api.post("/login", {
            email,
            password,
        });

        const { user, token } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);

        return user;
    };

    const register = async (data) => {
        const response = await api.post("/register", data);

        const { user, token } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);

        return user;
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);
        }
    };

    const getCurrentUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                setUser(null);
            }
        }

        try {
            const response = await api.get("/me");

            const currentUser = response.data.data.user;

            localStorage.setItem(
                "user",
                JSON.stringify(currentUser)
            );

            setUser(currentUser);
        } catch (error) {
            const status = error?.response?.status;

            if (status === 401 || status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } else if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    setUser(null);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        getCurrentUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}