import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBook, FaCheckDouble, FaTasks, 
    FaUserCheck, FaPlus, FaHistory, FaCalendarAlt,
    FaSearch, FaFilter, FaChalkboardTeacher, FaClock,
    FaCheckCircle, FaHourglassHalf, FaChartLine,
    FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import AddLogbookModal from './AddLogbookModal';

// Interfaces TypeScript
interface User {
    id?: number;
    name: string;
}

interface Teacher {
    id: number;
    user: User;
}

interface CourseModule {
    id: number;
    name: string;
}

interface Logbook {
    id: number;
    session_date: string;
    start_time: string;
    end_time: string;
    competencies: string;
    activities: string;
    is_validated: boolean;
    course_module?: CourseModule;
    teacher?: Teacher;
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
}

interface LogCardProps {
    log: Logbook;
    idx: number;
    isMobile: boolean;
    userRole: string | null;
    isExpanded: boolean;
    onToggle: (id: number | null) => void;
    onValidate: (id: number) => void;
}

const CahierTexte = () => {
    const [logs, setLogs] = useState<Logbook[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedLog, setExpandedLog] = useState<number | null>(null);
    
    const itemsPerPage = 5;
    const userRole = localStorage.getItem("user_role");
    const token = localStorage.getItem("token");

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/logbooks", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setLogs(data);
            }
        } catch (error) {
            console.error("Erreur chargement cahier de texte:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour valider pédagogiquement une séance (Admin seulement)
    const handleValidate = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8000/api/logbooks/${id}/validate`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchLogs();
            }
        } catch (error) {
            console.error("Erreur validation:", error);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    // Modules uniques pour le filtre
    const modules = ["all", ...new Set(logs.map((l: Logbook) => l.course_module?.name).filter(Boolean))];

    // Filtrage
    const filteredLogs = logs.filter((l: Logbook) => {
        const matchesSearch = l.course_module?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             l.teacher?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             l.competencies?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = selectedModule === "all" || l.course_module?.name === selectedModule;
        return matchesSearch && matchesModule;
    });

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredLogs.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    // Statistiques
    const stats = {
        total: logs.length,
        validees: logs.filter((l: Logbook) => l.is_validated).length,
        nonValidees: logs.filter((l: Logbook) => !l.is_validated).length,
        modules: new Set(logs.map((l: Logbook) => l.course_module?.name)).size
    };

    // Gestionnaire d'expansion
    const handleExpandToggle = (id: number | null) => {
        setExpandedLog(expandedLog === id ? null : id);
    };

    // Composant carte pour mobile
   const LogCard = ({ log, idx, isMobile: _isMobileProp, userRole: userRoleProp, isExpanded, onToggle, onValidate }: LogCardProps) => {
        const formattedDate = new Date(log.session_date);
        const day = formattedDate.getDate();
        const month = formattedDate.toLocaleDateString('fr-FR', { month: 'long' });
        const year = formattedDate.getFullYear();

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
                {/* En-tête avec date */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="text-center">
                            <span className="text-2xl font-bold">{day}</span>
                            <span className="text-xs uppercase ml-1">{month}</span>
                            <span className="text-[10px] text-blue-200 block">{year}</span>
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-bold truncate max-w-[200px]">
                                {log.course_module?.name || "Module inconnu"}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-blue-200 mt-1">
                                <FaChalkboardTeacher size={10} />
                                <span>{log.teacher?.user?.name || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-4">
                    {/* Info horaire */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaClock size={10} />
                            <span>{log.start_time || "N/A"} - {log.end_time || "N/A"}</span>
                        </div>
                        <div>
                            {log.is_validated ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-[9px] font-semibold">
                                    <FaCheckCircle size={10} /> Validée
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-[9px] font-semibold">
                                    <FaHourglassHalf size={10} /> En attente
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Aperçu des compétences */}
                    <div className="space-y-2">
                        <button
                            onClick={() => onToggle(isExpanded ? null : log.id)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Compétences & Activités
                            </span>
                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                        
                        {!isExpanded && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {log.competencies?.substring(0, 100)}...
                            </p>
                        )}
                    </div>

                    {/* Détails expansibles */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 space-y-3 overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                        <FaCheckDouble className="text-blue-500" /> Compétences enseignées
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {log.competencies}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                        <FaTasks className="text-blue-500" /> Activités de séance
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {log.activities}
                                    </p>
                                </div>
                                
                                {/* Bouton validation pour admin */}
                                {!log.is_validated && (userRoleProp === 'super-admin' || userRoleProp === 'admin') && (
                                    <button 
                                        onClick={() => onValidate(log.id)}
                                        className="w-full flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                                    >
                                        <FaUserCheck size={12} /> Valider pédagogiquement
                                    </button>
                                )}
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
                <FaBook className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement du journal pédagogique...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaBook className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Cahier de Texte
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Suivi de la progression des cours AFRILANE
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total séances" value={stats.total} icon={FaCalendarAlt} color="from-blue-500 to-blue-600" />
                    <StatCard label="Séances validées" value={stats.validees} icon={FaCheckCircle} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="En attente" value={stats.nonValidees} icon={FaHourglassHalf} color="from-amber-500 to-amber-600" />
                    <StatCard label="Modules" value={stats.modules} icon={FaChartLine} color="from-purple-500 to-purple-600" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input 
                                type="text" 
                                placeholder="Rechercher par module, formateur ou compétence..." 
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
                            {(userRole === 'formateur') && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm whitespace-nowrap"
                                >
                                    <FaPlus size={14} /> Nouvelle séance
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Panneau de filtres responsive */}
                    <AnimatePresence>
                        {(isFilterOpen || !isMobile) && modules.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-100 overflow-hidden"
                            >
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Module</label>
                                    <select 
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                        onChange={(e) => { setSelectedModule(e.target.value); setCurrentPage(1); }}
                                        value={selectedModule}
                                    >
                                        <option value="all">Tous les modules</option>
                                       {(modules as string[]).filter((m: string) => m !== "all").map((m: string) => (
                                        <option key={m} value={m}>{m}</option>
                                        ))}
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
                    {(searchTerm || selectedModule !== "all") && filteredLogs.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredLogs.length} séance{filteredLogs.length > 1 ? 's' : ''} trouvée{filteredLogs.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* LISTE RESPONSIVE DES SÉANCES */}
                {currentItems.length > 0 ? (
                    <>
                        <div className="space-y-3 sm:space-y-4">
                            <AnimatePresence>
                                {currentItems.map((log: Logbook, idx: number) => (
                                    isMobile ? (
                                        <LogCard 
                                            key={log.id} 
                                            log={log} 
                                            idx={idx}
                                            isMobile={isMobile}
                                            userRole={userRole}
                                            isExpanded={expandedLog === log.id}
                                            onToggle={handleExpandToggle}
                                            onValidate={handleValidate}
                                        />
                                    ) : (
                                        /* Version Tablette/Desktop - Carte horizontale */
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ y: -2 }}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* Date stylisée à gauche */}
                                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 md:p-6 md:w-44 flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 md:gap-0 md:text-center">
                                                    <div className="flex md:flex-col items-center gap-2 md:gap-0">
                                                        <span className="text-2xl md:text-3xl font-bold">{new Date(log.session_date).getDate()}</span>
                                                        <span className="text-xs uppercase font-semibold tracking-wider text-blue-200">
                                                            {new Date(log.session_date).toLocaleDateString('fr-FR', { month: 'long' })}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-blue-300 font-medium">{new Date(log.session_date).getFullYear()}</span>
                                                </div>

                                                {/* Contenu principal */}
                                                <div className="p-4 md:p-6 flex-1">
                                                    <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                                                        <div className="flex-1">
                                                            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                                                {log.course_module?.name || "Module inconnu"}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <FaChalkboardTeacher size={12} />
                                                                    {log.teacher?.user?.name || "N/A"}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <FaClock size={12} />
                                                                    {log.start_time || "N/A"} - {log.end_time || "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Logique de validation pédagogique */}
                                                        <div>
                                                            {log.is_validated ? (
                                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-semibold border border-emerald-200 whitespace-nowrap">
                                                                    <FaCheckCircle size={12} /> Séance validée
                                                                </div>
                                                            ) : (
                                                                (userRole === 'super-admin' || userRole === 'admin') ? (
                                                                    <button 
                                                                        onClick={() => handleValidate(log.id)}
                                                                        className="flex items-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-semibold border border-blue-200 transition-all active:scale-95 whitespace-nowrap"
                                                                    >
                                                                        <FaUserCheck size={12} /> Valider
                                                                    </button>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-semibold border border-gray-200 whitespace-nowrap">
                                                                        <FaHourglassHalf size={12} /> En attente
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Compétences et Activités */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                                        <div className="space-y-2">
                                                            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                <FaCheckDouble className="text-blue-500" /> Compétences enseignées
                                                            </h4>
                                                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100 line-clamp-3">
                                                                {log.competencies}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                <FaTasks className="text-blue-500" /> Activités de séance
                                                            </h4>
                                                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100 line-clamp-3">
                                                                {log.activities}
                                                            </p>
                                                        </div>
                                                    </div>
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
                                    <span className="hidden sm:inline">Affichage de </span>
                                    <span className="font-medium">{indexOfFirst + 1}</span> -{" "}
                                    <span className="font-medium">
                                        {Math.min(indexOfLast, filteredLogs.length)}
                                    </span>{" "}
                                    sur <span className="font-medium">{filteredLogs.length}</span>
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
                                    
                                    <span className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-500">
                                        Page {currentPage} / {totalPages}
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
                                <FaCalendarAlt size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || selectedModule !== "all" ? "Aucune séance trouvée" : "Aucune séance enregistrée"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md text-center">
                                {searchTerm || selectedModule !== "all" 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Les séances saisies par les formateurs apparaîtront ici"}
                            </p>
                            {(searchTerm || selectedModule !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedModule("all");
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
                            <FaHistory className="text-blue-600 text-sm sm:text-base" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">À propos du cahier de texte</h3>
                            <p className="text-[11px] sm:text-xs text-gray-600">
                                Le cahier de texte permet aux formateurs de consigner les compétences enseignées et les activités réalisées lors de chaque séance. 
                                Les administrateurs peuvent valider pédagogiquement les séances pour garantir la conformité du programme.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE DE SAISIE */}
            <AddLogbookModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchLogs} 
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
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
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

export default CahierTexte;