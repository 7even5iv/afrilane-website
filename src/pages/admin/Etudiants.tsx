import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaSearch, FaTimes, FaEdit, FaTrash, FaEye, FaIdCard, FaBook, FaChevronUp, FaChevronDown, FaPrint, FaWallet, FaSpinner } from "react-icons/fa";
import AddStudentModal from './AddStudentModal';
import { useAuth } from '../../components/auth/AuthContext';

// Interfaces TypeScript (Synchronisées avec ton Backend)
interface User { id?: string; name: string; email: string; }
interface Training { id?: string; name: string; code: string; }
interface Student {
    id: string;
    user: User;
    matricule: string;
    status: 'actif' | 'inactif' | 'suspendu' | 'diplome';
    specialite?: Training;
    telephone?: string;
    photo?: string;
    has_required_level?: boolean;
    is_fee_paid?: boolean;
    created_at?: string;
}

const Etudiants = () => {
    const { role: userRole } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [studentsPerPage, setStudentsPerPage] = useState(8);

    // AJOUT : Déclaration des variables manquantes
    const [statusFilter, setStatusFilter] = useState<string>("all"); // AJOUTÉ
    const [currentPage, setCurrentPage] = useState(1); // AJOUTÉ

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setStudentsPerPage(width < 768 ? 5 : 8);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchStudents = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/students", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            const data = await res.json();
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur lors du chargement des étudiants:", error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("⚠️ Supprimer cet étudiant définitivement ?")) {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/students/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) fetchStudents();
            } catch (error) { alert("Erreur de connexion"); }
        }
    };

    const handleDownload = (studentId: string) => {
        const token = localStorage.getItem('token');
        window.open(`http://localhost:8000/api/students/${studentId}/bulletin?token=${token}`, '_blank');
    };

    const filteredStudents = students.filter((s: Student) => {
        const matchesSearch = s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLast = currentPage * studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfLast - studentsPerPage, indexOfLast);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // Composant Image Étudiant
    const StudentAvatar = ({ student, size = "w-10 h-10" }: { student: Student, size?: string }) => {
        const photoUrl = student.photo ? `http://localhost:8000/storage/${student.photo}` : null;
        return (
            <div className={`${size} rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm overflow-hidden flex-shrink-0`}>
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        className="w-full h-full object-cover"
                        alt=""
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                ) : (
                    <span className="text-sm font-black">{student.user?.name?.charAt(0).toUpperCase()}</span>
                )}
            </div>
        );
    };

    // Composant Carte Mobile
    const StudentCard = ({ student }: { student: Student }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <StudentAvatar student={student} size="w-12 h-12" />
                        <div>
                            <p className="font-bold text-sm text-slate-900">{student.user?.name}</p>
                            <code className="text-[10px] text-blue-600 font-mono font-bold uppercase">{student.matricule}</code>
                        </div>
                    </div>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-400">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            <p className="text-xs text-gray-500 font-medium">Spécialité : <span className="text-blue-600 font-bold">{student.specialite?.name || 'Non assigné'}</span></p>
                            <div className="flex gap-2">
                                <button onClick={() => { setPreviewStudent(student); setIsPreviewModalOpen(true); }} className="flex-1 bg-emerald-600 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><FaEye /> Voir</button>
                                {userRole === 'super-admin' && (
                                    <>
                                        <button onClick={() => { setEditingStudent(student); setIsModalOpen(true); }} className="flex-1 bg-blue-600 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><FaEdit /> Modif</button>
                                        <button onClick={() => handleDelete(student.id)} className="flex-1 bg-red-600 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><FaTrash /> Suppr</button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    if (loading) return <div className="pt-40 text-center"><FaSpinner className="animate-spin text-blue-600" size={40} /><p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Mise à jour des dossiers...</p></div>;

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Étudiants</h1>
                {(userRole === 'super-admin' || userRole === 'secretaire') && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                        <FaUserPlus /> Inscrire étudiant
                    </button>
                )}
            </div>

            {/* BARRE DE RECHERCHE AVEC FILTRE DE STATUT */}
            <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher nom ou matricule..."
                        className="w-full pl-12 p-3 bg-gray-50 rounded-xl outline-none"
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* AJOUT : Filtre de statut */}
                <select
                    className="p-3 bg-gray-50 rounded-xl outline-none border border-gray-200"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="suspendu">Suspendu</option>
                    <option value="diplome">Diplômé</option>
                </select>
            </div>

            {/* CONTENU : TABLEAU OU CARTES */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                {isMobile ? (
                    <div className="p-4 space-y-4">
                        {currentStudents.map(s => <StudentCard key={s.id} student={s} />)}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-gray-100 font-black text-[10px] text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="p-6">Étudiant</th>
                                    <th className="p-6">Matricule</th>
                                    <th className="p-6">Spécialité</th>
                                    <th className="p-6">Statut</th> {/* AJOUTÉ */}
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {currentStudents.map(s => (
                                    <tr key={s.id} className="hover:bg-blue-50/20 transition-all">
                                        <td className="p-6 flex items-center gap-4">
                                            <StudentAvatar student={s} />
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">{s.user?.name}</p>
                                                <p className="text-xs text-gray-400">{s.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 font-mono text-blue-600 font-bold text-sm">{s.matricule}</td>
                                        <td className="p-6 text-xs font-bold text-slate-500 uppercase">{s.specialite?.name || "Non assigné"}</td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${s.status === 'actif' ? 'bg-emerald-100 text-emerald-700' :
                                                    s.status === 'inactif' ? 'bg-gray-100 text-gray-700' :
                                                        s.status === 'suspendu' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-purple-100 text-purple-700'
                                                }`}>
                                                {s.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => { setPreviewStudent(s); setIsPreviewModalOpen(true); }} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><FaEye size={12} /></button>
                                                {userRole === 'super-admin' && (
                                                    <>
                                                        <button onClick={() => { setEditingStudent(s); setIsModalOpen(true); }} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><FaEdit size={12} /></button>
                                                        <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><FaTrash size={12} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* AJOUT : PAGINATION */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="text-sm font-bold text-gray-500">
                            Page {currentPage} sur {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>

            <AddStudentModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingStudent(null); }} onRefresh={fetchStudents} editData={editingStudent} />

            {/* MODALE D'APERÇU */}
            <AnimatePresence>
                {isPreviewModalOpen && previewStudent && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                            <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-3"><FaIdCard /> Dossier Académique</h2>
                                <button onClick={() => setIsPreviewModalOpen(false)}><FaTimes /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-gray-100">
                                    <StudentAvatar student={previewStudent} size="w-24 h-24" />
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{previewStudent.user.name}</h3>
                                        <code className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md text-sm">{previewStudent.matricule}</code>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4"><FaBook className="text-blue-500" /><div className="text-xs font-bold uppercase text-gray-400">Formation<p className="text-sm text-slate-800 normal-case font-bold">{previewStudent.specialite?.name || 'Non assigné'}</p></div></div>
                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3 border-2 border-emerald-100"><FaWallet className={previewStudent.is_fee_paid ? "text-emerald-500" : "text-gray-300"} /><div className="text-xs font-bold uppercase text-gray-400">Paiement Inscription<p className="text-sm text-emerald-600 font-black">{previewStudent.is_fee_paid ? "RÉGLÉ" : "À PAYER"}</p></div></div>
                                </div>
                                <button onClick={() => handleDownload(previewStudent.id)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                                    <FaPrint /> Générer Relevé de Notes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Etudiants;