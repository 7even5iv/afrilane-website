import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaStar,
  FaShieldAlt,
  FaPlay,
  FaChartLine,
  FaClock,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 text-gray-900 min-h-screen flex items-center">

      {/* BACKGROUND MODERNISÉ */}
      <div className="absolute inset-0">
        {/* Cercles lumineux */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gray-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/5 rounded-full blur-3xl" />

        {/* Grille subtile */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28 w-full">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            {/* BADGE MODERNISÉ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 shadow-sm mb-8"
            >
              <FaShieldAlt className="text-blue-500 text-sm" />
              <span className="text-sm font-medium text-gray-700">
                Centre de formation IT certifié
              </span>
            </motion.div>

            {/* TITLE AMÉLIORÉ */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight text-gray-900"
            >
              Deviens un
              <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mt-2">
                expert IT
              </span>
              recherché partout.
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl"
            >
              Formations et certifications internationales pour booster ta
              carrière dans la cybersécurité, le cloud, le réseau et le
              management IT.
            </motion.p>

            {/* CERTIFICATIONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {["Cisco", "Microsoft", "AWS", "CompTIA", "PMP"].map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 cursor-default"
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link to="/certifications">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-3.5 rounded-xl bg-blue-600 font-semibold text-white flex items-center gap-3 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300"
                >
                  Commencer maintenant
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>

              <Link to="/expertise">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 flex items-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <FaPlay className="text-blue-500 text-sm" />
                  Explorer les services
                </motion.button>
              </Link>
            </motion.div>

            {/* TRUST INDICATORS MODERNISÉS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md"
                    >
                      <FaUsers className="text-white text-xs" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-2xl text-gray-900">+1000</p>
                  <p className="text-xs text-gray-400 font-medium">
                    étudiants accompagnés
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-gray-200" />

              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700">4.9</span>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  satisfaction moyenne
                </p>
              </div>

              <div className="h-10 w-px bg-gray-200" />

              <div>
                <div className="flex items-center gap-1">
                  <FaClock className="text-blue-500 text-sm" />
                  <p className="font-bold text-2xl text-gray-900">98%</p>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  taux de réussite
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT - IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* MAIN IMAGE CARD */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="Formation IT"
                className="w-full h-[580px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            </div>

            {/* FLOATING CARD 1 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-8 top-20 bg-white border border-gray-100 p-5 rounded-xl shadow-xl w-64"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCheckCircle className="text-blue-500 text-lg" />
                </div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Certifications
                </p>
              </div>
              <h3 className="text-3xl font-black text-gray-900">+2,500</h3>
              <p className="text-sm text-gray-500 mt-1">Diplômes délivrés</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-green-600">Taux de réussite 98%</span>
              </div>
            </motion.div>

            {/* FLOATING CARD 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 bottom-24 bg-white border border-gray-100 p-5 rounded-xl shadow-xl w-64"
            >
              <div className="flex items-center gap-2 mb-3">
                <FaChartLine className="text-blue-500 text-xl" />
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Carrière
                </p>
              </div>
              <h3 className="text-xl font-black text-gray-900">+45% d'opportunités</h3>
              <p className="text-sm text-gray-500 mt-1">Augmentation des offres</p>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                />
              </div>
            </motion.div>

            {/* CARD 3 - STATS */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-1/2 -right-10 -translate-y-1/2 bg-blue-600 text-white p-4 rounded-xl shadow-xl w-48 hidden lg:block"
            >
              <p className="text-xs text-blue-200 font-medium">Note moyenne</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-3xl font-black">4.9</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className="text-yellow-300 text-xs" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-blue-200 mt-2">Basé sur 500+ avis</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;