import { useState, useEffect } from "react";
import { FaTimes, FaCalendarCheck, FaSpinner, FaUser, FaBook, FaUserGraduate, FaClock, FaExclamationCircle, FaSave } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AddAttendanceModal = ({ isOpen, onClose, onRefresh }: any) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [filteredModules, setFilteredModules] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [formData, setFormData] = useState({
        student_id: "",
        training_id: "",
        course_module_id: "",
        date: new Date().toISOString().split('T')[0],
        status: "present",
        observation: ""
    });

    // Charger les étudiants et les modules à l'ouverture
    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('token');
            const headers = { "Authorization": `Bearer ${token}` };

            Promise.all([
                fetch("http://localhost:8000/api/students", { headers }).then(res => res.json()),
                fetch("http://localhost:8000/api/course-modules", { headers }).then(res => res.json())
            ]).then(([studentsData, modulesData]) => {
                setStudents(Array.isArray(studentsData) ? studentsData : []);
                setModules(Array.isArray(modulesData) ? modulesData : []);
            }).catch(error => {
                console.error("Erreur chargement:", error);
            });
        }
    }, [isOpen]);

    // Filtrer les modules selon la formation de l'étudiant
    useEffect(() => {
        if (formData.training_id) {
            const filtered = modules.filter(m => m.training_id == formData.training_id);
            setFilteredModules(filtered);
        } else {
            setFilteredModules([]);
        }
        // Réinitialiser le module sélectionné quand la formation change
        setFormData(prev => ({ ...prev, course_module_id: "" }));
    }, [formData.training_id, modules]);

    // Logique pour lier automatiquement la formation quand on choisit un étudiant
    const handleStudentChange = (id: string) => {
        const student = students.find(s => s.id === parseInt(id));
        setFormData({
            ...formData,
            student_id: id,
            training_id: student ? student.training_id : "",
            course_module_id: "" // Réinitialiser le module
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.student_id) newErrors.student_id = "Veuillez sélectionner un étudiant";
        if (!formData.course_module_id) newErrors.course_module_id = "Veuillez sélectionner un module";
        if (!formData.date) newErrors.date = "Date requise";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:8000/api/attendances", {
                method: "POST",
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
                    student_id: "",
                    training_id: "",
                    course_module_id: "",
                    date: new Date().toISOString().split('T')[0],
                    status: "present",
                    observation: ""
                });
                setErrors({});
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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'present':
                return { label: 'Présent', icon: FaUserCheck, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' };
            case 'absent':
                return { label: 'Absent', icon: FaUserTimes, color: 'from-red-500 to-red-600', bg: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' };
            case 'retard':
                return { label: 'Retard', icon: FaClock, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' };
            default:
                return { label: 'Présent', icon: FaUserCheck, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' };
        }
    };

    // Récupérer le nom de la formation de l'étudiant sélectionné
    const selectedStudent = students.find(s => s.id == formData.student_id);
    const currentStatusConfig = getStatusConfig(formData.status);
    const StatusIcon = currentStatusConfig.icon;

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
                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <FaCalendarCheck className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">Marquer la présence</h2>
                                    </div>
                                    <p className="text-white/80 text-xs">Enregistrez la présence d'un étudiant</p>
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
                                    onChange={e => handleStudentChange(e.target.value)}
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

                            {/* Information formation (lecture seule) */}
                            {selectedStudent && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-2">
                                        <FaBook size={10} />
                                        Formation : {selectedStudent.training?.name || 'Non assignée'}
                                    </p>
                                </div>
                            )}

                            {/* Sélection module (filtré par formation) */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaBook size={10} /> Module
                                </label>
                                <select 
                                    required 
                                    disabled={!formData.training_id}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.course_module_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                    value={formData.course_module_id}
                                    onChange={e => setFormData({...formData, course_module_id: e.target.value})}
                                >
                                    <option value="">{formData.training_id ? "Sélectionner un module" : "Sélectionnez d'abord un étudiant"}</option>
                                    {filteredModules.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                                {errors.course_module_id && <p className="text-red-500 text-xs mt-1">{errors.course_module_id}</p>}
                            </div>

                            {/* Date et Statut */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaCalendarCheck size={10} /> Date
                                    </label>
                                    <input 
                                        type="date" 
                                        required 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.date ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                    />
                                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaClock size={10} /> Statut
                                    </label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="present">Présent</option>
                                        <option value="absent">Absent</option>
                                        <option value="retard">En retard</option>
                                    </select>
                                </div>
                            </div>

                            {/* Observation */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaCalendarCheck size={10} /> Observation (optionnel)
                                </label>
                                <textarea 
                                    placeholder="Ex: Justifié par appel du parent, motif médical..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
                                    value={formData.observation}
                                    onChange={e => setFormData({...formData, observation: e.target.value})}
                                />
                            </div>

                            {/* Résumé */}
                            {formData.student_id && formData.course_module_id && (
                                <div className={`p-3 rounded-xl ${currentStatusConfig.bg} border ${currentStatusConfig.borderColor}`}>
                                    <p className={`text-xs font-medium ${currentStatusConfig.textColor} flex items-center gap-1`}>
                                        <StatusIcon size={10} />
                                        {currentStatusConfig.label === 'Présent' && 'Présence enregistrée pour '}
                                        {currentStatusConfig.label === 'Absent' && 'Absence enregistrée pour '}
                                        {currentStatusConfig.label === 'Retard' && 'Retard enregistré pour '}
                                        <span className="font-semibold">
                                            {selectedStudent?.user?.name || "l'étudiant"}
                                        </span>
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
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                            >
                                {loading ? (
                                    <><FaSpinner className="animate-spin" size={14} /> Enregistrement...</>
                                ) : (
                                    <><FaSave size={14} /> Enregistrer la présence</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Composants supplémentaires nécessaires
const FaUserCheck = ({ size, className }: any) => <FaUser className={className} size={size} />;
const FaUserTimes = ({ size, className }: any) => <FaUser className={className} size={size} />;

export default AddAttendanceModal;