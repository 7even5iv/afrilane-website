import { motion } from "framer-motion";
import {
    FaShieldAlt,
    FaDatabase,
    FaChartLine,
    FaCookieBite,
    FaUserShield,
    FaEdit,
    FaEnvelope,
    FaCheckCircle,
} from "react-icons/fa";

const Confidentialite = () => {
    const sections = [
        {
            id: 1,
            title: "Notre engagement",
            icon: FaShieldAlt,
            description: "La protection de vos données personnelles est notre priorité absolue.",
            content: (
                <p>
                    Chez <strong className="text-gray-900">AFRILANE</strong>, la protection
                    de vos données personnelles est une priorité. Cette politique explique quelles données sont
                    collectées, comment elles sont utilisées et quels sont vos droits.
                </p>
            ),
        },
        {
            id: 2,
            title: "Collecte des données",
            icon: FaDatabase,
            content: (
                <>
                    <p className="mb-4">
                        Nous collectons certaines informations lorsque vous utilisez notre site ou remplissez nos formulaires.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {["Nom et prénom", "Adresse e-mail", "Numéro de téléphone", "Informations relatives aux formations"].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <FaCheckCircle className="text-blue-500 text-xs flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 3,
            title: "Utilisation des données",
            icon: FaChartLine,
            content: (
                <>
                    <p className="mb-4">
                        Les informations collectées sont utilisées exclusivement dans le cadre des activités d'AFRILANE :
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Gestion des inscriptions aux formations et certifications",
                            "Envoi d'informations administratives et pédagogiques",
                            "Réponse aux demandes de contact, devis ou audit",
                            "Amélioration de l'expérience utilisateur sur le site",
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="text-blue-500 mt-1">→</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </>
            ),
        },
        {
            id: 4,
            title: "Protection des données",
            icon: FaUserShield,
            content: (
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                    <p className="text-gray-700">
                        AFRILANE met en œuvre des mesures de sécurité techniques et organisationnelles
                        afin de protéger vos données contre tout accès non autorisé, perte ou divulgation.
                    </p>
                </div>
            ),
        },
        {
            id: 5,
            title: "Cookies",
            icon: FaCookieBite,
            content: (
                <p>
                    Le site peut utiliser des cookies pour améliorer votre navigation,
                    mesurer l'audience et optimiser les performances du site.
                </p>
            ),
        },
        {
            id: 6,
            title: "Vos droits",
            icon: FaEdit,
            content: (
                <>
                    <p className="mb-4">
                        Conformément aux réglementations en vigueur, vous disposez des droits suivants :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {[
                            "Droit d'accès à vos données",
                            "Droit de rectification",
                            "Droit de suppression",
                            "Droit d'opposition au traitement",
                        ].map((right, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-sm">{right}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <FaEnvelope className="text-blue-500 text-xl flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                            Pour exercer vos droits, contactez-nous à :{" "}
                            <a href="mailto:contact@afrilane.cm" className="text-blue-600 font-semibold hover:underline">
                                contact@afrilane.cm
                            </a>
                        </p>
                    </div>
                </>
            ),
        },
        {
            id: 7,
            title: "Modification de la politique",
            icon: FaEdit,
            content: (
                <p>
                    AFRILANE se réserve le droit de modifier la présente politique de confidentialité
                    à tout moment afin de garantir sa conformité avec les évolutions légales et techniques.
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/5 rounded-full blur-3xl" />
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
                            Vie privée & sécurité
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                        Politique de{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Confidentialité
                        </span>
                    </h1>

                    <p className="text-gray-500 text-lg">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </motion.div>

                {/* Carte principale */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    {/* Sections */}
                    <div className="divide-y divide-gray-100">
                        {sections.map((section, index) => {
                            const Icon = section.icon;

                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="group p-6 md:p-8 hover:bg-gray-50/50 transition-colors duration-500"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icône */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                                                <Icon size={20} />
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                                {section.title}
                                            </h2>
                                            {section.description && (
                                                <p className="text-blue-600 text-sm font-medium mb-3">
                                                    {section.description}
                                                </p>
                                            )}
                                            <div className="text-gray-600 leading-relaxed">
                                                {section.content}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer note */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-50/30 p-6 border-t border-blue-100">
                        <div className="flex items-center gap-3 text-center justify-center">
                            <FaShieldAlt className="text-blue-500 text-lg" />
                            <p className="text-sm text-gray-600">
                                Conformité RGSS et protection des données personnelles garantie.
                                Toutes vos informations sont traitées avec la plus stricte confidentialité.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Information supplémentaire */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-xs text-gray-400">
                        Pour toute question relative à notre politique de confidentialité,
                        vous pouvez nous contacter à l'adresse suivante :{" "}
                        <a href="mailto:contact@afrilane.cm" className="text-blue-500 hover:underline">
                            contact@afrilane.cm
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Confidentialite;