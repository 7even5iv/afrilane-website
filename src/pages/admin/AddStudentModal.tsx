import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaTimes, FaUserGraduate, FaSpinner, FaCheckCircle,
    FaUser, FaEnvelope, FaBookOpen, FaCalendarAlt, FaPhoneAlt,
    FaGraduationCap, FaMoneyBillWave, FaShieldAlt, FaArrowRight,
    FaEdit
} from "react-icons/fa";

const AddStudentModal = ({ isOpen, onClose, onRefresh, editData }: any) => {
    const [trainings, setTrainings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [step, setStep] = useState(1);
    const isEditMode = !!editData;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        training_id: "",
        birth_date: "",
        phone_parent: "",
        has_required_level: false,
        is_fee_paid: false
    });

    // Charger les formations
    useEffect(() => {
        if (isOpen) {
            const fetchTrainings = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch("http://localhost:8000/api/trainings", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setTrainings(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Erreur:", error);
                    setTrainings([]);
                }
            };
            fetchTrainings();
            setStep(1);
            setErrors({});
        }
    }, [isOpen]);

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (editData && isOpen) {
            setFormData({
                name: editData.user?.name || "",
                email: editData.user?.email || "",
                training_id: editData.training_id || "",
                birth_date: editData.birth_date || "",
                phone_parent: editData.phone_parent || "",
                has_required_level: editData.has_required_level || false,
                is_fee_paid: editData.is_fee_paid || false
            });
        } else if (!editData && isOpen) {
            // Réinitialiser le formulaire en mode ajout
            setFormData({
                name: "",
                email: "",
                training_id: "",
                birth_date: "",
                phone_parent: "",
                has_required_level: false,
                is_fee_paid: false
            });
        }
    }, [editData, isOpen]);

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nom complet requis";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
        if (!formData.training_id) newErrors.training_id = "Veuillez sélectionner une formation";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.birth_date) newErrors.birth_date = "Date de naissance requise";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const token = localStorage.getItem('token');
        const url = isEditMode 
            ? `http://localhost:8000/api/students/${editData.id}` 
            : "http://localhost:8000/api/students";
        const method = isEditMode ? "PUT" : "POST";

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
                // Réinitialiser le formulaire
                setFormData({
                    name: "", email: "", training_id: "", birth_date: "", phone_parent: "",
                    has_required_level: false, is_fee_paid: false
                });
                setStep(1);
            } else {
                const err = await res.json();
                setErrors({ submit: err.message || `Erreur lors de ${isEditMode ? 'la modification' : "l'inscription"}` });
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
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* HEADER */}
                        <div className={`bg-gradient-to-r ${isEditMode ? 'from-amber-600 to-amber-700' : 'from-blue-600 to-blue-700'} p-6 text-white`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            {isEditMode ? <FaEdit className="text-white" /> : <FaUserGraduate className="text-white" />}
                                        </div>
                                        <h2 className="text-xl font-bold">
                                            {isEditMode ? "Modifier Étudiant" : "Inscription Étudiant"}
                                        </h2>
                                    </div>
                                    <p className="text-blue-100 text-xs">
                                        {isEditMode 
                                            ? "Modifiez les informations de l'étudiant" 
                                            : `Étape ${step} sur 3 - ${step === 1 ? "Informations personnelles" : step === 2 ? "Informations complémentaires" : "Validation"}`}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Indicateur d'étape (masqué en mode édition) */}
                            {!isEditMode && (
                                <div className="flex gap-2 mt-4">
                                    {[1, 2, 3].map((s) => (
                                        <div
                                            key={s}
                                            className={`h-1 rounded-full transition-all duration-300 ${step >= s ? "bg-white w-8" : "bg-white/30 w-4"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-5">
                                {/* Mode édition - formulaire simplifié */}
                                {isEditMode ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                required
                                                placeholder="Nom complet de l'étudiant"
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                value={formData.name}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>}
                                        </div>

                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="Adresse email (Identifiant de connexion)"
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                value={formData.email}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
                                        </div>

                                        <div className="relative">
                                            <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <select
                                                required
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.training_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                                onChange={e => setFormData({ ...formData, training_id: e.target.value })}
                                                value={formData.training_id}
                                            >
                                                <option value="">Sélectionner la spécialité</option>
                                                {trainings.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                                            </select>
                                            {errors.training_id && <p className="text-red-500 text-xs mt-1 ml-2">{errors.training_id}</p>}
                                        </div>

                                        <div className="relative">
                                            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                type="date"
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.birth_date ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                                value={formData.birth_date}
                                            />
                                            {errors.birth_date && <p className="text-red-500 text-xs mt-1 ml-2">{errors.birth_date}</p>}
                                        </div>

                                        <div className="relative">
                                            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                placeholder="Téléphone parent (optionnel)"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                                onChange={e => setFormData({ ...formData, phone_parent: e.target.value })}
                                                value={formData.phone_parent}
                                            />
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vérifications administratives</p>

                                            <label className="flex items-center justify-between cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.has_required_level ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        <FaGraduationCap size={14} />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">Diplôme / Niveau requis validé</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={formData.has_required_level}
                                                    onChange={e => setFormData({ ...formData, has_required_level: e.target.checked })}
                                                />
                                            </label>

                                            <label className="flex items-center justify-between cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.is_fee_paid ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        <FaMoneyBillWave size={14} />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">Frais d'inscription payés</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={formData.is_fee_paid}
                                                    onChange={e => setFormData({ ...formData, is_fee_paid: e.target.checked })}
                                                />
                                            </label>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* Mode ajout - formulaire en 3 étapes */
                                    <>
                                        {/* ÉTAPE 1 - INFOS DE BASE */}
                                        {step === 1 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-4"
                                            >
                                                <div className="relative">
                                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                                    <input
                                                        required
                                                        placeholder="Nom complet de l'étudiant"
                                                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        value={formData.name}
                                                    />
                                                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>}
                                                </div>

                                                <div className="relative">
                                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                                    <input
                                                        required
                                                        type="email"
                                                        placeholder="Adresse email (Identifiant de connexion)"
                                                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        value={formData.email}
                                                    />
                                                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
                                                </div>

                                                <div className="relative">
                                                    <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                                    <select
                                                        required
                                                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.training_id ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer`}
                                                        onChange={e => setFormData({ ...formData, training_id: e.target.value })}
                                                        value={formData.training_id}
                                                    >
                                                        <option value="">Sélectionner la spécialité</option>
                                                        {trainings.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                                                    </select>
                                                    {errors.training_id && <p className="text-red-500 text-xs mt-1 ml-2">{errors.training_id}</p>}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* ÉTAPE 2 - INFOS COMPLÉMENTAIRES */}
                                        {step === 2 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-4"
                                            >
                                                <div className="relative">
                                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                                    <input
                                                        type="date"
                                                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.birth_date ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                        onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                                        value={formData.birth_date}
                                                    />
                                                    {errors.birth_date && <p className="text-red-500 text-xs mt-1 ml-2">{errors.birth_date}</p>}
                                                </div>

                                                <div className="relative">
                                                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                                    <input
                                                        placeholder="Téléphone parent (optionnel)"
                                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                                        onChange={e => setFormData({ ...formData, phone_parent: e.target.value })}
                                                        value={formData.phone_parent}
                                                    />
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vérifications administratives</p>

                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.has_required_level ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                                                <FaGraduationCap size={14} />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700">Diplôme / Niveau requis validé</span>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            checked={formData.has_required_level}
                                                            onChange={e => setFormData({ ...formData, has_required_level: e.target.checked })}
                                                        />
                                                    </label>

                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.is_fee_paid ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                                                <FaMoneyBillWave size={14} />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700">Frais d'inscription payés</span>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            checked={formData.is_fee_paid}
                                                            onChange={e => setFormData({ ...formData, is_fee_paid: e.target.checked })}
                                                        />
                                                    </label>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* ÉTAPE 3 - CONFIRMATION */}
                                        {step === 3 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="space-y-4"
                                            >
                                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                        <FaShieldAlt className="text-blue-600" />
                                                        Vérifiez les informations
                                                    </h3>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between py-1 border-b border-blue-100">
                                                            <span className="text-gray-500">Étudiant:</span>
                                                            <span className="font-medium text-gray-800">{formData.name || "—"}</span>
                                                        </div>
                                                        <div className="flex justify-between py-1 border-b border-blue-100">
                                                            <span className="text-gray-500">Email:</span>
                                                            <span className="font-medium text-gray-800">{formData.email || "—"}</span>
                                                        </div>
                                                        <div className="flex justify-between py-1 border-b border-blue-100">
                                                            <span className="text-gray-500">Formation:</span>
                                                            <span className="font-medium text-gray-800">
                                                                {trainings.find(t => t.id == formData.training_id)?.name || "—"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between py-1 border-b border-blue-100">
                                                            <span className="text-gray-500">Date naissance:</span>
                                                            <span className="font-medium text-gray-800">{formData.birth_date || "—"}</span>
                                                        </div>
                                                        <div className="flex justify-between py-1">
                                                            <span className="text-gray-500">Statut:</span>
                                                            <span className="inline-flex items-center gap-1 text-emerald-600">
                                                                <FaCheckCircle size={12} />
                                                                Prêt pour inscription
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {errors.submit && (
                                                    <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                                        <p className="text-red-600 text-xs text-center">{errors.submit}</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </>
                                )}

                                {/* BOUTONS DE NAVIGATION */}
                                <div className="flex gap-3">
                                    {!isEditMode && step > 1 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevious}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all text-sm"
                                        >
                                            Précédent
                                        </button>
                                    )}

                                    {!isEditMode && step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                                        >
                                            Suivant <FaArrowRight size={12} />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-1 px-4 py-2.5 rounded-xl font-medium hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm ${
                                                isEditMode 
                                                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                                            }`}
                                        >
                                            {loading ? (
                                                <><FaSpinner className="animate-spin" size={14} /> {isEditMode ? "Modification..." : "Inscription..."}</>
                                            ) : (
                                                <><FaCheckCircle size={14} /> {isEditMode ? "Confirmer la modification" : "Confirmer l'inscription"}</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddStudentModal;