import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

import {
    FaTimes,
    FaHome,
    FaCertificate,
    FaChalkboardTeacher,
    FaConciergeBell,
    FaInfoCircle,
    FaPhoneAlt,
    FaLinkedin,
    FaFacebook
} from "react-icons/fa";

import logo from "../../assets/logo.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation(); // Pour savoir quelle page est active

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { name: "Accueil", href: "/", icon: FaHome },
        { name: "Certifications", href: "/certifications", icon: FaCertificate },
        { name: "Formations", href: "/formations", icon: FaChalkboardTeacher },
        { name: "Services", href: "/expertise", icon: FaConciergeBell },
        { name: "À propos", href: "/a-propos", icon: FaInfoCircle }
    ];

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto px-4 pt-4"
                >
                    {/* MAIN NAVBAR */}
                    <div className={`relative transition-all duration-500 rounded-2xl ${isScrolled
                            ? "bg-white/70 backdrop-blur-2xl border border-white/20 shadow-2xl"
                            : "bg-white/40 backdrop-blur-xl border border-white/10"
                        }`}>

                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none" />

                        <div className="relative flex items-center justify-between h-20 px-6">
                            {/* LOGO */}
                            <Link to="/">
                                <motion.img
                                    src={logo}
                                    alt="Afrilane"
                                    className="h-11 w-auto"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                />
                            </Link>

                            {/* DESKTOP NAV */}
                            <nav className="hidden lg:flex items-center gap-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`relative px-5 py-2 rounded-full font-semibold transition-all duration-300 group ${location.pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                                            }`}
                                    >
                                        <span className="absolute inset-0 rounded-full bg-blue-50 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                        <span className="relative z-10">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>

                            {/* CTA - Bouton Contact */}
                            <div className="hidden lg:block">
                                <Link to="/contact">
                                    <motion.div
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg cursor-pointer"
                                    >
                                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <span className="relative flex items-center gap-2">
                                            <FaPhoneAlt /> Contactez-nous
                                        </span>
                                    </motion.div>
                                </Link>
                            </div>

                            {/* MOBILE BUTTON */}
                            <motion.button
                                onClick={() => setIsOpen(true)}
                                whileTap={{ scale: 0.9 }}
                                className="lg:hidden relative w-11 h-11 rounded-full bg-white/50 backdrop-blur-md border border-white/20 flex flex-col justify-center items-center gap-1.5"
                            >
                                <span className="w-5 h-0.5 bg-gray-800 rounded-full" />
                                <span className="w-5 h-0.5 bg-gray-800 rounded-full" />
                                <span className="w-5 h-0.5 bg-gray-800 rounded-full" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 280, damping: 28 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl z-[70] overflow-hidden"
                        >
                            <div className="relative flex flex-col h-full p-8">
                                {/* HEADER MENU MOBILE */}
                                <div className="flex items-center justify-between mb-10">
                                    <img src={logo} alt="Afrilane" className="h-10" />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center"
                                    >
                                        <FaTimes className="text-gray-700" />
                                    </button>
                                </div>

                                {/* LINKS MOBILE */}
                                <nav className="flex flex-col gap-3 flex-1">
                                    {menuItems.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={index}
                                                to={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-all"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                                    <Icon className="text-gray-700 group-hover:text-blue-600 text-lg" />
                                                </div>
                                                <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* CTA MOBILE */}
                                <div className="pt-8 border-t border-gray-200">
                                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2">
                                            <FaPhoneAlt /> Contactez-nous
                                        </button>
                                    </Link>

                                    {/* SOCIALS */}
                                    <div className="flex justify-center gap-4 mt-8">
                                        <a href="#" className="w-11 h-11 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"><FaLinkedin /></a>
                                        <a href="#" className="w-11 h-11 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-all"><FaFacebook /></a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;