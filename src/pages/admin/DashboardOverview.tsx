import { motion } from "framer-motion";
import {
    FaUsers, FaFileSignature, FaChartLine,
    FaBookOpen, FaCalendarAlt,
    FaArrowRight, FaTrophy, FaClock, FaCheckCircle,  FaEnvelope,
    FaUserGraduate, FaUserTie, FaComments
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        students: 0,
        teachers: 0,
        formations: 0,
        messages: 0,
        certifications: 0,
        avgGrade: 14.2
    });
    const [recentMessages, setRecentMessages] = useState<any[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            };

            try {
                // Récupérer les statistiques globales
                const [studentsRes, teachersRes, formationsRes, messagesRes, gradesRes] = await Promise.all([
                    fetch("http://localhost:8000/api/students", { headers }),
                    fetch("http://localhost:8000/api/teachers", { headers }),
                    fetch("http://localhost:8000/api/trainings", { headers }),
                    fetch("http://localhost:8000/api/admin/messages", { headers }), // ✅ URL corrigée
                    fetch("http://localhost:8000/api/grades", { headers })
                ]);

                const students = await studentsRes.json();
                const teachers = await teachersRes.json();
                const formations = await formationsRes.json();
                const messages = await messagesRes.json();
                const grades = await gradesRes.json();

                // Calculer la moyenne générale
                let avgGrade = 0;
                if (Array.isArray(grades) && grades.length > 0) {
                    const total = grades.reduce((acc, g) => acc + (g.cc_score * 0.4 + g.exam_score * 0.6), 0);
                    avgGrade = total / grades.length;
                }

                setStatsData({
                    students: Array.isArray(students) ? students.length : 0,
                    teachers: Array.isArray(teachers) ? teachers.length : 0,
                    formations: Array.isArray(formations) ? formations.length : 0,
                    messages: Array.isArray(messages) ? messages.length : 0,
                    certifications: 12,
                    avgGrade: avgGrade || 14.2
                });

                // Récupérer les derniers messages
                if (Array.isArray(messages)) {
                    setRecentMessages(messages.slice(0, 4));
                }

                // Activités récentes simulées
                setRecentActivities([
                    { id: 1, action: "Nouvel étudiant inscrit", user: "Jean Dupont", time: "Il y a 5 minutes", icon: FaUserGraduate, color: "text-blue-600" },
                    { id: 2, action: "Nouvelle formation ajoutée", user: "Développement Web", time: "Il y a 1 heure", icon: FaBookOpen, color: "text-emerald-600" },
                    { id: 3, action: "Note modifiée", user: "Mathématiques - Examen", time: "Il y a 3 heures", icon: FaFileSignature, color: "text-purple-600" },
                    { id: 4, action: "Nouveau formateur", user: "Mme. Sarah Johnson", time: "Il y a 5 heures", icon: FaUserTie, color: "text-cyan-600" },
                ]);

            } catch (error) {
                console.error("Erreur de chargement du dashboard:", error);
                setError("Impossible de charger les données du tableau de bord");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { label: "Étudiants", value: statsData.students, trend: "+12%", icon: FaUserGraduate, color: "from-blue-500 to-blue-600" },
        { label: "Formateurs", value: statsData.teachers, trend: "+2%", icon: FaUserTie, color: "from-cyan-500 to-cyan-600" },
        { label: "Formations", value: statsData.formations, trend: "+3%", icon: FaBookOpen, color: "from-emerald-500 to-emerald-600" },
        { label: "Moyenne générale", value: `${statsData.avgGrade.toFixed(1)}/20`, trend: "+0.5", icon: FaChartLine, color: "from-purple-500 to-purple-600" },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <FaChartLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-xl" />
            </div>
            <p className="mt-6 text-gray-500 font-medium">Analyse des données en cours...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaChartLine className="text-red-500 text-3xl" />
            </div>
            <p className="text-red-600 font-medium mb-2">Erreur de chargement</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
                Réessayer
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* EN-TÊTE */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FaChartLine className="text-blue-600 text-xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
                    </div>
                    <p className="text-gray-500 ml-14">Bienvenue dans votre espace d'administration AFRILANE</p>
                </div>

                {/* STATISTIQUES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md text-white`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* GRAPHIQUES ET ACTIVITÉS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Performances académiques */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Performances académiques</h3>
                                <p className="text-sm text-gray-500 mt-1">Moyennes par formation</p>
                            </div>
                            <FaChartLine className="text-gray-200 text-3xl" />
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "Développement Web", average: 15.2, color: "bg-blue-500" },
                                { name: "Data Science", average: 14.8, color: "bg-cyan-500" },
                                { name: "Design UI/UX", average: 16.1, color: "bg-emerald-500" },
                                { name: "Marketing Digital", average: 13.5, color: "bg-purple-500" }
                            ].map((course, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{course.name}</span>
                                        <span className="text-sm font-bold text-gray-800">{course.average}/20</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(course.average / 20) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                            className={`${course.color} h-2 rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">89%</p>
                                <p className="text-xs text-gray-500 mt-1">Taux de réussite</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{statsData.students}</p>
                                <p className="text-xs text-gray-500 mt-1">Étudiants actifs</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{statsData.formations}</p>
                                <p className="text-xs text-gray-500 mt-1">Cours en ligne</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activités récentes */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Activités récentes</h3>
                                <p className="text-sm text-gray-500 mt-1">Dernières mises à jour</p>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                <FaComments className="text-blue-600 text-sm" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((activity, idx) => {
                                const Icon = activity.icon;
                                return (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + idx * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center ${activity.color}`}>
                                            <Icon size={14} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{activity.user}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <FaClock className="text-gray-400 text-xs" />
                                                <span className="text-xs text-gray-400">{activity.time}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <Link to="/admin/activities">
                            <button className="w-full mt-6 py-3 rounded-xl bg-gray-50 text-gray-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                                <FaCheckCircle size={14} />
                                Voir toutes les activités
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* DERNIERS MESSAGES */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Derniers messages</h3>
                            <p className="text-sm text-gray-500 mt-1">Messages reçus via le formulaire de contact</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FaEnvelope className="text-blue-600 text-sm" />
                        </div>
                    </div>

                    {recentMessages.length > 0 ? (
                        <div className="space-y-3">
                            {recentMessages.map((msg, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                        {msg.full_name?.charAt(0) || msg.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-800 text-sm">
                                                {msg.full_name || msg.name || 'Anonyme'}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {msg.created_at ? new Date(msg.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-blue-600 font-medium mt-0.5">
                                            {msg.subject || 'Sans sujet'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {msg.message || msg.content || 'Aucun message'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaEnvelope className="text-gray-200 text-4xl mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Aucun message reçu</p>
                        </div>
                    )}

                    {recentMessages.length > 0 && (
                        <Link to="/admin/messages">
                            <button className="w-full mt-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                                Voir tous les messages
                                <FaArrowRight size={12} />
                            </button>
                        </Link>
                    )}
                </motion.div>

                {/* MINI STATISTIQUES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MiniStat icon={FaTrophy} label="Taux réussite" value="89%" color="text-amber-500" bg="bg-amber-50" />
                    <MiniStat icon={FaUsers} label="Taux assiduité" value="94%" color="text-blue-500" bg="bg-blue-50" />
                    <MiniStat icon={FaFileSignature} label="Examens finis" value="32" color="text-purple-500" bg="bg-purple-50" />
                    <MiniStat icon={FaCalendarAlt} label="Jours restants" value="45" color="text-emerald-500" bg="bg-emerald-50" />
                </div>
            </div>
        </div>
    );
};

// COMPOSANT MINISTAT
const MiniStat = ({ icon: Icon, label, value, color, bg }: any) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={color} size={18} />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </motion.div>
);

export default DashboardOverview;