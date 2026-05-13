import { motion } from "framer-motion";
import { BLOG_POSTS } from "../constants";
import { FaCalendarAlt, FaUser, FaArrowRight, FaStar, FaNewspaper, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Blog = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen pt-32 pb-20">
            {/* Effets de fond */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-300/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER BLOG MODERNISÉ */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6"
                    >
                        <FaStar className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Notre Blog
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
                    >
                        Actualités &{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Insights
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-2xl mx-auto text-lg"
                    >
                        Restez informé des dernières tendances technologiques, de la cybersécurité
                        et de la vie du centre AFRILANE.
                    </motion.p>
                </div>

                {/* GRILLE D'ARTICLES MODERNISÉE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image de l'article */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Contenu de l'article */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-gray-400 text-xs mb-4 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-blue-400" />
                                        {post.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <FaUser className="text-blue-400" />
                                        {post.author}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-5 border-t border-gray-100">
                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all duration-300 group/link"
                                    >
                                        Lire la suite
                                        <FaArrowRight className="text-xs transition-transform group-hover/link:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* NEWSLETTER MODERNISÉE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-10 md:p-16 text-center"
                >
                    {/* Effets de fond */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

                    {/* Grille décorative */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                            <FaNewspaper className="text-blue-400 text-xs" />
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                                Newsletter
                            </span>
                        </div>

                        <h2 className="text-white text-3xl md:text-4xl font-black mb-4">
                            Ne manquez aucune opportunité
                        </h2>

                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                            Inscrivez-vous pour recevoir nos conseils IT et les alertes
                            sur les prochaines sessions d'examens.
                        </p>

                        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="email"
                                    placeholder="Votre email professionnel"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-400 outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
                                />
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                            >
                                S'abonner
                            </motion.button>
                        </form>

                        {/* Message de confirmation */}
                        {isSubscribed && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 text-green-400 text-sm font-medium"
                            >
                                Merci pour votre inscription ! 📧
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Statistiques ou informations complémentaires */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Articles publiés récemment
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Conseils d'experts IT
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Actualités du centre
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Blog;