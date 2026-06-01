import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaFilePdf, FaCloudUploadAlt, FaDownload, FaSearch, 
    FaFilter, FaFolderOpen, FaDatabase, 
    FaBook, FaCalendarAlt, FaChartLine, FaEye,
    FaTrash, FaEdit, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import AddExamModal from './AddExamModal';

// Interfaces TypeScript
interface Training {
    id: number;
    name: string;
    code?: string;
}

interface Exam {
    id: number;
    title: string;
    file_path: string;
    session_name?: string;
    created_at: string;
    training?: Training;
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
}

interface ExamCardProps {
    exam: Exam;
    idx: number;
    isMobile: boolean;
    isExpanded: boolean;
    onToggle: (id: number | null) => void;
    onDownload: (path: string, title: string) => void;
    onDelete: (id: number) => void;
}

const Epreuves = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTraining, setSelectedTraining] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedExam, setExpandedExam] = useState<number | null>(null);
    
    const itemsPerPage = 9;

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchExams = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/exams", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setExams(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur:", error);
            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cette épreuve ?")) {
            const token = localStorage.getItem("token");
            try {
                await fetch(`http://localhost:8000/api/exams/${id}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                fetchExams();
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    useEffect(() => { fetchExams(); }, []);

    const handleDownload = (path: string, title: string) => {
        const url = `http://localhost:8000/storage/${path}`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title}.pdf`);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleExpandToggle = (id: number | null) => {
        setExpandedExam(expandedExam === id ? null : id);
    };

    // Formations uniques pour le filtre
    const trainings = ["all", ...new Set(exams.map((e: Exam) => e.training?.name).filter(Boolean))];

    // Filtrage
    const filteredExams = exams.filter((e: Exam) => {
        const matchesSearch = e.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             e.training?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTraining = selectedTraining === "all" || e.training?.name === selectedTraining;
        return matchesSearch && matchesTraining;
    });

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

    // Statistiques
    const stats = {
        total: exams.length,
        formations: new Set(exams.map((e: Exam) => e.training?.name)).size,
        sessions: new Set(exams.map((e: Exam) => e.session_name)).size,
        recent: exams.filter((e: Exam) => {
            const date = new Date(e.created_at);
            const now = new Date();
            return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        }).length
    };

    // Composant carte pour mobile
    const ExamCard = ({ exam, idx, isMobile: _isMobileProp, isExpanded, onToggle, onDownload, onDelete }: ExamCardProps) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
                <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-md">
                                <FaFilePdf size={20} />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                {exam.title}
                            </h3>
                            <p className="text-[10px] text-blue-600 font-semibold mt-1">
                                {exam.training?.name}
                            </p>
                        </div>
                        <button
                            onClick={() => onToggle(isExpanded ? null : exam.id)}
                            className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center flex-shrink-0"
                        >
                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-tighter">
                                {exam.session_name || "Session"}
                            </span>
                            {exam.created_at && (
                                <span className="text-[8px] text-gray-300 mt-0.5">
                                    {new Date(exam.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => onDownload(exam.file_path, exam.title)}
                            className="flex items-center gap-1 text-gray-600 font-medium text-[10px] hover:text-blue-600 transition-all px-2 py-1 rounded-lg hover:bg-blue-50"
                        >
                            <FaDownload size={10} /> PDF
                        </button>
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
                                <div className="flex gap-2">
                                    <button className="flex-1 px-2 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-medium hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-1">
                                        <FaEye size={10} /> Aperçu
                                    </button>
                                    <button className="flex-1 px-2 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-medium hover:bg-amber-50 hover:text-amber-600 transition-all flex items-center justify-center gap-1">
                                        <FaEdit size={10} /> Modifier
                                    </button>
                                    <button 
                                        onClick={() => onDelete(exam.id)}
                                        className="flex-1 px-2 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-1"
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
                <FaFilePdf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement de la banque d'épreuves...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaFilePdf className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Banque d'Épreuves
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Archives numériques des sujets AFRILANE
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total épreuves" value={stats.total} icon={FaDatabase} color="from-blue-500 to-blue-600" />
                    <StatCard label="Formations" value={stats.formations} icon={FaBook} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Sessions" value={stats.sessions} icon={FaCalendarAlt} color="from-purple-500 to-purple-600" />
                    <StatCard label="Ajouts récents" value={stats.recent} icon={FaChartLine} color="from-amber-500 to-amber-600" />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input 
                                type="text" 
                                placeholder="Rechercher par titre ou spécialité..." 
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
                                className="flex-1 sm:flex-initial bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm whitespace-nowrap"
                            >
                                <FaCloudUploadAlt size={14} /> Déposer un sujet
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
                                className="mt-4 pt-4 border-t border-gray-100 overflow-hidden"
                            >
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Formation</label>
                                    <select 
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer"
                                        value={selectedTraining}
                                        onChange={(e) => { setSelectedTraining(e.target.value); setCurrentPage(1); }}
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
                                        className="mt-3 w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                                    >
                                        Appliquer
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Résultats de recherche */}
                    {(searchTerm || selectedTraining !== "all") && filteredExams.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredExams.length} épreuve{filteredExams.length > 1 ? 's' : ''} trouvée{filteredExams.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* GRILLE RESPONSIVE DES ÉPREUVES */}
                {currentExams.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            <AnimatePresence>
                                {currentExams.map((exam: Exam, idx: number) => (
                                    isMobile ? (
                                        <ExamCard 
                                            key={exam.id} 
                                            exam={exam} 
                                            idx={idx}
                                            isMobile={isMobile}
                                            isExpanded={expandedExam === exam.id}
                                            onToggle={handleExpandToggle}
                                            onDownload={handleDownload}
                                            onDelete={handleDelete}
                                        />
                                    ) : (
                                        /* Version Tablette/Desktop - Carte complète */
                                        <motion.div 
                                            key={exam.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                        >
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-red-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                                                            <FaFilePdf size={20} className="sm:text-2xl" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                                                            {exam.title}
                                                        </h3>
                                                        <p className="text-[11px] sm:text-xs text-blue-600 font-semibold mt-1">
                                                            {exam.training?.name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-tighter">
                                                            {exam.session_name || "Session"}
                                                        </span>
                                                        {exam.created_at && (
                                                            <span className="text-[8px] sm:text-[9px] text-gray-300 mt-0.5">
                                                                {new Date(exam.created_at).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDownload(exam.file_path, exam.title)}
                                                        className="flex items-center gap-1 sm:gap-2 text-gray-600 font-medium text-[11px] sm:text-xs hover:text-blue-600 transition-all px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-blue-50"
                                                    >
                                                        <FaDownload size={10} className="sm:text-xs" /> PDF
                                                    </button>
                                                </div>

                                                {/* Actions au survol - Desktop seulement */}
                                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-500 hover:text-white transition-all" title="Aperçu">
                                                        <FaEye size={10} />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-amber-500 hover:text-white transition-all" title="Modifier">
                                                        <FaEdit size={10} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(exam.id)}
                                                        className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-all"
                                                        title="Supprimer"
                                                    >
                                                        <FaTrash size={10} />
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
                                <FaFolderOpen size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">
                                {searchTerm || selectedTraining !== "all" ? "Aucune épreuve trouvée" : "Aucune épreuve enregistrée"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {searchTerm || selectedTraining !== "all" 
                                    ? "Essayez avec d'autres critères de recherche" 
                                    : "Commencez par déposer votre première épreuve"}
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
                            <FaFilePdf className="text-blue-600 text-sm sm:text-base" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">Format des épreuves</h3>
                            <p className="text-[11px] sm:text-xs text-gray-600">
                                Les documents doivent être au format PDF et ne pas dépasser 5 Mo. 
                                Les épreuves sont classées par formation et session pour faciliter leur consultation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE D'AJOUT */}
            <AddExamModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchExams} 
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

export default Epreuves;