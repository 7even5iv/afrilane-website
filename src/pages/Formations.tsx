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
import { useState } from "react";
import RegistrationModal from "../components/ui/RegistrationModal";

// Interfaces TypeScript
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
        console.log("Formation sélectionnée:", formation);
        setSelectedFormation(formation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFormation(null);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen pt-32 pb-20">
            {/* Effets de fond */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER MODERNISÉ */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6"
                    >
                        <FaStar className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Formation Professionnelle
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-gray-200"
                    >
                        <FaFileContract className="text-blue-500" />
                        Arrêté N° 000029/MINFOP/SG/DFOP du 27 Fév 2023
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
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
                        className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg"
                    >
                        Inscriptions ouvertes dès le{" "}
                        <span className="font-bold text-gray-900">03 Novembre 2026</span>.
                        Prenez une longueur d'avance avec nos cursus métiers certifiés par l'État.
                    </motion.p>
                </div>

                {/* STATISTIQUES */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
                >
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-3">
                                <stat.icon size={18} />
                            </div>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* BADGE FRAIS D'INSCRIPTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mb-16"
                >
                    <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-3 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest opacity-70">Frais d'inscription</p>
                                <p className="text-xl font-bold text-blue-400">30 000 FCFA</p>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest opacity-70">Rentrée académique</p>
                                <p className="text-sm font-semibold">03 Novembre 2026</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* GRILLE DES FORMATIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {VOCATIONAL_TRAININGS.map((item: Training, index: number) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image avec Badge */}
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                                <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                    {item.category}
                                </span>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-blue-600 text-xs font-medium mb-3">
                                    {item.subTitle}
                                </p>

                                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {item.description || "Formation professionnelle reconnue par l'État. Formation complète avec stage pratique et accompagnement personnalisé."}
                                </p>

                                {/* Détails supplémentaires */}
                                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FaClock size={10} />
                                        {item.duration || "12 mois"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaCalendarAlt size={10} />
                                        {item.schedule || "Cours du jour"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Frais de scolarité
                                        </p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {(item.price || 250000).toLocaleString()} <span className="text-xs font-normal text-gray-500">FCFA/an</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm"
                                    >
                                        <FaUserPlus size={14} />
                                        S'inscrire
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AVANTAGES DE LA FORMATION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
                        Pourquoi choisir nos formations ?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {advantages.map((advantage, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                                    <advantage.icon size={22} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{advantage.title}</h3>
                                <p className="text-sm text-gray-500">{advantage.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* BANNIÈRE CONTACT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 md:p-10"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                                <FaGraduationCap size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">Besoin d'en savoir plus ?</h4>
                                <p className="text-blue-100 text-sm">
                                    Contactez-nous à Biteng (Entrée Maetur) ou appelez-nous directement
                                </p>
                            </div>
                        </div>
                        <motion.a
                            href="tel:699463424"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                        >
                            <FaPhoneAlt className="text-blue-600" />
                            Appeler maintenant
                        </motion.a>
                    </div>
                </motion.div>

                {/* Informations complémentaires */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <FaCheckCircle className="text-green-500" />
                            Certification reconnue
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-blue-500" />
                            Formation sur 12 mois
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                            <FaClock className="text-blue-500" />
                            Cours du jour
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