import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus, FaTrash, FaBook, FaSearch,
    FaEdit, FaClock, FaMoneyBillWave, FaTag,
    FaExclamationTriangle, FaGraduationCap, FaEye,
    FaTimes, FaFilter, FaEllipsisV,
    FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import AddTrainingModal from './AddTrainingModal';

// Interfaces TypeScript
interface Training {
    id: string;
    name: string;
    code: string;
    category: string;
    duration_months: number;
    price: number;
    description?: string;
    prerequisites?: string;
    objectives?: string;
    program?: string;
    status?: string;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
}

interface TrainingCardProps {
    training: Training;
}

const FormationsAdmin = () => {
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
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    // ÉTATS DE PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const trainingsPerPage = 6;

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // FONCTION DE RÉCUPÉRATION
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
            setError("Impossible de charger les formations. Vérifiez la connexion.");
            setTrainings([]);
        } finally {
            setLoading(false);
        }
    };

    // FONCTION DE SUPPRESSION
    const handleDelete = async (id: string) => {
        if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.")) {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/trainings/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    fetchTrainings();
                } else {
                    alert("Erreur lors de la suppression");
                }
            } catch (error) {
                alert("Impossible de contacter le serveur");
            }
        }
    };

    // OUVERTURE MODALE EN MODE ÉDITION
    const handleEdit = (training: Training) => {
        setSelectedTraining(training);
        setIsModalOpen(true);
    };

    // OUVERTURE MODALE APERÇU
    const handlePreview = (training: Training) => {
        setPreviewTraining(training);
        setIsPreviewModalOpen(true);
    };

    // FERMETURE PROPRE DE LA MODALE
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTraining(null);
    };

    // FERMETURE MODALE APERÇU
    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewTraining(null);
    };

    useEffect(() => {
        fetchTrainings();
    }, []);

    // Obtenir toutes les catégories uniques
    const categories = ["all", ...new Set(trainings.map((t: Training) => t.category).filter(Boolean))];

    // LOGIQUE DE FILTRAGE
    let filteredTrainings = trainings.filter((t: Training) =>
        t?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtre par catégorie
    if (categoryFilter !== "all") {
        filteredTrainings = filteredTrainings.filter((t: Training) => t.category === categoryFilter);
    }

    // Tri
    filteredTrainings = [...filteredTrainings].sort((a: Training, b: Training) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "code") return a.code.localeCompare(b.code);
        if (sortBy === "price") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "duration") return (Number(a.duration_months) || 0) - (Number(b.duration_months) || 0);
        return 0;
    });

    // LOGIQUE DE PAGINATION
    const indexOfLastTraining = currentPage * trainingsPerPage;
    const indexOfFirstTraining = indexOfLastTraining - trainingsPerPage;
    const currentTrainings = filteredTrainings.slice(indexOfFirstTraining, indexOfLastTraining);
    const totalPages = Math.ceil(filteredTrainings.length / trainingsPerPage);

    // CALCUL DES STATISTIQUES AVEC PRIX EXACT
    const stats = {
        total: trainings.length,
        categories: new Set(trainings.map((t: Training) => t.category)).size,
        avgDuration: Math.round(trainings.reduce((acc: number, t: Training) => acc + (Number(t.duration_months) || 0), 0) / (trainings.length || 1)),
        totalValue: trainings.reduce((acc: number, t: Training) => acc + (Number(t.price) || 0), 0),
        avgPrice: trainings.reduce((acc: number, t: Training) => acc + (Number(t.price) || 0), 0) / (trainings.length || 1)
    };

    // Composant carte pour mobile avec boutons bien alignés
    const TrainingCard = ({ training }: TrainingCardProps) => {
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
            >
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                                <FaBook size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-base truncate">
                                    {training.name}
                                </p>
                                <code className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">
                                    {training.code}
                                </code>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center flex-shrink-0 ml-2"
                        >
                            <FaEllipsisV size={14} />
                        </button>
                    </div>

                    {/* Badges rapides */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                            <FaTag className="mr-1 text-xs" /> {training.category || 'Non catégorisé'}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                            <FaClock className="mr-1 text-xs" /> {training.duration_months} mois
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700">
                            <FaMoneyBillWave className="mr-1 text-xs" /> {Number(training.price).toLocaleString()} FCFA
                        </span>
                    </div>

                    {/* Détails expansibles avec boutons en colonne sur mobile */}
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
                                    <p className="text-xs text-gray-500 mb-1">Description</p>
                                    <p className="text-sm text-gray-700">
                                        {training.description || 'Aucune description disponible'}
                                    </p>
                                </div>
                                
                                {/* Boutons en colonne sur mobile, ligne sur tablette/desktop */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleEdit(training)}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaEdit size={12} /> Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(training.id)}
                                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaTrash size={12} /> Supprimer
                                    </button>
                                    <button
                                        onClick={() => handlePreview(training)}
                                        className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaEye size={12} /> Aperçu
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
                <FaBook className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-base sm:text-xl" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 font-medium text-sm sm:text-base">Chargement du catalogue...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl sm:text-3xl" />
            </div>
            <p className="text-red-600 font-medium mb-2 text-sm sm:text-base">Erreur de chargement</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 text-center">{error}</p>
            <button
                onClick={fetchTrainings}
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FaBook className="text-blue-600 text-base sm:text-xl" />
                            </div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                Gestion des Formations
                            </h1>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 ml-10 sm:ml-12 md:ml-14">
                        Créez et gérez l'offre de formation d'AFRILANE
                    </p>
                </div>

                {/* STATISTIQUES RESPONSIVES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total formations" value={stats.total} icon={FaBook} color="from-blue-500 to-blue-600" />
                    <StatCard label="Catégories" value={stats.categories} icon={FaTag} color="from-emerald-500 to-emerald-600" />
                    <StatCard label="Durée moyenne" value={`${stats.avgDuration} mois`} icon={FaClock} color="from-purple-500 to-purple-600" />
                    <StatCard label="Prix moyen" value={`${Math.round(stats.avgPrice).toLocaleString()} FCFA`} icon={FaMoneyBillWave} color="from-amber-500 to-amber-600" />
                </div>

                {/* BARRE DE RECHERCHE ET ACTIONS RESPONSIVE */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-1 w-full sm:flex-1">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, code ou catégorie..."
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
                                    <span className="hidden sm:inline">Filtres</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm whitespace-nowrap"
                            >
                                <FaPlus size={14} /> 
                                <span className="hidden sm:inline">Nouvelle formation</span>
                                <span className="inline sm:hidden">Ajouter</span>
                            </button>
                        </div>
                    </div>

                    {/* Panneau de filtres responsive avec animation */}
                    <AnimatePresence>
                        {(isFilterOpen || !isMobile) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-100 overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Catégorie</label>
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => {
                                                setCategoryFilter(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                                        >
                                            {categories.map((cat: string) => (
                                                <option key={cat} value={cat}>
                                                    {cat === "all" ? "Toutes les catégories" : cat}
                                                </option>
                                            ))}
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
                                            <option value="code">Code</option>
                                            <option value="price">Prix</option>
                                            <option value="duration">Durée</option>
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
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Résultats de recherche */}
                    {searchTerm && filteredTrainings.length > 0 && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500">
                            {filteredTrainings.length} formation{filteredTrainings.length > 1 ? 's' : ''} trouvée{filteredTrainings.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* VUE RESPONSIVE : CARTES SUR MOBILE, TABLEAU SUR TABLETTE/DESKTOP */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Version Mobile - Cartes */}
                    {isMobile ? (
                        <div className="divide-y divide-gray-100">
                            {currentTrainings.length > 0 ? (
                                <div className="p-3 space-y-3">
                                    {currentTrainings.map((training: Training) => (
                                        <TrainingCard key={training.id} training={training} />
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                            <FaBook size={28} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium text-sm">
                                            {searchTerm ? "Aucune formation trouvée" : "Aucune formation enregistrée"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {searchTerm ? "Essayez avec d'autres termes" : "Commencez par créer votre première formation"}
                                        </p>
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                Réinitialiser la recherche
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Version Tablette/Desktop - Tableau avec boutons toujours visibles */
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/50">
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Formation</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Durée</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <AnimatePresence>
                                        {currentTrainings.length > 0 ? currentTrainings.map((t: Training) => (
                                            <motion.tr
                                                key={t.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="hover:bg-blue-50/30 transition-colors duration-200"
                                            >
                                                <td className="px-4 md:px-6 py-3 md:py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
                                                            <FaBook size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4">
                                                    <code className="text-xs md:text-sm font-mono text-blue-700 bg-blue-50 px-1.5 md:px-2 py-1 rounded-md">
                                                        {t.code}
                                                    </code>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                                                        {t.category || 'Non catégorisé'}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1 md:gap-2">
                                                        <FaClock className="text-gray-400 text-xs" />
                                                        <span className="text-sm font-medium text-gray-700">{t.duration_months} mois</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 md:gap-2">
                                                        <FaMoneyBillWave className="text-gray-400 text-xs" />
                                                        <span className="text-sm font-bold text-gray-900">{Number(t.price).toLocaleString()} FCFA</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 md:gap-2">
                                                        <button
                                                            onClick={() => handleEdit(t)}
                                                            className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center"
                                                            title="Modifier"
                                                        >
                                                            <FaEdit size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(t.id)}
                                                            className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center"
                                                            title="Supprimer"
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handlePreview(t)}
                                                            className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center"
                                                            title="Aperçu"
                                                        >
                                                            <FaEye size={12} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                            <FaBook size={28} className="text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">
                                                            {searchTerm ? "Aucune formation trouvée" : "Aucune formation enregistrée"}
                                                        </p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {searchTerm ? "Essayez avec d'autres termes" : "Commencez par créer votre première formation"}
                                                        </p>
                                                        {searchTerm && (
                                                            <button
                                                                onClick={() => setSearchTerm("")}
                                                                className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                            >
                                                                Réinitialiser la recherche
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* PAGINATION RESPONSIVE */}
                    {totalPages > 1 && (
                        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                <span className="hidden sm:inline">Affichage de </span>
                                <span className="font-medium">{indexOfFirstTraining + 1}</span> -{" "}
                                <span className="font-medium">
                                    {Math.min(indexOfLastTraining, filteredTrainings.length)}
                                </span>{" "}
                                sur <span className="font-medium">{filteredTrainings.length}</span>
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
                                
                                {/* Version mobile : affichage simplifié */}
                                <span className="px-2 sm:hidden py-1.5 text-xs text-gray-500">
                                    {currentPage} / {totalPages}
                                </span>
                                
                                {/* Version desktop : boutons de pagination */}
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
                                                className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm transition-all ${
                                                    currentPage === pageNum
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                
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
            </div>

            {/* MODALE APERÇU - SANS BOUTONS MODIFIER ET SUPPRIMER */}
            <AnimatePresence>
                {isPreviewModalOpen && previewTraining && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
                        >
                            {/* Header avec icône close bien positionnée */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center">
                                        <FaEye size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Aperçu de la formation</h2>
                                        <p className="text-xs sm:text-sm text-gray-500">Détails complets</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClosePreviewModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors flex items-center justify-center"
                                    aria-label="Fermer"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>
                            
                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                {/* En-tête de la formation */}
                                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 sm:p-6">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
                                            <FaBook size={20} className="sm:text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{previewTraining.name}</h3>
                                            <code className="text-xs sm:text-sm font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded-md inline-block mt-1">
                                                {previewTraining.code}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                {/* Grille d'informations */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaTag className="text-blue-500 text-xs sm:text-sm" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-600">Catégorie</span>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-800 font-medium">
                                            {previewTraining.category || 'Non catégorisé'}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaClock className="text-blue-500 text-xs sm:text-sm" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-600">Durée</span>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-800 font-medium">
                                            {previewTraining.duration_months} mois
                                        </p>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaMoneyBillWave className="text-blue-500 text-xs sm:text-sm" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-600">Prix</span>
                                        </div>
                                        <p className="text-base sm:text-lg text-gray-800 font-bold">
                                            {Number(previewTraining.price).toLocaleString()} FCFA
                                        </p>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaGraduationCap className="text-blue-500 text-xs sm:text-sm" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-600">Statut</span>
                                        </div>
                                        <p className="text-gray-800">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                {previewTraining.description && (
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Description</h4>
                                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                            {previewTraining.description}
                                        </p>
                                    </div>
                                )}

                                {/* Prérequis */}
                                {previewTraining.prerequisites && (
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Prérequis</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">{previewTraining.prerequisites}</p>
                                    </div>
                                )}

                                {/* Objectifs */}
                                {previewTraining.objectives && (
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Objectifs</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">{previewTraining.objectives}</p>
                                    </div>
                                )}

                                {/* Programme */}
                                {previewTraining.program && (
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Programme</h4>
                                        <p className="text-gray-600 whitespace-pre-wrap text-sm sm:text-base">{previewTraining.program}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODALE D'AJOUT/MODIFICATION */}
            <AddTrainingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onRefresh={fetchTrainings}
                editData={selectedTraining}
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

export default FormationsAdmin;