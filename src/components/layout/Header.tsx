import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
    FaFacebook,
    FaNewspaper,
    FaUserLock
} from "react-icons/fa";

import logo from "../../assets/logo.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    const menuItems = [
        { name: "Accueil", href: "/", icon: FaHome },
        { name: "Certifications", href: "/certifications", icon: FaCertificate },
        { name: "Formations", href: "/formations", icon: FaChalkboardTeacher },
        { name: "Services", href: "/expertise", icon: FaConciergeBell },
        { name: "Blog", href: "/blog", icon: FaNewspaper },
        { name: "À propos", href: "/a-propos", icon: FaInfoCircle },
        { name: "Connexion", href: "/login", icon: FaUserLock },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4"
                >
                    <div
                        className={`relative rounded-xl md:rounded-2xl transition-all duration-500 ${
                            isScrolled
                                ? "bg-white/80 backdrop-blur-2xl border border-white/20 shadow-2xl"
                                : "bg-white/40 backdrop-blur-xl border border-white/10"
                        }`}
                    >
                        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none" />

                        <div className="relative flex items-center justify-between h-14 sm:h-16 md:h-20 px-3 sm:px-4 md:px-6">
                            {/* Logo et nom de l'entreprise */}
                            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
                                <motion.img
                                    src={logo}
                                    alt="Afrilane"
                                    className="h-8 sm:h-9 md:h-11 w-auto"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                />
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-lg sm:text-xl md:text-2xl font-bold bg-blue-600 bg-clip-text text-transparent"
                                >
                                    AFRILANE
                                </motion.span>
                            </Link>

                            {/* Navigation Desktop */}
                            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center">
                                {menuItems.filter(item => item.name !== "Connexion").map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`relative px-3 xl:px-5 py-2 rounded-full font-semibold overflow-hidden transition-all duration-300 group whitespace-nowrap ${
                                                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                                            }`}
                                        >
                                            <span className={`absolute inset-0 rounded-full transition-transform duration-300 ${
                                                isActive ? "bg-blue-100 scale-100" : "bg-blue-50 scale-0 group-hover:scale-100"
                                            }`} />
                                            <span className="relative z-10 text-sm xl:text-base">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Actions Desktop */}
                            <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
                                {/* Bouton Connexion Desktop */}
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 hover:text-blue-600 font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FaUserLock size={14} />
                                    <span>Connexion</span>
                                </Link>

                                {/* Bouton Contact Desktop */}
                                <Link to="/contact" className="flex-shrink-0">
                                    <motion.div
                                        whileHover={{ scale: 1.03, y: -1 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 xl:px-4 py-1.5 xl:py-2 rounded-full font-semibold shadow-md cursor-pointer text-sm"
                                    >
                                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <span className="relative flex items-center gap-1.5 xl:gap-2">
                                            <FaPhoneAlt size={11} className="xl:w-3 xl:h-3" /> 
                                            <span>Contact</span>
                                        </span>
                                    </motion.div>
                                </Link>
                            </div>

                            {/* Bouton Menu Mobile */}
                            <motion.button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                whileTap={{ scale: 0.9 }}
                                className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/50 backdrop-blur-md border border-white/20 flex flex-col justify-center items-center gap-1.5 flex-shrink-0"
                            >
                                <span className="w-4 sm:w-5 h-0.5 bg-gray-800 rounded-full" />
                                <span className="w-4 sm:w-5 h-0.5 bg-gray-800 rounded-full" />
                                <span className="w-4 sm:w-5 h-0.5 bg-gray-800 rounded-full" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Menu Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 280, damping: 28 }}
                            className="fixed top-0 right-0 h-full w-full max-w-[85%] sm:max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl z-[70] overflow-y-auto"
                        >
                            <div className="flex flex-col h-full p-4 sm:p-5 md:p-8">
                                {/* Header Sidebar */}
                                <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-10">
                                    <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                                        <img src={logo} alt="Afrilane" className="h-7 sm:h-8 md:h-10 w-auto" />
                                        <span className="text-base sm:text-lg md:text-xl font-bold bg-blue-600 bg-clip-text text-transparent">
                                            AFRILANE
                                        </span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
                                    >
                                        <FaTimes className="text-gray-700 text-sm sm:text-base" />
                                    </button>
                                </div>

                                {/* Navigation Mobile */}
                                <nav className="flex flex-col gap-2 sm:gap-3 flex-1">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all ${
                                                    isActive ? "bg-blue-50" : "hover:bg-blue-50"
                                                }`}
                                            >
                                                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                                                    isActive ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-100"
                                                }`}>
                                                    <Icon className={`text-sm sm:text-base md:text-lg ${
                                                        isActive ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"
                                                    }`} />
                                                </div>
                                                <span className={`text-sm sm:text-base md:text-lg font-semibold ${
                                                    isActive ? "text-blue-600" : "text-gray-800 group-hover:text-blue-600"
                                                }`}>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Footer Sidebar */}
                                <div className="pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 mt-4">
                                    {/* Bouton Contact Mobile */}
                                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                                        <button 
                                            type="button" 
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm sm:text-base"
                                        >
                                            <FaPhoneAlt size={14} className="sm:w-4 sm:h-4" /> 
                                            Contactez-nous
                                        </button>
                                    </Link>
                                    
                                    {/* Réseaux Sociaux */}
                                    <div className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8">
                                        <a 
                                            href="#" 
                                            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FaLinkedin size={14} className="sm:w-4 sm:h-4" />
                                        </a>
                                        <a 
                                            href="#" 
                                            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-all duration-300"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FaFacebook size={14} className="sm:w-4 sm:h-4" />
                                        </a>
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