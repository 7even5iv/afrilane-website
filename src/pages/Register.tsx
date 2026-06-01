import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaLock, FaEnvelope, FaEye, FaEyeSlash,
    FaShieldAlt, FaArrowRight, FaNetworkWired,
    FaCloud,
    FaUser, FaPhone, FaSpinner,
    FaArrowLeft
} from "react-icons/fa";

// Importation du logo
import logo from "../assets/logo.png";

// Interfaces TypeScript
interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

interface Slide {
    id: number;
    image: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
}

interface RegisterResponse {
    token: string;
    user: {
        role: string;
        name: string;
    };
    message?: string;
}

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

    const slides: Slide[] = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
            title: "Cybersécurité Avancée",
            description: "Protégez vos infrastructures contre les menaces modernes",
            icon: FaShieldAlt
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034",
            title: "Infrastructure Réseau",
            description: "Architectures réseau hautement disponibles",
            icon: FaNetworkWired
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072",
            title: "Cloud Computing",
            description: "Solutions cloud scalables et sécurisées",
            icon: FaCloud
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nom complet requis";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
        if (formData.password.length < 6) newErrors.password = "Mot de passe trop court (min 6 caractères)";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        if (!acceptTerms) newErrors.terms = "Veuillez accepter les conditions d'utilisation";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const res = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: "admin"
                })
            });

            const data: RegisterResponse | { message: string } = await res.json();

            if (res.ok) {
                const responseData = data as RegisterResponse;
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("user_role", responseData.user.role);
                localStorage.setItem("user_name", responseData.user.name);
                navigate("/admin/dashboard");
            } else {
                const errorData = data as { message: string };
                setErrors({ submit: errorData.message || "Erreur lors de l'inscription" });
            }
        } catch (err) {
            setErrors({ submit: "Le serveur ne répond pas. Veuillez réessayer plus tard." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/20">
            {/* SECTION GAUCHE - FORMULAIRE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6 relative overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6 md:p-8">
                        {/* Bouton retour */}
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 text-gray-500 text-sm mb-6 hover:text-blue-600 transition-colors"
                        >
                            <FaArrowLeft size={12} /> Retour à la connexion
                        </button>

                        {/* Logo + AFRILANE en bleu */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <img src={logo} alt="AFRILANE" className="h-12 w-auto" />
                                <span className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                                    AFRILANE
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">Créer un compte</h1>
                            <p className="text-gray-500 text-sm mt-1">Rejoignez l'espace administration AFRILANE</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            {/* Nom complet */}
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email professionnel"
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
                            </div>

                            {/* Téléphone */}
                            <div className="relative group">
                                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="tel"
                                    placeholder="Téléphone (optionnel)"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            {/* Mot de passe */}
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mot de passe"
                                    className={`w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                                {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>}
                            </div>

                            {/* Confirmation mot de passe */}
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirmer le mot de passe"
                                    className={`w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm`}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword}</p>}
                            </div>

                            {/* Conditions d'utilisation */}
                            <div className="flex items-start gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                                    J'accepte les <button type="button" className="text-blue-600 hover:underline">conditions d'utilisation</button> et la
                                    <button type="button" className="text-blue-600 hover:underline ml-1">politique de confidentialité</button>
                                </label>
                            </div>
                            {errors.terms && <p className="text-red-500 text-xs ml-6">{errors.terms}</p>}

                            {/* Erreur générale */}
                            {errors.submit && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                    <p className="text-red-600 text-xs text-center">{errors.submit}</p>
                                </div>
                            )}

                            {/* Bouton d'inscription */}
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <><FaSpinner className="animate-spin" size={14} /> Inscription en cours...</>
                                ) : (
                                    <>S'inscrire <FaArrowRight size={12} /></>
                                )}
                            </button>
                        </form>

                        {/* Lien vers connexion */}
                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-500">
                                Déjà inscrit ?
                                <button onClick={() => navigate("/login")} className="text-blue-600 font-semibold ml-2 hover:underline">
                                    Se connecter
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-400">
                            © {new Date().getFullYear()} AFRILANE. Tous droits réservés.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* SECTION DROITE - SLIDER */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                    >
                        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-l from-gray-900 via-gray-900/60 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 flex flex-col justify-between w-full p-8 md:p-12">
                    {/* Logo + AFRILANE en bleu dans le slider */}
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="h-10 w-auto brightness-0 invert" />
                        <span className="text-white font-bold text-xl tracking-tight">AFRILANE</span>
                    </div>

                    <div className="max-w-md">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white text-xl">
                                    {(() => { const Icon = slides[currentSlide].icon; return <Icon />; })()}
                                </div>
                                <h2 className="text-3xl font-bold text-white leading-tight">{slides[currentSlide].title}</h2>
                                <p className="text-gray-300 text-base leading-relaxed">{slides[currentSlide].description}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-2">
                        {slides.map((_, idx: number) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? "w-8 bg-blue-500" : "w-2 bg-white/30"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;