import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaCalendarPlus, FaSpinner, FaClock, FaDoorOpen,
    FaCheckCircle, FaExclamationCircle, FaSave,
    FaUniversity, FaBookOpen, FaUserTie, FaCalendarAlt
} from "react-icons/fa";

const AddScheduleModal = ({ isOpen, onClose, onRefresh, editData = null }: any) => {
    const [loading, setLoading] = useState(false);
    const [trainings, setTrainings] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [formData, setFormData] = useState({
        training_id: "",
        course_module_id: "",
        teacher_id: "",
        day: "Lundi",
        start_time: "08:00",
        end_time: "12:00",
        room: ""
    });

    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    // Charger les données nécessaires pour les menus déroulants
    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('token');
            const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };
            
            Promise.all([
                fetch("http://localhost:8000/api/trainings", { headers }).then(res => res.json()),
                fetch("http://localhost:8000/api/course-modules", { headers }).then(res => res.json()),
                fetch("http://localhost:8000/api/teachers", { headers }).then(res => res.json())
            ]).then(([tData, mData, teData]) => {
                setTrainings(Array.isArray(tData) ? tData : []);
                setModules(Array.isArray(mData) ? mData : []);
                setTeachers(Array.isArray(teData) ? teData : []);
            }).catch(err => console.error("Erreur de chargement des données", err));
        }
    }, [isOpen]);

    // Remplir le formulaire en mode édition
    useEffect(() => {
        if (editData) {
            setFormData({
                training_id: editData.training_id || "",
                course_module_id: editData.course_module_id || "",
                teacher_id: editData.teacher_id || "",
                day: editData.day || "Lundi",
                start_time: editData.start_time || "08:00",
                end_time: editData.end_time || "12:00",
                room: editData.room || ""
            });
        } else {
            setFormData({
                training_id: "",
                course_module_id: "",
                teacher_id: "",
                day: "Lundi",
                start_time: "08:00",
                end_time: "12:00",
                room: ""
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.training_id) newErrors.training_id = "Veuillez sélectionner une formation";
        if (!formData.course_module_id) newErrors.course_module_id = "Veuillez sélectionner un module";
        if (!formData.teacher_id) newErrors.teacher_id = "Veuillez sélectionner un formateur";
        if (!formData.room.trim()) newErrors.room = "Veuillez indiquer la salle";
        if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
            newErrors.time = "L'heure de fin doit être postérieure à l'heure de début";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem("token");

        const url = editData 
            ? `http://localhost:8000/api/schedules/${editData.id}`
            : "http://localhost:8000/api/schedules";
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
                setFormData({
                    training_id: "", course_module_id: "", teacher_id: "",
                    day: "Lundi", start_time: "08:00", end_time: "12:00", room: ""
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

    // Filtrer les modules par formation sélectionnée
    const filteredModules = modules.filter(m => !formData.training_id || m.training_id == formData.training_id);
    
    // Obtenir les informations sélectionnées
    const selectedTraining = trainings.find(t => t.id == formData.training_id);
    const selectedModule = modules.find(m => m.id == formData.course_module_id);
    const selectedTeacher = teachers.find(t => t.id == formData.teacher_id);

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
                        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* HEADER AVEC DÉGRADÉ */}
                        <div className={`bg-gradient-to-r ${editData ? 'from-amber-600 to-amber-700' : 'from-blue-600 to-blue-700'} p-6 text-white`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <FaCalendarPlus className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier le créneau" : "Planifier un cours"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les informations du créneau" : "Organisation de l'emploi du temps"}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* SÉLECTION FORMATION */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaUniversity size={10} /> Spécialité
                                    </label>
                                    <select 
                                        required 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.training_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                        value={formData.training_id}
                                        onChange={e => setFormData({...formData, training_id: e.target.value, course_module_id: ""})}>
                                        <option value="">Choisir la spécialité...</option>
                                        {trainings.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                                    </select>
                                    {errors.training_id && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.training_id}</p>}
                                </div>

                                {/* SÉLECTION MODULE */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaBookOpen size={10} /> Unité d'Enseignement
                                    </label>
                                    <select 
                                        required 
                                        disabled={!formData.training_id}
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.course_module_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                        value={formData.course_module_id}
                                        onChange={e => setFormData({...formData, course_module_id: e.target.value})}>
                                        <option value="">Choisir le module...</option>
                                        {filteredModules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                    {errors.course_module_id && <p className="text-red-500 text-xs mt-1">{errors.course_module_id}</p>}
                                </div>
                            </div>

                            {/* SÉLECTION FORMATEUR */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUserTie size={10} /> Formateur assigné
                                </label>
                                <select 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.teacher_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                    value={formData.teacher_id}
                                    onChange={e => setFormData({...formData, teacher_id: e.target.value})}>
                                    <option value="">Sélectionner un formateur...</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name} - {t.specialty}</option>)}
                                </select>
                                {errors.teacher_id && <p className="text-red-500 text-xs mt-1">{errors.teacher_id}</p>}
                            </div>

                            {/* JOUR ET HEURES */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaCalendarAlt size={10} /> Jour
                                    </label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        value={formData.day}
                                        onChange={e => setFormData({...formData, day: e.target.value})}>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaClock size={10} /> Heure début
                                    </label>
                                    <input 
                                        type="time" 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        value={formData.start_time} 
                                        onChange={e => setFormData({...formData, start_time: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaClock size={10} /> Heure fin
                                    </label>
                                    <input 
                                        type="time" 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        value={formData.end_time} 
                                        onChange={e => setFormData({...formData, end_time: e.target.value})} />
                                </div>
                            </div>
                            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}

                            {/* SALLE */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaDoorOpen size={10} /> Localisation / Salle
                                </label>
                                <div className="relative">
                                    <FaDoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input 
                                        required 
                                        placeholder="Ex: Salle A, Labo Réseau, Distanciel..." 
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.room ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.room} 
                                        onChange={e => setFormData({...formData, room: e.target.value})} />
                                </div>
                                {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
                            </div>

                            {/* Aperçu des informations */}
                            {selectedTraining && selectedModule && selectedTeacher && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Cours programmé : {selectedModule.name}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {selectedTraining.name} - {selectedTeacher.user?.name}
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
                                    <><FaSave size={14} /> {editData ? "Mettre à jour" : "Enregistrer au planning"}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddScheduleModal;