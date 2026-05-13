import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CERTIFICATIONS_DATA, CATEGORIES } from "../constants";
import {
    FaAward,
    FaHistory,
    FaCheckCircle,
    FaUserPlus,
    FaInfoCircle,
    FaStar,
    FaChartLine,
} from "react-icons/fa";
import QuoteModal from "../components/ui/QuoteModal";

const Certifications = () => {
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);

    const filteredCerts =
        activeCategory === "Tous"
            ? CERTIFICATIONS_DATA
            : CERTIFICATIONS_DATA.filter(
                (cert) => cert.category === activeCategory
            );

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-32 pb-24">

            {/* Background Effects améliorés */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-300/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/5 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER modernisé */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6"
                    >
                        <FaStar className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Certifications professionnelles
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6"
                    >
                        Développez vos{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            compétences IT
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed"
                    >
                        Accédez aux certifications les plus demandées du marché
                        et boostez votre carrière avec des formations reconnues
                        mondialement.
                    </motion.p>
                </div>

                {/* FILTERS modernisés */}
                <div className="flex flex-wrap justify-center gap-3 mb-20">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.button
                            key={cat}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${activeCategory === cat
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                }`}
                        >
                            {cat}
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* GRID améliorée */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCerts.map((cert, idx) => (
                            <motion.div
                                key={cert.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                whileHover={{ y: -8 }}
                                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                            >

                                {/* Image de fond avec overlay amélioré */}
                                <div className="absolute inset-0">
                                    <img
                                        src={cert.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"}
                                        alt={cert.name}
                                        className="w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-all duration-700 scale-110 group-hover:scale-100"
                                    />
                                </div>

                                {/* Contenu principal */}
                                <div className="relative z-10 p-6 flex flex-col h-full">

                                    {/* Header avec icône et badge */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                            <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                                                <FaAward size={22} />
                                            </div>
                                        </div>
                                        <span className="bg-gray-50 border border-gray-200 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                            {cert.provider}
                                        </span>
                                    </div>

                                    {/* Titre */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                        {cert.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                        {cert.description}
                                    </p>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">
                                            <FaHistory className="text-blue-500 text-xs" />
                                            {cert.duration}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">
                                            <FaCheckCircle className="text-blue-500 text-xs" />
                                            {cert.category}
                                        </div>
                                    </div>

                                    {/* Prix */}
                                    <div className="mb-6 pt-4 border-t border-gray-100">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            Tarif formation
                                        </span>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-3xl font-black text-gray-900">
                                                {Number(cert.trainingPrice).toLocaleString()}
                                            </span>
                                            <span className="text-sm font-medium text-gray-500">
                                                FCFA
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 mt-auto">
                                        <button
                                            onClick={() => setSelectedCert(cert)}
                                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300"
                                        >
                                            <FaInfoCircle size={14} />
                                            Détails
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:scale-95"
                                        >
                                            <FaUserPlus size={14} />
                                            S'inscrire
                                        </button>
                                    </div>
                                </div>

                                {/* Bordure décorative au survol */}
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Message si aucun résultat */}
                {filteredCerts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-gray-400 text-lg">
                            Aucune certification trouvée dans cette catégorie
                        </div>
                    </motion.div>
                )}
            </div>

            {/* MODAL avec certification sélectionnée */}
            <QuoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                certification={selectedCert}
            />
        </div>
    );
};

export default Certifications;