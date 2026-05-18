import { motion } from "framer-motion";
import { useState } from "react";
import {
    FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane,
    FaStar, FaClock, FaWhatsapp, FaCheckCircle, FaSpinner
} from "react-icons/fa";

const Contact = () => {
    // 1. ÉTAT DU FORMULAIRE (Pour la base de données)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        subject: "Formation Certifiante",
        message: ""
    });

    const [status, setStatus] = useState<{
        type: 'idle' | 'loading' | 'success' | 'error';
        text: string;
    }>({ type: 'idle', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', text: 'Envoi en cours...' });

        try {
            // URL de ton futur backend Laravel (ex: http://localhost:8000/api/contact)
            const response = await fetch("http://localhost:8000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: 'success', text: 'Votre message a été enregistré avec succès !' });
                setFormData({ full_name: "", email: "", phone: "", subject: "Formation Certifiante", message: "" });
            } else {
                throw new Error();
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Erreur de connexion au serveur. Réessayez plus tard.' });
        }
    };

    const contactMethods = [
        {
            icon: FaPhoneAlt,
            title: "Téléphone",
            detail: "+237 222 31 16 01",
            secondary: "699 463 424",
            description: "De lundi à samedi, 08h - 18h",
            iconBg: "from-blue-500 to-blue-600"
        },
        {
            icon: FaWhatsapp,
            title: "WhatsApp",
            detail: "+237 699 06 43 13",
            description: "Support instantané",
            iconBg: "from-green-500 to-green-600"
        },
        {
            icon: FaMapMarkerAlt,
            title: "Siège Social",
            detail: "Yaoundé - Maétur Biteng",
            description: "Entrée Maétur Biteng, Cameroun",
            iconBg: "from-slate-700 to-slate-800"
        }
    ];

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="relative max-w-7xl mx-auto px-4 z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6 text-blue-600 font-bold text-xs uppercase tracking-widest">
                        <FaStar className="text-blue-500" /> Contactez-nous
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 text-center">
                        Parlons de votre <span className="text-blue-600">Projet IT</span>
                    </h1>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* COLONNE GAUCHE : INFOS + LA CARTE MAPS */}
                    <div className="space-y-6">
                        {contactMethods.map((method, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <method.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{method.title}</h3>
                                    <p className="text-blue-600 font-semibold text-sm">{method.detail}</p>
                                    <p className="text-gray-400 text-[10px] uppercase mt-2">{method.description}</p>
                                </div>
                            </div>
                        ))}

                        {/* CARTE GOOGLE MAPS RÉ-INSÉRÉE ICI */}
                        <div className="rounded-2xl overflow-hidden h-80 border border-gray-100 shadow-xl relative group">
                            <iframe
                                title="Afrilane Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3472.8558712057966!2d11.562670274294614!3d3.847534796126255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bc51f50bbc06f%3A0x6a3d9e2aca9c52f4!2sAFRILANE!5e1!3m2!1sfr!2scm!4v1778164140982!5m2!1sfr!2scm"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl transition-all" />
                        </div>
                    </div>

                    {/* COLONNE DROITE : FORMULAIRE CONNECTÉ */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 md:p-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Envoyez-nous un message</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Nom Complet *</label>
                                    <input 
                                        required name="full_name" value={formData.full_name} onChange={handleChange}
                                        type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Pro *</label>
                                    <input 
                                        required name="email" value={formData.email} onChange={handleChange}
                                        type="email" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Téléphone</label>
                                    <input 
                                        name="phone" value={formData.phone} onChange={handleChange}
                                        type="tel" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Sujet *</label>
                                    <select 
                                        name="subject" value={formData.subject} onChange={handleChange}
                                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none cursor-pointer"
                                    >
                                        <option>Formation Certifiante</option>
                                        <option>Formation professionnelle</option>
                                        <option>Audit & Conseil IT</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Message *</label>
                                    <textarea 
                                        required name="message" value={formData.message} onChange={handleChange}
                                        rows={5} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        disabled={status.type === 'loading'}
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
                                    >
                                        {status.type === 'loading' ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                                        {status.type === 'loading' ? 'Traitement...' : 'Envoyer ma demande'}
                                    </button>

                                    {status.text && (
                                        <p className={`mt-4 text-center font-bold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                            {status.text}
                                        </p>
                                    )}
                                </div>
                            </form>
                            <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-2 text-gray-400 text-xs justify-center">
                                <FaCheckCircle /> Vos données sont protégées et confidentielles.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;