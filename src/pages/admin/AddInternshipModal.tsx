import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaBriefcase, FaSpinner, FaUserGraduate, FaBuilding, 
    FaUserTie, FaCalendarAlt, FaSave, FaCheckCircle, FaExclamationCircle,
} from "react-icons/fa";

const AddInternshipModal = ({ isOpen, onClose, onRefresh, editData = null }: any) => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        student_id: "", 
        company_name: "", 
        supervisor_name: "",
        start_date: "", 
        end_date: "", 
        status: "en_cours"
    });

    // Charger les étudiants à l'ouverture
    useEffect(() => {
        if (isOpen) {
            const fetchStudents = async () => {
                try {
                    const res = await fetch("http://localhost:8000/api/students", {
                        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
                    });
                    const data = await res.json();
                    setStudents(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Erreur:", error);
                }
            };
            fetchStudents();
        }
    }, [isOpen]);

    // Remplir le formulaire en mode édition
    useEffect(() => {
        if (editData) {
            setFormData({
                student_id: editData.student_id || "",
                company_name: editData.company_name || "",
                supervisor_name: editData.supervisor_name || "",
                start_date: editData.start_date || "",
                end_date: editData.end_date || "",
                status: editData.status || "en_cours"
            });
        } else {
            setFormData({
                student_id: "", 
                company_name: "", 
                supervisor_name: "",
                start_date: "", 
                end_date: "", 
                status: "en_cours"
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.student_id) newErrors.student_id = "Veuillez sélectionner un étudiant";
        if (!formData.company_name.trim()) newErrors.company_name = "Nom de l'entreprise requis";
        if (!formData.supervisor_name.trim()) newErrors.supervisor_name = "Nom du maître de stage requis";
        if (!formData.start_date) newErrors.start_date = "Date de début requise";
        if (formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) 
            newErrors.end_date = "La date de fin doit être postérieure à la date de début";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const url = editData 
            ? `http://localhost:8000/api/internships/${editData.id}`
            : "http://localhost:8000/api/internships";
        const method = editData ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onRefresh();
                onClose();
                setFormData({ 
                    student_id: "", company_name: "", supervisor_name: "", 
                    start_date: "", end_date: "", status: "en_cours" 
                });
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

    const selectedStudent = students.find(s => s.id == formData.student_id);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
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
                                            <FaBriefcase className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier le Stage" : "Nouveau Stage"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les informations du stage" : "Ajoutez un nouveau stage dans le suivi"}
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
                            {/* Sélection étudiant */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUserGraduate size={10} /> Étudiant
                                </label>
                                <select 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.student_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                    value={formData.student_id}
                                    onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                                >
                                    <option value="">Sélectionner un étudiant</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.name} ({s.matricule})
                                        </option>
                                    ))}
                                </select>
                                {errors.student_id && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.student_id}</p>}
                            </div>

                            {/* Entreprise */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaBuilding size={10} /> Entreprise
                                </label>
                                <input 
                                    required 
                                    placeholder="Nom de l'entreprise"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.company_name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.company_name}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                />
                                {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                            </div>

                            {/* Maître de stage */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUserTie size={10} /> Maître de stage
                                </label>
                                <input 
                                    required 
                                    placeholder="Nom complet du maître de stage"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.supervisor_name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.supervisor_name}
                                    onChange={e => setFormData({ ...formData, supervisor_name: e.target.value })}
                                />
                                {errors.supervisor_name && <p className="text-red-500 text-xs mt-1">{errors.supervisor_name}</p>}
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaCalendarAlt size={10} /> Date début
                                    </label>
                                    <input 
                                        type="date" 
                                        required 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.start_date ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.start_date}
                                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                    />
                                    {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaCalendarAlt size={10} /> Date fin
                                    </label>
                                    <input 
                                        type="date" 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.end_date ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.end_date}
                                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                    {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                                </div>
                            </div>

                            {/* Statut (mode édition uniquement) */}
                            {editData && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaBriefcase size={10} /> Statut
                                    </label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="en_cours">En cours</option>
                                        <option value="termine">Terminé</option>
                                    </select>
                                </div>
                            )}

                            {/* Aperçu des informations */}
                            {selectedStudent && formData.company_name && formData.supervisor_name && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Stage chez {formData.company_name} encadré par {formData.supervisor_name}
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
                                    <><FaSpinner className="animate-spin" size={14} /> {editData ? "Mise à jour..." : "Enregistrement..."}</>
                                ) : (
                                    <><FaSave size={14} /> {editData ? "Mettre à jour" : "Enregistrer le stage"}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddInternshipModal;