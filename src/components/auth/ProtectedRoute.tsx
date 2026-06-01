import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
    children: React.ReactNode;
    allowedRoles?: string[]; // Optionnel : liste des rôles autorisés
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const { token, role } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Si l'utilisateur n'a pas le bon rôle, on le renvoie au dashboard de base
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;