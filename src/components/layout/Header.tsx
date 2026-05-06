'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        "Accueil",
        "Certifications",
        "Formations",
        "Services",
        "À propos",
    ];

    return (
        <header className="fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 pt-4">

                {/* Container */}
                <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-lg border border-white/20">
                    <div className="flex justify-between items-center h-20 px-6">

                        {/* Logo */}
                        <img src={logo} alt="Afrilane" className="h-12" />

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex gap-8">
                            {menuItems.map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* CTA */}
                        <div className="hidden md:block">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
                                Contact
                            </button>
                        </div>

                        {/* HAMBURGER */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center"
                        >
                            <motion.span
                                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-[2px] bg-gray-800 mb-1 block"
                            />
                            <motion.span
                                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-6 h-[2px] bg-gray-800 mb-1 block"
                            />
                            <motion.span
                                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-[2px] bg-gray-800 block"
                            />
                        </button>

                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* OVERLAY */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* MENU PANEL */}
                        <motion.div
                            className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-2xl z-50 p-8 flex flex-col"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="self-end mb-8 text-gray-500"
                            >
                                ✕
                            </button>

                            {/* Links */}
                            <nav className="flex flex-col gap-6 text-lg font-semibold">
                                {menuItems.map((item, i) => (
                                    <motion.a
                                        key={item}
                                        href="#"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="text-gray-800 hover:text-blue-600 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                            </nav>

                            {/* CTA */}
                            <button className="mt-10 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                                Contactez-nous
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;