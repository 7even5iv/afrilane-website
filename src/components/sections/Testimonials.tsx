import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { TESTIMONIALS } from "../../constants";

// 1. On définit la structure d'un témoignage pour TypeScript
interface TestimonialType {
    id: number;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string; // Propriété requise
}

const Testimonials = () => {
    return (
        <section className="relative py-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">

            {/* Glow Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-xs uppercase tracking-[0.25em] font-bold">
                        Témoignages
                    </div>

                    <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                        Ce que disent nos
                        <span className="block text-blue-600">
                            Alumni & Clients
                        </span>
                    </h2>

                    <p className="mt-6 max-w-2xl mx-auto text-gray-500 text-lg leading-relaxed">
                        Découvrez les retours d’expérience des personnes qui ont
                        transformé leurs compétences et leurs projets grâce à AFRILANE.
                    </p>
                </motion.div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* 2. On force le type sur TESTIMONIALS pour que TS sache qu'avatar existe */}
                    {(TESTIMONIALS as TestimonialType[]).map((testi, index) => (
                        <motion.div
                            key={testi.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.12,
                                ease: "easeOut",
                            }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className="group relative overflow-hidden rounded-[32px] border border-white/40 bg-white/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50 via-white to-blue-100" />

                            {/* Animated Top Border */}
                            <div className="absolute top-0 left-0 h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-500" />

                            <div className="relative z-10">
                                {/* Stars */}
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-400 text-sm" />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-gray-600 leading-relaxed text-[15px] mb-8">
                                    “{testi.content}”
                                </p>

                                {/* USER */}
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl" />
                                        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-lg">
                                            {/* 3. Sécurité supplémentaire au cas où */}
                                            {testi.avatar || testi.name.charAt(0)}
                                        </div>
                                    </div>

                                    {/* Infos */}
                                    <div>
                                        <h4 className="font-bold text-slate-900">
                                            {testi.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {testi.role}
                                        </p>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                                            {testi.company}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;