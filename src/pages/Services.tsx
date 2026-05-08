import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaShieldAlt,
    FaNetworkWired,
    FaServer,
    FaUserTie,
    FaMicrophoneAlt,
    FaCloud,
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
            color: "blue",
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
            color: "cyan",
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
            color: "indigo",
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
            color: "blue",
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
            color: "cyan",
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
            color: "indigo",
        },
    ];

    const colorVariants: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
        cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600",
        indigo:
            "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
    };

    return (
        <div className="bg-white min-h-screen">

            {/* HERO */}
            <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent)]" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
                            Expertise{" "}
                            <span className="text-blue-500">
                                Ingénierie
                            </span>{" "}
                            & Solutions IT
                        </h1>

                        <p className="text-gray-400 text-lg leading-relaxed">
                            Nous accompagnons les entreprises dans leur
                            transformation numérique grâce à des services
                            avancés en audit, cybersécurité et infrastructures.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {mainServices.map((service, index) => {
                            const Icon = service.icon;

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
                                >

                                    {/* ICON */}
                                    <div
                                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:text-white ${colorVariants[service.color]}`}
                                    >
                                        <Icon size={30} />
                                    </div>

                                    {/* DECORATION */}
                                    <div className="w-12 h-1 bg-blue-600 rounded-full mb-6" />

                                    {/* TITLE */}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                        {service.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* DETAILS */}
                                    <ul className="space-y-3">
                                        {service.details.map((detail, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center gap-3 text-sm text-slate-600"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-afrilane-light-grey py-20">
                <div className="max-w-5xl mx-auto px-4 text-center">

                    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">

                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2 rounded-full" />

                        <h2 className="text-3xl md:text-5xl font-black mb-8 relative z-10">
                            Prêt à sécuriser votre <br />
                            infrastructure ?
                        </h2>

                        <p className="text-blue-100 mb-10 relative z-10 max-w-2xl mx-auto">
                            Nos experts sont disponibles pour réaliser un audit
                            gratuit ou discuter de vos besoins spécifiques.
                        </p>

                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                            }}
                            className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold shadow-xl relative z-10"
                        >
                            Demander un devis gratuit
                        </motion.button>

                    </div>
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