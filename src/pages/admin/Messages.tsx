import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaEnvelope, FaTrash, FaEye, FaReply,
    FaSearch, FaTimes, FaPhone, FaCalendarAlt,
    FaArrowLeft, FaChevronDown, FaChevronUp,
    FaFilter, FaTag
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
    const [isMobile, setIsMobile] = useState(false);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [subjectFilter, setSubjectFilter] = useState("all");

    // Détection de la taille d'écran
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    // Sujets uniques pour le filtre
    const subjects = ["all", ...new Set(messages.map(m => m.subject).filter(Boolean))];

    // Filtrage des messages
    const filteredMessages = messages.filter((msg: Message) => {
        const matchesSearch = msg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = subjectFilter === "all" || msg.subject === subjectFilter;
        return matchesSearch && matchesSubject;
    });

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

    // Composant Carte Mobile
    const MessageCard = ({ message }: { message: Message }) => {
        const isExpanded = expandedCard === message.id;
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {message.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{message.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{message.email}</p>
                            {message.phone && (
                                <p className="text-xs text-blue-600 mt-0.5 truncate">{message.phone}</p>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => setExpandedCard(isExpanded ? null : message.id)} 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-all flex-shrink-0 ml-2"
                    >
                        {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </button>
                </div>

                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                        {message.subject}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt size={10} />
                        {new Date(message.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                        })}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {message.message}
                </p>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }} 
                            className="overflow-hidden"
                        >
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Message complet</p>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {message.message}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleViewMessage(message)} 
                                        className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-emerald-700 transition-all"
                                    >
                                        <FaEye size={12} /> Voir détail
                                    </button>
                                    <a 
                                        href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-700 transition-all"
                                    >
                                        <FaReply size={12} /> Répondre
                                    </a>
                                    {deleteConfirm === message.id ? (
                                        <div className="flex gap-1 flex-1">
                                            <button
                                                onClick={() => handleDelete(message.id)}
                                                className="flex-1 bg-red-600 text-white px-2 py-2 rounded-lg text-xs font-medium"
                                            >
                                                Confirmer
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="flex-1 bg-gray-300 text-gray-700 px-2 py-2 rounded-lg text-xs font-medium"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setDeleteConfirm(message.id)}
                                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-700 transition-all"
                                        >
                                            <FaTrash size={12} /> Supprimer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <FaEnvelope className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement des messages...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaEnvelope className="text-red-500 text-2xl sm:text-3xl" />
            </div>
            <p className="text-red-600 font-medium mb-2 text-sm sm:text-base">Erreur de chargement</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 text-center">{error}</p>
            <button 
                onClick={fetchMessages}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm"
            >
                Réessayer
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE AVEC FLÈCHE DE RETOUR RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <Link 
                        to="/admin/dashboard" 
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-3 sm:mb-4 group"
                    >
                        <FaArrowLeft className="text-xs sm:text-sm group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Retour au tableau de bord</span>
                    </Link>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FaEnvelope className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Messages reçus</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Gérez les messages du formulaire de contact
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total messages" value={stats.total} icon={FaEnvelope} color="from-blue-500 to-blue-600" />
                    <StatCard label="Non lus" value={stats.nonLus} icon={FaEye} color="from-red-500 to-red-600" />
                    <StatCard label="Avec téléphone" value={stats.avecTelephone} icon={FaPhone} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Ce mois-ci" value={stats.ceMois} icon={FaCalendarAlt} color="from-purple-500 to-purple-600" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher par nom, email, sujet ou message..." 
                                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {isMobile && (
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <FaFilter size={14} />
                                    <span>Filtrer</span>
                                </button>
                            )}
                        </div>

                        {/* Panneau de filtres responsive */}
                        <AnimatePresence>
                            {(isFilterOpen || (!isMobile && subjects.length > 1)) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex flex-col sm:flex-row gap-3 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="block text-xs text-gray-500 mb-1">Filtrer par sujet</label>
                                                <div className="relative">
                                                    <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                                    <select
                                                        className="w-full pl-9 pr-8 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none appearance-none cursor-pointer"
                                                        value={subjectFilter}
                                                        onChange={e => {
                                                            setSubjectFilter(e.target.value);
                                                            if (isMobile) setIsFilterOpen(false);
                                                        }}
                                                    >
                                                        <option value="all">Tous les sujets</option>
                                                        {subjects.filter(s => s !== "all").map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {(searchTerm || subjectFilter !== "all") && (
                                                <button
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        setSubjectFilter("all");
                                                    }}
                                                    className="px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium whitespace-nowrap"
                                                >
                                                    Réinitialiser
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Résultats de recherche */}
                        {searchTerm && filteredMessages.length > 0 && (
                            <div className="text-xs sm:text-sm text-gray-500 pt-2">
                                {filteredMessages.length} résultat{filteredMessages.length > 1 ? 's' : ''} trouvé{filteredMessages.length > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* LISTE DES MESSAGES - VERSION MOBILE/TABLETTE */}
                {isMobile ?  (
                    <div className="space-y-3 sm:space-y-4">
                        <AnimatePresence>
                            {filteredMessages.map((msg) => (
                                <MessageCard key={msg.id} message={msg} />
                            ))}
                        </AnimatePresence>
                        {filteredMessages.length === 0 && (
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-12 sm:p-16 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <FaEnvelope size={28} className="text-gray-400 sm:text-4xl" />
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm">
                                        {searchTerm || subjectFilter !== "all" ? "Aucun message trouvé" : "Aucun message reçu"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {searchTerm || subjectFilter !== "all" 
                                            ? "Essayez avec d'autres critères de recherche" 
                                            : "Les messages du formulaire de contact apparaîtront ici"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* TABLEAU DES MESSAGES - VERSION DESKTOP */
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1024px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/50">
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expéditeur</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sujet</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
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
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                                                            {msg.full_name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{msg.full_name}</p>
                                                            <p className="text-xs text-gray-500 truncate hidden sm:block">{msg.email}</p>
                                                            {msg.phone && (
                                                                <p className="text-xs text-blue-600 mt-0.5 truncate hidden sm:block">{msg.phone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
                                                        {msg.subject}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 max-w-xs">
                                                        {msg.message}
                                                    </p>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                                                        <FaCalendarAlt className="text-blue-400 text-[10px] sm:text-xs" />
                                                        {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                        <button 
                                                            onClick={() => handleViewMessage(msg)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                                                            title="Voir le message"
                                                        >
                                                            <FaEye size={12} />
                                                        </button>
                                                        <a 
                                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                                            title="Répondre"
                                                        >
                                                            <FaReply size={12} />
                                                        </a>
                                                        {deleteConfirm === msg.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleDelete(msg.id)}
                                                                    className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] sm:text-xs font-medium"
                                                                >
                                                                    Confirmer
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    className="px-2 py-1 rounded-lg bg-gray-300 text-gray-700 text-[10px] sm:text-xs font-medium"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => setDeleteConfirm(msg.id)}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                                                title="Supprimer"
                                                            >
                                                                <FaTrash size={12} />
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
                )}
            </div>

            {/* MODALE DE VISUALISATION RESPONSIVE */}
            <AnimatePresence>
                {showModal && selectedMessage && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden my-auto mx-3 sm:mx-4"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                <FaEnvelope className="text-white text-xs sm:text-sm" />
                                            </div>
                                            <h2 className="text-base sm:text-xl font-bold">Détail du message</h2>
                                        </div>
                                        <p className="text-white/80 text-[10px] sm:text-xs">Message de {selectedMessage.full_name}</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                {/* Informations expéditeur */}
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
                                        {selectedMessage.full_name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">{selectedMessage.full_name}</h3>
                                        <p className="text-xs text-gray-600 truncate">{selectedMessage.email}</p>
                                        {selectedMessage.phone && (
                                            <p className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
                                                <FaPhone size={10} /> {selectedMessage.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Sujet</label>
                                        <p className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 mt-1">
                                            {selectedMessage.subject}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Date d'envoi</label>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-1">
                                            <FaCalendarAlt size={12} />
                                            {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</label>
                                    <div className="mt-2 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-64 overflow-y-auto">
                                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm"
                                    >
                                        <FaReply size={14} /> Répondre
                                    </a>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-gray-50 transition-all text-sm"
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

// COMPOSANT STATCARD RESPONSIVE
const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
    <motion.div 
        whileHover={{ y: -3 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-[10px] sm:text-sm font-medium">{label}</p>
                <p className="text-base sm:text-2xl font-bold text-gray-800 mt-0.5 sm:mt-1">{value}</p>
            </div>
            <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md`}>
                <Icon size={14} />
            </div>
        </div>
    </motion.div>
);

export default Messages;