import { motion } from "framer-motion";
import { VOCATIONAL_TRAININGS } from "../constants";
import {
    FaCheckCircle,
    FaFileContract,
    FaUserPlus,
    FaStar,
    FaClock,
    FaCalendarAlt,
    FaPhoneAlt,
    FaGraduationCap,
    FaBookOpen,
    FaChartLine,
    FaUsers,
    FaAward,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import RegistrationModal from "../components/ui/RegistrationModal";

interface Stat {
    label: string;
    value: string;
    icon: React.ComponentType<any>;
}

interface Advantage {
    title: string;
    desc: string;
    icon: React.ComponentType<any>;
}

interface Training {
    id: string;
    title: string;
    subTitle: string;
    price: number;
    category: string;
    image: string;
    description?: string;
    duration?: string;
    schedule?: string;
}

const Formations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState<Training | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 640);
            setIsTablet(width >= 640 && width < 1024);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const stats: Stat[] = [
        { label: "Certifications", value: "12+", icon: FaAward },
        { label: "Étudiants formés", value: "500+", icon: FaUsers },
        { label: "Taux de réussite", value: "95%", icon: FaChartLine },
        { label: "Formateurs experts", value: "15+", icon: FaBookOpen },
    ];

    const advantages: Advantage[] = [
        { title: "Certification reconnue", desc: "Diplômes certifiés par l'État et reconnus sur le marché du travail", icon: FaAward },
        { title: "Formateurs experts", desc: "Professionnels en activité avec une solide expérience terrain", icon: FaUsers },
        { title: "Accompagnement personnalisé", desc: "Suivi individuel et coaching tout au long de la formation", icon: FaChartLine },
    ];

    const handleOpenModal = (formation: Training) => {
        setSelectedFormation(formation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFormation(null);
    };

    return (
        <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-10 xs:pb-12 sm:pb-16 md:pb-20">

            {/* Effets de fond optimisés */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[200px] xs:w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[200px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-blue-400/5 rounded-full blur-xl xs:blur-2xl sm:blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[180px] xs:w-[250px] sm:w-[350px] md:w-[400px] lg:w-[500px] h-[180px] xs:h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-gray-300/10 rounded-full blur-xl xs:blur-2xl sm:blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] xs:w-[400px] sm:w-[600px] md:w-[700px] lg:w-[800px] h-[300px] xs:h-[400px] sm:h-[600px] md:h-[700px] lg:h-[800px] bg-blue-200/5 rounded-full blur-2xl sm:blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">

                {/* HEADER - Responsive */}
                <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-blue-50 border border-blue-200 rounded-full px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 mb-3 xs:mb-4 sm:mb-6"
                    >
                        <FaStar className="text-blue-500 text-[8px] xs:text-[10px] sm:text-xs" />
                        <span className="text-[8px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-600">
                            Formation Pro
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full bg-gray-100 text-gray-700 text-[7px] xs:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mb-3 xs:mb-4 sm:mb-6 border border-gray-200 max-w-[95%] xs:max-w-[90%] sm:max-w-full"
                    >
                        <FaFileContract className="text-blue-500 text-[10px] xs:text-xs sm:text-sm flex-shrink-0" />
                        <span className="truncate">
                            Arrêté N° 000029/MINFOP/SG/DFOP/SDGSF/CSACD/CBAC du 27 Fév 2023
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4 px-2"
                    >
                        Centre de Formation{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Professionnelle
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-500 max-w-2xl mx-auto text-xs xs:text-sm sm:text-base md:text-lg px-3 xs:px-4"
                    >
                        Inscriptions ouvertes dès le{" "}
                        <span className="font-bold text-gray-900">03 Novembre 2026</span>.
                        Prenez une longueur d'avance avec nos cursus métiers certifiés par l'État.
                    </motion.p>
                </div>

                {/* STATISTIQUES - Responsive */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 mb-10 xs:mb-12 sm:mb-16"
                >
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl border border-gray-200 p-2.5 xs:p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-1.5 xs:mb-2 sm:mb-3">
                                <stat.icon size={isMobile ? 12 : isTablet ? 14 : 18} />
                            </div>
                            <p className="text-sm xs:text-base sm:text-xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500 mt-0.5 xs:mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* BADGE FRAIS D'INSCRIPTION - Responsive */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mb-10 xs:mb-12 sm:mb-16"
                >
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-xl max-w-[92%] xs:max-w-[90%] sm:max-w-full">
                        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                            <div className="text-left">
                                <p className="text-[7px] xs:text-[8px] sm:text-xs uppercase tracking-widest opacity-70">Frais d'inscription</p>
                                <p className="text-sm xs:text-base sm:text-xl font-bold text-blue-400">30 000 FCFA</p>
                            </div>
                            <div className="h-5 xs:h-6 sm:h-8 w-px bg-white/20" />
                            <div className="text-left">
                                <p className="text-[7px] xs:text-[8px] sm:text-xs uppercase tracking-widest opacity-70">Rentrée</p>
                                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold">03 Nov 2026</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* GRILLE DES FORMATIONS - Responsive */}
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    {VOCATIONAL_TRAININGS.map((item: Training, index: number) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: isMobile ? 0 : -4 }}
                            className="group bg-white rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image avec Badge */}
                            <div className="h-36 xs:h-40 sm:h-44 md:h-48 relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                                <span className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[7px] xs:text-[8px] sm:text-[10px] font-bold px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                    {item.category}
                                </span>
                            </div>

                            <div className="p-3 xs:p-4 sm:p-5 md:p-6">
                                <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                                    {item.title}
                                </h3>
                                <p className="text-blue-600 text-[8px] xs:text-[10px] sm:text-xs font-medium mb-1.5 xs:mb-2 sm:mb-3 line-clamp-1">
                                    {item.subTitle}
                                </p>

                                <p className="text-gray-500 text-[10px] xs:text-xs sm:text-sm leading-relaxed mb-2 xs:mb-3 sm:mb-4 line-clamp-2">
                                    {item.description || "Formation professionnelle reconnue par l'État. Formation complète avec stage pratique et accompagnement personnalisé."}
                                </p>

                                {/* Détails supplémentaires */}
                                <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-4 mb-2 xs:mb-3 sm:mb-4 text-[8px] xs:text-[10px] sm:text-xs text-gray-500">
                                    <span className="flex items-center gap-0.5 xs:gap-1">
                                        <FaClock size={isMobile ? 7 : isTablet ? 8 : 10} />
                                        {item.duration || "12 mois"}
                                    </span>
                                    <span className="flex items-center gap-0.5 xs:gap-1">
                                        <FaCalendarAlt size={isMobile ? 7 : isTablet ? 8 : 10} />
                                        {item.schedule || "Cours du jour"}
                                    </span>
                                </div>

                                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 pt-2 xs:pt-3 sm:pt-4 border-t border-gray-100">
                                    <div className="w-full xs:w-auto">
                                        <p className="text-[7px] xs:text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Frais de scolarité
                                        </p>
                                        <p className="text-sm xs:text-base sm:text-xl font-bold text-gray-900">
                                            {(item.price || 250000).toLocaleString()} <span className="text-[8px] xs:text-[10px] sm:text-xs font-normal text-gray-500">FCFA/an</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="w-full xs:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm"
                                    >
                                        <FaUserPlus size={isMobile ? 10 : isTablet ? 12 : 14} />
                                        <span>S'inscrire</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AVANTAGES - Responsive */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-14 xs:mt-16 sm:mt-20"
                >
                    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-5 xs:mb-6 sm:mb-8 px-4">
                        Pourquoi choisir nos formations ?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                        {advantages.map((advantage, idx) => (
                            <div key={idx} className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 xs:p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-all">
                                <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-4">
                                    <advantage.icon size={isMobile ? 16 : isTablet ? 18 : 22} />
                                </div>
                                <h3 className="text-xs xs:text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">{advantage.title}</h3>
                                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500">{advantage.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* BANNIÈRE CONTACT - Responsive */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-14 xs:mt-16 sm:mt-20 relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-4 xs:p-6 sm:p-8 md:p-10"
                >
                    <div className="absolute top-0 right-0 w-32 xs:w-40 sm:w-60 md:w-80 h-32 xs:h-40 sm:h-60 md:h-80 bg-white/10 rounded-full blur-xl xs:blur-2xl sm:blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 xs:w-40 sm:w-60 md:w-80 h-32 xs:h-40 sm:h-60 md:h-80 bg-blue-400/20 rounded-full blur-xl xs:blur-2xl sm:blur-3xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 xs:gap-4 sm:gap-6">
                        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 w-full sm:w-auto">
                            <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg xs:rounded-xl flex items-center justify-center text-white backdrop-blur-sm flex-shrink-0">
                                <FaGraduationCap size={isMobile ? 16 : isTablet ? 20 : 24} />
                            </div>
                            <div className="flex-1 sm:flex-none">
                                <h4 className="text-xs xs:text-sm sm:text-lg font-bold text-white">Besoin d'en savoir plus ?</h4>
                                <p className="text-blue-100 text-[10px] xs:text-xs sm:text-sm">
                                    Contactez-nous ou appelez-nous
                                </p>
                            </div>
                        </div>
                        <motion.a
                            href="tel:659816042"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 bg-white text-gray-900 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transition-all duration-300 text-[10px] xs:text-xs sm:text-sm md:text-base"
                        >
                            <FaPhoneAlt className="text-blue-600 text-[10px] xs:text-xs sm:text-sm" />
                            Appeler maintenant
                        </motion.a>
                    </div>
                </motion.div>

                {/* Informations complémentaires - Responsive */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 xs:mt-10 sm:mt-12 text-center"
                >
                    <div className="flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 sm:gap-4 text-[8px] xs:text-[10px] sm:text-xs text-gray-400 px-1 xs:px-2">
                        <span className="flex items-center gap-0.5 xs:gap-1">
                            <FaCheckCircle className="text-green-500 text-[10px] xs:text-xs sm:text-sm" />
                            <span className="hidden xs:inline">Certification reconnue</span>
                            <span className="xs:hidden">Certifiée</span>
                        </span>
                        <span className="w-0.5 h-1 xs:h-1 sm:h-1.5 rounded-full bg-gray-300 hidden xs:block" />
                        <span className="flex items-center gap-0.5 xs:gap-1">
                            <FaCalendarAlt className="text-blue-500 text-[10px] xs:text-xs sm:text-sm" />
                            Formation sur 12 mois
                        </span>
                        <span className="w-0.5 h-1 xs:h-1 sm:h-1.5 rounded-full bg-gray-300 hidden xs:block" />
                        <span className="flex items-center gap-0.5 xs:gap-1">
                            <FaClock className="text-blue-500 text-[10px] xs:text-xs sm:text-sm" />
                            <span className="hidden xs:inline">Cours du jour</span>
                            <span className="xs:hidden">Jour</span>
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* MODALE D'INSCRIPTION */}
            <RegistrationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                formation={selectedFormation}
            />
        </div>
    );
};

export default Formations;