import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, FaUser, FaEnvelope, FaMobileAlt, FaCheckCircle, 
    FaSpinner, FaArrowRight, FaArrowLeft, FaShieldAlt,
    FaAward, FaLock, FaInfoCircle, FaClock
} from "react-icons/fa";
import { apiService } from "../../services/api";

// Interfaces
interface Certification {
    id: number | string;
    name?: string;
    title?: string;
    trainingPrice?: number;
    examPrice?: number;
    duration?: string;
    provider?: string;
}

interface FormData {
    name: string;
    email: string;
    paymentPhone: string;
    certificationName: string;
    certificationId: number | null;
    trainingPrice: number;
    examPrice: number;
    duration: string;
    provider: string;
}

interface CertificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    certification: Certification | null;
}

// Déclaration pour process.env
declare const process: {
    env: {
        NODE_ENV: string;
    };
};

const CertificationModal = ({ isOpen, onClose, certification }: CertificationModalProps) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("momo");
    const [paymentType, setPaymentType] = useState("training");
    const [errorMessage, setErrorMessage] = useState("");
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [formData, setFormData] = useState<FormData>({ 
        name: "", 
        email: "", 
        paymentPhone: "",
        certificationName: "",
        certificationId: null,
        trainingPrice: 0,
        examPrice: 0,
        duration: "",
        provider: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    // Mapping des IDs de certification (frontend) vers les IDs de la base de données
    const certificationIdMap: Record<string, number> = {
        'ccna': 1,
        'ccnp': 2,
        'iso-27001': 3,
        'ceh': 4,
        'fortinet': 5,
        'cissp': 6,
        'ccie-security': 7,
        'pmp': 8,
        'azure-fundamentals': 9,
        'itil-4': 10,
        'oca': 11,
        'mcsa-sql': 12,
        'mos-specialist': 13,
    };

    useEffect(() => {
        if (certification) {
            console.log("Certification reçue:", certification);
            
            let certificationIdValue: number | null = null;
            let certificationNameValue = certification.name || certification.title || "Certification";
            let trainingPriceValue = certification.trainingPrice || 0;
            let examPriceValue = certification.examPrice || 0;
            
            // Convertir l'ID frontend en ID base de données
            if (typeof certification.id === 'string' && certificationIdMap[certification.id]) {
                certificationIdValue = certificationIdMap[certification.id];
                console.log(`✅ ID "${certification.id}" converti en ID base de données: ${certificationIdValue}`);
            } else if (typeof certification.id === 'number') {
                certificationIdValue = certification.id;
            } else {
                console.warn(`⚠️ ID non trouvé dans le mapping: ${certification.id}`);
            }
            
            setFormData(prev => ({
                ...prev,
                certificationName: certificationNameValue,
                certificationId: certificationIdValue,
                trainingPrice: trainingPriceValue,
                examPrice: examPriceValue,
                duration: certification.duration || "3 mois",
                provider: certification.provider || "Afrilane"
            }));
        }
    }, [certification]);

    const getAmountToPay = (): number => {
        if (paymentType === "training") {
            return formData.trainingPrice;
        } else {
            return formData.examPrice;
        }
    };

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
            certificationName: certification?.name || "",
            certificationId: certification?.id ? (typeof certification.id === 'string' ? (certificationIdMap[certification.id] || null) : certification.id) : null,
            trainingPrice: certification?.trainingPrice || 0,
            examPrice: certification?.examPrice || 0,
            duration: certification?.duration || "",
            provider: certification?.provider || ""
        });
        setErrors({});
        setPaymentMethod("momo");
        setPaymentType("training");
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
            const amount = getAmountToPay();
            
            // S'assurer que certificationId est un nombre valide
            let finalCertificationId: number | null = formData.certificationId;
            
            if (!finalCertificationId && certification) {
                if (typeof certification.id === 'number') {
                    finalCertificationId = certification.id;
                } else if (typeof certification.id === 'string' && certificationIdMap[certification.id]) {
                    finalCertificationId = certificationIdMap[certification.id];
                }
            }
            
            if (!finalCertificationId || isNaN(finalCertificationId)) {
                throw new Error("ID de certification invalide. Veuillez rafraîchir la page.");
            }
            
            const registrationData = {
                student_name: formData.name,
                student_email: formData.email,
                student_phone: formData.paymentPhone,
                certification_id: finalCertificationId,
                certification_name: formData.certificationName,
                certification_provider: formData.provider,
                payment_type: paymentType,
                payment_method: paymentMethod,
                amount: amount,
                registration_fees: amount
            };
            
            console.log("📝 Création de l'inscription certification:", registrationData);
            
            // Appel API pour l'inscription certification
            const response = await fetch(`${API_URL}/certification-registrations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(registrationData)
            });
            
            const result = await response.json();
            console.log("📥 Réponse du serveur:", result);
            
            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join(', ');
                    throw new Error(`Validation échouée: ${errorMessages}`);
                }
                throw new Error(result.message || "Erreur lors de l'inscription");
            }
            
            const registration = result.data;
            
            // Initier le paiement Mobile Money
            const paymentData = {
                certification_registration_id: registration.id,
                phone_number: formData.paymentPhone,
                amount: amount,
                payment_method: paymentMethod,
                description: `Inscription certification ${formData.certificationName} - ${paymentType === "training" ? "Formation" : "Examen"}`
            };
            console.log("💰 Initiation du paiement:", paymentData);
            const paymentResponse = await apiService.initiatePayment(paymentData);
            
            if (!paymentResponse.success) {
                throw new Error(paymentResponse.message || "Erreur lors de l'initiation du paiement");
            }
            
            setTransactionId(paymentResponse.data.transaction_id);
            
            localStorage.setItem('last_certification_registration', JSON.stringify({
                registration_id: registration.id,
                transaction_id: paymentResponse.data.transaction_id,
                student_name: formData.name,
                student_email: formData.email,
                certification_name: formData.certificationName
            }));
            
            setStep(3);
            
        } catch (error) {
            console.error("❌ Erreur lors du paiement:", error);
            setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    // Vérification périodique du statut de paiement
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

    const amountToPay = getAmountToPay();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-3 md:p-4 overflow-y-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-[95%] md:max-w-lg rounded-2xl shadow-xl overflow-hidden my-auto border border-gray-100"
                    >
                        {/* HEADER */}
                        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-700 p-4 md:p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full -ml-10 md:-ml-12 -mb-10 md:-mb-12"></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                                <FaAward className="text-white text-base md:text-lg" />
                                            </div>
                                            <h2 className="text-lg md:text-xl font-bold tracking-tight">
                                                {step === 1 && "Inscription Certification"}
                                                {step === 2 && "Paiement sécurisé"}
                                                {step === 3 && "Confirmation"}
                                            </h2>
                                        </div>
                                        <p className="text-blue-100 text-[11px] md:text-xs">
                                            {step === 1 && "Renseignez vos coordonnées"}
                                            {step === 2 && "Finalisez votre inscription"}
                                            {step === 3 && paymentStatus === 'completed' ? "Inscription confirmée !" : "En attente de paiement"}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={onClose} 
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
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
                        </div>

                        <div className="p-4 md:p-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {errorMessage && (
                                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                                    <FaInfoCircle className="text-red-500 text-sm mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-red-700">{errorMessage}</p>
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
                                    {/* Certification info */}
                                    <div className="bg-blue-50 rounded-xl p-3 md:p-4 border border-blue-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <FaAward className="text-blue-600 text-base md:text-lg" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-blue-500 uppercase tracking-wider">Certification</p>
                                                <h3 className="font-bold text-gray-800 text-xs md:text-sm truncate">{formData.certificationName}</h3>
                                                <p className="text-[11px] md:text-xs text-gray-500 truncate">{formData.provider}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 md:gap-3 text-[11px] md:text-xs">
                                            <span className="flex items-center gap-1.5 text-gray-600">
                                                <FaClock size={10} className="text-blue-500 flex-shrink-0" />
                                                <span className="truncate">Durée: {formData.duration}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Nom complet */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                            <FaUser size={11} className="text-gray-400" /> 
                                            Nom complet <span className="text-blue-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <FaUser className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                required 
                                                className={`w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm`}
                                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                                placeholder="Jean Dupont"
                                                value={formData.name}
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                            <FaEnvelope size={11} className="text-gray-400" /> 
                                            Email <span className="text-blue-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <FaEnvelope className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                required 
                                                type="email" 
                                                className={`w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border-2 ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm`}
                                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                                placeholder="jean.dupont@exemple.com"
                                                value={formData.email}
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Type d'inscription */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-600">Type d'inscription</label>
                                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setPaymentType("training")}
                                                className={`p-2 md:p-3 rounded-xl border-2 transition-all duration-300 ${
                                                    paymentType === "training" 
                                                        ? "border-blue-500 bg-blue-50 shadow-sm" 
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <p className="text-[11px] md:text-xs font-semibold text-gray-700">Formation certifiante</p>
                                                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">Formation</p>
                                                    <p className="text-sm md:text-base font-bold text-blue-600 mt-1">{formData.trainingPrice.toLocaleString()} FCFA</p>
                                                </div>
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setPaymentType("exam")}
                                                className={`p-2 md:p-3 rounded-xl border-2 transition-all duration-300 ${
                                                    paymentType === "exam" 
                                                        ? "border-blue-500 bg-blue-50 shadow-sm" 
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <p className="text-[11px] md:text-xs font-semibold text-gray-700">Examen seul</p>
                                                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">Sans formation</p>
                                                    <p className="text-sm md:text-base font-bold text-blue-600 mt-1">{formData.examPrice.toLocaleString()} FCFA</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Montant à payer */}
                                    <div className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] md:text-xs text-gray-500">Montant à payer</p>
                                                <p className="font-bold text-blue-600 text-xl md:text-2xl">{amountToPay.toLocaleString()} <span className="text-xs md:text-sm">FCFA</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] md:text-xs text-gray-500">Type</p>
                                                <p className="font-semibold text-gray-700 text-xs md:text-sm">
                                                    {paymentType === "training" ? "🎓 Formation certifiante" : "📝 Examen seul"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info note */}
                                    <div className="flex items-start gap-2 p-2.5 md:p-3 rounded-xl bg-blue-50 border border-blue-100">
                                        <FaInfoCircle className="text-blue-500 text-xs md:text-sm mt-0.5 flex-shrink-0" />
                                        <p className="text-[10px] md:text-[11px] text-blue-700 leading-relaxed">
                                            La formation certifiante vous donne accès à la préparation complète et à l'examen final. 
                                            Un certificat vous sera délivré après réussite de l'examen.
                                        </p>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 text-sm"
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
                                    {/* Certification */}
                                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                        <p className="text-[10px] text-blue-500 mb-1">Certification</p>
                                        <p className="font-semibold text-gray-800 text-xs md:text-sm flex items-center gap-2">
                                            <FaAward size={12} className="text-blue-600 flex-shrink-0" />
                                            <span className="truncate">{formData.certificationName}</span>
                                        </p>
                                    </div>

                                    {/* Montant */}
                                    <div className="bg-gray-50 rounded-xl p-3 md:p-4 text-center border border-gray-200">
                                        <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-wider">Montant à payer</p>
                                        <h3 className="text-xl md:text-2xl font-bold text-blue-600">{amountToPay.toLocaleString()} FCFA</h3>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {paymentType === "training" ? "Formation certifiante" : "Examen seul"}
                                        </p>
                                    </div>
                                    
                                    {/* Moyen de paiement */}
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[11px] md:text-xs font-semibold text-gray-600 uppercase tracking-wider">Moyen de paiement</label>
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
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                            <FaMobileAlt size={11} className="text-gray-400" /> 
                                            Numéro {paymentMethod === "momo" ? "MTN" : "Orange"} <span className="text-blue-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <FaMobileAlt className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                required 
                                                type="tel" 
                                                className={`w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl bg-gray-50 border-2 ${errors.paymentPhone ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm`}
                                                placeholder="6XX XXX XXX"
                                                value={formData.paymentPhone}
                                                onChange={e => setFormData({...formData, paymentPhone: e.target.value})}
                                            />
                                        </div>
                                        {errors.paymentPhone && <p className="text-red-500 text-xs mt-1">{errors.paymentPhone}</p>}
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1">📱 Format: 6XX XXX XXX (9 chiffres minimum)</p>
                                    </div>

                                    {/* Boutons */}
                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3 pt-2">
                                        <button 
                                            onClick={handlePrevious}
                                            className="sm:flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all text-sm flex items-center justify-center gap-1"
                                        >
                                            <FaArrowLeft size={12} /> Retour
                                        </button>
                                        <button 
                                            onClick={handlePayment} 
                                            disabled={loading || !isPhoneValid} 
                                            className={`sm:flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                                                loading || !isPhoneValid
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm hover:shadow-md'
                                            }`}
                                        >
                                            {loading ? <><FaSpinner className="animate-spin" size={14} /> Traitement...</> : <><FaLock size={12} /> Payer {amountToPay.toLocaleString()} FCFA</>}
                                        </button>
                                    </div>

                                    {/* Sécurité */}
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-2">
                                        <FaShieldAlt size={10} className="text-blue-500" />
                                        Paiement 100% sécurisé
                                    </div>
                                </motion.div>
                            )}

                            {/* ÉTAPE 3 : SUCCÈS */}
                            {step === 3 && (
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-2 md:py-4"
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
                                        {paymentStatus === 'completed' ? "Inscription confirmée ! 🎉" : "Inscription en cours !"}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                                        {paymentStatus === 'completed' 
                                            ? `Félicitations ${formData.name}, votre inscription est complètement validée.`
                                            : `Merci ${formData.name}, votre inscription est enregistrée.`
                                        }
                                    </p>
                                    
                                    {paymentStatus === 'pending' && (
                                        <div className="bg-yellow-50 rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-yellow-200">
                                            <p className="text-sm font-semibold text-yellow-800 mb-2">
                                                📱 Paiement Mobile Money
                                            </p>
                                            <p className="text-xs text-yellow-700">
                                                Une demande de paiement de <strong>{amountToPay.toLocaleString()} FCFA</strong> a été envoyée à votre numéro <strong>{formData.paymentPhone}</strong>.
                                            </p>
                                            <p className="text-xs text-yellow-700 mt-2">
                                                Veuillez confirmer le paiement sur votre téléphone pour finaliser votre inscription.
                                            </p>
                                        </div>
                                    )}
                                    
                                    {paymentStatus === 'completed' && (
                                        <div className="bg-emerald-50 rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-emerald-200">
                                            <p className="text-sm font-semibold text-emerald-800 mb-2">
                                                ✅ Inscription validée
                                            </p>
                                            <p className="text-xs text-emerald-700">
                                                Votre inscription a été confirmée avec succès. Vous recevrez un email de confirmation avec tous les détails.
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6 text-left border border-gray-200">
                                        <p className="text-[11px] md:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Récapitulatif</p>
                                        
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
                                                <span className="text-gray-500">Certification</span>
                                                <span className="font-medium text-blue-600 text-right ml-2">{formData.certificationName}</span>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm pb-2 border-b border-gray-200">
                                                <span className="text-gray-500">Type</span>
                                                <span className="font-medium text-blue-600 text-right ml-2">
                                                    {paymentType === "training" ? "Formation certifiante" : "Examen seul"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm pb-2 border-b border-gray-200">
                                                <span className="text-gray-500">Montant payé</span>
                                                <span className="font-bold text-blue-600 ml-2">{amountToPay.toLocaleString()} FCFA</span>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm">
                                                <span className="text-gray-500">Paiement</span>
                                                <span className="font-medium text-gray-800 ml-2">
                                                    {paymentMethod === "momo" ? "MTN Mobile Money" : "Orange Money"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] md:text-xs text-gray-400 mb-4 md:mb-5 flex flex-wrap items-center justify-center gap-1">
                                        📧 Un email a été envoyé à <strong className="text-gray-600 truncate">{formData.email}</strong>
                                    </p>

                                    <button 
                                        onClick={onClose} 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 md:py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                                    >
                                        Terminer
                                    </button>

                                    {/* Bouton de test en développement */}
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

export default CertificationModal;