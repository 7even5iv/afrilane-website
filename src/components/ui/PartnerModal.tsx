import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaHandshake, FaBuilding, FaCheck } from "react-icons/fa";

interface PartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PartnerModal = ({ isOpen, onClose }: PartnerModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* OVERLAY SOMBRE */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100]"
                    />

                    {/* MODALE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="fixed inset-0 m-auto w-full max-w-3xl h-fit max-h-[95vh] bg-white rounded-[3rem] shadow-2xl z-[101] overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* CÔTÉ GAUCHE : VISUEL & INFOS (Visible sur Desktop) */}
                        <div className="hidden md:flex md:w-1/3 bg-blue-600 p-10 flex-col justify-between text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />

                            <div className="relative z-10">
                                <FaHandshake size={40} className="mb-6" />
                                <h2 className="text-2xl font-black leading-tight">Devenez un Partenaire Stratégique</h2>
                                <p className="mt-4 text-blue-100 text-sm">Rejoignez le réseau d'entreprises qui font confiance à l'expertise AFRILANE au Cameroun.</p>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3 text-xs font-bold">
                                    <div className="bg-white/20 p-2 rounded-lg"><FaCheck /></div>
                                    <span>Accompagnement Premium</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold">
                                    <div className="bg-white/20 p-2 rounded-lg"><FaCheck /></div>
                                    <span>Tarifs préférentiels</span>
                                </div>
                            </div>
                        </div>

                        {/* CÔTÉ DROIT : FORMULAIRE */}
                        <div className="flex-1 p-8 md:p-12 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <FaTimes size={18} className="text-gray-500" />
                            </button>

                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom complet</label>
                                        <input type="text" placeholder="Directeur IT / RH" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entreprise</label>
                                        <input type="text" placeholder="Nom de la structure" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Pro</label>
                                        <input type="email" placeholder="nom@entreprise.cm" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                                        <input type="tel" placeholder="+237 6xx xxx xxx" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secteur d'activité</label>
                                    <select className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer">
                                        <option>Administration Publique</option>
                                        <option>Banque & Finance</option>
                                        <option>Télécommunications</option>
                                        <option>Énergie & Industrie</option>
                                        <option>ONG & International</option>
                                        <option>Autre</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vos objectifs de partenariat</label>
                                    <textarea rows={3} placeholder="Ex: Formation continue de nos ingénieurs, Audit annuel de sécurité..." className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"></textarea>
                                </div>

                                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mt-4">
                                    Envoyer ma candidature <FaBuilding />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PartnerModal;