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
    FaGraduationCap
} from "react-icons/fa";
import { useState } from "react";
import QuoteModal from "../components/ui/QuoteModal";

const Formations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Supprimer selectedFormation car il n'est pas utilisé
    // const [selectedFormation, setSelectedFormation] = useState(null);

    return (
        <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen pt-32 pb-20">
            {/* Effets de fond */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER MODERNISÉ AVEC INFOS OFFICIELLES */}
                <div className="text-center mb-16">
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
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
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
                        className="text-gray-500 max-w-2xl mx-auto text-lg"
                    >
                        Inscriptions ouvertes dès le{" "}
                        <span className="font-bold text-gray-900">03 Novembre 2026</span>.
                        Prenez une longueur d'avance avec nos cursus métiers certifiés par l'État.
                    </motion.p>

                    {/* Badge Frais d'inscription modernisé */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 inline-flex items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-2xl shadow-xl"
                    >
                        <div className="text-left">
                            <p className="text-xs uppercase tracking-widest opacity-70">Frais d'inscription</p>
                            <p className="text-2xl font-black text-blue-400">30 000 FCFA</p>
                        </div>
                        <div className="h-10 w-px bg-white/20" />
                        <div className="text-left">
                            <p className="text-xs uppercase tracking-widest opacity-70">Rentrée académique</p>
                            <p className="text-sm font-semibold">03 Novembre 2026</p>
                        </div>
                    </motion.div>
                </div>

                {/* GRILLE DES FORMATIONS MODERNISÉE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {VOCATIONAL_TRAININGS.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image avec Badge Catégorie */}
                            <div className="h-52 relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                                <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                    {item.category}
                                </span>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-blue-600 text-xs font-medium mb-4">
                                    {item.subTitle}
                                </p>

                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {/* Supprimer la référence à item.description si elle n'existe pas */}
                                    Formation professionnelle certifiante reconnue par l'État.
                                </p>

                                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                            Scolarité
                                        </p>
                                        <p className="text-2xl font-black text-gray-900">
                                            {item.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">FCFA</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="group/btn bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                                    >
                                        <FaUserPlus size={18} className="group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* BANNIÈRE CONTACT BAS DE PAGE MODERNISÉE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-8 md:p-10"
                >
                    {/* Effets de fond */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm shadow-lg">
                                <FaGraduationCap size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Besoin d'en savoir plus ?</h4>
                                <p className="text-blue-100 text-sm">
                                    Contactez-nous à Biteng (Entrée Maetur) ou appelez-nous directement
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.href = 'tel:699463424'}
                            className="flex items-center gap-3 bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:shadow-xl transition-all duration-300"
                        >
                            <FaPhoneAlt className="text-blue-600" />
                            Appeler maintenant
                        </motion.button>
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
                            Formation sur 6 mois
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                            <FaClock className="text-blue-500" />
                            Cours en soirée & week-end
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* MODALE D'INSCRIPTION */}
            <QuoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Formations;