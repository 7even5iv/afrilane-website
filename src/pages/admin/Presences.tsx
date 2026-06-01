import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaCalendarCheck, FaUserCheck, FaUserTimes, FaClock, 
    FaPlus, FaBook, FaSearch, FaFilter, FaChartLine, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import AddAttendanceModal from './AddAttendanceModal';

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

interface CourseModule {
    id: number;
    name: string;
}

interface Attendance {
    id: number;
    student_id: number;
    course_module_id: number;
    date: string;
    status: 'present' | 'absent' | 'retard';
    observation?: string;
    student?: Student;
    course_module?: CourseModule;
}

interface Module {
    id: number;
    name: string;
}

interface Stats {
    total: number;
    present: number;
    absent: number;
    retard: number;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
}

interface AttendanceCardProps {
    attendance: Attendance;
    idx: number;
    isExpanded: boolean;
    onToggle: (id: number | null) => void;
}

const Presences = () => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModuleId, setSelectedModuleId] = useState<string>("");
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedAttendance, setExpandedAttendance] = useState<number | null>(null);
    
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

    const fetchAttendances = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/attendances", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setAttendances(data);
        } catch (error) {
            console.error("Erreur chargement présences:", error);
        }
    };

    const fetchModules = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/course-modules", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setModules(data);
        } catch (error) {
            console.error("Erreur chargement modules:", error);
        }
    };

    const fetchStats = async (moduleId: string) => {
        if (!moduleId) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/attendances/stats?course_module_id=${moduleId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Erreur stats:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchAttendances(), fetchModules()]).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedModuleId) {
            fetchStats(selectedModuleId);
        } else {
            setStats(null);
        }
    }, [selectedModuleId]);

    // Filtrage
    const filteredAttendances = attendances.filter((a: Attendance) => {
        const matchesModule = !selectedModuleId || a.course_module_id === parseInt(selectedModuleId);
        const matchesSearch = a.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             a.student?.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesModule && matchesSearch;
    });

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredAttendances.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredAttendances.length / itemsPerPage);

    // Statistiques générales
    const generalStats = {
        total: attendances.length,
        presents: attendances.filter((a: Attendance) => a.status === 'present').length,
        absents: attendances.filter((a: Attendance) => a.status === 'absent').length,
        retards: attendances.filter((a: Attendance) => a.status === 'retard').length,
        tauxPresence: attendances.length > 0 
            ? ((attendances.filter((a: Attendance) => a.status === 'present').length / attendances.length) * 100).toFixed(1)
            : 0
    };

    interface StatusConfig {
        label: string;
        color: string;
        icon: React.ComponentType<any>;
    }

    const getStatusConfig = (status: string): StatusConfig => {
        switch (status) {
            case 'present':
                return { label: 'Présent', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FaUserCheck };
            case 'absent':
                return { label: 'Absent', color: 'bg-red-50 text-red-700 border-red-200', icon: FaUserTimes };
            case 'retard':
                return { label: 'Retard', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: FaClock };
            default:
                return { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: FaCalendarCheck };
        }
    };

    // Gestionnaire d'expansion
    const handleToggleAttendance = (id: number | null) => {
        setExpandedAttendance(expandedAttendance === id ? null : id);
    };

    // Composant carte pour mobile
    const AttendanceCard = ({ attendance, idx, isExpanded, onToggle }: AttendanceCardProps) => {
        const statusConfig = getStatusConfig(attendance.status);
        const StatusIcon = statusConfig.icon;
        const formattedDate = new Date(attendance.date).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
                <div className="p-4">
                    {/* Date et statut */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FaCalendarCheck className="text-blue-500 text-xs" />
                            <span className="text-xs font-medium text-gray-600">{formattedDate}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                            <StatusIcon size={10} />
                            {statusConfig.label}
                        </span>
                    </div>

                    {/* Étudiant */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                            {attendance.student?.user?.name?.charAt(0) || 'E'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                                {attendance.student?.user?.name}
                            </p>
                            <p className="text-xs text-gray-400 font-mono truncate">
                                {attendance.student?.matricule}
                            </p>
                        </div>
                        <button
                            onClick={() => onToggle(isExpanded ? null : attendance.id)}
                            className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center"
                        >
                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                    </div>

                    {/* Module */}
                    <div className="mb-2">
                        <p className="text-xs text-gray-500">Module</p>
                        <p className="text-sm font-medium text-gray-700">{attendance.course_module?.name || '---'}</p>
                    </div>

                    {/* Détails expansibles */}
                    <AnimatePresence>
                        {isExpanded && attendance.observation && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 pt-3 border-t border-gray-100 overflow-hidden"
                            >
                                <p className="text-xs text-gray-500 mb-1">Observation</p>
                                <p className="text-sm text-gray-600 italic">{attendance.observation}</p>
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
                <FaCalendarCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement du registre...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaCalendarCheck className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Registre d'Appel
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Suivi des présences étudiants par unité d'enseignement
                    </p>
                </div>

                {/* STATISTIQUES GÉNÉRALES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <StatCard label="Total séances" value={generalStats.total} icon={FaBook} color="from-blue-500 to-blue-600" />
                    <StatCard label="Présents" value={generalStats.presents} icon={FaUserCheck} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Absents" value={generalStats.absents} icon={FaUserTimes} color="from-red-500 to-red-600" />
                    <StatCard label="Retards" value={generalStats.retards} icon={FaClock} color="from-amber-500 to-amber-600" />
                    <StatCard label="Taux présence" value={`${generalStats.tauxPresence}%`} icon={FaChartLine} color="from-purple-500 to-purple-600" />
                </div>

                {/* STATISTIQUES PAR MODULE RESPONSIVES */}
                {stats && selectedModuleId && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm"
                    >
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                            <FaChartLine className="text-blue-600" />
                            Statistiques du module sélectionné
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl font-bold text-gray-800">{stats.total || 0}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500">Séances</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl font-bold text-emerald-600">{stats.present || 0}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500">Présents</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.absent || 0}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500">Absents</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl font-bold text-amber-600">{stats.retard || 0}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500">Retards</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou matricule..."
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
                                <FaPlus size={14} /> Marquer présence
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
                                    <label className="block text-xs text-gray-500 mb-1">Module</label>
                                    <select
                                        value={selectedModuleId}
                                        onChange={(e) => setSelectedModuleId(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                    >
                                        <option value="">Tous les modules</option>
                                        {modules.map((mod: Module) => (
                                            <option key={mod.id} value={mod.id}>{mod.name}</option>
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
                    {(searchTerm || selectedModuleId) && filteredAttendances.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredAttendances.length} résultat{filteredAttendances.length > 1 ? 's' : ''} trouvé{filteredAttendances.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* VUE RESPONSIVE DES PRÉSENCES */}
                {currentItems.length > 0 ? (
                    <>
                        {isMobile ? (
                            /* Version Mobile - Cartes */
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {currentItems.map((attendance: Attendance, idx: number) => (
                                        <AttendanceCard 
                                            key={attendance.id} 
                                            attendance={attendance} 
                                            idx={idx}
                                            isExpanded={expandedAttendance === attendance.id}
                                            onToggle={handleToggleAttendance}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Version Tablette/Desktop - Tableau */
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Étudiant</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Observation</th>
                                              </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <AnimatePresence>
                                                {currentItems.map((a: Attendance, idx: number) => {
                                                    const statusConfig = getStatusConfig(a.status);
                                                    const StatusIcon = statusConfig.icon;
                                                    
                                                    return (
                                                        <motion.tr 
                                                            key={a.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="group hover:bg-blue-50/30 transition-colors duration-200"
                                                        >
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <span className="font-medium text-gray-700 text-xs md:text-sm">
                                                                    {new Date(a.date).toLocaleDateString('fr-FR', { 
                                                                        day: 'numeric', 
                                                                        month: 'short', 
                                                                        year: 'numeric' 
                                                                    })}
                                                                </span>
                                                              </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <div className="flex items-center gap-2 md:gap-3">
                                                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-[10px] md:text-xs">
                                                                        {a.student?.user?.name?.charAt(0) || 'E'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-800 text-xs md:text-sm">{a.student?.user?.name}</p>
                                                                        <p className="text-[10px] md:text-xs text-gray-400 font-mono">{a.student?.matricule}</p>
                                                                    </div>
                                                                </div>
                                                              </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <span className="text-xs md:text-sm text-gray-600 line-clamp-2 max-w-[200px]">
                                                                    {a.course_module?.name || '---'}
                                                                </span>
                                                              </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] md:text-xs font-medium border ${statusConfig.color}`}>
                                                                    <StatusIcon size={10} />
                                                                    {statusConfig.label}
                                                                </span>
                                                              </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <p className="text-xs md:text-sm text-gray-500 italic line-clamp-2 max-w-[200px]">
                                                                    {a.observation || '—'}
                                                                </p>
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
                                <FaCalendarCheck size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || selectedModuleId ? "Aucune présence trouvée" : "Aucune présence enregistrée"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {searchTerm || selectedModuleId 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Commencez par marquer la présence d'un étudiant"}
                            </p>
                            {(searchTerm || selectedModuleId) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedModuleId("");
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
                            <FaCalendarCheck className="text-blue-600 text-sm sm:text-base" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Taux de présence</h3>
                            <p className="text-[11px] sm:text-xs text-gray-600">
                                Le taux de présence est calculé sur l'ensemble des séances. 
                                Un taux inférieur à <strong className="text-red-600">75%</strong> peut entraîner des sanctions pédagogiques.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE D'AJOUT */}
            <AddAttendanceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchAttendances} 
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

export default Presences;