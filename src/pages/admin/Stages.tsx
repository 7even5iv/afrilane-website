import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPlus, FaSearch, FaBriefcase, FaBuilding, 
    FaUserTie,
    FaCalendarAlt, FaClock, FaCheckCircle,
    FaHourglassHalf, FaEdit, FaTrash,
    FaArrowLeft, FaArrowRight,
    FaFilter
} from 'react-icons/fa';
import AddInternshipModal from './AddInternshipModal';

// Interfaces TypeScript
interface User {
    id?: number;
    name: string;
}

interface Student {
    id: number;
    user: User;
    matricule: string;
}

interface Internship {
    id: number;
    company_name: string;
    supervisor_name: string;
    status: 'en_cours' | 'termine';
    start_date: string;
    end_date: string;
    description?: string;
    student?: Student;
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
}

interface InternshipCardProps {
    stage: Internship;
    idx: number;
    isMobile: boolean;
    isExpanded: boolean;
    onToggle: (id: number | null) => void;
    onEdit: (stage: Internship) => void;
    onDelete: (id: number) => void;
}

interface StatusConfig {
    label: string;
    color: string;
    icon: React.ComponentType<any>;
}

const Stages = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const itemsPerPage = 6;

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchInternships = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8000/api/internships", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (!res.ok) throw new Error("Erreur de chargement");
            const data = await res.json();
            setInternships(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger les stages");
            setInternships([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce stage ?")) {
            const token = localStorage.getItem("token");
            try {
                await fetch(`http://localhost:8000/api/internships/${id}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchInternships();
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    const handleEdit = (internship: Internship) => {
        setSelectedInternship(internship);
        setIsModalOpen(true);
    };

    useEffect(() => { fetchInternships(); }, []);

    // Filtrage
    const filteredInternships = internships.filter((i: Internship) => {
        const matchesSearch = i.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             i.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             i.supervisor_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || i.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredInternships.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);

    // Statistiques
    const stats = {
        total: internships.length,
        enCours: internships.filter((i: Internship) => i.status === 'en_cours').length,
        termine: internships.filter((i: Internship) => i.status === 'termine').length,
        entreprises: new Set(internships.map((i: Internship) => i.company_name)).size
    };

    const getStatusConfig = (status: string): StatusConfig => {
        switch(status) {
            case 'en_cours':
                return { label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FaHourglassHalf };
            case 'termine':
                return { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: FaCheckCircle };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FaClock };
        }
    };

    // Gestionnaire d'expansion
    const handleToggleCard = (id: number | null) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    // Composant carte pour mobile
    const InternshipCard = ({ stage, idx, isMobile: _isMobileProp, isExpanded, onToggle, onEdit, onDelete }: InternshipCardProps) => {
        const statusConfig = getStatusConfig(stage.status);
        const StatusIcon = statusConfig.icon;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
                <div className="p-4">
                    {/* En-tête */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                                <FaBuilding size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm truncate">
                                    {stage.company_name}
                                </h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <FaUserTie className="text-gray-400 text-[10px]" />
                                    <span className="text-[10px] text-gray-500 truncate">{stage.supervisor_name}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onToggle(isExpanded ? null : stage.id)}
                            className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center flex-shrink-0 ml-2"
                        >
                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                    </div>

                    {/* Statut */}
                    <div className="mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border ${statusConfig.color}`}>
                            <StatusIcon size={10} />
                            {statusConfig.label}
                        </span>
                    </div>

                    {/* Étudiant */}
                    <div className="mb-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                {stage.student?.user?.name?.charAt(0) || 'E'}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-800">
                                    {stage.student?.user?.name || 'Étudiant'}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                    Mat: {stage.student?.matricule || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2 mb-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400 text-[10px]" />
                            <div>
                                <p className="text-[9px] text-gray-400">Début</p>
                                <p className="text-[11px] font-medium text-gray-700">
                                    {new Date(stage.start_date).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400 text-[10px]" />
                            <div>
                                <p className="text-[9px] text-gray-400">Fin</p>
                                <p className="text-[11px] font-medium text-gray-700">
                                    {new Date(stage.end_date).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
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
                                    <p className="text-[10px] text-gray-500 mb-1">Description</p>
                                    <p className="text-xs text-gray-600">
                                        {stage.description || 'Aucune description disponible'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onEdit(stage)}
                                        className="flex-1 px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-1"
                                    >
                                        <FaEdit size={10} /> Modifier
                                    </button>
                                    <button 
                                        onClick={() => onDelete(stage.id)}
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
                <FaBriefcase className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement des stages...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaBriefcase className="text-red-500 text-2xl sm:text-3xl" />
            </div>
            <p className="text-red-600 font-medium mb-2 text-sm sm:text-base">Erreur de chargement</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 text-center">{error}</p>
            <button 
                onClick={fetchInternships}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm sm:text-base"
            >
                Réessayer
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaBriefcase className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Suivi des Stages
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Immersion professionnelle des étudiants d'AFRILANE
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total stages" value={stats.total} icon={FaBriefcase} color="from-blue-500 to-blue-600" />
                    <StatCard label="En cours" value={stats.enCours} icon={FaHourglassHalf} color="from-blue-500 to-blue-600" />
                    <StatCard label="Terminés" value={stats.termine} icon={FaCheckCircle} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Entreprises" value={stats.entreprises} icon={FaBuilding} color="from-purple-500 to-purple-600" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input
                                type="text" 
                                placeholder="Chercher entreprise, étudiant ou maître de stage..."
                                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                value={searchTerm}
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
                                <FaPlus size={14} /> Nouveau stage
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
                                    <label className="block text-xs text-gray-500 mb-1">Statut</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer"
                                    >
                                        <option value="all">Tous les statuts</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="termine">Terminé</option>
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
                    {(searchTerm || statusFilter !== "all") && filteredInternships.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredInternships.length} stage{filteredInternships.length > 1 ? 's' : ''} trouvé{filteredInternships.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* GRILLE RESPONSIVE DES STAGES */}
                {currentItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            <AnimatePresence>
                                {currentItems.map((stage: Internship, idx: number) => (
                                    isMobile ? (
                                        <InternshipCard 
                                            key={stage.id} 
                                            stage={stage} 
                                            idx={idx}
                                            isMobile={isMobile}
                                            isExpanded={expandedCard === stage.id}
                                            onToggle={handleToggleCard}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ) : (
                                        /* Version Tablette/Desktop - Carte complète */
                                        <motion.div
                                            key={stage.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        >
                                            <div className="p-4 sm:p-6">
                                                {/* En-tête */}
                                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                                                            <FaBuilding size={16} className="sm:text-xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                                                                {stage.company_name}
                                                            </h3>
                                                            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                                                                <FaUserTie className="text-gray-400 text-[10px] sm:text-xs" />
                                                                <span className="text-[10px] sm:text-xs text-gray-500">{stage.supervisor_name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {(() => {
                                                        const statusConfig = getStatusConfig(stage.status);
                                                        const StatusIcon = statusConfig.icon;
                                                        return (
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium border ${statusConfig.color}`}>
                                                                <StatusIcon size={10} />
                                                                {statusConfig.label}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>

                                                {/* Étudiant */}
                                                <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs sm:text-sm">
                                                            {stage.student?.user?.name?.charAt(0) || 'E'}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs sm:text-sm font-semibold text-gray-800">
                                                                {stage.student?.user?.name || 'Étudiant'}
                                                            </p>
                                                            <p className="text-[10px] sm:text-xs text-gray-500">
                                                                Matricule: {stage.student?.matricule || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dates */}
                                                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <FaCalendarAlt className="text-gray-400 text-[10px] sm:text-xs" />
                                                        <div>
                                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-400">
                                                                Début
                                                            </p>
                                                            <p className="text-[11px] sm:text-sm font-medium text-gray-700">
                                                                {new Date(stage.start_date).toLocaleDateString('fr-FR')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <FaCalendarAlt className="text-gray-400 text-[10px] sm:text-xs" />
                                                        <div>
                                                            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-400">
                                                                Fin
                                                            </p>
                                                            <p className="text-[11px] sm:text-sm font-medium text-gray-700">
                                                                {new Date(stage.end_date).toLocaleDateString('fr-FR')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100">
                                                    <button 
                                                        onClick={() => handleEdit(stage)}
                                                        className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-600 text-white text-[11px] sm:text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-1"
                                                    >
                                                        <FaEdit size={10} /> Modifier
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(stage.id)}
                                                        className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-red-200 text-red-600 text-[11px] sm:text-sm font-medium hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1"
                                                    >
                                                        <FaTrash size={10} /> Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                ))}
                            </AnimatePresence>
                        </div>

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
                                <FaBriefcase size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || statusFilter !== "all" ? "Aucun stage trouvé" : "Aucun stage enregistré"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {searchTerm || statusFilter !== "all" 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Commencez par ajouter un nouveau stage"}
                            </p>
                            {(searchTerm || statusFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                    }}
                                    className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* MODALE D'AJOUT/MODIFICATION */}
            <AddInternshipModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedInternship(null);
                }} 
                onRefresh={fetchInternships}
                editData={selectedInternship}
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
                <p className="text-base sm:text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md`}>
                <Icon size={12} className="sm:text-xl" />
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

export default Stages;