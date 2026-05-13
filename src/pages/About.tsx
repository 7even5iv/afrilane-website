import { motion } from "framer-motion";
import {
    FaBullseye,
    FaLightbulb,
    FaUsers,
    // FaChartLine - Supprimé car non utilisé
    FaCheck,
    FaStar,
    FaAward,
    FaHandshake,
    FaBuilding,
    FaGraduationCap,
} from "react-icons/fa";

const About = () => {
    const stats = [
        { label: "Années d'expérience", value: "10+", icon: FaBuilding },
        { label: "Experts certifiés", value: "15+", icon: FaAward },
        { label: "Étudiants formés", value: "1000+", icon: FaGraduationCap },
        { label: "Partenaires mondiaux", value: "8", icon: FaHandshake },
    ];

    const values = [
        {
            title: "Excellence",
            description: "Nous visons les standards internationaux les plus élevés dans chacune de nos interventions.",
            icon: FaBullseye,
        },
        {
            title: "Innovation",
            description: "L'IT évolue vite. Nous maintenons nos cursus et nos solutions à la pointe de la technologie.",
            icon: FaLightbulb,
        },
        {
            title: "Accompagnement",
            description: "Votre réussite est la nôtre. Nous suivons nos étudiants jusqu'à la certification finale.",
            icon: FaUsers,
        }
    ];

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">

            {/* HERO SECTION MODERNISÉE */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Effets de fond */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />

                {/* Grille décorative */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

                <div className="relative max-w-7xl mx-auto px-4 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6"
                    >
                        <FaStar className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            À propos de nous
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
                    >
                        Bâtir l'avenir numérique <br /> du{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Cameroun
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-2xl mx-auto text-lg"
                    >
                        AFRILANE est bien plus qu'une entreprise IT. C'est un centre d'excellence
                        dédié à la montée en compétence des talents africains.
                    </motion.p>
                </div>
            </section>

            {/* SECTION NOTRE HISTOIRE MODERNISÉE */}
            <section className="py-16 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                                <FaBuilding className="text-blue-500 text-xs" />
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                    Notre Histoire
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                                Une expertise forgée sur <br /> le terrain de l'ingénierie.
                            </h2>

                            <div className="space-y-4 text-gray-500 leading-relaxed">
                                <p>
                                    Fondée avec la volonté de combler le fossé technologique, <strong className="text-gray-900">AFRILANE</strong> s'est imposée
                                    comme une référence au Cameroun dans l'audit, la sécurité et la formation certifiante.
                                </p>
                                <p>
                                    Situé à Yaoundé, notre centre accompagne les administrations publiques et les grandes
                                    entreprises privées dans la sécurisation de leurs infrastructures critiques, tout en
                                    formant la prochaine génération d'ingénieurs réseaux et sécurité.
                                </p>
                            </div>

                            <div className="mt-8 space-y-3">
                                {["Centre agréé MINEFOP", "Partenaire Cisco & PECB", "Experts de terrain certifiés"].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 text-gray-700 font-medium"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                            <FaCheck size={12} />
                                        </div>
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* GRILLE DE STATS MODERNISÉE */}
                        <div className="grid grid-cols-2 gap-5">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 text-center"
                                    >
                                        <div className="relative mb-4 inline-block">
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform duration-500">
                                                <Icon size={20} />
                                            </div>
                                        </div>
                                        <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION VALEURS MODERNISÉE */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                            <FaStar className="text-blue-500 text-xs" />
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Ce qui nous guide
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                            Nos Valeurs{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Fondamentales
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((val, index) => {
                            const Icon = val.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -8 }}
                                    className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                                >
                                    {/* Dégradé de fond au survol */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-blue-50/30 transition-all duration-700" />

                                    {/* Icône */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                                            <Icon size={24} />
                                        </div>
                                    </div>

                                    {/* Titre */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                        {val.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {val.description}
                                    </p>

                                    {/* Bordure décorative */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION CTA OPTIONNELLE */}
            <section className="py-16 pb-24">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-12 md:p-16 overflow-hidden text-center"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                                Prêt à rejoindre l'aventure AFRILANE ?
                            </h3>
                            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                                Découvrez nos formations et certifications pour booster votre carrière.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Explorer nos formations
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;