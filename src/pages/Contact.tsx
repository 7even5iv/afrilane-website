import { motion } from "framer-motion";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPaperPlane,
    FaStar,
    FaClock,
    FaWhatsapp,
    FaCheckCircle
} from "react-icons/fa";

const Contact = () => {
    const contactMethods = [
        {
            icon: FaPhoneAlt,
            title: "Téléphone",
            detail: "+237 222 31 16 01",
            secondary: "699 06 43 13",
            description: "De lundi à samedi, 08h - 18h",
            color: "text-blue-600",
            bg: "bg-blue-50",
            iconBg: "from-blue-500 to-blue-600"
        },
        {
            icon: FaEnvelope,
            title: "Email",
            detail: "contact@afrilane.cm",
            description: "Réponse sous 24h ouvrées",
            color: "text-blue-600",
            bg: "bg-blue-50",
            iconBg: "from-blue-500 to-blue-600"
        },
        {
            icon: FaWhatsapp,
            title: "WhatsApp",
            detail: "+237 699 06 43 13",
            description: "Support instantané",
            color: "text-green-600",
            bg: "bg-green-50",
            iconBg: "from-green-500 to-green-600"
        },
        {
            icon: FaMapMarkerAlt,
            title: "Siège Social",
            detail: "Yaoundé - Maétur Biteng",
            description: "Entrée Maétur Biteng, Cameroun",
            color: "text-blue-600",
            bg: "bg-blue-50",
            iconBg: "from-blue-500 to-blue-600"
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
                            Contactez-nous
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4"
                    >
                        Parlons de votre{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Projet IT
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-2xl mx-auto text-lg"
                    >
                        Que vous soyez un professionnel cherchant une certification ou une entreprise en quête d'audit,
                        notre équipe est à votre écoute.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLONNE GAUCHE : INFOS */}
                    <div className="space-y-6">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -4 }}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Icône */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                                            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${method.iconBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500`}>
                                                <method.icon size={20} />
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">
                                                {method.title}
                                            </h3>
                                            <p className="text-blue-600 font-semibold text-sm">
                                                {method.detail}
                                            </p>
                                            {method.secondary && (
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {method.secondary}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <FaClock className="text-gray-400 text-xs" />
                                                <p className="text-gray-400 text-xs">
                                                    {method.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bordure décorative */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                            </motion.div>
                        ))}

                        {/* CARTE GOOGLE MAPS MODERNISÉE */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="rounded-2xl overflow-hidden h-72 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <iframe
                                title="Afrilane Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3472.8558712057966!2d11.562670274294614!3d3.847534796126255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bc51f50bbc06f%3A0x6a3d9e2aca9c52f4!2sAFRILANE!5e1!3m2!1sfr!2scm!4v1778164140982!5m2!1sfr!2scm"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </motion.div>
                    </div>

                    {/* COLONNE DROITE : FORMULAIRE MODERNISÉ */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            <div className="p-8 md:p-10">
                                {/* En-tête du formulaire */}
                                <div className="mb-8 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Envoyez-nous un message
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                                    </p>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Nom Complet <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Jean Dupont"
                                            className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Email Professionnel <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="jean@entreprise.cm"
                                            className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Téléphone (WhatsApp)
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+237 6xx xxx xxx"
                                            className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Sujet <span className="text-red-500">*</span>
                                        </label>
                                        <select className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer">
                                            <option>Formation Certifiante</option>
                                            <option>Formation professionnelle</option>
                                            <option>Examen de Certification</option>
                                            <option>Audit & Conseil IT</option>
                                            <option>Autre demande</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Votre Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={5}
                                            placeholder="Comment pouvons-nous vous aider ?"
                                            className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="md:col-span-2 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                                        >
                                            Envoyer le message
                                            <FaPaperPlane className="group-hover:translate-x-1 transition-transform" size={14} />
                                        </motion.button>
                                    </div>
                                </form>

                                {/* Informations de conformité */}
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <FaCheckCircle size={12} />
                                    <span>Vos données sont confidentielles</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Contact;