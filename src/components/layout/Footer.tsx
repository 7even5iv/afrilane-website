import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhoneAlt,
    FaMobileAlt,
    FaClock,
    FaLinkedin,
    FaTwitter,
    FaFacebook,
    FaGithub,
    FaArrowUp
} from "react-icons/fa";

import logo from "../../assets/logo.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const footerVariants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
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
            href: "#",
            hover: "hover:bg-blue-600",
            label: "LinkedIn"
        },
        {
            Icon: FaTwitter,
            href: "#",
            hover: "hover:bg-sky-500",
            label: "Twitter"
        },
        {
            Icon: FaFacebook,
            href: "#",
            hover: "hover:bg-blue-700",
            label: "Facebook"
        },
        {
            Icon: FaGithub,
            href: "#",
            hover: "hover:bg-gray-700",
            label: "GitHub"
        }
    ];

    return (
        <motion.footer
            className="relative pt-20 pb-8 mt-20 overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={footerVariants}
        >
            {/* Background principal */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 to-black" />

            {/* Blur Effects */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Container */}
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(59,130,246,0.15)]">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                        {/* ABOUT */}
                        <motion.div
                            className="space-y-6"
                            variants={itemVariants}
                        >
                            <motion.img
                                src={logo}
                                alt="Afrilane"
                                className="h-10 w-auto brightness-0 invert"
                                whileHover={{ scale: 1.05 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400
                                }}
                            />

                            <p className="text-gray-400 text-sm leading-relaxed">
                                Cabinet d'ingénierie informatique spécialisé
                                dans la formation certifiante, l'audit et
                                l'intégration de solutions technologiques
                                au Cameroun.
                            </p>

                            <p className="text-xs text-gray-500">
                                Powered by AFRILANE Technologies
                            </p>

                            {/* Socials */}
                            <div className="flex gap-3 pt-2">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        className={`group w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 ${social.hover}`}
                                        whileHover={{
                                            scale: 1.1,
                                            y: -4
                                        }}
                                        whileTap={{
                                            scale: 0.95
                                        }}
                                    >
                                        <social.Icon className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* NAVIGATION */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-bold mb-6 border-l-4 border-blue-500 pl-3 text-blue-500">
                                Navigation
                            </h4>

                            <ul className="space-y-4 text-sm">
                                {navLinks.map((link) => (
                                    <motion.li
                                        key={link.name}
                                        whileHover={{ x: 6 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300
                                        }}
                                    >
                                        <a
                                            href={link.path}
                                            className="text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* ADDRESS */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-bold mb-6 border-l-4 border-blue-500 pl-3 text-blue-500">
                                Siège Social
                            </h4>

                            <ul className="space-y-5 text-gray-400 text-sm">

                                <li className="flex items-start gap-3 group">
                                    <FaMapMarkerAlt className="text-blue-500 text-lg mt-1 group-hover:scale-110 transition-transform duration-300" />

                                    <span>
                                        Yaoundé - Maétur Biteng
                                        <br />
                                        (Entrée Maétur)
                                        <br />
                                        Cameroun
                                    </span>
                                </li>

                                <li className="flex items-start gap-3 group">
                                    <FaEnvelope className="text-blue-500 text-lg mt-1 group-hover:scale-110 transition-transform duration-300" />

                                    <span className="break-all">
                                        contact@afrilane.cm
                                    </span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* CONTACT */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-bold mb-6 border-l-4 border-blue-500 pl-3 text-blue-500">
                                Contact Rapide
                            </h4>

                            <ul className="space-y-5 text-gray-400 text-sm">

                                <li className="flex items-center gap-3 group">
                                    <FaPhoneAlt className="text-blue-500 text-lg group-hover:scale-110 transition-transform duration-300" />

                                    <span>
                                        +237 222 31 16 01
                                    </span>
                                </li>

                                <li className="flex items-center gap-3 group">
                                    <FaMobileAlt className="text-blue-500 text-lg group-hover:scale-110 transition-transform duration-300" />

                                    <span>
                                        +237 699 06 43 13
                                        <br />
                                        +237 677 34 34 40
                                    </span>
                                </li>

                                <li className="flex items-center gap-3 group">
                                    <FaClock className="text-blue-500 text-lg group-hover:scale-110 transition-transform duration-300" />

                                    <span>
                                        Lun - Ven : 08h00 - 18h00
                                    </span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <motion.div
                        className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400"
                        variants={itemVariants}
                    >
                        <p>
                            © {currentYear} AFRILANE - Expertise &
                            Certification IT. Tous droits réservés.
                        </p>

                        <div className="flex gap-6">
                            <a
                                href="#"
                                className="hover:text-white transition-colors duration-300"
                            >
                                Mentions Légales
                            </a>

                            <a
                                href="#"
                                className="hover:text-white transition-colors duration-300"
                            >
                                Confidentialité
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll To Top */}
            <AnimatePresence>
                {showButton && (
                    <motion.button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl z-50"
                        initial={{
                            opacity: 0,
                            scale: 0,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            y: 20
                        }}
                        whileHover={{
                            scale: 1.1,
                            y: -5
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300
                        }}
                    >
                        <FaArrowUp className="text-lg" />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.footer>
    );
};

export default Footer;