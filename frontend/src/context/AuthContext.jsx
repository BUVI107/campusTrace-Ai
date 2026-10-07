import { createContext, useContext, useEffect, useState } from "react";
import {
    loginUser,
    registerUser,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken =
            localStorage.getItem("campusTraceToken");

        const savedUser =
            localStorage.getItem("campusTraceUser");

        if (savedToken) {
            setToken(savedToken);
        }

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Invalid saved user:", error);
                localStorage.removeItem("campusTraceUser");
            }
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        if (!data.success) {
            throw new Error(
                data.message || "Login failed"
            );
        }

        const receivedToken =
            data.token ||
            data.accessToken ||
            data.data?.token;

        const receivedUser =
            data.user ||
            data.data?.user;

        if (!receivedToken) {
            throw new Error(
                "Login successful, but JWT token was not returned by backend"
            );
        }

        localStorage.setItem(
            "campusTraceToken",
            receivedToken
        );

        if (receivedUser) {
            localStorage.setItem(
                "campusTraceUser",
                JSON.stringify(receivedUser)
            );
        }

        setToken(receivedToken);
        setUser(receivedUser || null);

        return data;
    };

    const register = async (userData) => {
        const data = await registerUser(userData);

        if (!data.success) {
            throw new Error(
                data.message || "Registration failed"
            );
        }

        return data;
    };

    const logout = () => {
        localStorage.removeItem("campusTraceToken");
        localStorage.removeItem("campusTraceUser");

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

export default AuthContext;