import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaUserTie, FaSpinner, FaSave, FaEnvelope, 
    FaPhone, FaGraduationCap, FaCheckCircle, FaExclamationCircle,
    FaChalkboardTeacher,
} from "react-icons/fa";

const AddTeacherModal = ({ isOpen, onClose, onRefresh, editData = null }: any) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: "", 
        email: "", 
        specialty: "", 
        phone: "", 
        status: "interne"
    });

    // Remplir le formulaire en mode édition
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.user?.name || editData.name || "",
                email: editData.user?.email || editData.email || "",
                specialty: editData.specialty || "",
                phone: editData.phone || "",
                status: editData.status || "interne"
            });
        } else {
            setFormData({
                name: "", 
                email: "", 
                specialty: "", 
                phone: "", 
                status: "interne"
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nom complet requis";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
        if (!formData.specialty.trim()) newErrors.specialty = "Spécialité requise";
        if (!formData.phone.trim()) newErrors.phone = "Numéro de téléphone requis";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem("token");

        const url = editData 
            ? `http://localhost:8000/api/teachers/${editData.id}`
            : "http://localhost:8000/api/teachers";
        const method = editData ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onRefresh();
                onClose();
                setFormData({ name: "", email: "", specialty: "", phone: "", status: "interne" });
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
                                            <FaChalkboardTeacher className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier le formateur" : "Ajouter un formateur"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les informations du formateur" : "Ajoutez un nouveau formateur à l'équipe"}
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
                                    <FaUserTie size={10} /> Nom complet
                                </label>
                                <input 
                                    required 
                                    placeholder="Jean Dupont"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaEnvelope size={10} /> Email
                                </label>
                                <input 
                                    required 
                                    type="email" 
                                    placeholder="jean.dupont@exemple.com"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Spécialité */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaGraduationCap size={10} /> Spécialité
                                </label>
                                <input 
                                    required 
                                    placeholder="ex: Cybersécurité, Développement Web, Cloud..."
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.specialty ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.specialty}
                                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                                />
                                {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
                            </div>

                            {/* Téléphone */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaPhone size={10} /> Téléphone
                                </label>
                                <input 
                                    required 
                                    placeholder="+225 07 XX XX XX XX"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            {/* Statut (mode édition uniquement) */}
                            {editData && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaUserTie size={10} /> Statut
                                    </label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="interne">Interne</option>
                                        <option value="externe">Externe</option>
                                        <option value="vacataire">Vacataire</option>
                                    </select>
                                </div>
                            )}

                            {/* Aperçu des informations */}
                            {formData.name && formData.email && formData.specialty && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Nouveau formateur : {formData.name} - {formData.specialty}
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
                                    <><FaSpinner className="animate-spin" size={14} /> {editData ? "Mise à jour..." : "Ajout en cours..."}</>
                                ) : (
                                    <><FaSave size={14} /> {editData ? "Mettre à jour" : "Ajouter le formateur"}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddTeacherModal;