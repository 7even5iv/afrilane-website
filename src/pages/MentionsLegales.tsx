import { motion } from "framer-motion";
import {
    FaBuilding,
    FaUserTie,
    FaServer,
    FaCopyright,
    FaUserSecret,
    FaCookieBite,
    FaShieldAlt,
} from "react-icons/fa";

const MentionsLegales = () => {
    const sections = [
        {
            id: 1,
            title: "Présentation de l'entreprise",
            icon: FaBuilding,
            content: (
                <>
                    <p className="mb-4">
                        Le site <strong className="text-blue-600">afrilane.cm</strong> est édité par
                        <strong className="text-gray-900"> AFRILANE</strong>, Cabinet d'ingénierie informatique
                        et Centre de Formation Professionnelle agréé.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong className="text-gray-900">Siège social :</strong> Yaoundé – Maétur Biteng, Cameroun</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong className="text-gray-900">Statut :</strong> Centre de Formation Professionnelle Agréé (MINEFOP)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong className="text-gray-900">Téléphone :</strong> +237 222 31 16 01</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">•</span>
                            <span><strong className="text-gray-900">Email :</strong> contact@afrilane.cm</span>
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 2,
            title: "Directeur de publication",
            icon: FaUserTie,
            content: (
                <p>
                    Le directeur de publication du site est <strong className="text-gray-900">AFRILANE</strong>.
                </p>
            ),
        },
        {
            id: 3,
            title: "Hébergement",
            icon: FaServer,
            content: (
                <p>
                    Le site est hébergé par <strong className="text-gray-900">Vercel Inc.</strong>,
                    situé à San Francisco, Californie, États-Unis.
                </p>
            ),
        },
        {
            id: 4,
            title: "Propriété intellectuelle",
            icon: FaCopyright,
            content: (
                <>
                    <p className="mb-4">
                        L'ensemble du contenu présent sur ce site
                        (textes, images, graphismes, logo, vidéos,
                        icônes, structure et design) est protégé par les lois
                        relatives à la propriété intellectuelle.
                    </p>
                    <p className="text-blue-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        Toute reproduction, modification ou diffusion,
                        totale ou partielle, sans autorisation préalable
                        écrite d'AFRILANE est strictement interdite.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: "Données personnelles",
            icon: FaUserSecret,
            content: (
                <>
                    <p className="mb-4">
                        AFRILANE s'engage à assurer la confidentialité
                        des données personnelles collectées via le site.
                    </p>
                    <p>
                        Les informations recueillies via les formulaires
                        sont utilisées uniquement dans le cadre des services
                        proposés par AFRILANE.
                    </p>
                </>
            ),
        },
        {
            id: 6,
            title: "Cookies",
            icon: FaCookieBite,
            content: (
                <p>
                    Le site peut utiliser des cookies afin d'améliorer
                    l'expérience utilisateur et réaliser des statistiques
                    de navigation.
                </p>
            ),
        },
        {
            id: 7,
            title: "Responsabilité",
            icon: FaShieldAlt,
            content: (
                <p>
                    AFRILANE met tout en œuvre pour assurer l'exactitude
                    des informations diffusées sur le site. Toutefois,
                    aucune garantie n'est donnée quant à l'exhaustivité
                    ou à l'actualité des contenus.
                </p>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20">
            {/* Effets de fond */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                        <FaShieldAlt className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Informations légales
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                        Mentions{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Légales
                        </span>
                    </h1>

                    <p className="text-gray-500 text-lg">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden"
                            >
                                <div className="p-6 md:p-8">
                                    {/* En-tête de section */}
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                                                <Icon size={20} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {section.title}
                                            </h2>
                                            <div className="mt-2 h-0.5 w-12 bg-blue-500 rounded-full group-hover:w-24 transition-all duration-500" />
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="ml-16 text-gray-600 leading-relaxed">
                                        {section.content}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-center"
                >
                    <p className="text-sm text-gray-600">
                        Conformément à la réglementation en vigueur, ces mentions légales sont à la disposition de tout utilisateur du site.
                        Pour toute question, n'hésitez pas à nous contacter à{" "}
                        <a href="mailto:contact@afrilane.cm" className="text-blue-600 font-semibold hover:underline">
                            contact@afrilane.cm
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default MentionsLegales;