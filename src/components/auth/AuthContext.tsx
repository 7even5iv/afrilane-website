import { createContext, useContext, useState } from 'react';

// Interface pour l'utilisateur
interface User {
    id?: number;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
}

// Interface pour les données de connexion
interface LoginData {
    token: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    role: string | null;
    login: (data: LoginData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('user_role'));

    const login = (data: LoginData) => {
        setToken(data.token);
        setRole(data.user.role);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('user_name', data.user.name);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setUser(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};