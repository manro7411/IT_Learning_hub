import { createContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
    upn?: string;
    name?: string;
    email?: string;
    groups?: string[];
    role?: string;
    exp?: number;
    [key: string]: unknown;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("accessToken")
    );

    const [user, setUser] = useState<User | null>(null);

    const decodeAndSetUser = (jwt: string) => {
        try {
            const decoded = jwtDecode<User>(jwt);
            setUser(decoded);
        } catch (e) {
            console.error("❌ Failed to decode token:", e);
            logout(); 
        }
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<User>(token);
                const now = Date.now() / 1000;
                if (decoded.exp && decoded.exp > now) {
                    setUser(decoded);
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        }
    }, [token]);

    const login = (jwt: string) => {
        localStorage.setItem("accessToken", jwt);
        setToken(jwt);
        decodeAndSetUser(jwt);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
