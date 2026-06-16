import { createContext, useContext, useState} from 'react';

interface User {
    id?: number;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
}

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
    // Optimisation : On récupère les infos de base pour éviter l'affichage "Utilisateur" après un F5
    const [user, setUser] = useState<User | null>(() => {
        const name = localStorage.getItem('user_name');
        const role = localStorage.getItem('user_role');
        const email = localStorage.getItem('user_email'); // Optionnel
        if (name && role) return { name, role, email: email || "" } as User;
        return null;
    });

    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('user_role'));

    const login = (data: LoginData) => {
        setToken(data.token);
        setRole(data.user.role);
        setUser(data.user);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.user.role);
        localStorage.setItem("user_name", data.user.name);
        if (data.user.email) localStorage.setItem("user_email", data.user.email);
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