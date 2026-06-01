import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaSearch, FaUserGraduate, FaEllipsisV, FaTimes, FaFilter, FaSortAmountDown, FaEdit, FaTrash, FaEye, FaEnvelope, FaPhone, FaIdCard, FaBook, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import AddStudentModal from './AddStudentModal';

// Interfaces TypeScript
interface User {
    id?: string;
    name: string;
    email: string;
}

interface Training {
    id?: string;
    name: string;
    code: string;
}

interface Student {
    id: string;
    user: User;
    matricule: string;
    status: 'actif' | 'inactif';
    training?: Training;
    phone?: string;
}

interface EmptyStateProps {
    searchTerm: string;
}

interface StudentCardProps {
    student: Student;
}

const Etudiants = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("name");
    const [studentsPerPage, setStudentsPerPage] = useState(8);

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 640);
            setIsTablet(width >= 640 && width < 1024);
            
            if (width < 640) {
                setStudentsPerPage(5);
            } else if (width < 1024) {
                setStudentsPerPage(6);
            } else {
                setStudentsPerPage(8);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
    }, [currentPage, searchTerm]);

    const fetchStudents = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/students", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            const data = await res.json();
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur:", error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.")) {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/students/${id}`, {
                    method: "DELETE",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });

                if (res.ok) {
                    fetchStudents();
                    setIsPreviewModalOpen(false);
                } else {
                    const error = await res.json();
                    alert(error.message || "Erreur lors de la suppression");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Impossible de contacter le serveur");
            }
        }
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
        setIsPreviewModalOpen(false);
    };

    const handlePreview = (student: Student) => {
        setPreviewStudent(student);
        setIsPreviewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewStudent(null);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    let filteredStudents: Student[] = students.filter((s: Student) => {
        if (!s) return false;
        const userName = s.user?.name?.toLowerCase() || '';
        const matricule = s.matricule?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return userName.includes(search) || matricule.includes(search);
    });

    if (statusFilter !== "all") {
        filteredStudents = filteredStudents.filter((s: Student) => s?.status === statusFilter);
    }

    filteredStudents = [...filteredStudents].sort((a: Student, b: Student) => {
        if (sortBy === "name") {
            const nameA = a.user?.name || '';
            const nameB = b.user?.name || '';
            return nameA.localeCompare(nameB);
        }
        if (sortBy === "matricule") {
            const matA = a.matricule || '';
            const matB = b.matricule || '';
            return matA.localeCompare(matB);
        }
        if (sortBy === "status") {
            const statusA = a.status === 'actif' ? 0 : 1;
            const statusB = b.status === 'actif' ? 0 : 1;
            return statusA - statusB;
        }
        return 0;
    });

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // Composant carte responsive (mobile et tablette)
    const StudentCard = ({ student }: StudentCardProps) => {
        const [isExpanded, setIsExpanded] = useState(false);
        
        const userName = student.user?.name || 'Nom inconnu';
        const userEmail = student.user?.email || 'Email inconnu';
        const userInitial = userName.charAt(0).toUpperCase() || 'E';
        const matricule = student.matricule || 'N/A';
        const status = student.status || 'inactif';
        const trainingName = student.training?.name || 'Non assigné';
        const trainingCode = student.training?.code || '---';
        
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-sm text-lg flex-shrink-0">
                                {userInitial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-base truncate">
                                    {userName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {userEmail}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <code className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                        {matricule}
                                    </code>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        status === 'actif'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                            status === 'actif' ? 'bg-emerald-500' : 'bg-amber-500'
                                        }`}></span>
                                        {status === 'actif' ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center flex-shrink-0 ml-2"
                        >
                            <FaEllipsisV size={14} />
                        </button>
                    </div>
                    
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 pt-4 border-t border-gray-100 space-y-3 overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Formation</p>
                                    <p className="text-sm font-medium text-gray-800">{trainingName}</p>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">{trainingCode}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button 
                                        onClick={() => handlePreview(student)}
                                        className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaEye size={12} /> Aperçu
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(student)}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaEdit size={12} /> Modifier
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(student.id)}
                                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 sm:py-32">
            <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <FaUserGraduate className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement de la base étudiante...</p>
        </div>
    );

    // Rendu pour mobile
    const renderMobileView = () => (
        <div className="p-3 space-y-3">
            {currentStudents.length > 0 ? (
                currentStudents.map((student: Student) => (
                    <StudentCard key={student.id} student={student} />
                ))
            ) : (
                <EmptyState searchTerm={searchTerm} />
            )}
        </div>
    );

    // Rendu pour tablette
    const renderTableView = () => (
        <div className="p-4">
            {currentStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentStudents.map((student: Student) => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
            ) : (
                <EmptyState searchTerm={searchTerm} />
            )}
        </div>
    );

    // Rendu pour desktop
    const renderDesktopView = () => (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <button className="flex items-center gap-1 hover:text-gray-700">
                                Étudiant
                                {sortBy === "name" && <FaSortAmountDown size={10} />}
                            </button>
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Matricule</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Formation</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {currentStudents.map((s: Student) => (
                        <motion.tr
                            key={s.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hover:bg-blue-50/30 transition-colors duration-200 group"
                        >
                            <td className="px-4 md:px-6 py-3 md:py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-sm text-sm">
                                        {s.user?.name?.charAt(0)?.toUpperCase() || 'E'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{s.user?.name || 'Nom inconnu'}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{s.user?.email || 'Email inconnu'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                                <code className="text-xs md:text-sm font-mono text-blue-700 bg-blue-50 px-1.5 md:px-2 py-1 rounded-md">
                                    {s.matricule || 'N/A'}
                                </code>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                                <p className="text-sm font-medium text-gray-800">{s.training?.name || 'Non assigné'}</p>
                                <p className="text-xs text-gray-500 font-mono">{s.training?.code || '---'}</p>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-xs font-medium ${
                                    s.status === 'actif'
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                        s.status === 'actif' ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`}></span>
                                    {s.status === 'actif' ? 'Actif' : 'Inactif'}
                                </span>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                <div className="flex items-center justify-end gap-1 md:gap-2">
                                    <button 
                                        onClick={() => handlePreview(s)}
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center"
                                        title="Aperçu"
                                    >
                                        <FaEye size={12} />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(s)}
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center"
                                        title="Modifier"
                                    >
                                        <FaEdit size={12} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(s.id)}
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center"
                                        title="Supprimer"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                    {currentStudents.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-16 text-center">
                                <EmptyState searchTerm={searchTerm} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                    
                    {/* EN-TÊTE */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                            Gestion des Étudiants
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500">
                            Gérez et suivez tous les étudiants inscrits
                        </p>
                    </div>

                    {/* BARRE D'ACTIONS */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                            <div className="relative flex-1 w-full sm:w-80 md:w-96">
                                <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou matricule..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                {(isMobile || isTablet) && (
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
                                    >
                                        <FaFilter size={14} />
                                        Filtres
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setEditingStudent(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="flex-1 sm:flex-initial bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
                                >
                                    <FaUserPlus size={14} /> 
                                    <span className="hidden sm:inline">Nouvel étudiant</span>
                                    <span className="inline sm:hidden">Ajouter</span>
                                </button>
                            </div>
                        </div>

                        {/* Panneau de filtres animé */}
                        <AnimatePresence>
                            {(isFilterOpen || (!isMobile && !isTablet)) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 pt-4 border-t border-gray-100 overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Statut</label>
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => {
                                                    setStatusFilter(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                            >
                                                <option value="all">Tous les statuts</option>
                                                <option value="actif">Actifs</option>
                                                <option value="inactif">Inactifs</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Trier par</label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => {
                                                    setSortBy(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                            >
                                                <option value="name">Nom</option>
                                                <option value="matricule">Matricule</option>
                                                <option value="status">Statut</option>
                                            </select>
                                        </div>
                                        {(isMobile || isTablet) && (
                                            <button
                                                onClick={() => setIsFilterOpen(false)}
                                                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                                            >
                                                Appliquer
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Résultat de recherche */}
                        {searchTerm && filteredStudents.length > 0 && (
                            <div className="mt-3 text-xs sm:text-sm text-gray-500">
                                {filteredStudents.length} résultat{filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>

                    {/* VUE RESPONSIVE DES ÉTUDIANTS */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {isMobile && renderMobileView()}
                        {!isMobile && isTablet && renderTableView()}
                        {!isMobile && !isTablet && renderDesktopView()}

                        {/* PAGINATION RESPONSIVE */}
                        {filteredStudents.length > 0 && totalPages > 1 && (
                            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                    <span className="hidden sm:inline">Affichage de </span>
                                    <span className="font-medium">{indexOfFirstStudent + 1}</span> -{" "}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastStudent, filteredStudents.length)}
                                    </span>{" "}
                                    sur <span className="font-medium">{filteredStudents.length}</span>
                                </div>
                                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-2 sm:px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
                                    >
                                        <FaArrowLeft size={10} />
                                        <span className="hidden sm:inline ml-1">Précédent</span>
                                    </button>
                                    
                                    <span className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-500">
                                        {currentPage} / {totalPages}
                                    </span>
                                    
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-2 sm:px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline mr-1">Suivant</span>
                                        <FaArrowRight size={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MODALES */}
                    <AddStudentModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onRefresh={fetchStudents}
                        editData={editingStudent}
                    />

                    {/* MODALE D'APERÇU - SANS BOUTONS MODIFIER ET SUPPRIMER */}
                    <AnimatePresence>
                        {isPreviewModalOpen && previewStudent && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                                >
                                    {/* En-tête */}
                                    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center">
                                                <FaEye size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Aperçu de l'étudiant</h2>
                                                <p className="text-xs sm:text-sm text-gray-500">Informations complètes</p>
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
                                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                        {/* En-tête avec avatar */}
                                        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
                                                    <span className="text-2xl sm:text-3xl font-bold">
                                                        {previewStudent.user?.name?.charAt(0)?.toUpperCase() || 'E'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                                                        {previewStudent.user?.name || 'Nom inconnu'}
                                                    </h3>
                                                    <p className="text-sm sm:text-base text-gray-600 mt-1 break-all">
                                                        {previewStudent.user?.email || 'Email inconnu'}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                                                        <code className="text-xs sm:text-sm font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                                                            {previewStudent.matricule || 'N/A'}
                                                        </code>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                            previewStudent.status === 'actif'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                                previewStudent.status === 'actif' ? 'bg-emerald-500' : 'bg-amber-500'
                                                            }`}></span>
                                                            {previewStudent.status === 'actif' ? 'Actif' : 'Inactif'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Informations détaillées */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                    <FaIdCard className="text-blue-500" />
                                                    Informations personnelles
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-2">
                                                        <FaEnvelope className="text-gray-400 mt-0.5 text-sm flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500">Email</p>
                                                            <p className="text-sm text-gray-800 break-all">
                                                                {previewStudent.user?.email || 'Non renseigné'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {previewStudent.phone && (
                                                        <div className="flex items-start gap-2">
                                                            <FaPhone className="text-gray-400 mt-0.5 text-sm flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">Téléphone</p>
                                                                <p className="text-sm text-gray-800">{previewStudent.phone}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                    <FaBook className="text-blue-500" />
                                                    Informations académiques
                                                </h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Formation</p>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {previewStudent.training?.name || 'Non assigné'}
                                                        </p>
                                                        {previewStudent.training?.code && (
                                                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                                                                {previewStudent.training.code}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

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

// Composant État vide
const EmptyState = ({ searchTerm }: EmptyStateProps) => (
    <div className="flex flex-col items-center py-12 sm:py-16">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FaUserGraduate size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium text-sm sm:text-base">
            {searchTerm ? "Aucun résultat trouvé" : "Aucun étudiant inscrit"}
        </p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {searchTerm ? "Essayez avec d'autres termes" : "Commencez par inscrire un nouvel étudiant"}
        </p>
    </div>
);

export default Etudiants;