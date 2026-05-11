import { useState } from "react";
import { motion } from "framer-motion";
import ClientCard from "../ui/ClientCard";
import PartnerModal from "../ui/PartnerModal";

const CLIENTS_DATA = [
    { name: 'ARMP', logo: '/logos/clients/logo_armp.png', industry: 'Régulation Publique' },
    { name: 'Croix-rouge', logo: '/logos/clients/croix-rouge.png', industry: 'Humanitaire' },
    { name: 'Nexttel', logo: '/logos/clients/nexttel.png', industry: 'Télécommunications' },
    { name: 'CAMTEL', logo: '/logos/clients/camtel.png', industry: 'Télécommunications' },
    { name: 'MINFOPRA', logo: '/logos/clients/minfopra.png', industry: 'Administration Publique' },
    { name: 'SOFITOUL', logo: '/logos/clients/sofitoul.png', industry: 'Tourisme & Voyages' },
    { name: 'IHS Towers', logo: '/logos/clients/ihs.png', industry: 'Infrastructures Télécom' },
    { name: 'Port Autonome de Kribi', logo: '/logos/clients/pak.png', industry: 'Logistique & Portuaire' },
    { name: 'Min Travaux Publics', logo: '/logos/clients/mintp.png', industry: 'Infrastructures & Génie civil' },
    { name: 'Afreetech', logo: '/logos/clients/afreetech.png', industry: 'Technologie' },
    { name: 'CFAO', logo: '/logos/clients/cfao.png', industry: 'Technologie & Energie' },
    { name: 'CENADI', logo: '/logos/clients/cenadi.png', industry: 'Formations & Informatique' },
];

const Clients = () => {
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

    return (
        <section className="py-32 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* EN-TÊTE DE SECTION */}
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-blue-600 font-bold uppercase tracking-[0.4em] text-xs mb-4"
                    >
                        Références Clients
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 leading-tight"
                    >
                        Ils propulsent leur transformation <br />
                        digitale avec <span className="text-blue-600">AFRILANE</span>
                    </motion.h3>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 120 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-2 bg-blue-600 mt-10 rounded-full shadow-lg shadow-blue-200"
                    />
                </div>

                {/* GRILLE DE CARTES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {CLIENTS_DATA.map((client, index) => (
                        <motion.div
                            key={client.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: (index % 3) * 0.1,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <ClientCard
                                name={client.name}
                                logo={client.logo}
                                industry={client.industry}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* BANNIÈRE CTA DE FIN */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 p-10 md:p-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-[3rem] flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl -ml-32 -mb-32" />

                    <div className="relative z-10 text-center lg:text-left">
                        <p className="text-white text-2xl md:text-4xl font-black mb-4">
                            Rejoignez les leaders du marché.
                        </p>
                        <p className="text-blue-100 text-lg opacity-90">
                            Faites confiance à une expertise certifiée pour vos projets critiques.
                        </p>
                    </div>

                    <motion.button
                        onClick={() => setIsPartnerModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all whitespace-nowrap relative z-10 shadow-2xl"
                    >
                        Devenir client partenaire
                    </motion.button>
                </motion.div>
            </div>

            {/* LIGNE MANQUANTE AJOUTÉE ICI : Rendu de la modale */}
            <PartnerModal 
                isOpen={isPartnerModalOpen} 
                onClose={() => setIsPartnerModalOpen(false)} 
            />
        </section>
    );
};

export default Clients;