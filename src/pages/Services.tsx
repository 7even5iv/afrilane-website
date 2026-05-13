import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaShieldAlt,
    FaNetworkWired,
    FaServer,
    FaUserTie,
    FaMicrophoneAlt,
    FaCloud,
    FaArrowRight,
    FaCheckCircle,
} from "react-icons/fa";

import QuoteModal from "../components/ui/QuoteModal";

const Services = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mainServices = [
        {
            id: 1,
            title: "Audits & Conseils",
            icon: FaUserTie,
            description:
                "Analyse profonde de votre SI pour identifier les failles et optimiser vos performances.",
            details: [
                "Audit de sécurité (Pentest)",
                "Audit d'infrastructure",
                "Schéma directeur SI",
                "Gouvernance IT",
            ],
        },
        {
            id: 2,
            title: "Réseaux Informatiques",
            icon: FaNetworkWired,
            description:
                "Conception et déploiement d'architectures réseaux robustes et évolutives.",
            details: [
                "Câblage structuré",
                "Switching & Routing",
                "Wi-Fi Haute Densité",
                "Monitoring réseau",
            ],
        },
        {
            id: 3,
            title: "Sécurité des SI",
            icon: FaShieldAlt,
            description:
                "Protection complète de vos données contre les cybermenaces et fuites d'informations.",
            details: [
                "Firewalling (NGFW)",
                "Protection Endpoint",
                "VPN & Accès distants",
                "Conformité ISO 27001",
            ],
        },
        {
            id: 4,
            title: "Collaboration & VoIP",
            icon: FaMicrophoneAlt,
            description:
                "Modernisez votre communication avec des solutions de téléphonie IP avancées.",
            details: [
                "IP-PBX & SIP Trunking",
                "Vidéoconférence",
                "Messagerie unifiée",
                "Support technique",
            ],
        },
        {
            id: 5,
            title: "Cloud & Virtualisation",
            icon: FaCloud,
            description:
                "Optimisation de vos ressources serveurs pour plus de flexibilité et de sécurité.",
            details: [
                "Virtualisation VMware/Hyper-V",
                "Cloud Privé & Hybride",
                "Sauvegarde (Backup)",
                "DRP (Plan de secours)",
            ],
        },
        {
            id: 6,
            title: "Maintenance & Support",
            icon: FaServer,
            description:
                "Infogérance et support technique pour garantir la continuité de vos activités.",
            details: [
                "Contrats de maintenance",
                "Support 24/7",
                "Mise à jour systèmes",
                "Intervention sur site",
            ],
        },
    ];

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">

            {/* HERO SECTION MODERNISÉ */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background moderne */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />

                {/* Grille décorative */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

                <div className="relative max-w-7xl mx-auto px-4 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl text-center mx-auto"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6"
                        >
                            <FaShieldAlt className="text-blue-500 text-xs" />
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Notre expertise
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 text-gray-900">
                            Expertise{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Ingénierie
                            </span>{" "}
                            & Solutions IT
                        </h1>

                        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                            Nous accompagnons les entreprises dans leur
                            transformation numérique grâce à des services
                            avancés en audit, cybersécurité et infrastructures.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SERVICES GRID MODERNISÉ */}
            <section className="py-16 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mainServices.map((service, index) => {
                            const Icon = service.icon;

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    whileHover={{ y: -8 }}
                                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                                >
                                    {/* Dégradé de fond au survol */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-blue-50/30 transition-all duration-700" />

                                    {/* Contenu */}
                                    <div className="relative p-8">
                                        {/* ICON avec animation */}
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                                                <Icon size={24} />
                                            </div>
                                        </div>

                                        {/* TITRE */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                            {service.title}
                                        </h3>

                                        {/* DESCRIPTION */}
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                            {service.description}
                                        </p>

                                        {/* DÉTAILS */}
                                        <div className="space-y-2.5 mb-6">
                                            {service.details.map((detail, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                                                    className="flex items-center gap-2.5 text-sm text-gray-600"
                                                >
                                                    <FaCheckCircle className="text-blue-500 text-xs flex-shrink-0" />
                                                    <span>{detail}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* LIEN EN SAVOIR PLUS */}
                                        <button className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group/btn transition-all duration-300 hover:gap-3">
                                            En savoir plus
                                            <FaArrowRight className="text-xs transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>

                                    {/* Bordure décorative */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA SECTION MODERNISÉE */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-12 md:p-16 overflow-hidden"
                    >
                        {/* Effets de fond */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

                        {/* Grille décorative */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

                        <div className="relative z-10 text-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6"
                            >
                                Prêt à sécuriser votre infrastructure ?
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg"
                            >
                                Nos experts sont disponibles pour réaliser un audit
                                gratuit ou discuter de vos besoins spécifiques.
                            </motion.p>

                            <motion.button
                                onClick={() => setIsModalOpen(true)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="group relative bg-white text-blue-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-3"
                            >
                                Demander un devis gratuit
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* MODAL */}
            <QuoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Services;