import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHeart, FaComment, FaSpinner } from "react-icons/fa";

const Blog = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/posts")
            .then(res => res.json())
            .then(data => { setPosts(data); setLoading(false); });
    }, []);

    if (loading) return <div className="pt-40 text-center"><FaSpinner className="animate-spin inline text-blue-600" size={30}/></div>;

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <motion.article key={post.id} whileHover={{ y: -10 }} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                        <Link to={`/blog/${post.id}`}>
                            <img src={post.image} className="h-56 w-full object-cover" alt={post.title} />
                        </Link>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-3 uppercase">
                                <span>{post.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{post.title}</h3>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-gray-400 text-sm">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1"><FaHeart className="text-red-500"/> {post.likes}</span>
                                    <span className="flex items-center gap-1"><FaComment className="text-blue-500"/> {post.comments_count}</span>
                                </div>
                                <Link to={`/blog/${post.id}`} className="text-blue-600 font-bold">Lire plus →</Link>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
};
export default Blog;