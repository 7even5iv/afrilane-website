import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaRocket,
  FaTrophy,
  FaChevronDown,
  FaUsers,
  FaCheckCircle
} from "react-icons/fa";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 pt-16 pb-40 lg:pt-24 lg:pb-44 overflow-hidden">

      {/* Background */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="lg:grid lg:grid-cols-2 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >

          {/* LEFT */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Propulse ta</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                carrière IT
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
              Obtiens des certifications IT internationales et décroche des opportunités concrètes au Cameroun.
            </p>

            <div className="mt-4 flex gap-2 flex-wrap">
              {["Cisco", "CompTIA", "Microsoft", "PMP"].map((cert, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold"
                >
                  {cert}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-bold bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGraduationCap />
                Commencer ma certification
              </motion.button>

              <motion.button
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                whileHover={{ scale: 1.05 }}
              >
                <FaRocket />
                Voir les services
              </motion.button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-gray-500">
              <span className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center"
                  >
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                ))}
              </span>

              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-500" />
                <p>
                  Déjà{" "}
                  <span className="text-blue-600 font-bold">
                    +1000 certifiés accompagnés
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="mt-12 lg:mt-0 relative"
            variants={imageVariants}
          >
            <div className="relative rounded-2xl shadow-2xl overflow-hidden group">
              <motion.img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Formation IT"
                whileHover={{ scale: 1.05 }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20" />
            </div>

            <motion.div
              className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaTrophy className="text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Certifications</p>
                <p className="font-bold">100% reconnues</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* SCROLL FIX */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-xs text-gray-400">Découvrir</span>
        <FaChevronDown className="text-gray-400" />
      </motion.div>
    </section>
  );
};

export default Hero;