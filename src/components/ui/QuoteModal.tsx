import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheckCircle, FaRocket } from "react-icons/fa";

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuoteModal = ({ isOpen, onClose }: QuoteModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100]"
                    />

                    {/* MODALE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center p-4 z-[101]"
                    >
                        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">

                            {/* HEADER */}
                            <div className="bg-blue-600 p-8 text-white relative">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <FaTimes size={20} />
                                </button>

                                <h2 className="text-2xl font-black mb-2">
                                    Demander un devis
                                </h2>

                                <p className="text-blue-100 text-sm">
                                    Parlez-nous de votre projet, nos experts vous répondront sous 24h.
                                </p>
                            </div>

                            {/* FORMULAIRE */}
                            <form
                                className="p-8 overflow-y-auto space-y-6"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* NOM */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Nom du responsable
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Ex: Marc Njoh"
                                            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                                        />
                                    </div>

                                    {/* ENTREPRISE */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Nom de l'entreprise
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Ex: AFRILANE SARL"
                                            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                                        />
                                    </div>

                                    {/* EMAIL */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Email professionnel
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="contact@entreprise.cm"
                                            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                                        />
                                    </div>

                                    {/* SERVICE */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Service concerné
                                        </label>

                                        <select
                                            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm cursor-pointer"
                                        >
                                            <option>Audit & Conseil</option>
                                            <option>Sécurité des SI</option>
                                            <option>Infrastructure Réseau</option>
                                            <option>Collaboration & VoIP</option>
                                            <option>Formation d'équipe</option>
                                        </select>
                                    </div>
                                </div>

                                {/* DETAILS */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Détails du besoin
                                    </label>

                                    <textarea
                                        rows={4}
                                        placeholder="Décrivez brièvement les objectifs de votre projet..."
                                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm resize-none"
                                    />
                                </div>

                                {/* CONFIDENTIALITE */}
                                <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                                    <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />

                                    <p className="text-[11px] text-blue-800 leading-relaxed">
                                        En envoyant ce formulaire, vous acceptez qu'AFRILANE traite vos données pour vous recontacter.
                                        Vos informations restent strictement confidentielles.
                                    </p>
                                </div>

                                {/* BOUTON */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                                >
                                    Envoyer ma demande
                                    <FaRocket />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuoteModal;