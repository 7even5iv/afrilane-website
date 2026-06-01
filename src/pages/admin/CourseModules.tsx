import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPlus, FaBookOpen, FaClock, FaPercentage, FaTrash,
    FaEdit, FaSearch, FaFilter, FaUniversity,
    FaCheckCircle, FaGraduationCap, FaArrowLeft, FaArrowRight,
    FaEllipsisV, FaTimes, FaInfoCircle, FaEye, FaTag, FaUserGraduate
} from 'react-icons/fa';
import AddModuleModal from './AddModuleModal';

// Interfaces TypeScript
interface Training {
    id?: number;
    name: string;
    code: string;
}

interface CourseModule {
    id: number;
    name: string;
    training?: Training;
    description?: string;
    hours?: number;
    coefficient?: number;
    prerequisites?: string;
    objectives?: string;
    program?: string;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    suffix?: string;
}

interface ModuleCardProps {
    module: CourseModule;
    index: number;
    onPreview: (module: CourseModule) => void;
    onEdit: (module: CourseModule) => void;
    onDelete: (id: number) => void;
    onExpandToggle: (id: number | null) => void;
    expandedId: number | null;
}

const CourseModules = () => {
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTraining, setSelectedTraining] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
    const [previewModule, setPreviewModule] = useState<CourseModule | null>(null);
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

    const fetchModules = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/course-modules", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setModules(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur:", error);
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchModules(); }, []);

    // Formations uniques pour le filtre
    const trainings = ["all", ...new Set(modules.map((m: CourseModule) => m.training?.name).filter(Boolean))];

    // Filtrage
    const filteredModules = modules.filter((m: CourseModule) => {
        const matchesSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             m.training?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             m.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTraining = selectedTraining === "all" || m.training?.name === selectedTraining;
        return matchesSearch && matchesTraining;
    });

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredModules.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

    // Statistiques
    const stats = {
        total: modules.length,
        totalHours: modules.reduce((acc: number, m: CourseModule) => acc + (m.hours || 0), 0),
        avgCoefficient: (modules.reduce((acc: number, m: CourseModule) => acc + (m.coefficient || 0), 0) / (modules.length || 1)).toFixed(1),
        trainings: new Set(modules.map((m: CourseModule) => m.training?.name)).size
    };

    // Fonction d'aperçu
    const handlePreview = (module: CourseModule) => {
        setPreviewModule(module);
        setIsPreviewModalOpen(true);
    };

    // Fermeture de la modale d'aperçu
    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewModule(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce module ?")) {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/course-modules/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    fetchModules();
                    setIsPreviewModalOpen(false);
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    const handleEdit = (module: CourseModule) => {
        setSelectedModule(module);
        setIsModalOpen(true);
        setIsPreviewModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedModule(null);
    };

    const handleExpandToggle = (id: number | null) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    // Composant carte pour mobile
    const ModuleCard = ({ module, index, onPreview, onEdit, onDelete, onExpandToggle, expandedId }: ModuleCardProps) => {
        const isExpanded = expandedId === module.id;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
                <div className="p-4 sm:p-5">
                    {/* En-tête */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                                <FaBookOpen size={16} className="sm:text-xl" />
                            </div>
                            <div>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase">
                                    {module.training?.code || 'UE'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onPreview(module)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                                title="Aperçu"
                            >
                                <FaEye size={12} />
                            </button>
                            <button
                                onClick={() => onEdit(module)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                title="Modifier"
                            >
                                <FaEdit size={12} />
                            </button>
                            <button
                                onClick={() => onExpandToggle(isExpanded ? null : module.id)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center"
                            >
                                <FaEllipsisV size={12} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Titre et description */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {module.name}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3 line-clamp-2">
                        {module.description || 'Aucune description disponible.'}
                    </p>

                    {/* Informations */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FaClock className="text-blue-500 text-xs" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400">Heures</p>
                                <span className="text-sm font-semibold text-gray-700">{module.hours || 0}h</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <FaPercentage className="text-emerald-500 text-xs" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400">Coefficient</p>
                                <span className="text-sm font-semibold text-gray-700">{module.coefficient || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions expansibles */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 pt-3 border-t border-gray-100 space-y-2 overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Formation associée</p>
                                    <p className="text-sm font-medium text-gray-800">{module.training?.name || 'Non assigné'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onDelete(module.id)}
                                        className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaTrash size={12} /> Supprimer
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
                <FaBookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement des unités d'enseignement...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaBookOpen className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Unités d'Enseignement
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Gestion des programmes et coefficients
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total modules" value={stats.total} icon={FaBookOpen} color="from-blue-500 to-blue-600" />
                    <StatCard label="Heures totales" value={stats.totalHours} icon={FaClock} color="from-emerald-500 to-emerald-600" suffix="h" />
                    <StatCard label="Coeff. moyen" value={stats.avgCoefficient} icon={FaPercentage} color="from-purple-500 to-purple-600" />
                    <StatCard label="Formations" value={stats.trainings} icon={FaUniversity} color="from-amber-500 to-amber-600" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom, formation ou description..." 
                                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                                <FaPlus size={14} /> Nouveau module
                            </button>
                        </div>
                    </div>

                    {/* Panneau de filtres responsive */}
                    <AnimatePresence>
                        {(isFilterOpen || !isMobile) && trainings.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 overflow-hidden"
                            >
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">Formation</label>
                                    <select 
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                        onChange={(e) => { setSelectedTraining(e.target.value); setCurrentPage(1); }}
                                        value={selectedTraining}
                                    >
                                        <option value="all">Toutes les formations</option>
                                        {(trainings as string[]).filter((t: string) => t !== "all").map((t: string) => (
                                        <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                {isMobile && (
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                                    >
                                        Appliquer
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Résultats de recherche */}
                    {(searchTerm || selectedTraining !== "all") && filteredModules.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredModules.length} module{filteredModules.length > 1 ? 's' : ''} trouvé{filteredModules.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* GRILLE RESPONSIVE DES MODULES */}
                {currentItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            <AnimatePresence>
                                {currentItems.map((module: CourseModule, idx: number) => (
                                    <ModuleCard 
                                        key={module.id} 
                                        module={module} 
                                        index={idx}
                                        onPreview={handlePreview}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onExpandToggle={handleExpandToggle}
                                        expandedId={expandedCard}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* PAGINATION RESPONSIVE */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                    <span className="hidden sm:inline">Affichage de </span>
                                    <span className="font-medium">{indexOfFirst + 1}</span> -{" "}
                                    <span className="font-medium">
                                        {Math.min(indexOfLast, filteredModules.length)}
                                    </span>{" "}
                                    sur <span className="font-medium">{filteredModules.length}</span>
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
                                    
                                    {Array.from({ length: Math.min(totalPages, isMobile ? 3 : 5) }, (_, i) => {
                                        let pageNum: number;
                                        const maxVisible = isMobile ? 3 : 5;
                                        if (totalPages <= maxVisible) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= (isMobile ? 2 : 3)) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - (isMobile ? 1 : 2)) {
                                            pageNum = totalPages - maxVisible + i + 1;
                                        } else {
                                            pageNum = currentPage - (isMobile ? 1 : 2) + i;
                                        }
                                        
                                        if (pageNum < 1 || pageNum > totalPages) return null;
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`min-w-[32px] sm:min-w-[36px] px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${currentPage === pageNum
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    
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
                                <FaBookOpen size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || selectedTraining !== "all" ? "Aucun module trouvé" : "Aucun module enregistré"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {searchTerm || selectedTraining !== "all" 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Commencez par ajouter un nouveau module"}
                            </p>
                            {(searchTerm || selectedTraining !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedTraining("all");
                                    }}
                                    className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* NOTE D'INFORMATION RESPONSIVE */}
                <div className="bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-5">
                    <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FaGraduationCap className="text-blue-600 text-sm sm:text-base" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">À propos des modules</h3>
                            <p className="text-[11px] sm:text-xs text-gray-600">
                                Les unités d'enseignement (UE) sont rattachées à une formation spécifique. 
                                Chaque module possède un coefficient qui détermine son poids dans le calcul de la moyenne générale.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE D'AJOUT/MODIFICATION */}
            <AddModuleModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onRefresh={fetchModules}
                editData={selectedModule}
            />

            {/* MODALE D'APERÇU - SANS BOUTONS MODIFIER ET SUPPRIMER */}
            <AnimatePresence>
                {isPreviewModalOpen && previewModule && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* En-tête */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center">
                                        <FaEye size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Aperçu du module</h2>
                                        <p className="text-sm text-gray-500">Informations complètes</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClosePreviewModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            {/* Contenu */}
                            <div className="p-6 space-y-6">
                                {/* En-tête avec icône et infos principales */}
                                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6">
                                    <div className="flex items-start gap-4 flex-wrap">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
                                            <FaBookOpen size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-800">{previewModule.name}</h3>
                                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    <FaTag className="mr-1 text-xs" />
                                                    {previewModule.training?.code || 'UE'}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    <FaCheckCircle className="mr-1 text-xs" />
                                                    Actif
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        <FaInfoCircle className="text-blue-500" />
                                        Description
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {previewModule.description || 'Aucune description disponible pour ce module.'}
                                    </p>
                                </div>

                                {/* Informations détaillées */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <FaClock className="text-blue-500" />
                                            Détails pédagogiques
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Volume horaire</p>
                                                <p className="text-sm font-semibold text-gray-800">{previewModule.hours || 0} heures</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Coefficient</p>
                                                <p className="text-sm font-semibold text-gray-800">{previewModule.coefficient || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <FaUniversity className="text-blue-500" />
                                            Formation associée
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Nom de la formation</p>
                                                <p className="text-sm font-medium text-gray-800">{previewModule.training?.name || 'Non assigné'}</p>
                                            </div>
                                            {previewModule.training?.code && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Code formation</p>
                                                    <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {previewModule.training.code}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Prérequis */}
                                {previewModule.prerequisites && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                            <FaGraduationCap className="text-blue-500" />
                                            Prérequis
                                        </h4>
                                        <p className="text-sm text-gray-600">{previewModule.prerequisites}</p>
                                    </div>
                                )}

                                {/* Objectifs */}
                                {previewModule.objectives && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                            <FaUserGraduate className="text-blue-500" />
                                            Objectifs d'apprentissage
                                        </h4>
                                        <p className="text-sm text-gray-600">{previewModule.objectives}</p>
                                    </div>
                                )}

                                {/* Programme détaillé */}
                                {previewModule.program && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                            <FaBookOpen className="text-blue-500" />
                                            Programme détaillé
                                        </h4>
                                        <div className="text-sm text-gray-600 whitespace-pre-wrap">{previewModule.program}</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

// COMPOSANT STATCARD RESPONSIVE
const StatCard = ({ label, value, icon: Icon, color, suffix = "" }: StatCardProps) => (
    <motion.div 
        whileHover={{ y: -3 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-[10px] sm:text-sm font-medium">{label}</p>
                <p className="text-base sm:text-2xl font-bold text-gray-800 mt-1">{value}{suffix}</p>
            </div>
            <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md`}>
                <Icon size={12} className="sm:text-xl" />
            </div>
        </div>
    </motion.div>
);

export default CourseModules;