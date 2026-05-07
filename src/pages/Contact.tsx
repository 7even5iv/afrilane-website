import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
    const contactMethods = [
        {
            icon: FaPhoneAlt,
            title: "Téléphone",
            detail: "+237 222 31 16 01 / 699 06 43 13",
            description: "Du lundi au vendredi, 08h - 18h",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: FaEnvelope,
            title: "Email",
            detail: "contact@afrilane.cm",
            description: "Réponse sous 24h ouvrées",
            color: "text-cyan-600",
            bg: "bg-cyan-50"
        },
        {
            icon: FaMapMarkerAlt,
            title: "Siège Social",
            detail: "Yaoundé - Maétur Biteng",
            description: "Entrée Maétur Biteng, Cameroun",
            color: "text-red-600",
            bg: "bg-red-50"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* SECTION HERO - AJUSTÉE AVEC PT-32 POUR LE HEADER FIXE */}
            <section className="bg-slate-900 pt-32 pb-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-4"
                    >
                        Parlons de votre <span className="text-blue-500">Projet IT</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Que vous soyez un professionnel cherchant une certification ou une entreprise en quête d'audit, notre équipe est à votre écoute.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* COLONNE GAUCHE : INFOS */}
                    <div className="space-y-8">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-6 p-6 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 bg-white"
                            >
                                <div className={`${method.bg} ${method.color} p-4 rounded-2xl flex-shrink-0`}>
                                    <method.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{method.title}</h3>
                                    <p className="text-blue-600 font-semibold text-sm">{method.detail}</p>
                                    <p className="text-gray-500 text-xs mt-1">{method.description}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* CARTE GOOGLE MAPS RÉELLE D'AFRILANE */}
                        <div className="rounded-3xl overflow-hidden h-72 border border-gray-100 shadow-xl bg-gray-100">
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
                        </div>
                    </div>

                    {/* COLONNE DROITE : FORMULAIRE */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-2xl"
                        >
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Nom Complet</label>
                                    <input type="text" placeholder="Ex: Jean Dupont" className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Professionnel</label>
                                    <input type="email" placeholder="jean@entreprise.cm" className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Téléphone (WhatsApp)</label>
                                    <input type="tel" placeholder="+237 6xx xxx xxx" className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Sujet</label>
                                    <select className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all">
                                        <option>Formation Certifiante</option>
                                        <option>Examen de Certification</option>
                                        <option>Audit & Conseil IT</option>
                                        <option>Autre demande</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Votre Message</label>
                                    <textarea rows={5} placeholder="Comment pouvons-nous vous aider ?" className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all"></textarea>
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                    >
                                        Envoyer le message <FaPaperPlane size={14} />
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Contact;