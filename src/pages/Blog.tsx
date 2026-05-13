import { motion } from "framer-motion";
import { BLOG_POSTS } from "../constants";
import { FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Blog = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER BLOG */}
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 mb-6"
                    >
                        Actualités & <span className="text-blue-600">Insights</span>
                    </motion.h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Restez informé des dernières tendances technologiques, de la cybersécurité et de la vie du centre AFRILANE.
                    </p>
                </div>

                {/* GRILLE D'ARTICLES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {BLOG_POSTS.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Image de l'article */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                                </div>
                            </div>

                            {/* Contenu de l'article */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-gray-400 text-xs mb-4 font-bold">
                                    <span className="flex items-center gap-1.5"><FaCalendarAlt /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><FaUser /> {post.author}</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                    {post.title}
                                </h3>

                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-50">
                                    <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider hover:gap-4 transition-all">
                                        Lire la suite <FaArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* NEWSLETTER (Bonus stratégique) */}
                <div className="mt-32 bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    <h2 className="text-white text-3xl md:text-4xl font-black mb-6 relative z-10">Ne manquez aucune opportunité</h2>
                    <p className="text-gray-400 mb-10 relative z-10 max-w-xl mx-auto">Inscrivez-vous pour recevoir nos conseils IT et les alertes sur les prochaines sessions d'examens.</p>
                    <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
                        <input type="email" placeholder="Votre email" className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all" />
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">S'abonner</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;