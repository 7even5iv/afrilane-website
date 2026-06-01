import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPrint, FaCalculator, 
    FaCheckCircle, FaExclamationCircle, FaPlus, FaFileSignature,
    FaSearch, FaFilter, FaChartLine, FaArrowLeft, FaArrowRight,
    FaBookOpen
} from 'react-icons/fa';
import AddGradeModal from './AddGradeModal';

// Interfaces TypeScript
interface Student {
    id: number;
    user: {
        name: string;
    };
    matricule: string;
}

interface Module {
    id: number;
    name: string;
}

interface Grade {
    id: number;
    student_id: number;
    student?: Student;
    module?: Module;
    cc_score: number;
    exam_score: number;
    created_at?: string;
}

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ComponentType<any>;
    color: string;
    suffix?: string;
}

interface GradeCardProps {
    grade: Grade;
    idx: number;
    onDownload: (studentId: number) => void;
    onExpandToggle: (gradeId: number | null) => void;
    expandedGradeId: number | null;
}

const Notes = () => {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedGrade, setExpandedGrade] = useState<number | null>(null);
    
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

    const fetchGrades = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/grades", {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) setGrades(data);
        } catch (error) {
            console.error("Erreur chargement notes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGrades(); }, []);

    // Calcul de la moyenne (40% CC, 60% Exam)
    const calculateAverage = (cc: number, exam: number): number => {
        return (cc * 0.4 + exam * 0.6);
    };

    // Téléchargement du Bulletin
    const handleDownload = async (studentId: number) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/api/students/${studentId}/bulletin`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error();
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Bulletin_Etudiant_${studentId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Erreur lors de la génération du PDF");
        }
    };

    // Logique de filtrage
    const modules = ["all", ...new Set(grades.map((g: Grade) => g.module?.name).filter(Boolean))];
    const filteredGrades = grades.filter((g: Grade) => {
        const matchesSearch = g.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             g.student?.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = selectedModule === "all" || g.module?.name === selectedModule;
        return matchesSearch && matchesModule;
    });

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredGrades.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredGrades.length / itemsPerPage);

    // Statistiques
    const stats = {
        total: grades.length,
        admitted: grades.filter((g: Grade) => calculateAverage(g.cc_score, g.exam_score) >= 12).length,
        failed: grades.filter((g: Grade) => calculateAverage(g.cc_score, g.exam_score) < 12).length,
        avgGeneral: (grades.reduce((acc: number, g: Grade) => acc + calculateAverage(g.cc_score, g.exam_score), 0) / (grades.length || 1)).toFixed(2)
    };

    // Gestion de l'expansion
    const handleExpandToggle = (gradeId: number | null) => {
        setExpandedGrade(expandedGrade === gradeId ? null : gradeId);
    };

    // Composant carte pour mobile
    const GradeCard = ({ grade, idx, onDownload, onExpandToggle, expandedGradeId }: GradeCardProps) => {
        const isExpanded = expandedGradeId === grade.id;
        const avg = calculateAverage(grade.cc_score, grade.exam_score);
        const isAdmitted = avg >= 12;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
                <div className="p-4">
                    {/* En-tête avec étudiant */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-sm text-sm flex-shrink-0">
                                {grade.student?.user?.name?.charAt(0) || 'E'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                    {grade.student?.user?.name}
                                </p>
                                <p className="text-xs text-blue-600 font-mono truncate">
                                    {grade.student?.matricule}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onExpandToggle(grade.id)}
                            className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center flex-shrink-0"
                        >
                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                    </div>

                    {/* Module */}
                    <div className="mb-3 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FaBookOpen className="text-blue-500 text-xs" />
                            <span className="text-xs text-gray-600">{grade.module?.name}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                            <p className="text-[10px] text-gray-400">CC (40%)</p>
                            <p className="text-base font-bold text-gray-700">{grade.cc_score}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-gray-400">Examen (60%)</p>
                            <p className="text-base font-bold text-gray-700">{grade.exam_score}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-gray-400">Moyenne</p>
                            <p className={`text-base font-bold ${isAdmitted ? 'text-emerald-600' : 'text-red-500'}`}>
                                {avg.toFixed(2)}
                            </p>
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
                                className="mt-3 pt-3 border-t border-gray-100 space-y-3 overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-gray-600">Statut</span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isAdmitted ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {isAdmitted ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                                            {isAdmitted ? 'Admis' : 'Non admis'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onDownload(grade.student_id)}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all"
                                >
                                    <FaPrint size={14} /> Télécharger le bulletin
                                </button>
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
                <FaFileSignature className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement des résultats académiques...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaFileSignature className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Gestion des Notes
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Calcul des moyennes et délibération automatique (40% CC, 60% Examen)
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total évaluations" value={stats.total} icon={FaFileSignature} color="from-blue-500 to-blue-600" />
                    <StatCard label="Admis" value={stats.admitted} icon={FaCheckCircle} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Échecs" value={stats.failed} icon={FaExclamationCircle} color="from-red-500 to-red-600" />
                    <StatCard label="Moyenne générale" value={stats.avgGeneral} icon={FaChartLine} color="from-purple-500 to-purple-600" suffix="/20" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom ou matricule..." 
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
                                <FaPlus size={14} /> Saisir une note
                            </button>
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
                    {(searchTerm || selectedModule !== "all") && filteredGrades.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredGrades.length} résultat{filteredGrades.length > 1 ? 's' : ''} trouvé{filteredGrades.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* VUE RESPONSIVE DES NOTES */}
                {currentItems.length > 0 ? (
                    <>
                        {isMobile ? (
                            /* Version Mobile - Cartes */
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {currentItems.map((grade: Grade, idx: number) => (
                                        <GradeCard 
                                            key={grade.id} 
                                            grade={grade} 
                                            idx={idx}
                                            onDownload={handleDownload}
                                            onExpandToggle={handleExpandToggle}
                                            expandedGradeId={expandedGrade}
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
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Étudiant / Module</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">CC (40%)</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Examen (60%)</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Moyenne</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulletin</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <AnimatePresence>
                                                {currentItems.map((g: Grade, idx: number) => {
                                                    const avg = calculateAverage(g.cc_score, g.exam_score);
                                                    const isAdmitted = avg >= 12;
                                                    return (
                                                        <motion.tr 
                                                            key={g.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="group hover:bg-blue-50/30 transition-colors duration-200"
                                                        >
                                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-sm text-xs md:text-sm flex-shrink-0">
                                                                        {g.student?.user?.name?.charAt(0) || 'E'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900 text-xs md:text-sm">{g.student?.user?.name}</p>
                                                                        <p className="text-[10px] md:text-xs text-blue-600 font-mono">{g.student?.matricule}</p>
                                                                        <p className="text-[10px] text-gray-400 mt-0.5 hidden md:block">{g.module?.name}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[10px] text-gray-400 mt-1 md:hidden">{g.module?.name}</p>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                                <span className="inline-flex items-center justify-center w-12 md:w-16 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-gray-100 text-gray-700 font-semibold text-xs md:text-sm">
                                                                    {g.cc_score}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                                <span className="inline-flex items-center justify-center w-12 md:w-16 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-gray-100 text-gray-700 font-semibold text-xs md:text-sm">
                                                                    {g.exam_score}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                                <div className="flex flex-col items-center">
                                                                    <span className={`text-base md:text-xl font-bold ${isAdmitted ? 'text-emerald-600' : 'text-red-500'}`}>
                                                                        {avg.toFixed(2)}
                                                                    </span>
                                                                    <span className="text-[9px] md:text-[10px] text-gray-400">/20</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${isAdmitted ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {isAdmitted ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                                                                    {isAdmitted ? 'Admis' : 'Échec'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                                <button 
                                                                    onClick={() => handleDownload(g.student_id)}
                                                                    className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center mx-auto"
                                                                    title="Télécharger le bulletin"
                                                                >
                                                                    <FaPrint size={12} />
                                                                </button>
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
                                <FaFileSignature size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || selectedModule !== "all" ? "Aucune note trouvée" : "Aucune note enregistrée"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {searchTerm || selectedModule !== "all" 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Cliquez sur 'Saisir une note' pour commencer"}
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
                            <FaCalculator className="text-blue-600 text-sm sm:text-base" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Règle de délibération</h3>
                            <p className="text-[11px] sm:text-xs text-gray-600">
                                La moyenne est calculée sur une base de <strong className="text-blue-600">40% pour le Contrôle Continu (CC)</strong> et 
                                <strong className="text-blue-600"> 60% pour l'Examen Final</strong>. Le seuil d'admission est fixé à 
                                <strong className="text-emerald-600"> 12/20</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE D'AJOUT DE NOTE */}
            <AddGradeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchGrades} 
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

// Composant pour l'icône ChevronDown
const FaChevronDown = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size || 12} height={size || 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

// Composant pour l'icône ChevronUp
const FaChevronUp = ({ size, className }: { size?: number; className?: string }) => (
    <svg className={className} width={size || 12} height={size || 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

export default Notes;