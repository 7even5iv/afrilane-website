import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaBook, FaSpinner, FaSave, FaEdit,
    FaTag, FaClock, FaMoneyBillWave, FaCode, FaCheckCircle,
    FaExclamationCircle, FaUsers,
} from "react-icons/fa";

const AddTrainingModal = ({ isOpen, onClose, onRefresh, editData = null }: any) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: "", 
        code: "", 
        duration_months: "", 
        price: "", 
        category: "IT & Tech",
        description: ""
    });

    // Si on est en mode édition, on remplit le formulaire avec les données existantes
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                code: editData.code || "",
                duration_months: editData.duration_months || "",
                price: editData.price || "",
                category: editData.category || "IT & Tech",
                description: editData.description || ""
            });
        } else {
            setFormData({ 
                name: "", 
                code: "", 
                duration_months: "", 
                price: "", 
                category: "IT & Tech",
                description: ""
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nom de la formation requis";
        if (!formData.code.trim()) newErrors.code = "Code de formation requis";
        if (!formData.duration_months || Number(formData.duration_months) <= 0) 
            newErrors.duration_months = "Durée invalide (doit être supérieure à 0)";
        if (!formData.price || Number(formData.price) <= 0) 
            newErrors.price = "Prix invalide (doit être supérieur à 0)";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem("token");

        const url = editData
            ? `http://localhost:8000/api/trainings/${editData.id}`
            : "http://localhost:8000/api/trainings";

        const method = editData ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    duration_months: Number(formData.duration_months),
                    price: Number(formData.price)
                })
            });

            if (res.ok) {
                onRefresh();
                onClose();
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

    const categories = [
        { value: "IT & Tech", label: "IT & Tech", icon: FaCode, color: "blue", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
        { value: "Administration", label: "Administration", icon: FaUsers, color: "purple", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
        { value: "Finance", label: "Finance", icon: FaMoneyBillWave, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
        { value: "Design", label: "Design", icon: FaBook, color: "pink", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
        { value: "Administration", label: "Administration", icon: FaUsers, color: "purple", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    ];

    const getCategoryStyle = (category: string) => {
        const cat = categories.find(c => c.value === category);
        return cat || categories[0];
    };

    if (!isOpen) return null;

    const categoryStyle = getCategoryStyle(formData.category);
    const CategoryIcon = categoryStyle.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
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
                                            {editData ? <FaEdit className="text-white" /> : <FaBook className="text-white" />}
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier la formation" : "Nouvelle formation"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les informations de la formation" : "Ajoutez une nouvelle formation au catalogue"}
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
                            {/* Nom de la formation */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaBook size={10} /> Nom de la formation
                                </label>
                                <input 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                    placeholder="ex: Développement Web Full Stack"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.name}</p>}
                            </div>

                            {/* Code et Catégorie */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaCode size={10} /> Code
                                    </label>
                                    <input 
                                        required 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.code ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })} 
                                        placeholder="ex: DW-101"
                                    />
                                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaTag size={10} /> Catégorie
                                    </label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Durée et Prix */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaClock size={10} /> Durée (Mois)
                                    </label>
                                    <input 
                                        required 
                                        type="number" 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.duration_months ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.duration_months}
                                        onChange={e => setFormData({ ...formData, duration_months: e.target.value })} 
                                        placeholder="6"
                                        min="1"
                                    />
                                    {errors.duration_months && <p className="text-red-500 text-xs mt-1">{errors.duration_months}</p>}
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaMoneyBillWave size={10} /> Prix (FCFA)
                                    </label>
                                    <input 
                                        required 
                                        type="number" 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.price ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })} 
                                        placeholder="250000"
                                        min="0"
                                        step="1000"
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            {/* Description (optionnelle) */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaBook size={10} /> Description (optionnelle)
                                </label>
                                <textarea 
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                    placeholder="Description détaillée de la formation..."
                                />
                            </div>

                            {/* Aperçu de la catégorie */}
                            <div className="flex items-center gap-2 pt-2 pb-1">
                                <span className="text-xs text-gray-400">Catégorie sélectionnée :</span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                                    <CategoryIcon size={10} />
                                    {formData.category}
                                </span>
                            </div>

                            {/* Aperçu des informations */}
                            {formData.name && formData.code && formData.price && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Formation : {formData.name} ({formData.code})
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {Number(formData.duration_months)} mois - {Number(formData.price).toLocaleString()} FCFA
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
                                    <><FaSave size={14} /> {editData ? "Mettre à jour" : "Créer la formation"}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddTrainingModal;