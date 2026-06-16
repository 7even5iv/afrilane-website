import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaTimes, FaUserGraduate, FaSpinner, FaCheckCircle,
    FaEdit, FaArrowLeft, FaCamera, FaCloudUploadAlt, FaSave, FaArrowRight
} from "react-icons/fa";

const AddStudentModal = ({ isOpen, onClose, onRefresh, editData }: any) => {
    const [trainings, setTrainings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [step, setStep] = useState(1);
    const isEditMode = !!editData;

    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        specialite_id: "",
        birth_date: "",
        phone_parent: "",
        telephone: "",
        niveau: "Baccalauréat",
        has_required_level: false,
        is_fee_paid: false,
        address: ""
    });

    useEffect(() => {
        if (isOpen) {
            const fetchTrainings = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch("http://localhost:8000/api/trainings", {
                        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
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

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setPhotoPreview(null);
            setSelectedPhoto(null);
            setErrors({});
            setFormData({
                nom: "", prenom: "", email: "", specialite_id: "",
                birth_date: "", phone_parent: "", telephone: "",
                niveau: "Baccalauréat", has_required_level: false, is_fee_paid: false,
                address: ""
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (editData && isOpen) {
            setFormData({
                nom: editData.nom || "",
                prenom: editData.prenom || "",
                email: editData.email || "",
                specialite_id: editData.specialite_id || "",
                birth_date: editData.birth_date || "",
                phone_parent: editData.phone_parent || "",
                telephone: editData.telephone || "",
                niveau: editData.niveau || "Baccalauréat",
                has_required_level: !!editData.has_required_level,
                is_fee_paid: !!editData.is_fee_paid,
                address: editData.address || ""
            });
            if (editData.photo) {
                setPhotoPreview(`http://localhost:8000/storage/${editData.photo}`);
            }
        }
    }, [editData, isOpen]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("La photo est trop lourde (max 2Mo)");
                return;
            }
            setSelectedPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nom.trim()) newErrors.nom = "Nom requis";
        if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
        if (!formData.specialite_id) newErrors.specialite_id = "Veuillez sélectionner une formation";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && formData.telephone) setStep(3);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        const data = new FormData();
        // Correction : On utilise les clés exactes attendues par le EtudiantController de Laravel
        data.append('nom', formData.nom);
        data.append('prenom', formData.prenom);
        data.append('email', formData.email);
        data.append('telephone', formData.telephone);
        data.append('specialite_id', formData.specialite_id);
        data.append('niveau', formData.niveau);
        data.append('birth_date', formData.birth_date);
        data.append('phone_parent', formData.phone_parent);
        data.append('address', formData.address);
        data.append('has_required_level', formData.has_required_level ? "1" : "0");
        data.append('is_fee_paid', formData.is_fee_paid ? "1" : "0");

        if (selectedPhoto) data.append('photo', selectedPhoto);

        // Laravel nécessite _method: PUT pour traiter les fichiers en modification
        if (isEditMode) data.append('_method', 'PUT');

        const url = isEditMode
            ? `http://localhost:8000/api/students/${editData.id}`
            : "http://localhost:8000/api/students";

        try {
            const res = await fetch(url, {
                method: "POST", // On utilise toujours POST quand il y a des fichiers (PUT est simulé par _method)
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: data
            });

            if (res.ok) {
                onRefresh();
                onClose();
            } else {
                const err = await res.json();
                setErrors({ submit: err.message || "Erreur de validation." });
            }
        } catch (error) {
            setErrors({ submit: "Erreur serveur." });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto mx-3">

                    <div className={`bg-gradient-to-r ${isEditMode ? 'from-amber-600 to-amber-700' : 'from-blue-600 to-blue-700'} p-6 text-white`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    {isEditMode ? <FaEdit /> : <FaUserGraduate />} {isEditMode ? "Modifier le dossier" : "Inscription"}
                                </h2>
                                <p className="text-blue-100 text-[10px] uppercase font-black tracking-widest mt-1">
                                    {!isEditMode ? `Étape ${step} / 3` : "Mise à jour des informations"}
                                </p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><FaTimes /></button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-900">
                        {(step === 1 || isEditMode) && (
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                                <div className="flex flex-col items-center mb-4">
                                    <div onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden group shadow-inner">
                                        {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" alt="preview" /> : <FaCamera className="text-slate-400" size={24} />}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase"><FaCloudUploadAlt className="mr-1" /> Photo</div>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Nom</label>
                                        <input required value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex: NGOU MOU" className="p-3 bg-slate-50 rounded-xl outline-none w-full border border-transparent focus:border-blue-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Prénom</label>
                                        <input required value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} placeholder="Ex: LOIC" className="p-3 bg-slate-50 rounded-xl outline-none w-full border border-transparent focus:border-blue-500" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-transparent focus:border-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Spécialité</label>
                                    <select required value={formData.specialite_id} onChange={e => setFormData({ ...formData, specialite_id: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl outline-none cursor-pointer">
                                        <option value="">Choisir la spécialité...</option>
                                        {trainings.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                {!isEditMode && <button type="button" onClick={handleNext} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">Suivant <FaArrowRight size={12} /></button>}
                            </motion.div>
                        )}

                        {(step === 2 && !isEditMode) && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Naissance</label>
                                        <input required type="date" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} className="w-full p-3 bg-slate-50 rounded-xl outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Téléphone</label>
                                        <input required value={formData.telephone} onChange={e => setFormData({ ...formData, telephone: e.target.value })} placeholder="6XX XXX XXX" className="w-full p-3 bg-slate-50 rounded-xl outline-none" />
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-2xl space-y-3 text-slate-900 border border-blue-100">
                                    <label className="flex items-center justify-between text-xs font-bold text-blue-800 cursor-pointer">Niveau requis validé <input type="checkbox" checked={formData.has_required_level} onChange={e => setFormData({ ...formData, has_required_level: e.target.checked })} className="w-5 h-5 rounded border-blue-300" /></label>
                                    <label className="flex items-center justify-between text-xs font-bold text-blue-800 cursor-pointer">Frais payés <input type="checkbox" checked={formData.is_fee_paid} onChange={e => setFormData({ ...formData, is_fee_paid: e.target.checked })} className="w-5 h-5 rounded border-blue-300" /></label>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setStep(1)} className="p-3.5 bg-slate-100 rounded-xl"><FaArrowLeft /></button>
                                    <button type="button" onClick={handleNext} className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">Suivant <FaArrowRight size={12} /></button>
                                </div>
                            </motion.div>
                        )}

                        {(step === 3 && !isEditMode) && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Prêt pour l'inscription</h3>
                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <p><strong>Candidat :</strong> {formData.nom} {formData.prenom}</p>
                                    <p><strong>Spécialité :</strong> {trainings.find(t => t.id == formData.specialite_id)?.name}</p>
                                    <p><strong>Paiement :</strong> {formData.is_fee_paid ? "Réglé" : "En attente"}</p>
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="mt-4 text-xs font-bold text-blue-600 underline">Modifier les informations</button>
                            </motion.div>
                        )}

                        {errors.submit && <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg">{errors.submit}</p>}

                        {(step === 3 || isEditMode) && (
                            <button disabled={loading} type="submit" className={`w-full text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl flex items-center justify-center gap-3 transition-all ${isEditMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                                {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> {isEditMode ? "Enregistrer les modifications" : "Confirmer l'inscription"}</>}
                            </button>
                        )}
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddStudentModal;