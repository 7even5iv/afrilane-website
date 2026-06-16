import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
    FaChartLine, FaBookOpen, FaCalendarAlt,
    FaTasks, FaCog, FaSignOutAlt,
    FaUserCircle, FaBriefcase, FaFileSignature,
    FaChevronLeft, FaChevronRight, FaBell,
    FaSearch, FaMoon, FaSun, FaEdit, FaBars, FaTimes,
    FaShieldAlt,
    FaUserGraduate, FaChalkboardTeacher, FaFileAlt,
} from 'react-icons/fa';

// Import des sous-modules
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
    const [isTablet, setIsTablet] = useState(false);
    const [notifications] = useState(3);

    // RÉCUPÉRATION DES INFOS ACTEUR
    const userRole = localStorage.getItem("user_role") || "etudiant";
    const userName = localStorage.getItem("user_name") || "Utilisateur";

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            const tablet = width >= 768 && width < 1024;
            setIsMobile(mobile);
            setIsTablet(tablet);
            if (!mobile && !tablet) setIsMobileMenuOpen(false);
            // Auto-collapse sidebar on tablet
            if (tablet && !isSidebarCollapsed) setIsSidebarCollapsed(true);
            if (!tablet && isSidebarCollapsed && !isMobile) setIsSidebarCollapsed(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // CONFIGURATION DES DROITS D'ACCÈS
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaChartLine, roles: ['super-admin', 'admin', 'secretaire', 'formateur'] },
        { id: 'etudiants', label: 'Étudiants', icon: FaUserGraduate, roles: ['super-admin', 'admin', 'secretaire'] },
        { id: 'formateurs', label: 'Formateurs', icon: FaChalkboardTeacher, roles: ['super-admin', 'admin'] },
        { id: 'formations', label: 'Formations', icon: FaBriefcase, roles: ['super-admin', 'admin'] },
        { id: 'course-modules', label: 'Modules', icon: FaBookOpen, roles: ['super-admin', 'admin'] },
        { id: 'notes', label: 'Notes', icon: FaFileSignature, roles: ['super-admin', 'formateur'] },
        { id: 'presences', label: 'Présences', icon: FaCalendarAlt, roles: ['super-admin', 'secretaire', 'formateur'] },
        { id: 'cahierTexte', label: 'Cahier de texte', icon: FaEdit, roles: ['super-admin', 'formateur'] },
        { id: 'planning', label: 'Planning', icon: FaTasks, roles: ['super-admin', 'admin', 'secretaire', 'formateur'] },
        { id: 'stages', label: 'Stages', icon: FaBriefcase, roles: ['super-admin', 'secretaire'] },
        { id: 'epreuves', label: 'Épreuves', icon: FaFileAlt, roles: ['super-admin', 'formateur'] },
        { id: 'utilisateurs', label: 'Utilisateurs', icon: FaUserCircle, roles: ['super-admin'] },
        { id: 'parametres', label: 'Paramètres', icon: FaCog, roles: ['super-admin', 'admin'] },
    ];

    // FILTRAGE DYNAMIQUE DU MENU SELON L'ACTEUR
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    const renderContent = () => {
        const currentItem = menuItems.find(i => i.id === activeSection);
        if (currentItem && !currentItem.roles.includes(userRole)) {
            return (
                <div className="flex flex-col items-center justify-center p-8 sm:p-16 text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <FaShieldAlt className="text-red-500 text-2xl sm:text-3xl" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Accès restreint</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">Vous n'avez pas les droits nécessaires pour accéder à ce module.</p>
                </div>
            );
        }

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
            default: return <DashboardOverview />;
        }
    };

    const MobileMenu = () => (
        <AnimatePresence>
            {isMobileMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed top-0 left-0 w-72 h-full bg-white flex flex-col z-50 md:hidden shadow-2xl"
                    >
                        <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="text-lg sm:text-xl font-bold text-gray-800">AFRILANE <span className="text-blue-600">ADMIN</span></div>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{userRole}</p>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all flex items-center justify-center"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
                            {filteredMenuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${activeSection === item.id
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <item.icon size={16} />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                        <div className="p-3 sm:p-4 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all"
                            >
                                <FaSignOutAlt size={16} />
                                <span className="text-sm">Déconnexion</span>
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>

            {/* SIDEBAR DESKTOP & TABLET */}
            {!isMobile && (
                <aside className={`
                    ${isSidebarCollapsed ? 'w-20' : 'w-64'} 
                    bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen 
                    transition-all duration-300 z-20 shadow-sm
                    ${isTablet ? 'hidden lg:flex' : ''}
                `}>
                    <div className={`p-4 lg:p-5 border-b border-gray-100 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
                        {!isSidebarCollapsed && (
                            <div>
                                <span className="text-lg lg:text-xl font-bold text-gray-800 tracking-tight">AFRILANE</span>
                                <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wider mt-0.5">{userRole}</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center"
                        >
                            {isSidebarCollapsed ? <FaChevronRight size={11} /> : <FaChevronLeft size={11} />}
                        </button>
                    </div>

                    <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto mt-2 custom-scrollbar">
                        {filteredMenuItems.map((item) => (
                            <div key={item.id} className="relative group">
                                <button
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 p-2.5 lg:p-3 rounded-xl font-medium transition-all duration-200 ${activeSection === item.id
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <item.icon size={16} />
                                    {!isSidebarCollapsed && <span className="text-xs lg:text-sm">{item.label}</span>}
                                </button>
                                {isSidebarCollapsed && (
                                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="p-2 lg:p-3 border-t border-gray-100 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-2.5 lg:p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all"
                        >
                            <FaSignOutAlt size={16} />
                            {!isSidebarCollapsed && <span className="text-xs lg:text-sm">Déconnexion</span>}
                        </button>
                    </div>
                </aside>
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto w-full min-w-0">
                {/* HEADER */}
                <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        {isMobile && (
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all flex items-center justify-center"
                            >
                                <FaBars size={16} />
                            </button>
                        )}
                        <div className="relative flex-1 max-w-xs sm:max-w-md">
                            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Mode sombre */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all flex items-center justify-center"
                        >
                            {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
                        </button>

                        {/* Notifications */}
                        <button className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all flex items-center justify-center">
                            <FaBell size={14} />
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </button>

                        {/* Profil utilisateur */}
                        <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-gray-200 ml-1 sm:ml-2">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md text-xs sm:text-sm uppercase">
                                {userName.charAt(0)}
                            </div>
                            <div className="hidden md:block">
                                <p className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight">{userName}</p>
                                <p className="text-[9px] sm:text-[10px] text-blue-600 font-medium uppercase tracking-wider flex items-center gap-1">
                                    <FaShieldAlt size={7} /> {userRole}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENU PRINCIPAL */}
                <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
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

            <MobileMenu />
        </div>
    );
};

export default Dashboard;