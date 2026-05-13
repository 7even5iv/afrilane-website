import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaStar,
  FaShieldAlt,
  FaPlay,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#020617] text-white min-h-screen flex items-center">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full" />

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32 w-full">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <FaShieldAlt className="text-cyan-400" />
              <span className="text-sm text-gray-300">
                Centre de formation IT certifié
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight">
              Deviens un
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                expert IT
              </span>
              recherché partout.
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-xl">
              Formations et certifications internationales pour booster ta
              carrière dans la cybersécurité, le cloud, le réseau et le
              management IT.
            </p>

            {/* CERTIFICATIONS */}
            <div className="mt-6 flex flex-wrap gap-3">
              {["Cisco", "Microsoft", "AWS", "CompTIA", "PMP"].map((item) => (
                <div
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">

              <Link to="/certifications">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold flex items-center gap-3 shadow-2xl shadow-cyan-500/20"
                >
                  Commencer maintenant
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link to="/expertise">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3 hover:bg-white/10 transition"
                >
                  <FaPlay />
                  Explorer les services
                </motion.button>
              </Link>
            </div>

            {/* TRUST */}
            <div className="mt-10 flex flex-wrap items-center gap-6">

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#020617] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
                    >
                      <FaUsers className="text-sm" />
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-bold text-lg">+1000</p>
                  <p className="text-sm text-gray-400">
                    étudiants accompagnés
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  4.9/5 satisfaction moyenne
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >

            {/* MAIN IMAGE */}
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="Formation IT"
                className="w-full h-[650px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
            </div>

            {/* FLOATING CARD */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -left-10 top-10 bg-white text-black p-5 rounded-3xl shadow-2xl w-64"
            >
              <p className="text-sm text-gray-500">
                Certifications obtenues
              </p>

              <h3 className="text-3xl font-black mt-2">+2,500</h3>

              <div className="mt-4 flex items-center gap-2 text-green-500 font-semibold">
                <FaCheckCircle />
                Taux de réussite élevé
              </div>
            </motion.div>

            {/* SECOND CARD */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -right-6 bottom-10 bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-3xl shadow-2xl w-60"
            >
              <p className="text-sm text-cyan-100">
                Opportunités professionnelles
              </p>

              <h3 className="text-2xl font-black mt-2">
                Carrière boostée 🚀
              </h3>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;