import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus, FaTrash, FaBook, FaSearch,
    FaEdit, FaMoneyBillWave, FaTag, FaEye, FaTimes,
    FaArrowLeft, FaArrowRight, FaInfoCircle,
    FaClock, FaFilter, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import AddTrainingModal from './AddTrainingModal';
import { useAuth } from '../../components/auth/AuthContext';

// Interfaces TypeScript
interface Training {
    id: string;
    name: string;
    code: string;
    category: string;
    duration_months: number;
    price: number;
    description?: string;
    status?: string;
    created_at?: string;
}

const FormationsAdmin = () => {
    const { role: userRole } = useAuth();

    // ÉTATS DE DONNÉES
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ÉTATS D'INTERFACE
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
    const [previewTraining, setPreviewTraining] = useState<Training | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [trainingsPerPage, setTrainingsPerPage] = useState(6);

    // Détection de la taille d'écran
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            const tablet = width >= 768 && width < 1024;
            setIsMobile(mobile);
            setIsTablet(tablet);

            // Ajuster le nombre d'éléments par page
            if (mobile) setTrainingsPerPage(4);
            else if (tablet) setTrainingsPerPage(5);
            else setTrainingsPerPage(6);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // RÉCUPÉRATION DES DONNÉES
    const fetchTrainings = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8000/api/trainings", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (!res.ok) throw new Error(`Erreur ${res.status}`);
            const data = await res.json();
            setTrainings(Array.isArray(data) ? data : []);
        } catch (error) {
            setError("Impossible de charger les formations");
            setTrainings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTrainings(); }, []);

    // SUPPRESSION
    const handleDelete = async (id: string) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.")) {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/trainings/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) fetchTrainings();
                else alert("Erreur lors de la suppression");
            } catch (error) {
                alert("Erreur de connexion");
            }
        }
    };

    const handleEdit = (training: Training) => {
        setSelectedTraining(training);
        setIsModalOpen(true);
    };

    const handlePreview = (training: Training) => {
        setPreviewTraining(training);
        setIsPreviewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTraining(null);
    };

    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewTraining(null);
    };

    // FILTRAGE
    const categories = ["all", ...new Set(trainings.map(t => t.category).filter(Boolean))];

    const filteredTrainings = trainings.filter(t =>
        t?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t?.code?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(t => categoryFilter === "all" || t.category === categoryFilter);

    // PAGINATION
    const indexOfLast = currentPage * trainingsPerPage;
    const indexOfFirst = indexOfLast - trainingsPerPage;
    const currentTrainings = filteredTrainings.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredTrainings.length / trainingsPerPage);

    // STATISTIQUES
    const stats = {
        total: trainings.length,
        avgPrice: trainings.reduce((acc, t) => acc + (Number(t.price) || 0), 0) / (trainings.length || 1),
        categories: categories.length - 1,
        totalDuration: trainings.reduce((acc, t) => acc + (t.duration_months || 0), 0)
    };

    // Composant de pagination réutilisable
    const Pagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 order-2 sm:order-1">
                        Affichage de {indexOfFirst + 1} à {Math.min(indexOfLast, filteredTrainings.length)} sur {filteredTrainings.length} formation(s)
                    </div>
                    <div className="flex gap-2 order-1 sm:order-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-1"
                        >
                            <FaArrowLeft size={12} /> Précédent
                        </button>

                        {/* Numéros de page pour desktop */}
                        <div className="hidden sm:flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                if (pageNum < 1 || pageNum > totalPages) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`min-w-[36px] px-3 py-2 rounded-lg text-sm transition-all ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Indicateur de page pour mobile */}
                        <span className="px-3 py-2 text-sm text-gray-600 sm:hidden">
                            Page {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-1"
                        >
                            Suivant <FaArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Composant Carte Mobile/Tablette
    const TrainingCard = ({ training }: { training: Training }) => {
        const isExpanded = expandedCard === training.id;
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {training.code?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{training.name}</p>
                            <code className="text-[10px] text-blue-600 font-mono block truncate">{training.code}</code>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpandedCard(isExpanded ? null : training.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-all flex-shrink-0 ml-2"
                    >
                        {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </button>
                </div>

                <div className="mt-3 flex justify-between items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                        {training.category || 'Non catégorisé'}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">{training.price.toLocaleString()} FCFA</span>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Durée:</span>
                                    <span className="font-medium text-gray-800">{training.duration_months} mois</span>
                                </div>
                                {training.description && (
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <p className="text-xs text-gray-600 line-clamp-2">{training.description}</p>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => handlePreview(training)}
                                        className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-emerald-700 transition-all"
                                    >
                                        <FaEye size={12} /> Voir
                                    </button>
                                    {(userRole === 'super-admin' || userRole === 'admin') && (
                                        <button
                                            onClick={() => handleEdit(training)}
                                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-700 transition-all"
                                        >
                                            <FaEdit size={12} /> Modifier
                                        </button>
                                    )}
                                    {userRole === 'super-admin' && (
                                        <button
                                            onClick={() => handleDelete(training.id)}
                                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-700 transition-all"
                                        >
                                            <FaTrash size={12} /> Suppr.
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
                <FaBook className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement du catalogue...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaBook className="text-red-500 text-2xl sm:text-3xl" />
            </div>
            <p className="text-red-600 font-medium mb-2 text-sm sm:text-base">Erreur de chargement</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 text-center">{error}</p>
            <button
                onClick={fetchTrainings}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm"
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
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FaBook className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Gestion des Formations</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Catalogue des formations professionnelles AFRILANE
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total formations" value={stats.total} icon={FaBook} color="from-blue-500 to-blue-600" />
                    <StatCard label="Prix moyen" value={`${Math.round(stats.avgPrice).toLocaleString()} FCFA`} icon={FaMoneyBillWave} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Catégories" value={stats.categories} icon={FaTag} color="from-purple-500 to-purple-600" />
                    <StatCard label="Total heures" value={stats.totalDuration} icon={FaClock} color="from-amber-500 to-amber-600" suffix=" mois" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou code..."
                                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    value={searchTerm}
                                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <div className="flex gap-2">
                                {isMobile && (
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
                                    >
                                        <FaFilter size={14} />
                                        <span className="hidden sm:inline">Filtres</span>
                                    </button>
                                )}
                                {(userRole === 'super-admin' || userRole === 'admin') && (
                                    <button
                                        onClick={() => { setSelectedTraining(null); setIsModalOpen(true); }}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 hover:shadow-md transition-all text-sm whitespace-nowrap"
                                    >
                                        <FaPlus size={14} />
                                        <span className="hidden sm:inline">Nouvelle formation</span>
                                        <span className="inline sm:hidden">Ajouter</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Panneau de filtres responsive */}
                        <AnimatePresence>
                            {(isFilterOpen || (!isMobile && categories.length > 1)) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="relative w-full">
                                            <FaFilter className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                                            <select
                                                className="w-full pl-9 sm:pl-11 pr-8 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none cursor-pointer"
                                                value={categoryFilter}
                                                onChange={e => {
                                                    setCategoryFilter(e.target.value);
                                                    setCurrentPage(1);
                                                    if (isMobile) setIsFilterOpen(false);
                                                }}
                                            >
                                                <option value="all">Toutes les catégories</option>
                                                {categories.filter(c => c !== "all").map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Résultats de recherche */}
                        {searchTerm && filteredTrainings.length > 0 && (
                            <div className="text-xs sm:text-sm text-gray-500">
                                {filteredTrainings.length} résultat{filteredTrainings.length > 1 ? 's' : ''} trouvé{filteredTrainings.length > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* GRILLE DES FORMATIONS - VERSION MOBILE/TABLETTE AVEC PAGINATION */}
                {(isMobile || isTablet) ? (
                    <>
                        <div className="space-y-3 sm:space-y-4">
                            <AnimatePresence>
                                {currentTrainings.map(training => (
                                    <TrainingCard key={training.id} training={training} />
                                ))}
                            </AnimatePresence>
                            {currentTrainings.length === 0 && (
                                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-12 sm:p-16 text-center">
                                    <FaBook className="text-gray-200 text-3xl sm:text-4xl mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm">Aucune formation trouvée</p>
                                </div>
                            )}
                        </div>
                        {/* PAGINATION POUR MOBILE ET TABLETTE */}
                        <Pagination />
                    </>
                ) : (
                    /* TABLEAU DESCRIPTIF - VERSION DESKTOP AVEC PAGINATION */
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[768px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/50">
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Formation</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Durée</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <AnimatePresence>
                                        {currentTrainings.map((t, idx) => (
                                            <motion.tr
                                                key={t.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-blue-50/30 transition-colors duration-200"
                                            >
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-sm text-xs sm:text-sm flex-shrink-0">
                                                            {t.code?.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{t.name}</p>
                                                            <p className="text-xs text-gray-500 truncate hidden sm:block">{t.code}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <code className="text-xs sm:text-sm font-mono text-blue-700 bg-blue-50 px-1.5 sm:px-2 py-1 rounded-md whitespace-nowrap">
                                                        {t.code}
                                                    </code>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
                                                        {t.category || 'Non catégorisé'}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-center">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t.duration_months} mois</span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-right">
                                                    <span className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">{t.price.toLocaleString()} FCFA</span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                        <button
                                                            onClick={() => handlePreview(t)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                                                            title="Aperçu"
                                                        >
                                                            <FaEye size={12} />
                                                        </button>
                                                        {(userRole === 'super-admin' || userRole === 'admin') && (
                                                            <button
                                                                onClick={() => handleEdit(t)}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                                                title="Modifier"
                                                            >
                                                                <FaEdit size={12} />
                                                            </button>
                                                        )}
                                                        {userRole === 'super-admin' && (
                                                            <button
                                                                onClick={() => handleDelete(t.id)}
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

                        {/* PAGINATION POUR DESKTOP */}
                        <div className="border-t border-gray-200">
                            <Pagination />
                        </div>
                    </div>
                )}

                {/* MODALE D'AJOUT/MODIFICATION */}
                <AddTrainingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onRefresh={fetchTrainings}
                    editData={selectedTraining}
                />

                {/* MODALE D'APERÇU RESPONSIVE */}
                <AnimatePresence>
                    {isPreviewModalOpen && previewTraining && (
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white w-full max-w-xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden my-auto mx-3 sm:mx-4"
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                    <FaBook className="text-white text-xs sm:text-sm" />
                                                </div>
                                                <h2 className="text-base sm:text-xl font-bold">Détails de la formation</h2>
                                            </div>
                                            <p className="text-white/80 text-[10px] sm:text-xs">Fiche technique de la formation</p>
                                        </div>
                                        <button
                                            onClick={handleClosePreviewModal}
                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                    {/* En-tête responsive */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md flex-shrink-0 self-center sm:self-auto">
                                            {previewTraining.code?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h3 className="text-base sm:text-xl font-bold text-gray-800">{previewTraining.name}</h3>
                                            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                                                {previewTraining.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Informations détaillées responsives */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl text-center">
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Durée</p>
                                            <p className="font-bold text-gray-800 text-base sm:text-lg">{previewTraining.duration_months} mois</p>
                                        </div>
                                        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl text-center">
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Prix</p>
                                            <p className="font-bold text-emerald-600 text-base sm:text-lg">{previewTraining.price.toLocaleString()} FCFA</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {previewTraining.description && (
                                        <div className="bg-gray-800 rounded-xl p-4 sm:p-5">
                                            <h4 className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                                                <FaInfoCircle size={12} /> Description du programme
                                            </h4>
                                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                                {previewTraining.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Bouton fermer */}
                                    <button
                                        onClick={handleClosePreviewModal}
                                        className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-gray-200 transition-all text-sm"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// COMPOSANT STATCARD RESPONSIVE
const StatCard = ({ label, value, icon: Icon, color, suffix = "" }: any) => (
    <motion.div
        whileHover={{ y: -3 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-[10px] sm:text-sm font-medium">{label}</p>
                <p className="text-base sm:text-2xl font-bold text-gray-800 mt-0.5 sm:mt-1">{value}{suffix}</p>
            </div>
            <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md`}>
                <Icon size={14} />
            </div>
        </div>
    </motion.div>
);

export default FormationsAdmin;