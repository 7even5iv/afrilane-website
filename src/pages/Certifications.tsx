import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CERTIFICATIONS_DATA, CATEGORIES } from "../constants";
import { FaAward, FaHistory, FaCheckCircle } from "react-icons/fa";

const Certifications = () => {
    const [activeCategory, setActiveCategory] = useState("Tous");

    // Filtrage des données
    const filteredCerts = activeCategory === "Tous"
        ? CERTIFICATIONS_DATA
        : CERTIFICATIONS_DATA.filter(cert => cert.category === activeCategory);

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                        Nos <span className="text-blue-600">Certifications</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Sélectionnez votre domaine d'expertise et boostez votre carrière avec nos titres agréés.
                    </p>
                </div>

                {/* FILTRES (TABS) */}
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

                {/* GRILLE ANIMÉE */}
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
                                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 hover:shadow-2xl transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FaAward size={24} />
                                    </div>
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {cert.provider}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-4">{cert.name}</h3>
                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">{cert.description}</p>

                                <div className="flex items-center gap-4 mb-8 text-xs font-bold text-gray-400">
                                    <span className="flex items-center gap-1"><FaHistory className="text-blue-500" /> {cert.duration}</span>
                                    <span className="flex items-center gap-1"><FaCheckCircle className="text-blue-500" /> {cert.category}</span>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Formation dès</span>
                                        <p className="text-xl font-black text-blue-600">{cert.trainingPrice.toLocaleString()} <span className="text-xs font-normal">FCFA</span></p>
                                    </div>
                                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all">
                                        Détails
                                    </button>
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