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

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Bloquer le scroll quand le menu mobile est ouvert
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const menuItems = [
        {
            name: "Accueil",
            href: "/",
            icon: FaHome,
        },
        {
            name: "Certifications",
            href: "/certifications",
            icon: FaCertificate,
        },
        {
            name: "Formations",
            href: "/formations",
            icon: FaChalkboardTeacher,
        },
        {
            name: "Services",
            href: "/expertise",
            icon: FaConciergeBell,
        },
        {
            name: "À propos",
            href: "/a-propos",
            icon: FaInfoCircle,
        },
    ];

    return (
        <>
            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full z-50">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto px-4 pt-4"
                >
                    <div
                        className={`relative rounded-2xl transition-all duration-500 ${isScrolled
                                ? "bg-white/80 backdrop-blur-2xl border border-white/20 shadow-2xl"
                                : "bg-white/40 backdrop-blur-xl border border-white/10"
                            }`}
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none" />

                        {/* CONTENT */}
                        <div className="relative flex items-center justify-between h-20 px-6">

                            {/* LOGO */}
                            <Link to="/">
                                <motion.img
                                    src={logo}
                                    alt="Afrilane"
                                    className="h-11 w-auto"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                    }}
                                />
                            </Link>

                            {/* NAVIGATION DESKTOP */}
                            <nav className="hidden lg:flex items-center gap-2">
                                {menuItems.map((item) => {
                                    const isActive =
                                        location.pathname === item.href;

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`relative px-5 py-2 rounded-full font-semibold overflow-hidden transition-all duration-300 group ${isActive
                                                    ? "text-blue-600"
                                                    : "text-gray-700 hover:text-blue-600"
                                                }`}
                                        >
                                            <span
                                                className={`absolute inset-0 rounded-full transition-transform duration-300 ${isActive
                                                        ? "bg-blue-100 scale-100"
                                                        : "bg-blue-50 scale-0 group-hover:scale-100"
                                                    }`}
                                            />

                                            <span className="relative z-10">
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* CTA DESKTOP */}
                            <div className="hidden lg:block">
                                <Link to="/contact">
                                    <motion.div
                                        whileHover={{
                                            scale: 1.04,
                                            y: -2,
                                        }}
                                        whileTap={{
                                            scale: 0.97,
                                        }}
                                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg cursor-pointer"
                                    >
                                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                                        <span className="relative flex items-center gap-2">
                                            <FaPhoneAlt />
                                            Contactez-nous
                                        </span>
                                    </motion.div>
                                </Link>
                            </div>

                            {/* BOUTON MOBILE */}
                            <motion.button
                                type="button"
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

            {/* MENU MOBILE */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* OVERLAY */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                        />

                        {/* DRAWER */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                stiffness: 280,
                                damping: 28,
                            }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl z-[70] overflow-hidden"
                        >
                            <div className="flex flex-col h-full p-8">

                                {/* TOP */}
                                <div className="flex items-center justify-between mb-10">
                                    <img
                                        src={logo}
                                        alt="Afrilane"
                                        className="h-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                                    >
                                        <FaTimes className="text-gray-700" />
                                    </button>
                                </div>

                                {/* NAVIGATION MOBILE */}
                                <nav className="flex flex-col gap-3 flex-1">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;

                                        const isActive =
                                            location.pathname === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={() =>
                                                    setIsOpen(false)
                                                }
                                                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive
                                                        ? "bg-blue-50"
                                                        : "hover:bg-blue-50"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isActive
                                                            ? "bg-blue-100"
                                                            : "bg-gray-100 group-hover:bg-blue-100"
                                                        }`}
                                                >
                                                    <Icon
                                                        className={`text-lg ${isActive
                                                                ? "text-blue-600"
                                                                : "text-gray-700 group-hover:text-blue-600"
                                                            }`}
                                                    />
                                                </div>

                                                <span
                                                    className={`text-lg font-semibold ${isActive
                                                            ? "text-blue-600"
                                                            : "text-gray-800 group-hover:text-blue-600"
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* FOOTER MOBILE */}
                                <div className="pt-8 border-t border-gray-200">
                                    <Link
                                        to="/contact"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <button
                                            type="button"
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                        >
                                            <FaPhoneAlt />
                                            Contactez-nous
                                        </button>
                                    </Link>

                                    {/* SOCIALS */}
                                    <div className="flex justify-center gap-4 mt-8">
                                        <a
                                            href="https://linkedin.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300"
                                        >
                                            <FaLinkedin size={18} />
                                        </a>

                                        <a
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-blue-700 text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300"
                                        >
                                            <FaFacebook size={18} />
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