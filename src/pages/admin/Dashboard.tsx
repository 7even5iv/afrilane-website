import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
    FaChartLine, FaUsers, FaBookOpen, FaCalendarAlt,
    FaTasks, FaGraduationCap, FaCog, FaSignOutAlt,
    FaUserCircle, FaBriefcase, FaFileSignature,
    FaChevronLeft, FaChevronRight, FaBell,
    FaSearch, FaMoon, FaSun, FaEdit, FaBars, FaTimes
} from 'react-icons/fa';

// Import des sous-modules (à créer à l'étape suivante)
import DashboardOverview from './DashboardOverview';
import Etudiants from './Etudiants';
import FormationsAdmin from './Formations';
import Utilisateurs from './Utilisateurs';
import Formateurs from './Formateurs';
import Notes from './Notes';
import Stages from './Stages';
import Epreuves from './Epreuves';
import Presences from './Presences';
import CahierTexte from './CahierTexte';
import CourseModules from './CourseModules';
import Parametres from './Parametres';
import Planning from './Planning';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Détecter la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileMenuOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
        { id: 'etudiants', label: 'Étudiants', icon: FaGraduationCap },
        { id: 'formations', label: 'Formations', icon: FaBookOpen },
        { id: 'formateurs', label: 'Formateurs', icon: FaUsers },
        { id: 'course-modules', label: 'Modules (UE)', icon: FaBookOpen },
        { id: 'cahierTexte', label: 'Cahier de texte', icon: FaEdit },
        { id: 'notes', label: 'Notes', icon: FaFileSignature },
        { id: 'presences', label: 'Présences', icon: FaCalendarAlt },
        { id: 'planning', label: 'Planning', icon: FaTasks },
        { id: 'stages', label: 'Stages', icon: FaBriefcase },
        { id: 'epreuves', label: 'Épreuves', icon: FaFileSignature },
        { id: 'utilisateurs', label: 'Utilisateurs', icon: FaUserCircle },
        { id: 'parametres', label: 'Paramètres', icon: FaCog },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard': return <DashboardOverview />;
            case 'etudiants': return <Etudiants />;
            case 'formations': return <FormationsAdmin />;
            case 'formateurs': return <Formateurs />;
            case 'course-modules': return <CourseModules />;
            case 'utilisateurs': return <Utilisateurs />;
            case 'notes': return <Notes />;
            case 'stages': return <Stages />;  
            case 'epreuves': return <Epreuves />; 
            case 'presences': return <Presences />;
            case 'cahierTexte': return <CahierTexte />;
            case 'parametres': return <Parametres />;
            case 'planning': return <Planning />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                            <FaTasks size={36} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Module en développement</h2>
                        <p className="text-gray-400 text-sm md:text-base">Le module {activeSection} sera bientôt disponible</p>
                    </div>
                );
        }
    };

    // Menu mobile overlay
    const MobileMenu = () => (
        <AnimatePresence>
            {isMobileMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 left-0 w-72 h-full bg-white border-r border-gray-200 flex flex-col z-50 md:hidden shadow-xl"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="text-2xl font-black tracking-tighter text-gray-800">
                                    Afrilane <span className="text-blue-600">Admin</span>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mt-1">Système de Gestion</p>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FaTimes size={18} className="text-gray-500" />
                            </button>
                        </div>

                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl font-medium transition-all duration-200 ${activeSection === item.id
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <item.icon size={18} className={activeSection === item.id ? "text-blue-600" : "text-gray-400"} />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm transition-all duration-200"
                            >
                                <FaSignOutAlt size={18} />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* SIDEBAR - Desktop */}
            {!isMobile && (
                <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen shadow-sm transition-all duration-300 z-20 hidden md:flex`}>
                    <div className={`p-6 border-b border-gray-100 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
                        {!isSidebarCollapsed && (
                            <div>
                                <div className="text-2xl font-black tracking-tighter text-gray-800">
                                    Afrilane <span className="text-blue-600">Admin</span>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mt-1">Système de Gestion</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            {isSidebarCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4 custom-scrollbar">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-4 p-3 rounded-xl font-medium transition-all duration-200 group relative ${activeSection === item.id
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon size={18} className={activeSection === item.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} />
                                {!isSidebarCollapsed && (
                                    <span className="text-sm">{item.label}</span>
                                )}
                                {isSidebarCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm transition-all duration-200"
                        >
                            <FaSignOutAlt size={18} />
                            {!isSidebarCollapsed && <span>Déconnexion</span>}
                        </button>
                    </div>
                </aside>
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto w-full min-w-0">
                {/* Header moderne et responsive */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 sm:px-6 md:px-10 py-3 md:py-4">
                    <div className="flex justify-between items-center gap-3">
                        {/* Menu burger pour mobile */}
                        {isMobile && (
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                            >
                                <FaBars size={20} />
                            </button>
                        )}

                        {/* Barre de recherche - responsive */}
                        <div className={`flex items-center gap-4 flex-1 ${isMobile ? 'ml-0' : ''}`}>
                            <div className="relative flex-1 max-w-full md:max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder={isMobile ? "Rechercher..." : "Rechercher un étudiant, formation..."}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm"
                                />
                            </div>
                        </div>

                        {/* Actions header */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative text-gray-600">
                                <FaBell size={16} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                            >
                                {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                            </button>

                            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md text-sm">
                                    AD
                                </div>
                                <div className="hidden sm:block">
                                    <p className="font-semibold text-gray-800 text-sm">Administrateur</p>
                                    <p className="text-xs text-gray-400">Super Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Title - responsive */}
                <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-3 sm:pb-4">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 capitalize">
                            {menuItems.find(i => i.id === activeSection)?.label}
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            Gérez et supervisez l'ensemble de vos données
                        </p>
                    </motion.div>
                </div>

                {/* Content Area - responsive avec overflow-x-auto */}
                <div className="px-4 sm:px-6 md:px-10 pb-8 sm:pb-10 overflow-x-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Menu mobile */}
            <MobileMenu />
        </div>
    );
};

export default Dashboard;