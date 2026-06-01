import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FaBullseye,
    FaLightbulb,
    FaUsers,
    FaCheck,
    FaStar,
    FaAward,
    FaHandshake,
    FaBuilding,
    FaGraduationCap,
    FaChalkboardTeacher,
} from "react-icons/fa";

const About = () => {
    const stats = [
        { label: "Années d'expérience", value: "10+", icon: FaBuilding, color: "from-blue-500 to-blue-600" },
        { label: "Experts certifiés", value: "15+", icon: FaAward, color: "from-emerald-500 to-emerald-600" },
        { label: "Étudiants formés", value: "1000+", icon: FaGraduationCap, color: "from-purple-500 to-purple-600" },
        { label: "Partenaires mondiaux", value: "8", icon: FaHandshake, color: "from-cyan-500 to-cyan-600" },
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

    const teamMembers = [
        { name: "Jean-Pierre NANA", role: "Directeur Technique", expertise: "Cybersécurité & Réseaux" },
        { name: "Caroline MBALLA", role: "Responsable Pédagogique", expertise: "Certifications IT" },
        { name: "Michel TCHINDA", role: "Expert Formateur", expertise: "Cloud & Virtualisation" },
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Effets de fond */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/5 rounded-full blur-3xl" />

                {/* Grille décorative */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm"
                    >
                        <FaStar className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                            À propos de nous
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
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
                        className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg"
                    >
                        AFRILANE est bien plus qu'une entreprise IT. C'est un centre d'excellence
                        dédié à la montée en compétence des talents africains.
                    </motion.p>
                </div>
            </section>

            {/* SECTION NOTRE HISTOIRE */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 mb-6">
                                <FaBuilding className="text-blue-500 text-xs" />
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                    Notre Histoire
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
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

                            <div className="mt-6 space-y-2">
                                {["Centre agréé MINEFOP", "Partenaire Cisco & PECB", "Experts de terrain certifiés"].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 text-gray-700 text-sm"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                            <FaCheck size={10} />
                                        </div>
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* STATISTIQUES */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mx-auto mb-3 shadow-md`}>
                                            <Icon size={18} />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION VALEURS */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 mb-4">
                            <FaStar className="text-blue-500 text-xs" />
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Ce qui nous guide
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Nos Valeurs{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Fondamentales
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((val, index) => {
                            const Icon = val.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5 }}
                                    className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {val.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {val.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION ÉQUIPE */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 mb-4">
                            <FaUsers className="text-blue-500 text-xs" />
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Notre équipe
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Des{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Experts Passionnés
                            </span>
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                            Une équipe d'ingénieurs et formateurs certifiés à votre service
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                                    <FaChalkboardTeacher size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900">{member.name}</h3>
                                <p className="text-blue-600 text-xs font-medium mt-1">{member.role}</p>
                                <p className="text-gray-400 text-xs mt-2">{member.expertise}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION CTA */}
            <section className="py-16 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-10 md:p-12 overflow-hidden text-center"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                                Prêt à rejoindre l'aventure AFRILANE ?
                            </h3>
                            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm">
                                Découvrez nos formations et certifications pour booster votre carrière.
                            </p>
                            <Link to="/formations">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Explorer nos formations
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;