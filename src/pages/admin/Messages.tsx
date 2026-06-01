import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaEnvelope, FaTrash, FaEye, FaReply, 
    FaSearch, FaTimes,
    FaPhone, FaCalendarAlt,
    FaArrowLeft
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Interface pour un message
interface Message {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

// Interface pour StatCard
interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
}

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const fetchMessages = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/admin/messages", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (!res.ok) throw new Error("Erreur de chargement");
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger les messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/admin/messages/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchMessages();
                setDeleteConfirm(null);
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
        }
    };

    const handleViewMessage = (message: Message) => {
        setSelectedMessage(message);
        setShowModal(true);
    };

    const filteredMessages = messages.filter((msg: Message) => 
        msg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: messages.length,
        nonLus: messages.filter((m: Message) => !m.is_read).length,
        avecTelephone: messages.filter((m: Message) => m.phone).length,
        ceMois: messages.filter((m: Message) => {
            const date = new Date(m.created_at);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <FaEnvelope className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-xl" />
            </div>
            <p className="mt-6 text-gray-500 font-medium">Chargement des messages...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaEnvelope className="text-red-500 text-3xl" />
            </div>
            <p className="text-red-600 font-medium mb-2">Erreur de chargement</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button 
                onClick={fetchMessages}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
                Réessayer
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* EN-TÊTE AVEC FLÈCHE DE RETOUR */}
                <div className="mb-8">
                    {/* Bouton retour */}
                    <Link 
                        to="/admin/dashboard" 
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 group"
                    >
                        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Retour au tableau de bord</span>
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaEnvelope className="text-blue-600 text-xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Messages reçus</h1>
                    </div>
                    <p className="text-gray-500 ml-14">Gérez les messages du formulaire de contact</p>
                </div>

                {/* STATISTIQUES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total messages" value={stats.total} icon={FaEnvelope} color="from-blue-500 to-blue-600" />
                    <StatCard label="Non lus" value={stats.nonLus} icon={FaEye} color="from-red-500 to-red-600" />
                    <StatCard label="Avec téléphone" value={stats.avecTelephone} icon={FaPhone} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Ce mois-ci" value={stats.ceMois} icon={FaCalendarAlt} color="from-purple-500 to-purple-600" />
                </div>

                {/* BARRE DE RECHERCHE */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom, email, sujet ou message..." 
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* LISTE DES MESSAGES */}
                {filteredMessages.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expéditeur</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sujet</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <AnimatePresence>
                                        {filteredMessages.map((msg: Message, idx: number) => (
                                            <motion.tr 
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="group hover:bg-blue-50/30 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                                            {msg.full_name?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">{msg.full_name}</p>
                                                            <p className="text-xs text-gray-500">{msg.email}</p>
                                                            {msg.phone && (
                                                                <p className="text-xs text-blue-600 mt-0.5">{msg.phone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                                                        {msg.subject}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                                        {msg.message}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <FaCalendarAlt className="text-blue-400 text-xs" />
                                                        {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleViewMessage(msg)}
                                                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                                            title="Voir le message"
                                                        >
                                                            <FaEye size={14} />
                                                        </button>
                                                        <a 
                                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                                                            title="Répondre"
                                                        >
                                                            <FaReply size={14} />
                                                        </a>
                                                        {deleteConfirm === msg.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleDelete(msg.id)}
                                                                    className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-medium"
                                                                >
                                                                    Confirmer
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    className="px-2 py-1 rounded-lg bg-gray-300 text-gray-700 text-xs font-medium"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => setDeleteConfirm(msg.id)}
                                                                className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                                                title="Supprimer"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <FaEnvelope size={40} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                                {searchTerm ? "Aucun message trouvé" : "Aucun message reçu"}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                {searchTerm ? "Essayez avec d'autres critères de recherche" : "Les messages du formulaire de contact apparaîtront ici"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALE DE VISUALISATION */}
            <AnimatePresence>
                {showModal && selectedMessage && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                <FaEnvelope className="text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold">Détail du message</h2>
                                        </div>
                                        <p className="text-white/80 text-xs">Message de {selectedMessage.full_name}</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom complet</label>
                                        <p className="text-gray-800 font-medium mt-1">{selectedMessage.full_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                                        <p className="text-gray-800 font-medium mt-1">{selectedMessage.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Téléphone</label>
                                        <p className="text-gray-800 font-medium mt-1">{selectedMessage.phone || 'Non renseigné'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sujet</label>
                                        <p className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 mt-1">
                                            {selectedMessage.subject}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date d'envoi</label>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all"
                                    >
                                        <FaReply size={14} /> Répondre
                                    </a>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// COMPOSANT STATCARD
const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md`}>
                <Icon size={20} />
            </div>
        </div>
    </motion.div>
);

export default Messages;