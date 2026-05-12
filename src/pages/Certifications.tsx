import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CERTIFICATIONS_DATA, CATEGORIES } from "../constants";
import { FaAward, FaHistory, FaCheckCircle, FaUserPlus, FaInfoCircle } from "react-icons/fa";

const Certifications = () => {
    const [activeCategory, setActiveCategory] = useState("Tous");

    const filteredCerts = activeCategory === "Tous"
        ? CERTIFICATIONS_DATA
        : CERTIFICATIONS_DATA.filter(cert => cert.category === activeCategory);

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 mb-6"
                    >
                        Nos <span className="text-blue-600">Certifications</span>
                    </motion.h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Sélectionnez votre domaine d'expertise et boostez votre carrière avec nos titres agréés mondialement.
                    </p>
                </div>

                {/* FILTRES */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeCategory === cat
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                                : "bg-white text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* GRILLE */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredCerts.map((cert) => (
                            <motion.div
                                key={cert.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/5 hover:shadow-2xl transition-all group border border-gray-100"
                            >
                                {/* IMAGE DE FOND AVEC OVERLAY */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={cert.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"}
                                        alt=""
                                        className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-white/80" />
                                </div>

                                {/* CONTENU (Z-10 pour être au dessus de l'image) */}
                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200">
                                            <FaAward size={24} />
                                        </div>
                                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                            {cert.provider}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                        {cert.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-8 leading-relaxed line-clamp-3">
                                        {cert.description}
                                    </p>

                                    <div className="flex items-center gap-4 mb-8 text-xs font-bold text-gray-500">
                                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                                            <FaHistory className="text-blue-500" /> {cert.duration}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                                            <FaCheckCircle className="text-blue-500" /> {cert.category}
                                        </span>
                                    </div>

                                    {/* FOOTER CARTE : PRIX & BOUTONS */}
                                    <div className="pt-6 border-t border-gray-100 mt-auto">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Tarif formation</span>
                                                <p className="text-2xl font-black text-slate-900">
                                                    {cert.trainingPrice.toLocaleString()} <span className="text-xs font-normal text-gray-500">FCFA</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                                                <FaInfoCircle size={14} /> Détails
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                                                <FaUserPlus size={14} /> S'inscrire
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
};

export default Certifications;