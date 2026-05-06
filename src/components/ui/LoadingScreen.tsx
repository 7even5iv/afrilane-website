'use client';

import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

const LoadingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 1.02
            }}
            transition={{
                duration: 0.8,
                ease: "easeInOut"
            }}
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                overflow-hidden
                bg-white
            "
        >

            {/* Blur Background */}
            <div className="
                absolute
                top-0
                left-0
                w-72
                h-72
                bg-blue-500/10
                rounded-full
                blur-3xl
            " />

            <div className="
                absolute
                bottom-0
                right-0
                w-72
                h-72
                bg-cyan-400/10
                rounded-full
                blur-3xl
            " />

            {/* Grid Overlay */}
            <div className="
                absolute
                inset-0
                opacity-[0.03]
                bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px)]
                bg-[size:40px_40px]
            " />

            {/* Content */}
            <div className="relative flex flex-col items-center">

                {/* Logo */}
                <motion.div
                    initial={{
                        scale: 0.8,
                        opacity: 0
                    }}
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: 1
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative mb-10"
                >

                    {/* Glow */}
                    <div className="
                        absolute
                        inset-0
                        bg-blue-500/10
                        blur-2xl
                        rounded-full
                    " />

                    <img
                        src={logo}
                        alt="Afrilane Loading"
                        className="
                            relative
                            h-20
                            w-auto
                            drop-shadow-xl
                        "
                    />

                </motion.div>

                {/* Progress Bar */}
                <div className="
                    relative
                    w-64
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-gray-100
                    shadow-inner
                ">

                    <motion.div
                        initial={{
                            x: "-100%"
                        }}
                        animate={{
                            x: "200%"
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="
                            absolute
                            top-0
                            left-0
                            h-full
                            w-1/2
                            rounded-full
                            bg-gradient-to-r
                            from-blue-500
                            via-cyan-400
                            to-blue-500
                        "
                    />

                </div>

                {/* Text */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8
                    }}
                    className="mt-8 text-center"
                >

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.45em]
                        text-blue-600
                    ">
                        Expertise & Certification
                    </p>

                    <motion.p
                        animate={{
                            opacity: [0.4, 1, 0.4]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                        className="
                            mt-3
                            text-sm
                            text-gray-400
                        "
                    >
                        Chargement de l’expérience...
                    </motion.p>

                </motion.div>

            </div>
        </motion.div>
    );
};

export default LoadingScreen;