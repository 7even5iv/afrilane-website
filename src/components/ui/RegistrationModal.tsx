import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaUser, FaEnvelope, FaMobileAlt, FaCheckCircle, 
    FaSpinner, FaArrowRight, FaArrowLeft, FaShieldAlt,
    FaBriefcase, FaLock, FaGraduationCap, FaInfoCircle,
    FaBookOpen, FaClock, FaMoneyBillWave, FaExclamationTriangle
} from "react-icons/fa";
import { apiService } from "../../services/api";

// Interfaces
interface Formation {
    id: number | string;
    name?: string;
    title?: string;
    price?: number;
    duration?: string;
    schedule?: string;
}

interface FormData {
    name: string;
    email: string;
    paymentPhone: string;
    formationName: string;
    formationId: number | null;
    formationPrice: number;
    formationDuration: string;
    formationSchedule: string;
}

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    formation: Formation | null;
}

// Déclaration pour process.env
declare const process: {
    env: {
        NODE_ENV: string;
    };
};

const RegistrationModal = ({ isOpen, onClose, formation }: RegistrationModalProps) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("momo");
    const [errorMessage, setErrorMessage] = useState("");
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [formData, setFormData] = useState<FormData>({ 
        name: "", 
        email: "", 
        paymentPhone: "",
        formationName: "",
        formationId: null,
        formationPrice: 0,
        formationDuration: "",
        formationSchedule: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const INSCRIPTION_FEES = 30000;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const formationIdMap: Record<string, number> = {
        'sec-bur': 1,
        'sec-bil': 2,
        'sec-comp': 3,
        'comp-inf': 4,
        'maint-res': 5,
        'graph-prod': 6,
        'webmaster': 7,
        'dev-app': 8,
    };

    useEffect(() => {
        if (formation) {
            console.log("Formation reçue dans le modal:", formation);
            
            let formationIdValue: number | null = null;
            let formationPriceValue = formation.price || 0;
            let formationNameValue = formation.title || formation.name || "Formation professionnelle";
            
            if (typeof formation.id === 'string' && formationIdMap[formation.id]) {
                formationIdValue = formationIdMap[formation.id];
                console.log(`✅ ID "${formation.id}" converti en ID base de données: ${formationIdValue}`);
            } else if (typeof formation.id === 'number') {
                formationIdValue = formation.id;
            } else {
                console.warn(`⚠️ ID non trouvé dans le mapping: ${formation.id}`);
            }
            
            setFormData(prev => ({
                ...prev,
                formationName: formationNameValue,
                formationId: formationIdValue,
                formationPrice: formationPriceValue,
                formationDuration: "12 mois",
                formationSchedule: "Cours du jour"
            }));
        }
    }, [formation]);

    useEffect(() => {
        const phone = formData.paymentPhone;
        const isValid = phone && phone.length >= 9 && /^[0-9]{9,}$/.test(phone);
        setIsPhoneValid(isValid === true);
        
        if (isValid && errors.paymentPhone) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.paymentPhone;
                return newErrors;
            });
        }
    }, [formData.paymentPhone, errors.paymentPhone]);

    useEffect(() => {
        if (!isOpen) {
            resetModal();
        }
    }, [isOpen]);

    const resetModal = () => {
        setStep(1);
        setFormData({
            name: "", 
            email: "", 
            paymentPhone: "",
            formationName: formation?.title || formation?.name || "",
            formationId: formation?.id ? (typeof formation.id === 'string' ? (formationIdMap[formation.id] || null) : formation.id) : null,
            formationPrice: formation?.price || 0,
            formationDuration: "12 mois",
            formationSchedule: "Cours du jour"
        });
        setErrors({});
        setPaymentMethod("momo");
        setLoading(false);
        setErrorMessage("");
        setTransactionId(null);
        setPaymentStatus("pending");
    };

    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nom complet requis";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.paymentPhone || formData.paymentPhone.length < 9) {
            newErrors.paymentPhone = "Numéro de téléphone invalide (9 chiffres minimum)";
        } else if (!/^[0-9]{9,}$/.test(formData.paymentPhone)) {
            newErrors.paymentPhone = "Le numéro ne doit contenir que des chiffres";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
            window.scrollTo(0, 0);
            setErrorMessage("");
        }
    };

    const handlePrevious = () => {
        setStep(1);
        window.scrollTo(0, 0);
        setErrorMessage("");
    };

    const simulatePaymentSuccess = async () => {
        if (!transactionId) {
            setErrorMessage("Aucune transaction en cours");
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/payments/simulate/success/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setPaymentStatus('completed');
                alert('✅ Paiement simulé avec succès! Le statut a été mis à jour.');
            } else {
                throw new Error(data.message || "Erreur lors de la simulation");
            }
        } catch (error) {
            console.error("Erreur lors de la simulation:", error);
            setErrorMessage(error instanceof Error ? error.message : "Erreur lors de la simulation du paiement");
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;
        
        setLoading(true);
        setErrorMessage("");
        
        try {
            let finalFormationId: number | null = formData.formationId;
            
            if (!finalFormationId && formation) {
                if (typeof formation.id === 'number') {
                    finalFormationId = formation.id;
                } else if (typeof formation.id === 'string' && formationIdMap[formation.id]) {
                    finalFormationId = formationIdMap[formation.id];
                }
            }
            
            if (typeof finalFormationId === 'string') {
                if (formationIdMap[finalFormationId]) {
                    finalFormationId = formationIdMap[finalFormationId];
                } else if (!isNaN(Number(finalFormationId))) {
                    finalFormationId = Number(finalFormationId);
                } else {
                    throw new Error(`ID de formation invalide: ${finalFormationId}`);
                }
            }
            
            if (!finalFormationId || isNaN(finalFormationId) || finalFormationId === 0) {
                throw new Error("ID de formation invalide. Veuillez sélectionner une formation valide.");
            }
            
            console.log("✅ ID formation final (base de données):", finalFormationId);
            
            const registrationData = {
                student_name: formData.name,
                student_email: formData.email,
                student_phone: formData.paymentPhone,
                formation_id: finalFormationId,
                payment_method: paymentMethod,
                registration_fees: INSCRIPTION_FEES
            };
            
            console.log("📝 Données envoyées à l'API:", registrationData);
            const registrationResponse = await apiService.registerForFormation(registrationData);
            
            if (!registrationResponse.success) {
                throw new Error(registrationResponse.message || "Erreur lors de l'inscription");
            }
            
            const registration = registrationResponse.data;
            
            const paymentData = {
                registration_id: registration.id,
                phone_number: formData.paymentPhone,
                amount: INSCRIPTION_FEES,
                payment_method: paymentMethod,
                description: `Frais d'inscription - ${formData.formationName}`
            };
            
            console.log("💰 Initiation du paiement:", paymentData);
            const paymentResponse = await apiService.initiatePayment(paymentData);
            
            if (!paymentResponse.success) {
                throw new Error(paymentResponse.message || "Erreur lors de l'initiation du paiement");
            }
            
            setTransactionId(paymentResponse.data.transaction_id);
            
            localStorage.setItem('last_registration', JSON.stringify({
                registration_id: registration.id,
                transaction_id: paymentResponse.data.transaction_id,
                student_name: formData.name,
                student_email: formData.email
            }));
            
            setStep(3);
            
        } catch (error) {
            console.error("❌ Erreur lors du paiement:", error);
            setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (step === 3 && transactionId && paymentStatus === 'pending') {
            interval = setInterval(async () => {
                try {
                    const status = await apiService.checkPaymentStatus(transactionId);
                    if (status.data.status === 'completed') {
                        setPaymentStatus('completed');
                        if (interval) clearInterval(interval);
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification du statut:", error);
                }
            }, 5000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [step, transactionId, paymentStatus]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-3 md:p-4 overflow-y-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="bg-white w-full max-w-[95%] md:max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <FaBriefcase className="text-white text-sm md:text-base" />
                                        </div>
                                        <h2 className="text-lg md:text-xl font-bold">
                                            {step === 1 && "Inscription formation"}
                                            {step === 2 && "Paiement sécurisé"}
                                            {step === 3 && "Confirmation"}
                                        </h2>
                                    </div>
                                    <p className="text-white/80 text-[11px] md:text-xs">
                                        {step === 1 && "Veuillez renseigner vos coordonnées"}
                                        {step === 2 && "Finalisez votre inscription"}
                                        {step === 3 && paymentStatus === 'completed' ? "Paiement confirmé !" : "En attente de paiement"}
                                    </p>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                                >
                                    <FaTimes className="text-xs md:text-sm" />
                                </button>
                            </div>

                            {/* Indicateur d'étape */}
                            <div className="flex gap-2 mt-4 md:mt-6">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            step >= s ? "bg-white w-6 md:w-8" : "bg-white/30 w-3 md:w-4"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="p-4 md:p-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Messages d'erreur */}
                            {errorMessage && (
                                <div className="mb-4 p-2.5 md:p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                                    <FaExclamationTriangle className="text-red-500 text-xs md:text-sm mt-0.5 flex-shrink-0" />
                                    <p className="text-[11px] md:text-xs text-red-700">{errorMessage}</p>
                                </div>
                            )}

                            {/* ÉTAPE 1 : INFORMATIONS PERSONNELLES */}
                            {step === 1 && (
                                <motion.form 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleNext} 
                                    className="space-y-4 md:space-y-5"
                                >
                                    {/* Formation info */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 md:p-4 border border-blue-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <FaBookOpen className="text-blue-600 text-sm md:text-base" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-gray-500">Formation choisie</p>
                                                <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">{formData.formationName}</h3>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 md:gap-3 text-[11px] md:text-xs">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <FaGraduationCap size={10} className="text-blue-500 flex-shrink-0" />
                                                <span className="truncate">Durée: {formData.formationDuration}</span>
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <FaClock size={10} className="text-blue-500 flex-shrink-0" />
                                                <span className="truncate">{formData.formationSchedule}</span>
                                            </span>
                                            {formData.formationPrice > 0 && (
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <FaMoneyBillWave size={10} className="text-blue-500 flex-shrink-0" />
                                                    <span className="truncate">{formData.formationPrice.toLocaleString()} FCFA/an</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nom complet */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                            <FaUser size={10} /> Nom complet *
                                        </label>
                                        <div className="relative">
                                            <FaUser className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm" />
                                            <input 
                                                required 
                                                className={`w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                                placeholder="Jean Dupont"
                                                value={formData.name}
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-[11px] md:text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                            <FaEnvelope size={10} /> Adresse email *
                                        </label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm" />
                                            <input 
                                                required 
                                                type="email" 
                                                className={`w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                                placeholder="jean.dupont@exemple.com"
                                                value={formData.email}
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-[11px] md:text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Frais d'inscription */}
                                    <div className="bg-blue-50 rounded-xl p-3 md:p-4 border border-blue-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <p className="text-[11px] md:text-xs text-gray-500">Frais d'inscription</p>
                                                <p className="font-bold text-blue-600 text-lg md:text-xl">{INSCRIPTION_FEES.toLocaleString()} FCFA</p>
                                                <p className="text-[10px] text-gray-400 mt-1">Paiement unique</p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-[11px] md:text-xs text-gray-500">Scolarité annuelle</p>
                                                <p className="font-semibold text-gray-700 text-sm md:text-base">{formData.formationPrice.toLocaleString()} FCFA</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info note */}
                                    <div className="flex items-start gap-2 p-2.5 md:p-3 rounded-xl bg-amber-50 border border-amber-100">
                                        <FaInfoCircle className="text-amber-500 text-xs md:text-sm mt-0.5 flex-shrink-0" />
                                        <p className="text-[10px] md:text-[11px] text-amber-700 leading-relaxed">
                                            Les frais d'inscription sont un paiement unique de <strong>{INSCRIPTION_FEES.toLocaleString()} FCFA</strong>. 
                                            La scolarité annuelle de <strong>{formData.formationPrice.toLocaleString()} FCFA</strong> est à payer à la rentrée.
                                        </p>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm"
                                    >
                                        Continuer <FaArrowRight size={12} />
                                    </button>
                                </motion.form>
                            )}

                            {/* ÉTAPE 2 : PAIEMENT */}
                            {step === 2 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4 md:space-y-5"
                                >
                                    {/* Formation */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                                        <p className="text-[10px] text-gray-500 mb-1">Formation choisie</p>
                                        <p className="font-semibold text-gray-800 text-xs md:text-sm flex items-center gap-2">
                                            <FaBookOpen size={12} className="text-blue-600 flex-shrink-0" />
                                            <span className="truncate">{formData.formationName}</span>
                                        </p>
                                    </div>

                                    {/* Montant */}
                                    <div className="bg-gray-50 rounded-xl p-3 md:p-4 text-center border border-gray-200">
                                        <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-wider">Frais d'inscription</p>
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-800">{INSCRIPTION_FEES.toLocaleString()} FCFA</h3>
                                        <p className="text-[10px] text-gray-400 mt-1">Paiement unique</p>
                                    </div>
                                    
                                    {/* Moyen de paiement */}
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">Moyen de paiement</label>
                                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setPaymentMethod("momo")}
                                                className={`relative p-2 md:p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                                                    paymentMethod === "momo" 
                                                        ? "border-yellow-500 bg-yellow-50 shadow-md" 
                                                        : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                            >
                                                <img 
                                                    src="/logos/momo-logo.png" 
                                                    alt="MTN MoMo" 
                                                    className="h-8 md:h-12 w-auto object-contain mb-1 md:mb-2"
                                                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/60x40?text=MTN" }}
                                                />
                                                <span className="text-[10px] md:text-[11px] font-semibold text-gray-700 text-center">MTN Mobile Money</span>
                                            </button>

                                            <button 
                                                type="button"
                                                onClick={() => setPaymentMethod("om")}
                                                className={`relative p-2 md:p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                                                    paymentMethod === "om" 
                                                        ? "border-orange-500 bg-orange-50 shadow-md" 
                                                        : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                            >
                                                <img 
                                                    src="/logos/om-logo.jpg" 
                                                    alt="Orange Money" 
                                                    className="h-8 md:h-12 w-auto object-contain mb-1 md:mb-2"
                                                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/60x40?text=Orange" }}
                                                />
                                                <span className="text-[10px] md:text-[11px] font-semibold text-gray-700 text-center">Orange Money</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Numéro de téléphone */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                            <FaMobileAlt size={10} /> Numéro {paymentMethod === "momo" ? "MTN" : "Orange"} *
                                        </label>
                                        <div className="relative">
                                            <FaMobileAlt className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm" />
                                            <input 
                                                required 
                                                type="tel" 
                                                className={`w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border ${errors.paymentPhone ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                                placeholder="6XX XXX XXX"
                                                value={formData.paymentPhone}
                                                onChange={e => setFormData({...formData, paymentPhone: e.target.value})}
                                            />
                                        </div>
                                        {errors.paymentPhone && <p className="text-red-500 text-[11px] md:text-xs mt-1">{errors.paymentPhone}</p>}
                                        <p className="text-[10px] text-gray-400 mt-1">📱 Format: 6XX XXX XXX (9 chiffres minimum)</p>
                                    </div>

                                    {/* Boutons */}
                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                                        <button 
                                            onClick={handlePrevious}
                                            className="sm:flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all text-sm flex items-center justify-center gap-1"
                                        >
                                            <FaArrowLeft size={12} /> Retour
                                        </button>
                                        <button 
                                            onClick={handlePayment} 
                                            disabled={loading || !isPhoneValid} 
                                            className={`sm:flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                                                loading || !isPhoneValid
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:shadow-md'
                                            }`}
                                        >
                                            {loading ? <><FaSpinner className="animate-spin" size={14} /> Traitement...</> : <><FaLock size={12} /> Payer {INSCRIPTION_FEES.toLocaleString()} FCFA</>}
                                        </button>
                                    </div>

                                    {/* Sécurité */}
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                                        <FaShieldAlt size={10} />
                                        Paiement 100% sécurisé
                                    </div>
                                </motion.div>
                            )}

                            {/* ÉTAPE 3 : CONFIRMATION */}
                            {step === 3 && (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-4 md:py-6"
                                >
                                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-inner ${
                                        paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                        {paymentStatus === 'completed' ? 
                                            <FaCheckCircle size={32} className="md:text-4xl" /> : 
                                            <FaSpinner className="animate-spin md:text-4xl" size={32} />
                                        }
                                    </div>
                                    
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                                        {paymentStatus === 'completed' ? "Paiement confirmé ! 🎉" : "Inscription en cours !"}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                                        {paymentStatus === 'completed' 
                                            ? `Félicitations ${formData.name}, votre inscription est complètement validée.`
                                            : `Merci ${formData.name}, votre inscription est enregistrée.`
                                        }
                                    </p>
                                    
                                    {paymentStatus === 'pending' && (
                                        <div className="bg-yellow-50 rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-yellow-200">
                                            <p className="text-xs md:text-sm font-semibold text-yellow-800 mb-2">
                                                📱 Paiement Mobile Money
                                            </p>
                                            <p className="text-[11px] md:text-xs text-yellow-700">
                                                Une demande de paiement de <strong>{INSCRIPTION_FEES.toLocaleString()} FCFA</strong> a été envoyée à votre numéro <strong>{formData.paymentPhone}</strong>.
                                            </p>
                                            <p className="text-[11px] md:text-xs text-yellow-700 mt-2">
                                                Veuillez confirmer le paiement sur votre téléphone pour finaliser votre inscription.
                                            </p>
                                        </div>
                                    )}
                                    
                                    {paymentStatus === 'completed' && (
                                        <div className="bg-emerald-50 rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-emerald-200">
                                            <p className="text-xs md:text-sm font-semibold text-emerald-800 mb-2">
                                                ✅ Inscription validée
                                            </p>
                                            <p className="text-[11px] md:text-xs text-emerald-700">
                                                Votre inscription a été confirmée avec succès. Vous recevrez un email de confirmation avec tous les détails.
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Récapitulatif */}
                                    <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6 text-left border border-gray-200">
                                        <p className="text-[11px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Récapitulatif</p>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs md:text-sm pb-2 border-b border-gray-200">
                                                <span className="text-gray-500">Étudiant</span>
                                                <span className="font-medium text-gray-800 truncate ml-2">{formData.name}</span>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm pb-2 border-b border-gray-200">
                                                <span className="text-gray-500">Email</span>
                                                <span className="font-medium text-gray-800 truncate ml-2">{formData.email}</span>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm pb-2 border-b border-gray-200">
                                                <span className="text-gray-500">Téléphone</span>
                                                <span className="font-medium text-gray-800 ml-2">{formData.paymentPhone}</span>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm pb-2 border-b border-gray-200">
                                                <span className="text-gray-500">Formation</span>
                                                <span className="font-medium text-blue-600 text-right ml-2 truncate">{formData.formationName}</span>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm">
                                                <span className="text-gray-500">Statut</span>
                                                <span className={`font-medium ml-2 ${paymentStatus === 'completed' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                                                    {paymentStatus === 'completed' ? 'Confirmé' : 'En attente de paiement'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={onClose} 
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-md transition-all text-sm"
                                    >
                                        Fermer
                                    </button>

                                    {/* Bouton de test développement */}
                                    {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && paymentStatus === 'pending' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={simulatePaymentSuccess}
                                                className="w-full bg-yellow-500 text-white py-2 rounded-xl text-sm hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaCheckCircle size={14} />
                                                🔧 Simuler un paiement réussi (Test)
                                            </button>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                ⚠️ Mode développement seulement - Simule la confirmation du paiement
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RegistrationModal;