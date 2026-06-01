import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaFileSignature, FaSpinner, FaUserGraduate, 
    FaBook, FaCalculator, FaSave, FaCheckCircle, 
    FaExclamationCircle, FaChartLine, 
} from "react-icons/fa";

const AddGradeModal = ({ isOpen, onClose, onRefresh, editData = null }: any) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [formData, setFormData] = useState({
        student_id: "",
        course_module_id: "",
        cc_score: "",
        exam_score: ""
    });

    // Charger les ressources nécessaires
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const token = localStorage.getItem('token');
                const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };
                
                try {
                    const [studentsRes, modulesRes] = await Promise.all([
                        fetch("http://localhost:8000/api/students", { headers }),
                        fetch("http://localhost:8000/api/course-modules", { headers })
                    ]);
                    
                    const studentsData = await studentsRes.json();
                    const modulesData = await modulesRes.json();
                    
                    setStudents(Array.isArray(studentsData) ? studentsData : []);
                    setModules(Array.isArray(modulesData) ? modulesData : []);
                } catch (error) {
                    console.error("Erreur chargement:", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    // Remplir le formulaire en mode édition
    useEffect(() => {
        if (editData) {
            setFormData({
                student_id: editData.student_id || "",
                course_module_id: editData.course_module_id || "",
                cc_score: editData.cc_score || "",
                exam_score: editData.exam_score || ""
            });
        } else {
            setFormData({
                student_id: "",
                course_module_id: "",
                cc_score: "",
                exam_score: ""
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    // Calculer la moyenne prévisionnelle (40% CC, 60% Exam)
    const previewAverage = () => {
        const cc = parseFloat(formData.cc_score) || 0;
        const exam = parseFloat(formData.exam_score) || 0;
        const avg = (cc * 0.4 + exam * 0.6);
        return { value: avg.toFixed(2), isPassing: avg >= 10 };
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.student_id) newErrors.student_id = "Veuillez sélectionner un étudiant";
        if (!formData.course_module_id) newErrors.course_module_id = "Veuillez sélectionner un module";
        
        const cc = parseFloat(formData.cc_score);
        const exam = parseFloat(formData.exam_score);
        
        if (isNaN(cc) || cc < 0 || cc > 20) newErrors.cc_score = "Note CC invalide (0-20)";
        if (isNaN(exam) || exam < 0 || exam > 20) newErrors.exam_score = "Note examen invalide (0-20)";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const token = localStorage.getItem("token");

        const url = editData 
            ? `http://localhost:8000/api/grades/${editData.id}`
            : "http://localhost:8000/api/grades";
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
                    cc_score: parseFloat(formData.cc_score),
                    exam_score: parseFloat(formData.exam_score)
                })
            });

            if (res.ok) {
                onRefresh();
                onClose();
                setFormData({ student_id: "", course_module_id: "", cc_score: "", exam_score: "" });
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

    const avgPreview = previewAverage();
    const selectedStudent = students.find(s => s.id == formData.student_id);
    const selectedModule = modules.find(m => m.id == formData.course_module_id);

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
                                            <FaFileSignature className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier la note" : "Saisie des notes"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les notes de l'étudiant" : "Évaluation des compétences académiques"}
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
                            {/* ÉTUDIANT */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUserGraduate size={10} /> Étudiant
                                </label>
                                <select 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.student_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                    value={formData.student_id}
                                    onChange={e => setFormData({...formData, student_id: e.target.value})}
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

                            {/* MODULE */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaBook size={10} /> Unité d'Enseignement
                                </label>
                                <select 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.course_module_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                    value={formData.course_module_id}
                                    onChange={e => setFormData({...formData, course_module_id: e.target.value})}
                                >
                                    <option value="">Sélectionner un module</option>
                                    {modules.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} {m.training?.name && `(${m.training.name})`}
                                        </option>
                                    ))}
                                </select>
                                {errors.course_module_id && <p className="text-red-500 text-xs mt-1">{errors.course_module_id}</p>}
                            </div>

                            {/* NOTES CC ET EXAMEN */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaCalculator size={10} /> Note CC / 20
                                    </label>
                                    <input 
                                        type="number" 
                                        step="0.25" 
                                        min="0" 
                                        max="20" 
                                        required 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.cc_score ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-center font-semibold`}
                                        value={formData.cc_score}
                                        onChange={e => setFormData({...formData, cc_score: e.target.value})}
                                        placeholder="0-20"
                                    />
                                    {errors.cc_score && <p className="text-red-500 text-xs mt-1">{errors.cc_score}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <FaChartLine size={10} /> Note Examen / 20
                                    </label>
                                    <input 
                                        type="number" 
                                        step="0.25" 
                                        min="0" 
                                        max="20" 
                                        required 
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.exam_score ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-center font-semibold`}
                                        value={formData.exam_score}
                                        onChange={e => setFormData({...formData, exam_score: e.target.value})}
                                        placeholder="0-20"
                                    />
                                    {errors.exam_score && <p className="text-red-500 text-xs mt-1">{errors.exam_score}</p>}
                                </div>
                            </div>

                            {/* APERÇU MOYENNE */}
                            {(formData.cc_score || formData.exam_score) && (
                                <div className={`p-4 rounded-xl ${avgPreview.isPassing ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FaCalculator className={avgPreview.isPassing ? 'text-emerald-600' : 'text-amber-600'} size={14} />
                                            <span className={`text-xs font-semibold ${avgPreview.isPassing ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                Moyenne prévisionnelle :
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-2xl font-bold ${avgPreview.isPassing ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {avgPreview.value}
                                            </span>
                                            <span className="text-xs text-gray-400">/20</span>
                                            {avgPreview.isPassing ? (
                                                <FaCheckCircle className="text-emerald-500" size={14} />
                                            ) : (
                                                <FaExclamationCircle className="text-amber-500" size={14} />
                                            )}
                                        </div>
                                    </div>
                                    <p className={`text-xs mt-2 ${avgPreview.isPassing ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {avgPreview.isPassing 
                                            ? "✅ L'étudiant est admis avec cette moyenne" 
                                            : "⚠️ L'étudiant est en échec avec cette moyenne"}
                                    </p>
                                </div>
                            )}

                            {/* Résumé des informations */}
                            {selectedStudent && selectedModule && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Note pour {selectedStudent.user?.name} - {selectedModule.name}
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
                                    <><FaSave size={14} /> {editData ? "Mettre à jour la note" : "Enregistrer la note"}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddGradeModal;