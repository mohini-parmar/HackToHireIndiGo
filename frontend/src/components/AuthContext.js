import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const cookieUser = Cookies.get('user');
        if (cookieUser) {
            setUser(JSON.parse(cookieUser));
        }
    }, []);

    const login = (userData) => {
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
