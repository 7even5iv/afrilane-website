import { useState } from "react"; // Ajout de useState
import { motion } from "framer-motion";
import { FaShieldAlt, FaNetworkWired, FaServer, FaUserTie, FaMicrophoneAlt, FaCloud } from "react-icons/fa";
import QuoteModal from "../components/ui/QuoteModal"; // Importation de la modale

const Services = () => {
    // État pour gérer l'ouverture de la modale de devis
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mainServices = [
        {
            id: 1,
            title: "Audits & Conseils",
            icon: FaUserTie,
            description: "Analyse profonde de votre SI pour identifier les failles et optimiser vos performances.",
            details: ["Audit de sécurité (Pentest)", "Audit d'infrastructure", "Schéma directeur SI", "Gouvernance IT"],
            color: "blue"
        },
        {
            id: 2,
            title: "Réseaux Informatiques",
            icon: FaNetworkWired,
            description: "Conception et déploiement d'architectures réseaux robustes et évolutives.",
            details: ["Câblage structuré", "Switching & Routing", "Wi-Fi Haute Densité", "Monitoring réseau"],
            color: "cyan"
        },
        {
            id: 3,
            title: "Sécurité des SI",
            icon: FaShieldAlt,
            description: "Protection complète de vos données contre les cybermenaces et fuites d'informations.",
            details: ["Firewalling (NGFW)", "Protection Endpoint", "VPN & Accès distants", "Conformité ISO 27001"],
            color: "indigo"
        },
        {
            id: 4,
            title: "Collaboration & VoIP",
            icon: FaMicrophoneAlt,
            description: "Modernisez votre communication avec des solutions de téléphonie IP avancées.",
            details: ["IP-PBX & SIP Trunking", "Vidéoconférence", "Messagerie unifiée", "Support technique"],
            color: "blue"
        },
        {
            id: 5,
            title: "Cloud & Virtualisation",
            icon: FaCloud,
            description: "Optimisation de vos ressources serveurs pour plus de flexibilité et de sécurité.",
            details: ["Virtualisation VMware/Hyper-V", "Cloud Privé & Hybride", "Sauvegarde (Backup)", "DRP (Plan de secours)"],
            color: "cyan"
        },
        {
            id: 6,
            title: "Maintenance & Support",
            icon: FaServer,
            description: "Infogérance et support technique pour garantir la continuité de vos activités.",
            details: ["Contrats de maintenance", "Support 24/7", "Mise à jour systèmes", "Intervention site"],
            color: "indigo"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION SERVICES */}
            <section className="bg-slate-900 pt-32 pb-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            Expertise <span className="text-blue-500">Ingénierie</span> & Solutions IT
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Nous accompagnons les entreprises dans leur transformation numérique par des services de pointe en audit, sécurité et intégration d'infrastructures.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* GRILLE DES SERVICES */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mainServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500`}>
                                    <service.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                                    {service.description}
                                </p>
                                <ul className="space-y-3">
                                    {service.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION CTA B2B */}
            <section className="bg-afrilane-light-grey py-20">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2 rounded-full" />
                        <h2 className="text-3xl md:text-5xl font-black mb-8 relative z-10">Prêt à sécuriser votre <br /> infrastructure ?</h2>
                        <p className="text-blue-100 mb-10 relative z-10 max-w-xl mx-auto">
                            Nos experts sont disponibles pour un audit gratuit ou pour discuter de vos besoins spécifiques.
                        </p>

                        {/* BOUTON CONNECTÉ À LA MODALE */}
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold shadow-xl relative z-10"
                        >
                            Demander un devis gratuit
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* COMPOSANT MODALE (Affiché uniquement si isModalOpen est true) */}
            <QuoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Services;