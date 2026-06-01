import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhoneAlt,
    FaMobileAlt,
    FaClock,
    FaLinkedin,
    FaFacebook,
    FaArrowUp,
    FaRegCopyright,
    FaHeart
} from "react-icons/fa";

import logo from "../../assets/logo.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const navLinks = [
        { name: "Accueil", path: "/" },
        { name: "Nos Formations", path: "/formations" },
        { name: "Certifications", path: "/certifications" },
        { name: "Expertise IT", path: "/expertise" }
    ];

    const socialLinks = [
        {
            Icon: FaLinkedin,
            href: "https://linkedin.com/company/afrilane",
            hover: "hover:bg-blue-600",
            label: "LinkedIn"
        },
        {
            Icon: FaFacebook,
            href: "https://facebook.com/afrilane",
            hover: "hover:bg-blue-700",
            label: "Facebook"
        },
    ];

    const contactInfo = [
        { icon: FaPhoneAlt, text: "+237 222 31 16 01", href: "tel:+237222311601" },
        { icon: FaMobileAlt, text: "+237 699 06 43 13", href: "tel:+237699064313" },
        { icon: FaClock, text: "Lun - Sam : 08h00 - 18h00", isStatic: true }
    ];

    return (
        <motion.footer
            className="relative pt-20 pb-8 mt-20 overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={footerVariants}
        >
            {/* Background avec dégradé sombre */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-black -z-20" />

            {/* Effets de lumière animés */}
            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full -z-10"
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full -z-10"
                animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />

            {/* Pattern de grille technique */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] -z-10" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Container principal Glassmorphism */}
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-shadow duration-500">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

                        {/* SECTION NAVIGATION */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-bold mb-6 border-l-4 border-blue-500 pl-3 text-white">
                                Navigation
                            </h4>
                            <ul className="space-y-4 text-sm">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* SECTION LOGO CENTRÉE AVEC TEXTE AFRILANE */}
                        <motion.div 
                            className="flex flex-col items-center justify-center space-y-6"
                            variants={itemVariants}
                        >
                            <Link to="/" className="flex items-center gap-3 group">
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Effet de glow autour du logo */}
                                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                                    <img
                                        src={logo}
                                        alt="Afrilane"
                                        className="h-16 w-auto brightness-0 invert relative z-10"
                                    />
                                </motion.div>
                                <motion.span 
                                    className="text-white text-2xl font-bold tracking-tight"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    AFRILANE
                                </motion.span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed text-center max-w-xs">
                                Entreprise d'ingénierie informatique spécialisée dans la formation certifiante, la formation professionnelle, l'audit et conseil IT.
                            </p>
                            <div className="flex gap-3 pt-2">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 ${social.hover}`}
                                        whileHover={{ scale: 1.15, y: -4 }}
                                    >
                                        <social.Icon className="text-gray-300 group-hover:text-white text-sm" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* SECTION ADRESSE & CONTACT */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-bold mb-6 border-l-4 border-blue-500 pl-3 text-white">
                                Contact
                            </h4>
                            <ul className="space-y-5 text-gray-400 text-sm">
                                <li className="flex items-start gap-3 group">
                                    <FaMapMarkerAlt className="text-blue-500 text-lg mt-1 group-hover:scale-110 transition-transform flex-shrink-0" />
                                    <span>
                                        Yaoundé - Maétur Biteng
                                        <br />
                                        (Entrée Maétur)
                                        <br />
                                        Cameroun
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <FaEnvelope className="text-blue-500 text-lg mt-1 group-hover:scale-110 transition-transform flex-shrink-0" />
                                    <a href="mailto:contact@afrilane.cm" className="hover:text-white transition-colors break-all">
                                        contact@afrilane.cm
                                    </a>
                                </li>
                                {contactInfo.map((info, index) => (
                                    <li key={index} className="flex items-center gap-3 group">
                                        <info.icon className="text-blue-500 text-lg group-hover:scale-110 transition-transform flex-shrink-0" />
                                        {info.href ? (
                                            <a href={info.href} className="hover:text-white transition-colors">{info.text}</a>
                                        ) : (
                                            <span>{info.text}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* BARRE DE COPYRIGHT & LÉGAL */}
                    <motion.div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400" variants={itemVariants}>
                        <div className="flex items-center gap-2">
                            <FaRegCopyright />
                            <p>{currentYear} AFRILANE. Tous droits réservés.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Made with</span>
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                <FaHeart className="text-red-500" />
                            </motion.div>
                            <span>in Cameroon</span>
                        </div>

                        <div className="flex gap-6">
                            <Link to="/mentions-legales" className="hover:text-white transition-colors relative group">
                                Mentions Légales
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link to="/confidentialite" className="hover:text-white transition-colors relative group">
                                Confidentialité
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* BOUTON SCROLL TO TOP */}
            <AnimatePresence>
                {showButton && (
                    <motion.button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-2xl z-50 group"
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 20 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaArrowUp />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.footer>
    );
};

export default Footer;