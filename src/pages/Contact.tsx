import { motion } from "framer-motion";
import { useState } from "react";
import {
    FaPhoneAlt,
    FaPaperPlane,
    FaStar,
    FaWhatsapp,
    FaCheckCircle,
    FaSpinner,
    FaEnvelope,
    FaClock,
    FaHeadset
} from "react-icons/fa";

// Interfaces TypeScript
interface FormData {
    full_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface Status {
    type: 'idle' | 'loading' | 'success' | 'error';
    text: string;
}

interface ContactMethod {
    icon: React.ComponentType<any>;
    title: string;
    detail: string;
    secondary?: string;
    description: string;
    iconBg: string;
    action: string;
}

interface WorkingHour {
    day: string;
    hours: string;
    icon: React.ComponentType<any>;
}

const Contact = () => {
    const [formData, setFormData] = useState<FormData>({
        full_name: "",
        email: "",
        phone: "",
        subject: "Formation Certifiante",
        message: ""
    });

    const [status, setStatus] = useState<Status>({ type: 'idle', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', text: 'Envoi en cours...' });

        try {
            const response = await fetch("http://localhost:8000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: 'success', text: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.' });
                setFormData({ full_name: "", email: "", phone: "", subject: "Formation Certifiante", message: "" });
                setTimeout(() => setStatus({ type: 'idle', text: '' }), 5000);
            } else {
                throw new Error();
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Erreur de connexion au serveur. Veuillez réessayer plus tard.' });
            setTimeout(() => setStatus({ type: 'idle', text: '' }), 5000);
        }
    };

    const contactMethods: ContactMethod[] = [
        {
            icon: FaPhoneAlt,
            title: "Téléphone",
            detail: "+237 222 31 16 01",
            secondary: "699 463 424",
            description: "De lundi à samedi, 08h - 18h",
            iconBg: "from-blue-500 to-blue-600",
            action: "tel:+237222311601"
        },
        {
            icon: FaWhatsapp,
            title: "WhatsApp",
            detail: "+237 699 06 43 13",
            description: "Support instantané",
            iconBg: "from-green-500 to-green-600",
            action: "https://wa.me/237699064313"
        },
        {
            icon: FaEnvelope,
            title: "Email",
            detail: "contact@afrilane.cm",
            description: "Réponse sous 24h",
            iconBg: "from-purple-500 to-purple-600",
            action: "mailto:contact@afrilane.cm"
        }
    ];

    const workingHours: WorkingHour[] = [
        { day: "Lundi - Vendredi", hours: "08:00 - 18:00", icon: FaClock },
        { day: "Samedi", hours: "09:00 - 13:00", icon: FaClock },
        { day: "Dimanche", hours: "Fermé", icon: FaClock }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm"
                    >
                        <FaStar className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Contactez-nous</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
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
                        className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg"
                    >
                        Une question ? Un projet ? Contactez notre équipe d'experts et nous vous répondrons sous 24h.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLONNE GAUCHE : INFOS */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaHeadset className="text-blue-600" />
                                Nos coordonnées
                            </h3>
                            <div className="space-y-4">
                                {contactMethods.map((method, index) => (
                                    <a
                                        key={index}
                                        href={method.action}
                                        target={method.action.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                                            <method.icon size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-sm">{method.title}</h4>
                                            <p className="text-blue-600 font-medium text-sm">{method.detail}</p>
                                            {method.secondary && <p className="text-xs text-gray-400">{method.secondary}</p>}
                                            <p className="text-gray-400 text-[10px] mt-1">{method.description}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Horaires d'ouverture */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaClock className="text-blue-600" />
                                Horaires d'ouverture
                            </h3>
                            <div className="space-y-3">
                                {workingHours.map((schedule, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-sm text-gray-600">{schedule.day}</span>
                                        <span className="text-sm font-semibold text-gray-800">{schedule.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carte Google Maps */}
                        <div className="rounded-2xl overflow-hidden h-64 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <iframe
                                title="Afrilane Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3472.8558712057966!2d11.562670274294614!3d3.847534796126255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bc51f50bbc06f%3A0x6a3d9e2aca9c52f4!2sAFRILANE!5e1!3m2!1sfr!2scm!4v1778164140982!5m2!1sfr!2scm"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* COLONNE DROITE : FORMULAIRE */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Envoyez-nous un message</h3>
                                <p className="text-sm text-gray-500 mt-1">Remplissez le formulaire et nous vous répondrons rapidement</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom complet *</label>
                                        <input
                                            required
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            placeholder="Jean Dupont"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email *</label>
                                        <input
                                            required
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            placeholder="jean.dupont@exemple.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Téléphone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="tel"
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            placeholder="+225 07 XX XX XX XX"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sujet *</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        >
                                            <option>Formation Certifiante</option>
                                            <option>Formation professionnelle</option>
                                            <option>Audit & Conseil IT</option>
                                            <option>Partenariat</option>
                                            <option>Autre demande</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message *</label>
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
                                        placeholder="Décrivez votre projet ou votre demande..."
                                    ></textarea>
                                </div>

                                <button
                                    disabled={status.type === 'loading'}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-md transition-all disabled:opacity-50"
                                >
                                    {status.type === 'loading' ? <FaSpinner className="animate-spin" size={16} /> : <FaPaperPlane size={16} />}
                                    {status.type === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                                </button>

                                {status.text && (
                                    <div className={`p-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 ${status.type === 'success'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                        {status.type === 'success' ? <FaCheckCircle size={14} /> : null}
                                        {status.text}
                                    </div>
                                )}
                            </form>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <FaCheckCircle size={12} /> Vos données sont protégées et confidentielles.
                            </div>
                        </motion.div>
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
                                Prêt à démarrer votre projet ?
                            </h3>
                            <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm">
                                Nos experts sont disponibles pour vous accompagner
                            </p>
                            <a
                                href="https://wa.me/237699064313"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                <FaWhatsapp size={16} />
                                Discuter sur WhatsApp
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;