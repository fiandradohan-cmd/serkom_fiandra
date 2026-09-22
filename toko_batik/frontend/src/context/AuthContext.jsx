import { createContext, useContext, useEffect, useState } from "react";
import { getToken, getSession, clearSession, saveSession } from "../utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getSession());

    const refreshSession = () => {
        setToken(getToken());
        setUser(getSession());
    };

    useEffect(() => {
        refreshSession();
        // Sinkron saat tab fokus kembali / storage berubah
        const onFocus = () => refreshSession();
        window.addEventListener("focus", onFocus);
        window.addEventListener("storage", onFocus);
        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("storage", onFocus);
        };
    }, []);

    const login = (newToken, newUser) => {
        saveSession(newToken, newUser);
        setToken(newToken);
        setUser({ token: newToken, user: newUser });
    };

    const logout = () => {
        clearSession();
        setToken(null);
        setUser(null);
    };

    const isLoggedIn = Boolean(token || getToken());
    const currentUser = user?.user || (user?.role ? user : null);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                currentUser,
                isLoggedIn,
                login,
                logout,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
