import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaCloudUploadAlt, FaSpinner, FaFilePdf, 
    FaCheckCircle, FaExclamationCircle, FaSave, FaUniversity,
    FaFileAlt, FaUpload
} from "react-icons/fa";

const AddExamModal = ({ isOpen, onClose, onRefresh, editData = null }: any) => {
    const [loading, setLoading] = useState(false);
    const [trainings, setTrainings] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({ 
        title: "", 
        training_id: "", 
        type: "Examen",
        session_name: ""
    });

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
                title: editData.title || "",
                training_id: editData.training_id || "",
                type: editData.type || "Examen",
                session_name: editData.session_name || ""
            });
        } else {
            setFormData({
                title: "",
                training_id: "",
                type: "Examen",
                session_name: ""
            });
            setFile(null);
        }
        setErrors({});
    }, [editData, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "Titre de l'épreuve requis";
        if (!formData.training_id) newErrors.training_id = "Veuillez sélectionner une formation";
        if (!editData && !file) newErrors.file = "Veuillez sélectionner un fichier PDF";
        if (file && file.type !== "application/pdf") newErrors.file = "Le fichier doit être au format PDF";
        if (file && file.size > 2 * 1024 * 1024) newErrors.file = "Le fichier ne doit pas dépasser 2 Mo";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('training_id', formData.training_id);
        data.append('type', formData.type);
        if (formData.session_name) data.append('session_name', formData.session_name);
        if (file) data.append('file', file);

        const url = editData 
            ? `http://localhost:8000/api/exams/${editData.id}`
            : "http://localhost:8000/api/exams";
        //const method = editData ? "POST" : "POST";
        // Pour l'édition avec fichier, on utilise POST avec _method PUT
        if (editData) data.append('_method', 'PUT');

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: data
            });

            if (res.ok) {
                onRefresh();
                onClose();
                setFormData({ title: "", training_id: "", type: "Examen", session_name: "" });
                setFile(null);
            } else {
                const errorData = await res.json();
                setErrors({ submit: errorData.message || "Erreur lors de l'envoi" });
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
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* HEADER AVEC DÉGRADÉ */}
                        <div className={`bg-gradient-to-r ${editData ? 'from-amber-600 to-amber-700' : 'from-red-600 to-red-700'} p-6 text-white`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <FaFilePdf className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {editData ? "Modifier l'épreuve" : "Déposer une épreuve"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-xs">
                                        {editData ? "Modifiez les informations de l'épreuve" : "Ajoutez un nouveau sujet à la banque"}
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
                            {/* Titre */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaFileAlt size={10} /> Titre de l'épreuve
                                </label>
                                <input 
                                    required 
                                    placeholder="ex: Examen de fin de module - Réseaux"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.title ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.title}</p>}
                            </div>

                            {/* Formation */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUniversity size={10} /> Formation
                                </label>
                                <select 
                                    required 
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${errors.training_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                    value={formData.training_id}
                                    onChange={e => setFormData({...formData, training_id: e.target.value})}>
                                    <option value="">Sélectionner une formation</option>
                                    {trainings.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                                </select>
                                {errors.training_id && <p className="text-red-500 text-xs mt-1">{errors.training_id}</p>}
                            </div>

                            {/* Type d'épreuve */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaFileAlt size={10} /> Type d'épreuve
                                </label>
                                <select 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="Examen">Examen</option>
                                    <option value="Devoir">Devoir</option>
                                    <option value="TP">Travaux Pratiques</option>
                                    <option value="Rattrapage">Rattrapage</option>
                                </select>
                            </div>

                            {/* Session (optionnel) */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaFileAlt size={10} /> Session (optionnel)
                                </label>
                                <input 
                                    placeholder="ex: Session 2024-2025"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    value={formData.session_name}
                                    onChange={e => setFormData({...formData, session_name: e.target.value})}
                                />
                            </div>

                            {/* Upload de fichier */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FaUpload size={10} /> Fichier PDF {!editData && "*"}
                                </label>
                                <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer hover:border-red-500 ${errors.file ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => setFile(e.target.files![0] || null)}
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center">
                                            <FaFilePdf className="text-red-500 text-3xl mb-2" />
                                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {(file.size / 1024).toFixed(1)} Ko
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <FaCloudUploadAlt className="text-gray-300 text-4xl mb-2" />
                                            <p className="text-sm text-gray-500 font-medium">
                                                Cliquez ou glissez un fichier PDF
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Maximum 2 Mo
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.file && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.file}</p>}
                            </div>

                            {/* Aperçu des informations */}
                            {selectedTraining && formData.title && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaCheckCircle size={10} />
                                        Épreuve : {formData.title}
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
                                className={`w-full ${editData ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-red-600 to-red-700'} text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2`}
                            >
                                {loading ? (
                                    <><FaSpinner className="animate-spin" size={14} /> {editData ? "Mise à jour..." : "Upload en cours..."}</>
                                ) : (
                                    <><FaSave size={14} /> {editData ? "Mettre à jour" : "Déposer l'épreuve"}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddExamModal;