import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaUserPlus, FaSpinner, FaShieldAlt, 
    FaUser, FaEnvelope, FaUserTag, FaCheckCircle, 
    FaExclamationCircle, FaSave,
    FaUserShield, FaChalkboardTeacher, FaUserGraduate
} from "react-icons/fa";

// Interfaces TypeScript
interface User {
    id?: number;
    name: string;
    email: string;
    role: string;
    password?: string;
}

interface Role {
    value: string;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
    description: string;
}

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
    editData?: User | null;
}

const AddUserModal = ({ isOpen, onClose, onRefresh, editData = null }: AddUserModalProps) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "password123",
        role: "admin"
    });

    // Remplir le formulaire en mode édition
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                email: editData.email || "",
                password: "", // En édition, laisser vide pour ne pas changer le mot de passe
                role: editData.role || "admin"
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "password123",
                role: "admin"
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nom complet requis";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
        if (!editData && !formData.password) newErrors.password = "Mot de passe requis";
        if (!editData && formData.password && formData.password.length < 6) newErrors.password = "Minimum 6 caractères";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem("token");

        const url = editData 
            ? `http://localhost:8000/api/users/${editData.id}`
            : "http://localhost:8000/api/users";
        const method = editData ? "PUT" : "POST";

        // En édition, ne pas envoyer le mot de passe s'il est vide
        const payload = { ...formData };
        if (editData && !payload.password) {
            delete (payload as any).password;
        }

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onRefresh();
                onClose();
                setFormData({ name: "", email: "", password: "password123", role: "admin" });
            } else {
                const data = await res.json();
                setErrors({ submit: data.message || "Erreur lors de l'enregistrement" });
            }
        } catch (error) {
            setErrors({ submit: "Erreur de connexion au serveur" });
        } finally {
            setLoading(false);
        }
    };

    const roles: Role[] = [
        { value: "admin", label: "Administrateur", icon: FaUserShield, color: "from-red-500 to-red-600", description: "Accès total à la plateforme" },
        { value: "formateur", label: "Formateur", icon: FaChalkboardTeacher, color: "from-blue-500 to-blue-600", description: "Gestion des cours et des notes" },
        { value: "secretaire", label: "Secrétaire / Gestionnaire", icon: FaUserTag, color: "from-amber-500 to-amber-600", description: "Gestion administrative" },
        { value: "etudiant", label: "Étudiant", icon: FaUserGraduate, color: "from-emerald-500 to-emerald-600", description: "Accès à son espace personnel" }
    ];

    const selectedRole = roles.find(r => r.value === formData.role);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* HEADER AVEC DÉGRADÉ */}
                        <div className={`bg-gradient-to-r ${editData ? 'from-amber-600 to-amber-700' : 'from-blue-600 to-blue-700'} p-6 text-white`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <FaUserPlus className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier l'utilisateur" : "Nouveau compte"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
                                    </p>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Nom complet */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUser size={10} /> Nom complet
                                </label>
                                <input 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    placeholder="Jean Dupont"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaEnvelope size={10} /> Email professionnel
                                </label>
                                <input 
                                    required 
                                    type="email" 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                    placeholder="jean.dupont@afrilane.cm"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Mot de passe (caché en édition) */}
                            {!editData && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaShieldAlt size={10} /> Mot de passe
                                    </label>
                                    <input 
                                        type="text" 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})} 
                                        placeholder="password123"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                            )}

                            {/* Rôle */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUserTag size={10} /> Rôle & Privilèges
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map(role => {
                                        const Icon = role.icon;
                                        const isSelected = formData.role === role.value;
                                        return (
                                            <button
                                                key={role.value}
                                                type="button"
                                                onClick={() => setFormData({...formData, role: role.value})}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                                    isSelected 
                                                        ? `bg-gradient-to-br ${role.color} text-white border-transparent shadow-md` 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <Icon size={16} />
                                                <span className="text-[10px] font-semibold">{role.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedRole && (
                                    <p className="text-[10px] text-gray-400 mt-1 ml-1">
                                        {selectedRole.description}
                                    </p>
                                )}
                            </div>

                            {/* Aperçu des informations */}
                            {formData.name && formData.email && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Nouvel utilisateur : {formData.name}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Rôle : {selectedRole?.label}
                                    </p>
                                </div>
                            )}

                            {/* Erreur générale */}
                            {errors.submit && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                    <p className="text-red-600 text-xs text-center flex items-center justify-center gap-2">
                                        <FaExclamationCircle size={12} /> {errors.submit}
                                    </p>
                                </div>
                            )}

                            {/* Bouton de soumission */}
                            <button 
                                disabled={loading} 
                                type="submit" 
                                className={`w-full ${editData ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2`}
                            >
                                {loading ? (
                                    <><FaSpinner className="animate-spin" size={14} /> {editData ? "Mise à jour..." : "Création en cours..."}</>
                                ) : (
                                    <><FaSave size={14} /> {editData ? "Mettre à jour" : "Créer le compte"}</>
                                )}
                            </button>

                            {/* Note sur le mot de passe par défaut (uniquement en création) */}
                            {!editData && (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                                    <FaShieldAlt className="text-amber-600 text-sm mt-0.5" />
                                    <p className="text-[10px] text-amber-700 leading-relaxed">
                                        Le mot de passe par défaut est <strong>password123</strong>. 
                                        L'utilisateur pourra le modifier dans ses paramètres.
                                    </p>
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddUserModal;