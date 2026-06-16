import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserTie, FaPlus, FaPhone, FaEnvelope, FaEllipsisV,
    FaGraduationCap, FaChalkboardTeacher, FaSearch, FaFilter,
    FaTimes, FaEdit, FaTrash, FaEye, FaIdCard, FaBook, FaAward,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import AddTeacherModal from './AddTeacherModal';

// Interfaces TypeScript
interface User {
    id?: string;
    name: string;
    email: string;
}

interface Training {
    id?: string;
    name: string;
    code?: string;
}

interface Teacher {
    id: string;
    user: User;
    specialty: string;
    status?: 'actif' | 'inactif' | 'en_attente';
    phone?: string;
    bio?: string;
    expertise?: string;
    trainings?: Training[];
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
}

interface TeacherCardProps {
    teacher: Teacher;
    onPreview: (teacher: Teacher) => void;
    onEdit: (teacher: Teacher) => void;
    onDelete: (id: string) => void;
    isMobile: boolean;
}

const Formateurs = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [previewTeacher, setPreviewTeacher] = useState<Teacher | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [teachersPerPage, setTeachersPerPage] = useState(6);

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            setIsMobile(mobile);

            // Ajuster le nombre d'éléments par page
            if (mobile) setTeachersPerPage(4);
            else setTeachersPerPage(6);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchTeachers = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/teachers", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            const data = await res.json();
            const validTeachers = data.filter((teacher: Teacher) => teacher && teacher.user && teacher.user.name);
            setTeachers(validTeachers);
        } catch (error) {
            console.error("Erreur:", error);
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const specialties = ["all", ...new Set(teachers.map((t: Teacher) => t?.specialty).filter(Boolean))];

    let filteredTeachers = teachers.filter((t: Teacher) => {
        if (!t || !t.user) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            (t.user.name && t.user.name.toLowerCase().includes(searchLower)) ||
            (t.specialty && t.specialty.toLowerCase().includes(searchLower)) ||
            (t.user.email && t.user.email.toLowerCase().includes(searchLower))
        );
    });

    if (specialtyFilter !== "all") {
        filteredTeachers = filteredTeachers.filter((t: Teacher) => t.specialty === specialtyFilter);
    }

    const indexOfLastTeacher = currentPage * teachersPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
    const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
    const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

    const stats = {
        total: teachers.length,
        specialties: new Set(teachers.map((t: Teacher) => t?.specialty).filter(Boolean)).size,
        active: teachers.filter((t: Teacher) => t?.status === 'actif' || !t?.status).length
    };

    // Fonctions de gestion
    const handlePreview = (teacher: Teacher) => {
        setPreviewTeacher(teacher);
        setIsPreviewModalOpen(true);
    };

    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewTeacher(null);
    };

    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce formateur ?")) {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/teachers/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    await fetchTeachers();
                    setIsPreviewModalOpen(false);
                } else {
                    alert("Erreur lors de la suppression");
                }
            } catch (error) {
                alert("Impossible de contacter le serveur");
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTeacher(null);
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        setSpecialtyFilter("all");
        setCurrentPage(1);
    };

    // Composant Carte Formateur Responsive
    const TeacherCard = ({ teacher, onPreview, onEdit, onDelete, isMobile }: TeacherCardProps) => {
        const isExpanded = expandedCard === teacher.id;

        const userName = teacher?.user?.name || 'Nom inconnu';
        const userEmail = teacher?.user?.email || 'Email non renseigné';
        const userSpecialty = teacher?.specialty || 'Spécialité non définie';
        const userPhone = teacher?.phone || 'Non renseigné';
        const userBio = teacher?.bio || 'Aucune information supplémentaire';

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
                <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
                                    {userName}
                                </h3>
                                <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mt-1 truncate">
                                    {userSpecialty}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                            <button
                                onClick={() => onPreview(teacher)}
                                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                                title="Aperçu"
                            >
                                <FaEye size={12} />
                            </button>
                            <button
                                onClick={() => onEdit(teacher)}
                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                title="Modifier"
                            >
                                <FaEdit size={12} />
                            </button>
                            {!isMobile && (
                                <button
                                    onClick={() => onDelete(teacher.id)}
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                    title="Supprimer"
                                >
                                    <FaTrash size={12} />
                                </button>
                            )}
                            <button
                                onClick={() => setExpandedCard(isExpanded ? null : teacher.id)}
                                className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center"
                            >
                                <FaEllipsisV size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <FaPhone className="text-blue-500 text-xs" />
                            </div>
                            <span className="text-xs sm:text-sm truncate">{userPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <FaEnvelope className="text-blue-500 text-xs" />
                            </div>
                            <span className="text-xs sm:text-sm truncate">{userEmail}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${teacher?.status === 'actif'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${teacher?.status === 'actif' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}></span>
                            {teacher?.status === 'actif' ? 'Actif' : teacher?.status || 'En attente'}
                        </span>
                        {isMobile && (
                            <button
                                onClick={() => onDelete(teacher.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                                <FaTrash size={10} /> Suppr.
                            </button>
                        )}
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
                                    <p className="text-xs text-gray-500 mb-1">Bio / Description</p>
                                    <p className="text-sm text-gray-700">
                                        {userBio.length > 100 ? `${userBio.substring(0, 100)}...` : userBio}
                                    </p>
                                </div>
                                {teacher.trainings && teacher.trainings.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Formations enseignées</p>
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.trainings.slice(0, 3).map((training, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-medium bg-blue-100 text-blue-700">
                                                    {typeof training === 'string' ? training : training.name}
                                                </span>
                                            ))}
                                            {teacher.trainings.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-medium bg-gray-100 text-gray-600">
                                                    +{teacher.trainings.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
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
                <FaUserTie className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement du corps enseignant...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* EN-TÊTE RESPONSIVE */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FaUserTie className="text-blue-600 text-base sm:text-xl" />
                            </div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                Corps Enseignant
                            </h1>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Gérez les experts et formateurs d'AFRILANE
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <StatCard
                        label="Total formateurs"
                        value={stats.total}
                        icon={FaUserTie}
                        color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                        label="Spécialités"
                        value={stats.specialties}
                        icon={FaGraduationCap}
                        color="from-emerald-500 to-emerald-600"
                    />
                    <StatCard
                        label="Actifs"
                        value={stats.active}
                        icon={FaChalkboardTeacher}
                        color="from-purple-500 to-purple-600"
                    />
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, spécialité ou email..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
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
                                        <span className="hidden sm:inline">Filtres</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm whitespace-nowrap"
                                >
                                    <FaPlus size={14} />
                                    <span className="hidden sm:inline">Nouveau formateur</span>
                                    <span className="inline sm:hidden">Ajouter</span>
                                </button>
                            </div>
                        </div>

                        {/* Panneau de filtres responsive */}
                        <AnimatePresence>
                            {(isFilterOpen || (!isMobile && specialties.length > 1)) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex flex-col sm:flex-row gap-3 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="block text-xs text-gray-500 mb-1">Filtrer par spécialité</label>
                                                <select
                                                    value={specialtyFilter}
                                                    onChange={(e) => {
                                                        setSpecialtyFilter(e.target.value);
                                                        setCurrentPage(1);
                                                        if (isMobile) setIsFilterOpen(false);
                                                    }}
                                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                                >
                                                    {specialties.map((spec: string) => (
                                                        <option key={spec} value={spec}>
                                                            {spec === "all" ? "Toutes les spécialités" : spec}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {(searchTerm || specialtyFilter !== "all") && (
                                                <button
                                                    onClick={handleResetFilters}
                                                    className="px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium whitespace-nowrap"
                                                >
                                                    Réinitialiser
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Résultats de recherche */}
                        {searchTerm && filteredTeachers.length > 0 && (
                            <div className="text-xs sm:text-sm text-gray-500 pt-2">
                                {filteredTeachers.length} résultat{filteredTeachers.length > 1 ? 's' : ''} trouvé{filteredTeachers.length > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* GRILLE RESPONSIVE DES FORMATEURS */}
                {filteredTeachers.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                            <AnimatePresence>
                                {currentTeachers.map((teacher: Teacher) => (
                                    <TeacherCard
                                        key={teacher.id}
                                        teacher={teacher}
                                        onPreview={handlePreview}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isMobile={isMobile}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* PAGINATION RESPONSIVE */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                    <span className="hidden sm:inline">Affichage de </span>
                                    <span className="font-medium">{indexOfFirstTeacher + 1}</span> -{" "}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastTeacher, filteredTeachers.length)}
                                    </span>{" "}
                                    sur <span className="font-medium">{filteredTeachers.length}</span>
                                </div>
                                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-2 sm:px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm flex items-center gap-1"
                                    >
                                        <FaChevronLeft size={10} />
                                        <span className="hidden sm:inline">Précédent</span>
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
                                                    className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm transition-all ${currentPage === pageNum
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
                                    <span className="px-2 sm:hidden py-1.5 text-xs text-gray-500">
                                        {currentPage} / {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-2 sm:px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm flex items-center gap-1"
                                    >
                                        <span className="hidden sm:inline">Suivant</span>
                                        <FaChevronRight size={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-16 text-center"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <FaUserTie size={28} className="text-gray-400 sm:text-4xl" />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                                {searchTerm || specialtyFilter !== "all" ? "Aucun formateur trouvé" : "Aucun formateur enregistré"}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 max-w-md text-center">
                                {(searchTerm || specialtyFilter !== "all")
                                    ? "Essayez avec d'autres critères de recherche"
                                    : "Commencez par ajouter votre premier formateur à l'équipe pédagogique"}
                            </p>
                            {!(searchTerm || specialtyFilter !== "all") && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium flex items-center gap-2 hover:shadow-md transition-all text-sm"
                                >
                                    <FaPlus size={14} /> Ajouter un formateur
                                </button>
                            )}
                            {(searchTerm || specialtyFilter !== "all") && (
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* MODALE D'AJOUT/ÉDITION */}
            <AddTeacherModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onRefresh={fetchTeachers}
                editData={selectedTeacher}
            />

            {/* MODALE D'APERÇU RESPONSIVE */}
            <AnimatePresence>
                {isPreviewModalOpen && previewTeacher && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* En-tête sticky */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center">
                                        <FaEye size={16} className="sm:text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-xl font-bold text-gray-800">Aperçu du formateur</h2>
                                        <p className="text-xs sm:text-sm text-gray-500">Informations complètes</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClosePreviewModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center ml-auto sm:ml-0"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>

                            {/* Contenu avec scroll */}
                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                {/* En-tête avec photo et infos */}
                                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg flex-shrink-0 self-center sm:self-auto">
                                            <span className="text-2xl sm:text-3xl font-bold">
                                                {previewTeacher.user?.name?.charAt(0)?.toUpperCase() || 'F'}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{previewTeacher.user?.name || 'Nom inconnu'}</h3>
                                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mt-2">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    {previewTeacher.specialty || 'Spécialité non définie'}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${previewTeacher.status === 'actif'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${previewTeacher.status === 'actif' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`}></span>
                                                    {previewTeacher.status === 'actif' ? 'Actif' : previewTeacher.status || 'En attente'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grille d'informations */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaEnvelope className="text-blue-500 text-sm" />
                                            Contact
                                        </h4>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <p className="text-[10px] sm:text-xs text-gray-500">Email</p>
                                                <p className="text-xs sm:text-sm text-gray-800 break-all">{previewTeacher.user?.email || 'Non renseigné'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] sm:text-xs text-gray-500">Téléphone</p>
                                                <p className="text-xs sm:text-sm text-gray-800">{previewTeacher.phone || 'Non renseigné'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaAward className="text-blue-500 text-sm" />
                                            Informations professionnelles
                                        </h4>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <p className="text-[10px] sm:text-xs text-gray-500">Spécialité</p>
                                                <p className="text-xs sm:text-sm text-gray-800">{previewTeacher.specialty || 'Non définie'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] sm:text-xs text-gray-500">Expertise</p>
                                                <p className="text-xs sm:text-sm text-gray-800">{previewTeacher.expertise || 'Non renseignée'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Biographie */}
                                {previewTeacher.bio && (
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                                            <FaIdCard className="text-blue-500 text-sm" />
                                            Biographie
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{previewTeacher.bio}</p>
                                    </div>
                                )}

                                {/* Formations enseignées */}
                                {previewTeacher.trainings && previewTeacher.trainings.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                                            <FaBook className="text-blue-500 text-sm" />
                                            Formations enseignées
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {previewTeacher.trainings.map((training: Training, index: number) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                                                    {typeof training === 'string' ? training : training.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Composant StatCard
const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
    <motion.div
        whileHover={{ y: -3 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-[10px] sm:text-sm font-medium">{label}</p>
                <p className="text-lg sm:text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md`}>
                <Icon size={14} className="sm:text-xl" />
            </div>
        </div>
    </motion.div>
);

export default Formateurs;