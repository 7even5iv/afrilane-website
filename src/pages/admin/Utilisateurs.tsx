import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserPlus, FaUserShield, FaChalkboardTeacher, FaUserGraduate,
    FaEnvelope, FaCalendarAlt, FaSearch, FaFilter,
    FaEdit, FaTrash, FaUserCheck, FaUsers, FaUserClock, FaShieldAlt,
    FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import AddUserModal from './AddUserModal';

// Interfaces TypeScript
interface User {
    id: number;
    name: string;
    email: string;
    role: 'super-admin' | 'admin' | 'formateur' | 'secretaire' | 'etudiant';
    phone?: string;
    created_at: string;
}

interface StatBoxProps {
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
    bg: string;
}

interface UserCardProps {
    user: User;
    idx: number;
    isExpanded: boolean;
    onToggle: (id: number | null) => void;
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

interface RoleConfig {
    label: string;
    color: string;
    icon: React.ComponentType<any>;
    gradient: string;
}

const Utilisateurs = () => {
    // ÉTATS DES DONNÉES
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ÉTATS DE FILTRAGE & INTERFACE
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedUser, setExpandedUser] = useState<number | null>(null);
    
    const itemsPerPage = 8;

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // RÉCUPÉRATION DES DONNÉES
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8000/api/users", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (!res.ok) throw new Error("Accès refusé ou serveur injoignable");
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            setError("Impossible de charger les utilisateurs");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // SUPPRESSION D'UN UTILISATEUR
    const handleDelete = async (id: number) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce compte définitivement ?")) {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/users/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) fetchUsers();
                else alert("Erreur lors de la suppression");
            } catch (err) {
                alert("Erreur de connexion");
            }
        }
    };

    // MODIFICATION D'UN UTILISATEUR
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // LOGIQUE DE FILTRAGE
    const filteredUsers = users.filter((user: User) => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // PAGINATION
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // STATISTIQUES
    const stats = {
        total: users.length,
        admins: users.filter((u: User) => u.role === 'super-admin' || u.role === 'admin').length,
        formateurs: users.filter((u: User) => u.role === 'formateur').length,
        etudiants: users.filter((u: User) => u.role === 'etudiant').length,
        gestionnaires: users.filter((u: User) => u.role === 'secretaire').length,
        nouveaux: users.filter((u: User) => {
            const date = new Date(u.created_at);
            const now = new Date();
            return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        }).length
    };

    // CONFIGURATION DES BADGES PAR RÔLE
    const getRoleConfig = (role: string): RoleConfig => {
        switch (role) {
            case 'super-admin':
                return { label: 'Super Admin', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: FaShieldAlt, gradient: 'from-purple-600 to-purple-700' };
            case 'admin':
                return { label: 'Administrateur', color: 'bg-red-50 text-red-700 border-red-200', icon: FaUserShield, gradient: 'from-red-500 to-red-600' };
            case 'formateur':
                return { label: 'Formateur', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FaChalkboardTeacher, gradient: 'from-blue-500 to-blue-600' };
            case 'secretaire':
                return { label: 'Gestionnaire', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: FaUserCheck, gradient: 'from-amber-500 to-amber-600' };
            default:
                return { label: 'Étudiant', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FaUserGraduate, gradient: 'from-emerald-500 to-emerald-600' };
        }
    };

    // Gestionnaire d'expansion
    const handleToggleUser = (id: number | null) => {
        setExpandedUser(expandedUser === id ? null : id);
    };

    // Composant carte pour mobile
    const UserCard = ({ user, idx, isExpanded, onToggle, onEdit, onDelete }: UserCardProps) => {
        const config = getRoleConfig(user.role);
        const RoleIcon = config.icon;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} text-white flex items-center justify-center font-bold shadow-sm text-sm flex-shrink-0`}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                    <FaEnvelope size={10} /> {user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onToggle(isExpanded ? null : user.id)}
                            className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center flex-shrink-0 ml-2"
                        >
                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border ${config.color}`}>
                            <RoleIcon size={10} /> {config.label}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <FaCalendarAlt size={10} />
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </div>
                    </div>

                    {/* Détails expansibles */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 pt-3 border-t border-gray-100 space-y-2 overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-[10px] text-gray-500 mb-1">Informations supplémentaires</p>
                                    <p className="text-xs text-gray-600">
                                        {user.phone ? `📞 ${user.phone}` : 'Aucun téléphone renseigné'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onEdit(user)}
                                        className="flex-1 px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-1"
                                    >
                                        <FaEdit size={10} /> Modifier
                                    </button>
                                    <button 
                                        onClick={() => onDelete(user.id)}
                                        className="flex-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-1"
                                    >
                                        <FaTrash size={10} /> Supprimer
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <FaUsers className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement de l'annuaire...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaUsers className="text-red-500 text-2xl sm:text-3xl" />
            </div>
            <p className="text-red-600 font-medium mb-2 text-sm sm:text-base">Erreur de chargement</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 text-center">{error}</p>
            <button 
                onClick={fetchUsers}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm sm:text-base"
            >
                Réessayer
            </button>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6"
        >
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaUsers className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Utilisateurs & Privilèges
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Gérez les accès et les rôles de la plateforme
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    <StatBox label="Total" value={stats.total} icon={FaUsers} color="text-gray-800" bg="bg-gray-100" />
                    <StatBox label="Admins" value={stats.admins} icon={FaUserShield} color="text-red-600" bg="bg-red-50" />
                    <StatBox label="Formateurs" value={stats.formateurs} icon={FaChalkboardTeacher} color="text-blue-600" bg="bg-blue-50" />
                    <StatBox label="Étudiants" value={stats.etudiants} icon={FaUserGraduate} color="text-emerald-600" bg="bg-emerald-50" />
                    <StatBox label="Gestionnaires" value={stats.gestionnaires} icon={FaUserCheck} color="text-amber-600" bg="bg-amber-50" />
                    <StatBox label="Nouveaux" value={stats.nouveaux} icon={FaUserClock} color="text-purple-600" bg="bg-purple-50" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom ou email..." 
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            {isMobile && (
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
                                >
                                    <FaFilter size={14} />
                                    Filtres
                                </button>
                            )}
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm whitespace-nowrap"
                            >
                                <FaUserPlus size={14} /> Nouveau compte
                            </button>
                        </div>
                    </div>

                    {/* Panneau de filtres responsive */}
                    <AnimatePresence>
                        {(isFilterOpen || !isMobile) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-100 overflow-hidden"
                            >
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Rôle</label>
                                    <select 
                                        value={roleFilter}
                                        onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer"
                                    >
                                        <option value="all">Tous les rôles</option>
                                        <option value="super-admin">Super Admins</option>
                                        <option value="admin">Administrateurs</option>
                                        <option value="secretaire">Gestionnaires</option>
                                        <option value="formateur">Formateurs</option>
                                        <option value="etudiant">Étudiants</option>
                                    </select>
                                </div>
                                {isMobile && (
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="mt-3 w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                                    >
                                        Appliquer
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Résultats de recherche */}
                    {(searchTerm || roleFilter !== "all") && filteredUsers.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* VUE RESPONSIVE DES UTILISATEURS */}
                {currentUsers.length > 0 ? (
                    <>
                        {isMobile ? (
                            /* Version Mobile - Cartes */
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {currentUsers.map((user: User, idx: number) => (
                                        <UserCard 
                                            key={user.id} 
                                            user={user} 
                                            idx={idx}
                                            isExpanded={expandedUser === user.id}
                                            onToggle={handleToggleUser}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Version Tablette/Desktop - Tableau */
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle & Accès</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscription</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                              </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <AnimatePresence>
                                                {currentUsers.map((user: User, idx: number) => {
                                                    const config = getRoleConfig(user.role);
                                                    const RoleIcon = config.icon;
                                                    return (
                                                        <motion.tr 
                                                            key={user.id}
                                                            initial={{ opacity: 0, x: -10 }} 
                                                            animate={{ opacity: 1, x: 0 }} 
                                                            transition={{ delay: idx * 0.03 }}
                                                            className="group hover:bg-blue-50/30 transition-colors duration-200"
                                                        >
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <div className="flex items-center gap-2 md:gap-3">
                                                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${config.gradient} text-white flex items-center justify-center font-bold shadow-sm text-xs md:text-sm flex-shrink-0`}>
                                                                        {user.name?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900 text-xs md:text-sm">{user.name}</p>
                                                                        <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                                                                            <FaEnvelope size={10} /> {user.email}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[10px] md:text-xs font-medium border ${config.color}`}>
                                                                    <RoleIcon size={10} className="md:text-xs" /> {config.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gray-500">
                                                                    <FaCalendarAlt className="text-blue-400 text-[10px] md:text-xs" />
                                                                    {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                                                <div className="flex items-center justify-end gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={() => handleEdit(user)}
                                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                                                        title="Modifier"
                                                                    >
                                                                        <FaEdit size={12} className="md:text-sm" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDelete(user.id)}
                                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                                                        title="Supprimer"
                                                                    >
                                                                        <FaTrash size={12} className="md:text-sm" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* PAGINATION RESPONSIVE */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                    <span className="hidden sm:inline">Page </span>
                                    <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                                </div>
                                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-2 sm:px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all text-xs sm:text-sm flex items-center gap-1"
                                    >
                                        <FaArrowLeft size={10} />
                                        <span className="hidden sm:inline">Précédent</span>
                                    </button>
                                    <span className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-500 sm:hidden">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-2 sm:px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all text-xs sm:text-sm flex items-center gap-1"
                                    >
                                        <span className="hidden sm:inline">Suivant</span>
                                        <FaArrowRight size={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* État vide amélioré */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-16 text-center"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <FaUsers size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || roleFilter !== "all" ? "Aucun utilisateur trouvé" : "Aucun utilisateur enregistré"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {searchTerm || roleFilter !== "all" 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Commencez par ajouter un nouvel utilisateur"}
                            </p>
                            {(searchTerm || roleFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setRoleFilter("all");
                                    }}
                                    className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* BANNIÈRE D'INFORMATION RESPONSIVE */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FaShieldAlt className="text-blue-600 text-sm sm:text-base" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-semibold text-gray-800">Gestion des privilèges</p>
                                <p className="text-[10px] sm:text-xs text-gray-500">Les administrateurs ont tous les droits sur la plateforme</p>
                            </div>
                        </div>
                        <button className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 transition-colors">
                            Gérer les permissions →
                        </button>
                    </div>
                </div>
            </div>

            {/* MODALE D'AJOUT/MODIFICATION */}
            <AddUserModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onRefresh={fetchUsers}
                editData={selectedUser}
            />

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </motion.div>
    );
};

// COMPOSANT STATBOX RESPONSIVE
const StatBox = ({ label, value, icon: Icon, color, bg }: StatBoxProps) => (
    <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className={`text-base sm:text-xl font-bold ${color} mt-0.5`}>{value}</p>
            </div>
            <div className={`${bg} ${color} w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center`}>
                <Icon size={12} className="sm:text-lg" />
            </div>
        </div>
    </motion.div>
);

// Composants d'icônes manquants
const FaChevronDown = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size || 12} height={size || 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const FaChevronUp = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size || 12} height={size || 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

export default Utilisateurs;