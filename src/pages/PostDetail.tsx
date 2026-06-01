import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaHeart, FaComment, FaPaperPlane, FaSpinner, FaCalendarAlt,
    FaArrowLeft, FaShare, FaBookmark, FaUserAlt, FaTag,
    FaEye, FaTwitter, FaFacebook, FaLinkedin, FaLink,
    FaChevronLeft
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState({ name: "", text: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${id}`);
            if (!res.ok) throw new Error("Article non trouvé");
            const data = await res.json();
            setPost(data);

            // Simuler des articles recommandés
            setRelatedPosts([
                { id: 1, title: "Les tendances du développement web en 2024", image: "https://via.placeholder.com/300x200", category: "Tendances" },
                { id: 2, title: "Comment optimiser ses applications React", image: "https://via.placeholder.com/300x200", category: "Technique" }
            ]);
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger l'article");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${id}/like`, { method: 'POST' });
            const data = await res.json();
            if (post) {
                setPost({ ...post, likes: data.likes });
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error("Erreur like:", error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author_name: newComment.name, content: newComment.text })
            });
            const data = await res.json();
            if (post) setPost({ ...post, comments: [data, ...post.comments] });
            setNewComment({ name: "", text: "" });
        } catch (error) {
            console.error("Erreur commentaire:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = post?.title;

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert("Lien copié dans le presse-papier !");
                break;
        }
        setShowShareMenu(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FaSpinner className="text-blue-400 text-xl animate-pulse" />
                </div>
            </div>
            <p className="mt-6 text-gray-500 font-medium">Chargement de l'article...</p>
        </div>
    );

    if (error || !post) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <FaComment className="text-red-500 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Article non trouvé</h3>
                <p className="text-gray-500 mb-6">{error || "L'article que vous recherchez n'existe pas"}</p>
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                    <FaArrowLeft size={14} /> Retour au blog
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* BARRE DE NAVIGATION SIMPLIFIÉE */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        to="/blog"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                        <FaChevronLeft size={14} /> Retour au blog
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLike}
                            className={`p-2 rounded-lg transition-all ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
                        >
                            <FaHeart />
                        </button>
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-2 rounded-lg transition-all ${isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                            <FaBookmark />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <FaShare />
                            </button>
                            {showShareMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                                        <FaTwitter className="text-blue-400" /> Twitter
                                    </button>
                                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                                        <FaFacebook className="text-blue-600" /> Facebook
                                    </button>
                                    <button onClick={() => handleShare('linkedin')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                                        <FaLinkedin className="text-blue-700" /> LinkedIn
                                    </button>
                                    <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                                        <FaLink /> Copier le lien
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* IMAGE DE COUVERTURE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-10"
                >
                    <img
                        src={post.image || "https://via.placeholder.com/800x450?text=Article"}
                        className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-xl"
                        alt={post.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-3xl"></div>
                </motion.div>

                {/* MÉTADONNÉES */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center gap-4 mb-6"
                >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        <FaTag size={10} />
                        {post.category || "Non catégorisé"}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <FaCalendarAlt size={12} />
                        {new Date(post.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <FaUserAlt size={12} />
                        {post.author || "Admin"}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <FaEye size={12} />
                        {post.views || 0} vues
                    </span>
                </motion.div>

                {/* TITRE */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                >
                    {post.title}
                </motion.h1>

                {/* CONTENU */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-lg max-w-none text-gray-600 mb-12 leading-relaxed"
                >
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </motion.div>

                {/* STATISTIQUES D'INTERACTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between gap-6 mb-12 py-6 border-y border-gray-200"
                >
                    <div className="flex gap-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${isLiked
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-500'
                                }`}
                        >
                            <FaHeart className={isLiked ? "fill-current" : ""} />
                            {post.likes || 0}
                        </button>
                        <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-700 border border-gray-200">
                            <FaComment />
                            {post.comments?.length || 0} commentaires
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        Temps de lecture : {Math.ceil(post.content?.length / 1000) || 3} min
                    </div>
                </motion.div>

                {/* SECTION COMMENTAIRES */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-16"
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <FaComment className="text-blue-600" />
                        Commentaires ({post.comments?.length || 0})
                    </h3>

                    <AnimatePresence>
                        {post.comments?.map((c: any, idx: number) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: idx * 0.05 }}
                                key={c.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold uppercase shadow-md">
                                        {c.author_name?.charAt(0) || 'A'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{c.author_name}</h4>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(c.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <button className="text-gray-400 hover:text-blue-600 text-sm font-medium">
                                                Répondre
                                            </button>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{c.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {(!post.comments || post.comments.length === 0) && (
                        <div className="bg-gray-50 rounded-2xl p-12 text-center">
                            <FaComment className="text-gray-300 text-4xl mx-auto mb-3" />
                            <p className="text-gray-500">Soyez le premier à commenter cet article !</p>
                        </div>
                    )}
                </motion.div>

                {/* FORMULAIRE DE COMMENTAIRE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 md:p-12"
                >
                    <h3 className="text-2xl font-bold text-white mb-2 text-center">Partager votre avis</h3>
                    <p className="text-gray-300 text-center mb-8">Votre commentaire nous intéresse</p>

                    <form onSubmit={handleComment} className="space-y-4">
                        <input
                            required
                            placeholder="Votre nom"
                            value={newComment.name}
                            onChange={e => setNewComment({ ...newComment, name: e.target.value })}
                            className="w-full px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        <textarea
                            required
                            placeholder="Votre message..."
                            value={newComment.text}
                            onChange={e => setNewComment({ ...newComment, text: e.target.value })}
                            rows={4}
                            className="w-full px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><FaSpinner className="animate-spin" /> Envoi en cours...</>
                            ) : (
                                <><FaPaperPlane /> Publier le commentaire</>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* ARTICLES RECOMMANDÉS */}
                {relatedPosts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-16 pt-8 border-t border-gray-200"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Articles recommandés</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedPosts.map(related => (
                                <Link
                                    key={related.id}
                                    to={`/blog/${related.id}`}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                                >
                                    <div className="flex gap-4 p-4">
                                        <img
                                            src={related.image}
                                            className="w-24 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform"
                                            alt={related.title}
                                        />
                                        <div className="flex-1">
                                            <span className="text-xs text-blue-600 font-bold uppercase">{related.category}</span>
                                            <h4 className="font-semibold text-gray-800 mt-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {related.title}
                                            </h4>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PostDetail;