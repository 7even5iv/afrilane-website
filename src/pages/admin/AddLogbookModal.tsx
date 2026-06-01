import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    FaTimes, FaEdit, FaSpinner, FaCheckDouble, 
    FaTasks, FaCalendarAlt, FaBookOpen, FaSave 
} from "react-icons/fa";

const AddLogbookModal = ({ isOpen, onClose, onRefresh }: any) => {
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        course_module_id: "",
        session_date: new Date().toISOString().split('T')[0], // Date du jour par défaut
        competencies: "",
        activities: ""
    });

    // 1. Charger les modules pour que le formateur choisisse le sien
    useEffect(() => {
        if (isOpen) {
            const fetchModules = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch("http://localhost:8000/api/course-modules", {
                        headers: { 
                            "Authorization": `Bearer ${token}`,
                            "Accept": "application/json"
                        }
                    });
                    const data = await res.json();
                    if (Array.isArray(data)) setModules(data);
                } catch (error) {
                    console.error("Erreur chargement modules:", error);
                }
            };
            fetchModules();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // On récupère l'ID de l'utilisateur connecté pour l'associer comme formateur
        // Note : Assurez-vous que votre API Laravel gère l'ID du formateur via Auth::id() ou passez-le ici
        const payload = {
            ...formData,
            teacher_id: localStorage.getItem("user_id") // Optionnel si géré par Laravel
        };

        try {
            const res = await fetch("http://localhost:8000/api/logbooks", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onRefresh(); // Recharge la liste dans CahierTexte.tsx
                onClose();   // Ferme la modale
                setFormData({ 
                    course_module_id: "", 
                    session_date: new Date().toISOString().split('T')[0], 
                    competencies: "", 
                    activities: "" 
                });
            }
        } catch (error) {
            console.error("Erreur enregistrement séance:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* HEADER */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-3">
                            <FaEdit /> Journal de Séance
                        </h2>
                        <p className="text-blue-100 text-[10px] uppercase font-black tracking-widest mt-1">Saisie du Cahier de Texte</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* MODULE */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-2">
                                <FaBookOpen className="text-blue-500" /> Unité d'Enseignement
                            </label>
                            <select 
                                required 
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all text-sm font-bold text-slate-700"
                                value={formData.course_module_id}
                                onChange={e => setFormData({...formData, course_module_id: e.target.value})}
                            >
                                <option value="">Choisir le module...</option>
                                {modules.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.training?.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* DATE */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" /> Date du cours
                            </label>
                            <input 
                                type="date" required 
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all"
                                value={formData.session_date}
                                onChange={e => setFormData({...formData, session_date: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* COMPÉTENCES (POINT 1 DU MODULE 7) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-2">
                            <FaCheckDouble className="text-blue-500" /> Compétences enseignées
                        </label>
                        <textarea 
                            required 
                            placeholder="Ex: Configuration des VLANs, Sécurisation des ports switch..."
                            className="w-full p-4 bg-gray-50 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all text-sm font-medium"
                            value={formData.competencies}
                            onChange={e => setFormData({...formData, competencies: e.target.value})}
                        />
                    </div>

                    {/* ACTIVITÉS (POINT 2 DU MODULE 7) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-2">
                            <FaTasks className="text-blue-500" /> Activités de la séance
                        </label>
                        <textarea 
                            required 
                            placeholder="Ex: Travaux pratiques sur équipements Cisco réels, schématisation au tableau..."
                            className="w-full p-4 bg-gray-50 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all text-sm font-medium"
                            value={formData.activities}
                            onChange={e => setFormData({...formData, activities: e.target.value})}
                        />
                    </div>

                    {/* BOUTON DE SAUVEGARDE */}
                    <button 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Enregistrer la séance</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddLogbookModal;