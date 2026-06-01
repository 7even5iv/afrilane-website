import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaSave, FaSpinner, FaBookOpen, FaUniversity,
    FaClock, FaPercentage, FaCheckCircle, FaExclamationCircle,
} from "react-icons/fa";

const AddModuleModal = ({ isOpen, onClose, onRefresh, editData = null }: any) => {
    const [loading, setLoading] = useState(false);
    const [trainings, setTrainings] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: "", 
        training_id: "", 
        hours: "", 
        coefficient: "1", 
        description: ""
    });

    // Charger les formations à l'ouverture
    useEffect(() => {
        if (isOpen) {
            const fetchTrainings = async () => {
                try {
                    const res = await fetch("http://localhost:8000/api/trainings", {
                        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
                    });
                    const data = await res.json();
                    setTrainings(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Erreur:", error);
                }
            };
            fetchTrainings();
        }
    }, [isOpen]);

    // Remplir le formulaire en mode édition
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                training_id: editData.training_id || "",
                hours: editData.hours || "",
                coefficient: editData.coefficient || "1",
                description: editData.description || ""
            });
        } else {
            setFormData({
                name: "", 
                training_id: "", 
                hours: "", 
                coefficient: "1", 
                description: ""
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nom du module requis";
        if (!formData.training_id) newErrors.training_id = "Veuillez sélectionner une formation";
        if (!formData.hours || Number(formData.hours) <= 0) 
            newErrors.hours = "Volume horaire invalide (doit être supérieur à 0)";
        if (!formData.coefficient || Number(formData.coefficient) <= 0) 
            newErrors.coefficient = "Coefficient invalide (doit être supérieur à 0)";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const url = editData 
            ? `http://localhost:8000/api/course-modules/${editData.id}`
            : "http://localhost:8000/api/course-modules";
        const method = editData ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    ...formData,
                    hours: Number(formData.hours),
                    coefficient: Number(formData.coefficient)
                })
            });

            if (res.ok) {
                onRefresh();
                onClose();
                setFormData({ name: "", training_id: "", hours: "", coefficient: "1", description: "" });
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

    const selectedTraining = trainings.find(t => t.id == formData.training_id);

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
                        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* HEADER AVEC DÉGRADÉ */}
                        <div className={`bg-gradient-to-r ${editData ? 'from-amber-600 to-amber-700' : 'from-blue-600 to-blue-700'} p-6 text-white`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <FaBookOpen className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier le module" : "Nouveau module"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les informations du module" : "Ajoutez une nouvelle unité d'enseignement"}
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
                            {/* Sélection de la formation */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUniversity size={10} /> Formation rattachée
                                </label>
                                <select 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.training_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                    value={formData.training_id}
                                    onChange={e => setFormData({...formData, training_id: e.target.value})}
                                >
                                    <option value="">Sélectionner une formation</option>
                                    {trainings.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.code})
                                        </option>
                                    ))}
                                </select>
                                {errors.training_id && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.training_id}</p>}
                            </div>

                            {/* Nom du module */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaBookOpen size={10} /> Nom du module
                                </label>
                                <input 
                                    required 
                                    placeholder="ex: Réseaux IP, Cybersécurité, Cloud Computing..."
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Heures et Coefficient */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaClock size={10} /> Volume horaire
                                    </label>
                                    <input 
                                        type="number" 
                                        required 
                                        placeholder="Heures"
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.hours ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.hours}
                                        onChange={e => setFormData({...formData, hours: e.target.value})}
                                        min="1"
                                        step="1"
                                    />
                                    {errors.hours && <p className="text-red-500 text-xs mt-1">{errors.hours}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaPercentage size={10} /> Coefficient
                                    </label>
                                    <input 
                                        type="number" 
                                        required 
                                        placeholder="Coefficient"
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.coefficient ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.coefficient}
                                        onChange={e => setFormData({...formData, coefficient: e.target.value})}
                                        min="0.5"
                                        step="0.5"
                                    />
                                    {errors.coefficient && <p className="text-red-500 text-xs mt-1">{errors.coefficient}</p>}
                                </div>
                            </div>

                            {/* Description (optionnelle) */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaBookOpen size={10} /> Description (optionnelle)
                                </label>
                                <textarea 
                                    rows={3}
                                    placeholder="Objectifs du module, prérequis, contenu..."
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            {/* Aperçu des informations */}
                            {selectedTraining && formData.name && formData.hours && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Module "{formData.name}" - {formData.hours}h - Coeff. {formData.coefficient}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Formation : {selectedTraining.name}
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
                                    <><FaSave size={14} /> {editData ? "Mettre à jour" : "Créer le module"}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddModuleModal;