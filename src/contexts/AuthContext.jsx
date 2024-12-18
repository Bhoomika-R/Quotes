import React, { createContext, useState, useContext } from 'react';

import Cookies from "js-cookie";
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(Cookies.get('token'));
    const login = (newToken) => {
        setToken(newToken);
        Cookies.set("token", newToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            sameSite: "none",
        });
    };

    const logout = () => {
        setToken(null);
        Cookies.remove("token");
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

