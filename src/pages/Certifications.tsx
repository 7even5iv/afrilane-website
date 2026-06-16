import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CERTIFICATIONS_DATA, CATEGORIES } from "../constants";
import {
    FaAward,
    FaHistory,
    FaCheckCircle,
    FaUserPlus,
    FaInfoCircle,
    FaStar,
    FaSearch,
    FaTimes,
    FaFilter,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";
import CertificationModal from "../components/ui/CertificationModal";

interface Certification {
    id: string;
    name: string;
    provider: string;
    category: string;
    trainingPrice: number;
    examPrice: number;
    duration: string;
    description: string;
    image: string;
    skills?: string[];
    popularity?: number;
}

const Certifications = () => {
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
    const [sortBy, setSortBy] = useState<"name" | "price" | "popularity">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Détection des écrans
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 640);
            setIsTablet(width >= 640 && width < 1024);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const filterAndSearchCerts = useMemo(() => {
        let filtered = CERTIFICATIONS_DATA as any[];

        if (activeCategory !== "Tous") {
            filtered = filtered.filter((cert) => cert.category === activeCategory);
        }

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((cert) => {
                const nameMatch = cert.name.toLowerCase().includes(query);
                const descMatch = cert.description.toLowerCase().includes(query);
                const providerMatch = cert.provider.toLowerCase().includes(query);
                const categoryMatch = cert.category.toLowerCase().includes(query);
                const skillsMatch = cert.skills?.some((skill: string) =>
                    skill.toLowerCase().includes(query)
                );
                const priceMatch = cert.trainingPrice.toString().includes(query) ||
                    cert.examPrice?.toString().includes(query);
                const durationMatch = cert.duration.toLowerCase().includes(query);

                return nameMatch || descMatch || providerMatch ||
                    categoryMatch || skillsMatch || priceMatch || durationMatch;
            });
        }

        filtered = [...filtered].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "price":
                    comparison = a.trainingPrice - b.trainingPrice;
                    break;
                case "popularity":
                    comparison = (a.popularity || 0) - (b.popularity || 0);
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [activeCategory, searchQuery, sortBy, sortOrder]);

    const handleOpenModal = (certification: any) => {
        setSelectedCertification(certification);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCertification(null);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24">

            {/* Background Effects optimisés */}
            <div className="absolute top-0 left-0 w-32 xs:w-48 sm:w-64 md:w-80 lg:w-96 h-32 xs:h-48 sm:h-64 md:h-80 lg:h-96 bg-blue-400/10 rounded-full blur-xl xs:blur-2xl sm:blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-32 xs:w-48 sm:w-64 md:w-80 lg:w-96 h-32 xs:h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-300/10 rounded-full blur-xl xs:blur-2xl sm:blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] xs:w-[400px] sm:w-[600px] md:w-[800px] h-[300px] xs:h-[400px] sm:h-[600px] md:h-[800px] bg-blue-200/5 rounded-full blur-2xl sm:blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">

                {/* HEADER responsive */}
                <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-blue-50 border border-blue-200 rounded-full px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 mb-3 xs:mb-4 sm:mb-6"
                    >
                        <FaStar className="text-blue-500 text-[8px] xs:text-[10px] sm:text-xs" />
                        <span className="text-[8px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-600">
                            Certifications internationales
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-gray-900 leading-tight mb-2 xs:mb-3 sm:mb-4 md:mb-6 px-2"
                    >
                        Développez vos{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            compétences IT
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-500 max-w-3xl mx-auto px-3 xs:px-4 sm:px-6 leading-relaxed"
                    >
                        Accédez aux certifications les plus demandées du marché
                        et boostez votre carrière avec des formations reconnues
                        mondialement.
                    </motion.p>
                </div>

                {/* BARRE DE RECHERCHE ET FILTRES - Responsive */}
                <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 items-stretch xs:items-center">
                        {/* Barre de recherche */}
                        <div className="relative flex-1 w-full xs:max-w-sm sm:max-w-md md:max-w-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={isMobile ? "Rechercher..." : "Rechercher une certification..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 pl-8 xs:pl-9 sm:pl-11 pr-7 xs:pr-8 sm:pr-10 rounded-lg sm:rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                                />
                                <FaSearch className="absolute left-2.5 xs:left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] xs:text-xs sm:text-sm" />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-2 xs:right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FaTimes className="text-[10px] xs:text-xs sm:text-sm" />
                                    </button>
                                )}
                            </div>
                            {/* Suggestions de recherche */}
                            {searchQuery && filterAndSearchCerts.length > 0 && (
                                <div className="absolute mt-1 xs:mt-2 w-full bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 py-1 xs:py-2 z-20 max-h-40 xs:max-h-48 sm:max-h-60 overflow-y-auto">
                                    <div className="px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 text-[8px] xs:text-[10px] sm:text-xs text-gray-400 font-medium">
                                        {filterAndSearchCerts.length} résultat(s)
                                    </div>
                                    {filterAndSearchCerts.slice(0, 5).map((cert) => (
                                        <button
                                            key={cert.id}
                                            onClick={() => {
                                                setSearchQuery(cert.name);
                                            }}
                                            className="w-full text-left px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 hover:bg-blue-50 transition-colors flex items-center gap-1.5 xs:gap-2 sm:gap-3"
                                        >
                                            <FaAward className="text-blue-500 text-[8px] xs:text-[10px] sm:text-xs flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                    {cert.name}
                                                </div>
                                                <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500 truncate">
                                                    {cert.provider} • {cert.category}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Boutons d'action - Responsive */}
                        <div className="flex flex-wrap gap-1.5 xs:gap-2 sm:gap-3 w-full xs:w-auto">
                            {/* Bouton Filtres */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex-1 xs:flex-none flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700"
                            >
                                <FaFilter className="text-blue-500 text-[10px] xs:text-xs sm:text-sm" />
                                <span>{isMobile ? 'Filtres' : isTablet ? 'Filtres' : 'Filtres'}</span>
                            </button>

                            {/* Tri déroulant */}
                            <div className="relative flex-1 xs:flex-none min-w-[80px] xs:min-w-[100px] sm:min-w-[120px]">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 pr-6 xs:pr-7 sm:pr-10 rounded-lg sm:rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 transition-all duration-300"
                                >
                                    <option value="name">Nom</option>
                                    <option value="price">Prix</option>
                                    <option value="popularity">Populaire</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                    className="absolute right-1 xs:right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {sortOrder === "asc" ?
                                        <FaSortAmountUp className="text-[10px] xs:text-xs sm:text-sm" /> :
                                        <FaSortAmountDown className="text-[10px] xs:text-xs sm:text-sm" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filtres avancés - Responsive */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-2 xs:mt-3 sm:mt-4 p-2.5 xs:p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200">
                                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                                        {/* Filtre par prix */}
                                        <div>
                                            <label className="block text-[8px] xs:text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 xs:mb-1.5 sm:mb-2">
                                                Prix max
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="500000"
                                                step="10000"
                                                className="w-full"
                                                onChange={(e) => {
                                                    console.log("Prix max:", e.target.value);
                                                }}
                                            />
                                            <div className="flex justify-between text-[8px] xs:text-[10px] sm:text-xs text-gray-400 mt-0.5 xs:mt-1">
                                                <span>0 FCFA</span>
                                                <span>500K FCFA</span>
                                            </div>
                                        </div>

                                        {/* Filtre par durée */}
                                        <div>
                                            <label className="block text-[8px] xs:text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 xs:mb-1.5 sm:mb-2">
                                                Durée
                                            </label>
                                            <select className="w-full px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-white text-[10px] xs:text-xs sm:text-sm">
                                                <option value="">Toutes</option>
                                                <option value="1-3 mois">1-3 mois</option>
                                                <option value="3-6 mois">3-6 mois</option>
                                                <option value="6-12 mois">6-12 mois</option>
                                                <option value="12+ mois">12+ mois</option>
                                            </select>
                                        </div>

                                        {/* Filtre par provider */}
                                        <div className="xs:col-span-2 lg:col-span-1">
                                            <label className="block text-[8px] xs:text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 xs:mb-1.5 sm:mb-2">
                                                Fournisseur
                                            </label>
                                            <select className="w-full px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-white text-[10px] xs:text-xs sm:text-sm">
                                                <option value="">Tous</option>
                                                {Array.from(new Set(CERTIFICATIONS_DATA.map(c => c.provider))).map(provider => (
                                                    <option key={provider} value={provider}>{provider}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* FILTRES catégories - Responsive */}
                <div className="flex flex-wrap justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-0.5 xs:px-1">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.button
                            key={cat}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative px-2 xs:px-2.5 sm:px-4 md:px-6 py-1 xs:py-1.5 sm:py-2 md:py-2.5 rounded-full font-semibold text-[8px] xs:text-[10px] sm:text-xs md:text-sm transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Résultats - Responsive */}
                <div className="mb-2 xs:mb-3 sm:mb-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1.5 xs:gap-2">
                    <span className="text-[10px] xs:text-xs sm:text-sm text-gray-500">
                        {filterAndSearchCerts.length} certification{filterAndSearchCerts.length > 1 ? 's' : ''}
                    </span>
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="text-[10px] xs:text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Effacer la recherche
                        </button>
                    )}
                </div>

                {/* GRID responsive */}
                <motion.div
                    layout
                    className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filterAndSearchCerts.map((cert, idx) => (
                            <motion.div
                                key={cert.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                whileHover={{ y: isMobile ? 0 : -4 }}
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                {/* Image de fond */}
                                <div className="absolute inset-0">
                                    <img
                                        src={cert.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"}
                                        alt={cert.name}
                                        className="w-full h-full object-cover opacity-30 xs:opacity-40 sm:opacity-40 group-hover:opacity-20 transition-all duration-700 scale-110 group-hover:scale-100"
                                    />
                                    <div className="absolute inset-0 bg-white/70 xs:bg-white/60 backdrop-blur-[0.5px] xs:backdrop-blur-[1px] group-hover:bg-white/80 transition-all duration-500"></div>
                                </div>

                                {/* Contenu principal */}
                                <div className="relative z-10 p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col h-full">

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2 xs:mb-3 sm:mb-4 md:mb-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                            <div className="relative h-9 xs:h-11 sm:h-12 md:h-14 w-9 xs:w-11 sm:w-12 md:w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                                                <FaAward size={isMobile ? 14 : isTablet ? 18 : 22} />
                                            </div>
                                        </div>
                                        <span className="bg-white/80 backdrop-blur-sm border border-gray-200 text-blue-600 text-[6px] xs:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-full truncate max-w-[60px] xs:max-w-[80px] sm:max-w-none">
                                            {cert.provider}
                                        </span>
                                    </div>

                                    {/* Titre */}
                                    <h3 className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-1.5 xs:mb-2 sm:mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                        {searchQuery ? (
                                            <HighlightText text={cert.name} highlight={searchQuery} />
                                        ) : (
                                            cert.name
                                        )}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm leading-relaxed mb-3 xs:mb-4 sm:mb-6 line-clamp-2">
                                        {cert.description}
                                    </p>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-3 xs:mb-4 sm:mb-6">
                                        <div className="flex items-center gap-0.5 xs:gap-1 bg-white/80 backdrop-blur-sm border border-gray-100 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-600">
                                            <FaHistory className="text-blue-500 text-[6px] xs:text-[8px] sm:text-xs" />
                                            <span className="truncate max-w-[40px] xs:max-w-[60px] sm:max-w-none">{cert.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 xs:gap-1 bg-white/80 backdrop-blur-sm border border-gray-100 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-600">
                                            <FaCheckCircle className="text-blue-500 text-[6px] xs:text-[8px] sm:text-xs" />
                                            <span className="truncate max-w-[40px] xs:max-w-[60px] sm:max-w-none">{cert.category}</span>
                                        </div>
                                        {cert.popularity !== undefined && cert.popularity > 0 && (
                                            <div className="flex items-center gap-0.5 xs:gap-1 bg-yellow-50 border border-yellow-200 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-lg text-[8px] xs:text-[10px] sm:text-xs font-medium text-yellow-700">
                                                <FaStar className="text-yellow-500 text-[6px] xs:text-[8px] sm:text-xs" />
                                                <span>{cert.popularity}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Prix */}
                                    <div className="mb-3 xs:mb-4 sm:mb-6 pt-2 xs:pt-3 sm:pt-4 border-t border-gray-200/50">
                                        <span className="text-[6px] xs:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                            Tarif formation
                                        </span>
                                        <div className="flex items-baseline gap-0.5 xs:gap-1 mt-0.5 xs:mt-1">
                                            <span className="text-base xs:text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
                                                {Number(cert.trainingPrice).toLocaleString()}
                                            </span>
                                            <span className="text-[8px] xs:text-xs sm:text-sm font-medium text-gray-500">
                                                FCFA
                                            </span>
                                        </div>
                                        {cert.examPrice > 0 && (
                                            <div className="mt-1 xs:mt-1.5 sm:mt-2">
                                                <span className="text-[6px] xs:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                    Examen
                                                </span>
                                                <div className="flex items-baseline gap-0.5 xs:gap-1 mt-0.5">
                                                    <span className="text-sm xs:text-base sm:text-lg md:text-xl font-black text-gray-900">
                                                        {Number(cert.examPrice).toLocaleString()}
                                                    </span>
                                                    <span className="text-[8px] xs:text-[10px] sm:text-sm font-medium text-gray-500">
                                                        FCFA
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions - Responsive */}
                                    <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3 mt-auto">
                                        <button
                                            onClick={() => {
                                                console.log("Détails:", cert);
                                            }}
                                            className="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-2 rounded-lg sm:rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 text-[8px] xs:text-[10px] sm:text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-white hover:border-gray-300"
                                        >
                                            <FaInfoCircle size={isMobile ? 10 : isTablet ? 12 : 14} />
                                            <span className="hidden xs:inline">Détails</span>
                                            <span className="xs:hidden">Info</span>
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(cert)}
                                            className="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 text-[8px] xs:text-[10px] sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-95"
                                        >
                                            <FaUserPlus size={isMobile ? 10 : isTablet ? 12 : 14} />
                                            <span className="hidden xs:inline">S'inscrire</span>
                                            <span className="xs:hidden">Inscrire</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Bordure décorative */}
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Message si aucun résultat */}
                {filterAndSearchCerts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10 xs:py-12 sm:py-16 md:py-20"
                    >
                        <div className="text-gray-400 text-sm xs:text-base sm:text-lg">
                            Aucune certification trouvée pour "{searchQuery}"
                        </div>
                        <button
                            onClick={clearSearch}
                            className="mt-2 xs:mt-3 sm:mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors text-xs xs:text-sm sm:text-base"
                        >
                            Effacer la recherche
                        </button>
                    </motion.div>
                )}
            </div>

            {/* MODALE */}
            <CertificationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                certification={selectedCertification}
            />
        </div>
    );
};

// Composant HighlightText optimisé
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={index} className="bg-yellow-200 text-gray-900 px-0.5 xs:px-1 rounded">
                        {part}
                    </span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
};

export default Certifications;