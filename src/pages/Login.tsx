import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaLock, FaEnvelope, FaEye, FaEyeSlash,
    FaShieldAlt, FaArrowRight, FaNetworkWired,
    FaServer, FaCloud, FaRobot,
    FaArrowLeft, FaUserPlus, FaSpinner,
    FaCheckCircle,
    FaHome
} from "react-icons/fa";

// Import du logo
import logo from "../assets/logo.png";

// Interfaces TypeScript
interface Credentials {
    email: string;
    password: string;
}

interface Slide {
    id: number;
    image: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
}

interface LoginResponse {
    token: string;
    user: {
        role: string;
        name: string;
    };
}

const Login = () => {
    const [credentials, setCredentials] = useState<Credentials>({ email: "", password: "" });
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [resetEmail, setResetEmail] = useState<string>("");
    const [resetMessage, setResetMessage] = useState<string>("");
    const [isResetLoading, setIsResetLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const slides: Slide[] = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
            title: "Cybersécurité Avancée",
            description: "Protégez vos infrastructures contre les menaces modernes avec une sécurité de pointe",
            icon: FaShieldAlt
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034",
            title: "Infrastructure Réseau",
            description: "Architectures réseau hautement disponibles pour une connectivité optimale",
            icon: FaNetworkWired
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072",
            title: "Cloud Computing",
            description: "Solutions cloud scalables et sécurisées pour votre entreprise",
            icon: FaCloud
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070",
            title: "Data Center Moderne",
            description: "Infrastructures de dernière génération pour une performance maximale",
            icon: FaServer
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070",
            title: "Innovation Technologique",
            description: "À la pointe de l'innovation IT pour votre transformation digitale",
            icon: FaRobot
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            const data: LoginResponse | { message: string } = await res.json();

            if (res.ok) {
                const responseData = data as LoginResponse;
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("user_role", responseData.user.role);
                localStorage.setItem("user_name", responseData.user.name);
                navigate("/admin/dashboard");
            } else {
                const errorData = data as { message: string };
                setError(errorData.message || "Email ou mot de passe incorrect");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsResetLoading(true);
        setTimeout(() => {
            setResetMessage("Un lien de récupération a été envoyé à " + resetEmail);
            setIsResetLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/20">
            {/* SECTION GAUCHE - SLIDER IT */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 flex flex-col justify-between w-full p-8 md:p-12">
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
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? "w-8 bg-blue-500" : "w-2 bg-white/30"}`}
                                aria-label={`Aller à la slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION DROITE - LOGIN */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6 relative overflow-y-auto bg-white">
                
                {/* BOUTON RETOUR À L'ACCUEIL */}
                <Link 
                    to="/" 
                    className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold transition-colors duration-300 group z-20"
                >
                    <FaHome className="text-lg group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Retour à l'accueil</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {!showForgotPassword ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6 md:p-8"
                                >
                                    <div className="text-center mb-8">
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <img src={logo} alt="Afrilane" className="h-12 w-auto" />
                                            <span className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                                                AFRILANE
                                            </span>
                                        </div>
                                        <h1 className="text-xl font-bold text-gray-800">Connexion</h1>
                                        <p className="text-gray-500 text-sm mt-1">Accédez à votre espace sécurisé</p>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="relative group">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Adresse email"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="relative group">
                                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                placeholder="Mot de passe"
                                                className="w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                            </button>
                                        </div>

                                        {error && (
                                            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                                <p className="text-red-600 text-xs text-center font-medium">{error}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-xs">
                                            <button
                                                type="button"
                                                onClick={() => navigate("/register")}
                                                className="text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
                                            >
                                                <FaUserPlus size={12} /> Créer un compte
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPassword(true)}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                Mot de passe oublié ?
                                            </button>
                                        </div>

                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <><FaSpinner className="animate-spin" size={14} /> Connexion...</>
                                            ) : (
                                                <>Se connecter <FaArrowRight size={12} /></>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="forgot"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6 md:p-8"
                                >
                                    <button
                                        onClick={() => setShowForgotPassword(false)}
                                        className="flex items-center gap-2 text-gray-500 text-sm mb-6 hover:text-blue-600 transition-colors font-medium"
                                    >
                                        <FaArrowLeft size={12} /> Retour
                                    </button>

                                    <div className="text-center mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                            <FaLock className="text-blue-600 text-xl" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-800">Mot de passe oublié ?</h2>
                                        <p className="text-gray-500 text-sm mt-1">Saisissez votre email pour recevoir les instructions</p>
                                    </div>

                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Votre adresse email"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                                onChange={e => setResetEmail(e.target.value)}
                                            />
                                        </div>

                                        {resetMessage && (
                                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                                                <FaCheckCircle className="text-emerald-500 text-sm" />
                                                <p className="text-emerald-600 text-xs font-medium">{resetMessage}</p>
                                            </div>
                                        )}

                                        <button
                                            disabled={isResetLoading}
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isResetLoading ? (
                                                <><FaSpinner className="animate-spin" size={14} /> Envoi...</>
                                            ) : (
                                                "Réinitialiser le mot de passe"
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Copyright Footer */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-400 font-medium">
                            © {new Date().getFullYear()} AFRILANE. Tous droits réservés.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;