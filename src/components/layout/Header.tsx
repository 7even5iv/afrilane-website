'use client';

import { useState } from "react";
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
    FaTwitter,
    FaFacebook
} from "react-icons/fa";
import logo from "../../assets/logo.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Accueil", href: "#", icon: FaHome },
        { name: "Certifications", href: "#", icon: FaCertificate },
        { name: "Formations", href: "#", icon: FaChalkboardTeacher },
        { name: "Services", href: "#", icon: FaConciergeBell },
        { name: "À propos", href: "#", icon: FaInfoCircle },
    ];

    return (
        <header className="fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 pt-4">

                {/* Container Glassmorphism */}
                <motion.div
                    className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-lg border border-white/20"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-between items-center h-20 px-6">

                        {/* Logo avec animation */}
                        <motion.img
                            src={logo}
                            alt="Afrilane"
                            className="h-12 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        />

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex gap-8">
                            {menuItems.map((item) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium transition relative group"
                                    whileHover={{ y: -2 }}
                                >
                                    {item.name}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </motion.a>
                            ))}
                        </nav>

                        {/* CTA Desktop */}
                        <motion.div
                            className="hidden md:block"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                                <FaPhoneAlt className="text-sm" />
                                Contactez-nous
                            </button>
                        </motion.div>

                        {/* HAMBURGER BUTTON MODERNE */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden relative w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex flex-col justify-center items-center gap-1.5 z-50"
                        >
                            <motion.span
                                animate={isOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-gray-800 block rounded-full"
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                                className="w-5 h-0.5 bg-gray-800 block rounded-full"
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                animate={isOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-gray-800 block rounded-full"
                                transition={{ duration: 0.3 }}
                            />
                        </button>

                    </div>
                </motion.div>
            </div>

            {/* MOBILE MENU PROFESSIONNEL */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* OVERLAY avec blur */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            transition={{ duration: 0.3 }}
                        />

                        {/* MENU PANEL GLASSMORPHISM */}
                        <motion.div
                            className="fixed top-0 right-0 w-full max-w-md h-full bg-white/95 backdrop-blur-xl shadow-2xl z-50 p-8 flex flex-col"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Header du menu mobile */}
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                                <motion.img
                                    src={logo}
                                    alt="Afrilane"
                                    className="h-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                />
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaTimes className="text-gray-600 text-xl" />
                                </motion.button>
                            </div>

                            {/* Navigation Links avec animations */}
                            <nav className="flex flex-col gap-2 flex-1">
                                {menuItems.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.a
                                            key={item.name}
                                            href={item.href}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                                            className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
                                            onClick={() => setIsOpen(false)}
                                            whileHover={{ x: 10 }}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                                <Icon className="text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <span className="text-lg font-semibold">{item.name}</span>
                                        </motion.a>
                                    );
                                })}
                            </nav>

                            {/* CTA Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 pt-6 border-t border-gray-200"
                            >
                                <motion.button
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <FaPhoneAlt />
                                    Contactez-nous
                                </motion.button>

                                {/* Réseaux sociaux */}
                                <div className="flex justify-center gap-4 mt-6">
                                    {[
                                        { Icon: FaLinkedin, href: "#", color: "hover:bg-blue-600" },
                                        { Icon: FaFacebook, href: "#", color: "hover:bg-blue-700" }
                                    ].map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.href}
                                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:text-white transition-all"
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                        >
                                            <social.Icon className="text-gray-600 text-lg" />
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;