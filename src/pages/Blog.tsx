import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FaHeart, FaComment, FaSpinner, FaSearch, FaTag,
    FaUserAlt, FaCalendarAlt, FaEye, FaShare, FaBookmark,
    FaArrowRight, FaFilter, FaTimes
} from "react-icons/fa";

const Blog = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/posts");
            if (!res.ok) throw new Error("Erreur de chargement");
            const data = await res.json();
            if (Array.isArray(data)) {
                setPosts(data);
                // Extraire les catégories uniques
                const uniqueCategories = [...new Set(data.map((post: any) => post.category).filter(Boolean))];
                setCategories(uniqueCategories);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger les articles");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = (postId: number) => {
        if (likedPosts.includes(postId)) {
            setLikedPosts(likedPosts.filter(id => id !== postId));
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: post.likes - 1 } : post
            ));
        } else {
            setLikedPosts([...likedPosts, postId]);
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            ));
        }
    };

    // Filtrer les articles
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const postVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FaSpinner className="text-blue-400 text-xl animate-pulse" />
                </div>
            </div>
            <p className="mt-6 text-gray-500 font-medium">Chargement des articles...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <FaTimes className="text-red-500 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchPosts}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* HERO SECTION */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Blog & Actualités
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Découvrez les dernières actualités, conseils et tendances du développement web
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* BARRE DE RECHERCHE ET FILTRES */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Rechercher un article..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="relative lg:w-64">
                            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-11 pr-8 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                            >
                                <option value="all">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* FILTRES ACTIFS */}
                    {(searchTerm || selectedCategory !== "all") && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                            {searchTerm && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm">
                                    Recherche: {searchTerm}
                                    <button onClick={() => setSearchTerm("")} className="hover:text-blue-900">
                                        <FaTimes size={12} />
                                    </button>
                                </span>
                            )}
                            {selectedCategory !== "all" && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm">
                                    Catégorie: {selectedCategory}
                                    <button onClick={() => setSelectedCategory("all")} className="hover:text-blue-900">
                                        <FaTimes size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* NOMBRE D'ARTICLES TROUVÉS */}
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* GRILLE DES ARTICLES */}
                {filteredPosts.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredPosts.map((post) => (
                                <motion.article
                                    key={post.id}
                                    variants={postVariants}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <Link to={`/blog/${post.id}`}>
                                        <div className="relative overflow-hidden h-56">
                                            <img
                                                src={post.image || "https://via.placeholder.com/400x300?text=Article"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt={post.title}
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold">
                                                    <FaTag size={10} />
                                                    {post.category || "Non catégorisé"}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="p-6">
                                        {/* MÉTADONNÉES */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt size={10} />
                                                {new Date(post.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaUserAlt size={10} />
                                                {post.author || "Admin"}
                                            </span>
                                        </div>

                                        {/* TITRE */}
                                        <Link to={`/blog/${post.id}`}>
                                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {/* EXTRAIT */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {post.excerpt || post.content?.substring(0, 120) + "..."}
                                        </p>

                                        {/* INTERACTIONS */}
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-1.5 text-sm transition-all ${likedPosts.includes(post.id)
                                                            ? 'text-red-500'
                                                            : 'text-gray-500 hover:text-red-500'
                                                        }`}
                                                >
                                                    <FaHeart className={likedPosts.includes(post.id) ? "fill-current" : ""} />
                                                    <span>{post.likes || 0}</span>
                                                </button>
                                                <Link
                                                    to={`/blog/${post.id}`}
                                                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                                >
                                                    <FaComment />
                                                    <span>{post.comments_count || 0}</span>
                                                </Link>
                                                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                                    <FaEye />
                                                    <span>{post.views || 0}</span>
                                                </button>
                                            </div>

                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                    <FaBookmark size={14} />
                                                </button>
                                                <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                    <FaShare size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* BOUTON LIRE PLUS */}
                                        <Link
                                            to={`/blog/${post.id}`}
                                            className="inline-flex items-center gap-2 mt-4 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all"
                                        >
                                            Lire l'article
                                            <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    /* ÉTAT VIDE */
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <FaSearch size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Aucun article trouvé
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                {searchTerm || selectedCategory !== "all"
                                    ? "Aucun article ne correspond à vos critères de recherche"
                                    : "Aucun article n'est encore disponible"}
                            </p>
                            {(searchTerm || selectedCategory !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("all");
                                    }}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* NEWSLETTER SECTION */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                    <div className="text-center max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold mb-2">Restez informé</h3>
                        <p className="text-blue-100 mb-6">
                            Recevez nos derniers articles directement dans votre boîte mail
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                className="flex-1 px-4 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-all">
                                S'abonner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;