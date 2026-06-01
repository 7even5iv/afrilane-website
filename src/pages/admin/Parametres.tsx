import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaCog, FaUniversity, FaBell, FaSave, 
    FaGlobe, FaPhoneAlt, FaEnvelope, FaShieldAlt, FaSpinner, FaCheckCircle,
    FaDatabase, FaServer, FaKey, FaEye, FaEyeSlash,
    FaExclamationCircle, FaHistory
} from 'react-icons/fa';

// Interfaces TypeScript
interface SchoolInfo {
    name: string;
    slogan: string;
    academicYear: string;
    email: string;
    phone: string;
    address: string;
    website: string;
}

interface PasswordData {
    current: string;
    new: string;
    confirm: string;
}

interface Tab {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    textColor: string;
    hoverBg: string;
}

interface Stats {
    version: string;
    environment: string;
    lastBackup: string;
    usersCount: string;
}

const Parametres = () => {
    const [loading, setLoading] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState("etablissement");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // États pour les formulaires
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
        name: "AFRILANE",
        slogan: "Expertise & Certification IT",
        academicYear: "2025-2026",
        email: "contact@afrilane.cm",
        phone: "+237 222 31 16 01",
        address: "Yaoundé - Maétur Biteng",
        website: "www.afrilane.cm"
    });

    const [passwordData, setPasswordData] = useState<PasswordData>({
        current: "",
        new: "",
        confirm: ""
    });

    // Détection mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const validatePasswordForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!passwordData.current) newErrors.current = "Mot de passe actuel requis";
        if (!passwordData.new) newErrors.new = "Nouveau mot de passe requis";
        if (passwordData.new.length < 6) newErrors.new = "Minimum 6 caractères";
        if (passwordData.new !== passwordData.confirm) newErrors.confirm = "Les mots de passe ne correspondent pas";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveInfo = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;
        
        setLoadingPassword(true);
        setTimeout(() => {
            setLoadingPassword(false);
            setPasswordSuccess(true);
            setPasswordData({ current: "", new: "", confirm: "" });
            setTimeout(() => setPasswordSuccess(false), 3000);
        }, 1500);
    };

    const tabs: Tab[] = [
        { id: "etablissement", label: "Établissement", icon: FaUniversity, color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-600", hoverBg: "hover:bg-blue-50" },
        { id: "securite", label: "Sécurité", icon: FaShieldAlt, color: "red", bgColor: "bg-red-50", textColor: "text-red-600", hoverBg: "hover:bg-red-50" },
        { id: "notifications", label: "Notifications", icon: FaBell, color: "purple", bgColor: "bg-purple-50", textColor: "text-purple-600", hoverBg: "hover:bg-purple-50" },
        { id: "systeme", label: "Système", icon: FaServer, color: "emerald", bgColor: "bg-emerald-50", textColor: "text-emerald-600", hoverBg: "hover:bg-emerald-50" }
    ];

    const stats: Stats = {
        version: "2.0.0",
        environment: "Production",
        lastBackup: "15/05/2024",
        usersCount: "156"
    };

    // Récupérer l'onglet actif
    const activeTabObj = tabs.find(t => t.id === activeTab);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                
                {/* EN-TÊTE DE LA PAGE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaCog className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Paramètres</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Personnalisez votre plateforme de gestion
                    </p>
                </div>

                {/* BOUTON DE MENU MOBILE */}
                {isMobile && (
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 p-3 mb-2"
                    >
                        <div className="flex items-center gap-2">
                            {activeTabObj && (
                                <div className={`w-8 h-8 rounded-lg ${activeTabObj.bgColor} flex items-center justify-center`}>
                                    <activeTabObj.icon className={`${activeTabObj.textColor} text-sm`} />
                                </div>
                            )}
                            <span className="font-medium text-gray-800 text-sm">
                                {activeTabObj?.label}
                            </span>
                        </div>
                        {isMobileMenuOpen ? 
                            <FaChevronUp size={14} className="text-gray-400" /> : 
                            <FaChevronDown size={14} className="text-gray-400" />
                        }
                    </button>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    
                    {/* COLONNE GAUCHE : NAVIGATION DES RÉGLAGES - RESPONSIVE */}
                    {(!isMobile || isMobileMenuOpen) && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:col-span-1 space-y-3 sm:space-y-4"
                        >
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 px-2">
                                    Menu réglages
                                </h3>
                                <nav className="space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    if (isMobile) setIsMobileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                                                    isActive 
                                                        ? `${tab.bgColor} ${tab.textColor} font-semibold` 
                                                        : `text-gray-500 ${tab.hoverBg}`
                                                }`}
                                            >
                                                <Icon size={14} className={isActive ? tab.textColor : 'text-gray-400'} />
                                                <span className="truncate">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* CARTE STATUT SYSTÈME - RESPONSIVE */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white shadow-md">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                                        Système en ligne
                                    </span>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <div>
                                        <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-semibold">Version</p>
                                        <p className="text-base sm:text-lg font-bold text-white">v{stats.version}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-semibold">Environnement</p>
                                        <p className="text-xs sm:text-sm text-gray-300">{stats.environment}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-semibold">Dernière sauvegarde</p>
                                        <p className="text-xs sm:text-sm text-gray-300">{stats.lastBackup}</p>
                                    </div>
                                </div>
                            </div>

                            {/* CARTE STATISTIQUES - RESPONSIVE */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-5">
                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                    <FaDatabase className="text-blue-500 text-xs sm:text-sm" />
                                    <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Base de données</h4>
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.usersCount}</p>
                                <p className="text-[10px] sm:text-xs text-gray-400">Utilisateurs actifs</p>
                            </div>
                        </motion.div>
                    )}

                    {/* COLONNE DROITE : FORMULAIRES RESPONSIVES */}
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                        
                        {/* SECTION ÉTABLISSEMENT */}
                        {activeTab === "etablissement" && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <FaUniversity className="text-blue-600 text-sm sm:text-base" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-gray-800">Identité de l'établissement</h2>
                                        <p className="text-[10px] sm:text-xs text-gray-500">Informations générales de votre institution</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleSaveInfo} className="space-y-4 sm:space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Nom de la structure</label>
                                            <input 
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm"
                                                value={schoolInfo.name}
                                                onChange={e => setSchoolInfo({...schoolInfo, name: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Année académique</label>
                                            <input 
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm font-semibold text-blue-600"
                                                value={schoolInfo.academicYear}
                                                onChange={e => setSchoolInfo({...schoolInfo, academicYear: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Slogan / Devise</label>
                                        <input 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm"
                                            value={schoolInfo.slogan}
                                            onChange={e => setSchoolInfo({...schoolInfo, slogan: e.target.value})}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                                <FaEnvelope size={10} /> Email officiel
                                            </label>
                                            <input 
                                                type="email"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm"
                                                value={schoolInfo.email}
                                                onChange={e => setSchoolInfo({...schoolInfo, email: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                                <FaPhoneAlt size={10} /> Téléphone
                                            </label>
                                            <input 
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm"
                                                value={schoolInfo.phone}
                                                onChange={e => setSchoolInfo({...schoolInfo, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Adresse</label>
                                        <input 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm"
                                            value={schoolInfo.address}
                                            onChange={e => setSchoolInfo({...schoolInfo, address: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                            <FaGlobe size={10} /> Site web
                                        </label>
                                        <input 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm"
                                            value={schoolInfo.website}
                                            onChange={e => setSchoolInfo({...schoolInfo, website: e.target.value})}
                                            placeholder="www.exemple.com"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium hover:shadow-md transition-all flex items-center justify-center sm:justify-start gap-2 disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
                                    >
                                        {loading ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                                        {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                                    </button>

                                    {success && (
                                        <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-emerald-600 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2">
                                            <FaCheckCircle /> Les informations ont été mises à jour.
                                        </motion.p>
                                    )}
                                </form>
                            </motion.div>
                        )}

                        {/* SECTION SÉCURITÉ */}
                        {activeTab === "securite" && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                        <FaShieldAlt className="text-red-600 text-sm sm:text-base" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-gray-800">Sécurité du compte</h2>
                                        <p className="text-[10px] sm:text-xs text-gray-500">Gérez votre mot de passe et la sécurité</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5">
                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Mot de passe actuel</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border ${errors.current ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm pr-10`}
                                                value={passwordData.current}
                                                onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                                            >
                                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                            </button>
                                        </div>
                                        {errors.current && <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1"><FaExclamationCircle size={10} /> {errors.current}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Nouveau mot de passe</label>
                                        <div className="relative">
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border ${errors.new ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm pr-10`}
                                                value={passwordData.new}
                                                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                            </button>
                                        </div>
                                        {errors.new && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.new}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1">Confirmer le mot de passe</label>
                                        <input 
                                            type="password"
                                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border ${errors.confirm ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs sm:text-sm`}
                                            value={passwordData.confirm}
                                            onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                                        />
                                        {errors.confirm && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.confirm}</p>}
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loadingPassword}
                                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium hover:shadow-md transition-all flex items-center justify-center sm:justify-start gap-2 disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
                                    >
                                        {loadingPassword ? <FaSpinner className="animate-spin" size={14} /> : <FaKey size={14} />}
                                        {loadingPassword ? "Modification..." : "Changer le mot de passe"}
                                    </button>

                                    {passwordSuccess && (
                                        <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-emerald-600 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2">
                                            <FaCheckCircle /> Votre mot de passe a été modifié avec succès.
                                        </motion.p>
                                    )}
                                </form>

                                {/* Conseils de sécurité */}
                                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                                    <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-2">Conseils de sécurité</h4>
                                    <ul className="text-[10px] sm:text-xs text-gray-400 space-y-1 list-disc list-inside">
                                        <li>Utilisez un mot de passe d'au moins 8 caractères</li>
                                        <li>Combinez lettres majuscules, minuscules, chiffres et symboles</li>
                                        <li>Ne partagez jamais votre mot de passe</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}

                        {/* SECTION NOTIFICATIONS - RESPONSIVE */}
                        {activeTab === "notifications" && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 md:p-12 text-center"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                    <FaBell className="text-purple-600 text-2xl sm:text-3xl" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
                                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                                    La configuration des notifications sera disponible dans une prochaine version.
                                </p>
                            </motion.div>
                        )}

                        {/* SECTION SYSTÈME - RESPONSIVE */}
                        {activeTab === "systeme" && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <FaServer className="text-emerald-600 text-sm sm:text-base" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-gray-800">Informations système</h2>
                                        <p className="text-[10px] sm:text-xs text-gray-500">Détails techniques de la plateforme</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-xs sm:text-sm text-gray-500">Version de l'application</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-800">v{stats.version}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-xs sm:text-sm text-gray-500">Environnement</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-800">{stats.environment}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-xs sm:text-sm text-gray-500">Dernière sauvegarde</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-800">{stats.lastBackup}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 gap-1 sm:gap-0">
                                        <span className="text-xs sm:text-sm text-gray-500">Base de données</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-800">MySQL 8.0</span>
                                    </div>
                                </div>

                                <button className="mt-4 sm:mt-6 w-full bg-gray-100 text-gray-600 px-4 py-2 sm:py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all text-xs sm:text-sm flex items-center justify-center gap-2">
                                    <FaHistory size={12} /> Journal d'activité
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composants d'icônes manquants
const FaChevronDown = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size || 14} height={size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const FaChevronUp = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size || 14} height={size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

export default Parametres;