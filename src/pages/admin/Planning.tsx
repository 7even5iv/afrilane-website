import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaCalendarAlt, FaClock, FaDoorOpen, FaUserTie, 
    FaPlus, FaTrash, FaEdit, FaSearch, FaFilter, 
    FaUniversity, FaChalkboardTeacher, FaBuilding, FaArrowLeft, FaArrowRight,
} from 'react-icons/fa';
import AddScheduleModal from './AddScheduleModal';

// Interfaces TypeScript
interface User {
    id?: number;
    name: string;
}

interface Teacher {
    id: number;
    user: User;
}

interface Module {
    id: number;
    name: string;
}

interface Training {
    id: number;
    name: string;
    code?: string;
}

interface Schedule {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
    room: string;
    module?: Module;
    teacher?: Teacher;
    training?: Training;
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
}

interface ScheduleCardProps {
    schedule: Schedule;
    onEdit: (schedule: Schedule) => void;
    onDelete: (id: number) => void;
}

interface DayCardProps {
    day: string;
    idx: number;
    schedules: Schedule[];
    isExpanded: boolean;
    onToggle: (day: string) => void;
    onEdit: (schedule: Schedule) => void;
    onDelete: (id: number) => void;
}

const Planning = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [selectedDay, setSelectedDay] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    
    const daysPerPage = 6;
    const days: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchSchedules = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/schedules", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setSchedules(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:8000/api/schedules/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchSchedules();
        }
    };

    const handleEdit = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSchedule(null);
    };

    useEffect(() => { fetchSchedules(); }, []);

    // Filtrer par jour
    const filteredDays = selectedDay === "all" 
        ? days 
        : days.filter(d => d === selectedDay);

    // Filtrer les séances par recherche
    const getFilteredSchedules = (day: string): Schedule[] => {
        return schedules.filter(s => {
            const matchesDay = s.day === day;
            const matchesSearch = searchTerm === "" || 
                s.module?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.teacher?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.training?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDay && matchesSearch;
        });
    };

    // Pagination
    const indexOfLast = currentPage * daysPerPage;
    const indexOfFirst = indexOfLast - daysPerPage;
    const currentDays = filteredDays.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredDays.length / daysPerPage);

    // Statistiques
    const stats = {
        total: schedules.length,
        modules: new Set(schedules.map(s => s.module?.name)).size,
        teachers: new Set(schedules.map(s => s.teacher?.user?.name)).size,
        rooms: new Set(schedules.map(s => s.room)).size
    };

    // Composant carte de créneau pour mobile
    const ScheduleCard = ({ schedule, onEdit, onDelete }: ScheduleCardProps) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative group"
        >
            <div className="absolute top-2 right-2 flex gap-1">
                <button 
                    onClick={() => onEdit(schedule)}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-500 hover:text-white transition-all"
                    title="Modifier"
                >
                    <FaEdit size={10} />
                </button>
                <button 
                    onClick={() => onDelete(schedule.id)}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Supprimer"
                >
                    <FaTrash size={10} />
                </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1">
                    <FaClock size={8} /> {schedule.start_time?.substring(0,5)} - {schedule.end_time?.substring(0,5)}
                </div>
                <span className="text-[9px] font-semibold text-gray-400 uppercase">
                    {schedule.training?.code || schedule.training?.name?.substring(0,3)}
                </span>
            </div>

            <h4 className="font-bold text-gray-800 text-sm mb-2 leading-tight line-clamp-2">
                {schedule.module?.name}
            </h4>
            
            <div className="space-y-1 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <FaUserTie className="text-blue-500 text-xs" /> 
                    <span className="truncate flex-1">{schedule.teacher?.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <FaDoorOpen className="text-blue-500 text-xs" /> 
                    <span>{schedule.room}</span>
                </div>
            </div>
        </motion.div>
    );

    // Composant jour expansible pour mobile
    const DayCard = ({ day, idx, schedules: daySchedules, isExpanded, onToggle, onEdit, onDelete }: DayCardProps) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
                <button
                    onClick={() => onToggle(day)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex items-center justify-between"
                >
                    <div className="text-left">
                        <h3 className="font-bold text-base tracking-wide">{day}</h3>
                        <p className="text-xs text-blue-200 mt-0.5">
                            {daySchedules.length} créneau{daySchedules.length > 1 ? 'x' : ''}
                        </p>
                    </div>
                    {isExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
                
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 space-y-2 bg-gray-50/30 max-h-[400px] overflow-y-auto">
                                {daySchedules.length > 0 ? (
                                    daySchedules.map((schedule) => (
                                        <ScheduleCard 
                                            key={schedule.id} 
                                            schedule={schedule}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <FaCalendarAlt className="text-gray-200 text-3xl mb-2" />
                                        <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">Repos / Libre</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    // Gestionnaires d'expansion
    const handleDayToggle = (day: string) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <FaCalendarAlt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement de l'emploi du temps...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaCalendarAlt className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Emploi du Temps
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Planification des salles et formateurs par spécialité
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total créneaux" value={stats.total} icon={FaCalendarAlt} color="from-blue-500 to-blue-600" />
                    <StatCard label="Modules" value={stats.modules} icon={FaChalkboardTeacher} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Formateurs" value={stats.teachers} icon={FaUserTie} color="from-purple-500 to-purple-600" />
                    <StatCard label="Salles" value={stats.rooms} icon={FaBuilding} color="from-amber-500 to-amber-600" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input 
                                type="text" 
                                placeholder="Rechercher module, formateur ou formation..." 
                                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                <FaPlus size={14} /> Programmer
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
                                    <label className="block text-xs text-gray-500 mb-1">Jour</label>
                                    <select 
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                    >
                                        <option value="all">Tous les jours</option>
                                        {days.map(day => <option key={day} value={day}>{day}</option>)}
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
                    {(searchTerm || selectedDay !== "all") && schedules.filter(s => {
                        const matchesSearch = searchTerm === "" || 
                            s.module?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.teacher?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.training?.name?.toLowerCase().includes(searchTerm.toLowerCase());
                        return matchesSearch;
                    }).length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {schedules.filter(s => {
                                const matchesSearch = searchTerm === "" || 
                                    s.module?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    s.teacher?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    s.training?.name?.toLowerCase().includes(searchTerm.toLowerCase());
                                return matchesSearch;
                            }).length} résultat(s) trouvé(s)
                        </div>
                    )}
                </div>

                {/* GRILLE HEBDOMADAIRE RESPONSIVE */}
                {currentDays.length > 0 && schedules.length > 0 ? (
                    <>
                        {isMobile ? (
                            /* Version Mobile - Cartes expansibles */
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {currentDays.map((day, idx) => (
                                        <DayCard 
                                            key={day} 
                                            day={day} 
                                            idx={idx}
                                            schedules={getFilteredSchedules(day)}
                                            isExpanded={expandedDay === day}
                                            onToggle={handleDayToggle}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Version Tablette/Desktop - Grille */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                <AnimatePresence>
                                    {currentDays.map((day, idx) => {
                                        const daySchedules = getFilteredSchedules(day);
                                        return (
                                            <motion.div
                                                key={day}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 text-white text-center">
                                                    <h3 className="font-bold text-base sm:text-lg tracking-wide">{day}</h3>
                                                    <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5">
                                                        {daySchedules.length} créneau{daySchedules.length > 1 ? 'x' : ''}
                                                    </p>
                                                </div>
                                                
                                                <div className="p-3 sm:p-4 space-y-3 flex-1 bg-gray-50/30 min-h-[280px] max-h-[500px] overflow-y-auto">
                                                    <AnimatePresence>
                                                        {daySchedules.length > 0 ? daySchedules.map((schedule, sIdx) => (
                                                            <motion.div
                                                                key={schedule.id}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: sIdx * 0.05 }}
                                                                whileHover={{ y: -2 }}
                                                                className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:border-blue-300 hover:shadow-md transition-all"
                                                            >
                                                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={() => handleEdit(schedule)}
                                                                        className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-500 hover:text-white transition-all"
                                                                        title="Modifier"
                                                                    >
                                                                        <FaEdit size={10} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDelete(schedule.id)}
                                                                        className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-all"
                                                                        title="Supprimer"
                                                                    >
                                                                        <FaTrash size={10} />
                                                                    </button>
                                                                </div>

                                                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                                    <div className="bg-blue-50 text-blue-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold flex items-center gap-1">
                                                                        <FaClock size={8} /> {schedule.start_time?.substring(0,5)} - {schedule.end_time?.substring(0,5)}
                                                                    </div>
                                                                    <span className="text-[8px] sm:text-[9px] font-semibold text-gray-400 uppercase">
                                                                        {schedule.training?.code || schedule.training?.name?.substring(0,3)}
                                                                    </span>
                                                                </div>

                                                                <h4 className="font-bold text-gray-800 text-xs sm:text-sm mb-2 sm:mb-3 leading-tight line-clamp-2">
                                                                    {schedule.module?.name}
                                                                </h4>
                                                                
                                                                <div className="space-y-1 sm:space-y-1.5 pt-2 border-t border-gray-100">
                                                                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-gray-500">
                                                                        <FaUserTie className="text-blue-500 text-[10px] sm:text-xs" /> 
                                                                        <span className="truncate">{schedule.teacher?.user?.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-gray-500">
                                                                        <FaDoorOpen className="text-blue-500 text-[10px] sm:text-xs" /> 
                                                                        <span>{schedule.room}</span>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )) : (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="flex flex-col items-center justify-center py-8 sm:py-10 text-center"
                                                            >
                                                                <FaCalendarAlt className="text-gray-200 text-2xl sm:text-3xl mb-2" />
                                                                <p className="text-gray-300 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Repos / Libre</p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
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
                                <FaCalendarAlt size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || selectedDay !== "all" ? "Aucun créneau trouvé" : "Aucun créneau programmé"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {searchTerm || selectedDay !== "all" 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Commencez par programmer des cours"}
                            </p>
                            {(searchTerm || selectedDay !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedDay("all");
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
                            <FaUniversity className="text-blue-600 text-sm sm:text-base" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Planification des cours</h3>
                            <p className="text-[11px] sm:text-xs text-gray-600">
                                L'emploi du temps est généré par spécialité et par module. 
                                Chaque créneau doit être associé à un formateur, une salle et un module spécifique.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE D'AJOUT/MODIFICATION */}
            <AddScheduleModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onRefresh={fetchSchedules}
                editData={selectedSchedule}
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
    <svg className={className} width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const FaChevronUp = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

export default Planning;