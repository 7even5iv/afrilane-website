'use client';

import { useEffect, useState } from "react";
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        {
            name: "Accueil",
            href: "#",
            icon: FaHome
        },
        {
            name: "Certifications",
            href: "#",
            icon: FaCertificate
        },
        {
            name: "Formations",
            href: "#",
            icon: FaChalkboardTeacher
        },
        {
            name: "Services",
            href: "#",
            icon: FaConciergeBell
        },
        {
            name: "À propos",
            href: "#",
            icon: FaInfoCircle
        }
    ];

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50">

                <motion.div
                    initial={{
                        y: -100,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.6
                    }}
                    className="max-w-7xl mx-auto px-4 pt-4"
                >

                    {/* MAIN NAVBAR */}
                    <div
                        className={`
                            relative transition-all duration-500 rounded-2xl
                            ${isScrolled
                                ? "bg-white/70 backdrop-blur-2xl border border-white/20 shadow-2xl"
                                : "bg-white/40 backdrop-blur-xl border border-white/10"
                            }
                        `}
                    >

                        {/* Glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none" />

                        <div className="relative flex items-center justify-between h-20 px-6">

                            {/* LOGO */}
                            <motion.img
                                src={logo}
                                alt="Afrilane"
                                className="h-11 w-auto cursor-pointer"
                                whileHover={{
                                    scale: 1.05
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400
                                }}
                            />

                            {/* DESKTOP NAV */}
                            <nav className="hidden lg:flex items-center gap-2">

                                {menuItems.map((item, index) => (
                                    <motion.a
                                        key={index}
                                        href={item.href}
                                        className="relative px-5 py-2 rounded-full text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group"
                                        whileHover={{
                                            y: -2
                                        }}
                                    >

                                        {/* Hover BG */}
                                        <span className="absolute inset-0 rounded-full bg-blue-50 scale-0 group-hover:scale-100 transition-transform duration-300" />

                                        <span className="relative z-10">
                                            {item.name}
                                        </span>

                                    </motion.a>
                                ))}

                            </nav>

                            {/* CTA */}
                            <div className="hidden lg:block">
                                <motion.button
                                    whileHover={{
                                        scale: 1.04,
                                        y: -2
                                    }}
                                    whileTap={{
                                        scale: 0.97
                                    }}
                                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                                >

                                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                                    <span className="relative flex items-center gap-2">
                                        <FaPhoneAlt />
                                        Contactez-nous
                                    </span>

                                </motion.button>
                            </div>

                            {/* MOBILE BUTTON */}
                            <motion.button
                                onClick={() => setIsOpen(true)}
                                whileTap={{
                                    scale: 0.9
                                }}
                                className="lg:hidden relative w-11 h-11 rounded-full bg-white/50 backdrop-blur-md border border-white/20 flex flex-col justify-center items-center gap-1.5"
                            >

                                <motion.span
                                    animate={{
                                        rotate: isOpen ? 45 : 0,
                                        y: isOpen ? 6 : 0
                                    }}
                                    className="w-5 h-0.5 bg-gray-800 rounded-full"
                                />

                                <motion.span
                                    animate={{
                                        opacity: isOpen ? 0 : 1
                                    }}
                                    className="w-5 h-0.5 bg-gray-800 rounded-full"
                                />

                                <motion.span
                                    animate={{
                                        rotate: isOpen ? -45 : 0,
                                        y: isOpen ? -6 : 0
                                    }}
                                    className="w-5 h-0.5 bg-gray-800 rounded-full"
                                />

                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* OVERLAY */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* PANEL */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                stiffness: 280,
                                damping: 28
                            }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
                        >

                            {/* TOP BLUR */}
                            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

                            <div className="relative flex flex-col h-full p-8">

                                {/* HEADER */}
                                <div className="flex items-center justify-between mb-10">

                                    <motion.img
                                        src={logo}
                                        alt="Afrilane"
                                        className="h-10"
                                        initial={{
                                            opacity: 0
                                        }}
                                        animate={{
                                            opacity: 1
                                        }}
                                    />

                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        whileHover={{
                                            rotate: 90
                                        }}
                                        whileTap={{
                                            scale: 0.9
                                        }}
                                        className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                    >
                                        <FaTimes className="text-gray-700 text-lg" />
                                    </motion.button>

                                </div>

                                {/* LINKS */}
                                <nav className="flex flex-col gap-3 flex-1">

                                    {menuItems.map((item, index) => {
                                        const Icon = item.icon;

                                        return (
                                            <motion.a
                                                key={index}
                                                href={item.href}
                                                initial={{
                                                    opacity: 0,
                                                    x: 40
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0
                                                }}
                                                transition={{
                                                    delay: index * 0.08
                                                }}
                                                whileHover={{
                                                    x: 8
                                                }}
                                                onClick={() => setIsOpen(false)}
                                                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-all duration-300"
                                            >

                                                <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-300">

                                                    <Icon className="text-gray-700 group-hover:text-blue-600 text-lg transition-colors duration-300" />

                                                </div>

                                                <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                                    {item.name}
                                                </span>

                                            </motion.a>
                                        );
                                    })}

                                </nav>

                                {/* CTA */}
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        delay: 0.4
                                    }}
                                    className="pt-8 border-t border-gray-200"
                                >

                                    <motion.button
                                        whileHover={{
                                            scale: 1.02
                                        }}
                                        whileTap={{
                                            scale: 0.98
                                        }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
                                    >

                                        <FaPhoneAlt />

                                        Contactez-nous

                                    </motion.button>

                                    {/* SOCIALS */}
                                    <div className="flex justify-center gap-4 mt-8">

                                        {[
                                            {
                                                Icon: FaLinkedin,
                                                href: "#"
                                            },
                                            {
                                                Icon: FaFacebook,
                                                href: "#"
                                            }
                                        ].map((social, index) => (
                                            <motion.a
                                                key={index}
                                                href={social.href}
                                                whileHover={{
                                                    scale: 1.1,
                                                    y: -4
                                                }}
                                                className="w-11 h-11 rounded-full bg-gray-100 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group"
                                            >

                                                <social.Icon className="text-gray-700 group-hover:text-white transition-colors duration-300" />

                                            </motion.a>
                                        ))}

                                    </div>

                                </motion.div>

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;