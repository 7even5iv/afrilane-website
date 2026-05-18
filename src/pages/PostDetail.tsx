import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaComment, FaPaperPlane, FaSpinner, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [newComment, setNewComment] = useState({ name: "", text: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8000/api/posts/${id}`).then(res => res.json()).then(data => setPost(data));
    }, [id]);

    const handleLike = async () => {
        const res = await fetch(`http://localhost:8000/api/posts/${id}/like`, { method: 'POST' });
        const data = await res.json();
        if (post) setPost({ ...post, likes: data.likes });
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await fetch(`http://localhost:8000/api/posts/${id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author_name: newComment.name, content: newComment.text })
        });
        const data = await res.json();
        if (post) setPost({ ...post, comments: [data, ...post.comments] });
        setNewComment({ name: "", text: "" });
        setIsSubmitting(false);
    };

    if (!post) return <div className="pt-40 text-center text-blue-600 font-bold"><FaSpinner className="animate-spin inline mr-2"/> Chargement...</div>;

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <motion.img initial={{opacity:0}} animate={{opacity:1}} src={post.image} className="w-full h-[450px] object-cover rounded-[3rem] shadow-2xl mb-10" />
                
                <div className="flex items-center gap-4 mb-6">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">{post.category}</span>
                    <span className="text-gray-400 text-sm flex items-center gap-2"><FaCalendarAlt /> {new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">{post.title}</h1>
                
                <div className="prose prose-lg max-w-none text-gray-600 mb-16 leading-relaxed">
                    {post.content}
                </div>

                {/* INTERACTION BAR */}
                <div className="flex items-center gap-6 mb-12 py-8 border-y border-gray-200">
                    <button onClick={handleLike} className="flex items-center gap-2 text-red-500 font-black bg-white shadow-md px-6 py-3 rounded-2xl hover:scale-105 transition-all">
                        <FaHeart /> {post.likes}
                    </button>
                    <div className="flex items-center gap-2 text-blue-600 font-black bg-white shadow-md px-6 py-3 rounded-2xl">
                        <FaComment /> {post.comments.length}
                    </div>
                </div>

                {/* COMMENTS LIST */}
                <div className="space-y-6 mb-16">
                    <h3 className="text-2xl font-black text-slate-900 mb-8">Commentaires</h3>
                    <AnimatePresence>
                        {post.comments.map((c: any) => (
                            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold uppercase">{c.author_name.charAt(0)}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{c.author_name}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">{new Date(c.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{c.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* FORM */}
                <form onSubmit={handleComment} className="bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl text-white">
                    <h3 className="text-2xl font-black mb-8 text-center">Partager votre avis</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <input required placeholder="Votre nom" value={newComment.name} onChange={e => setNewComment({...newComment, name: e.target.value})} className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:border-blue-500 outline-none transition-all" />
                        <textarea required placeholder="Votre message..." value={newComment.text} onChange={e => setNewComment({...newComment, text: e.target.value})} rows={4} className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 focus:border-blue-500 outline-none transition-all resize-none" />
                        <button disabled={isSubmitting} className="bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                            {isSubmitting ? <FaSpinner className="animate-spin"/> : <FaPaperPlane />} Envoyer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default PostDetail;