import { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

const AssignModuleModal = ({ isOpen, onClose, teacher }: any) => {
    const [allModules, setAllModules] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Charger tous les modules disponibles
            fetch("http://localhost:8000/api/modules", {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => res.json())
                .then(data => setAllModules(data));

            // Pré-cocher les modules déjà assignés
            setSelectedIds(teacher.course_modules?.map((m: any) => m.id) || []);
        }
    }, [isOpen, teacher]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:8000/api/teachers/${teacher.id}/assign-modules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ module_ids: selectedIds })
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Affectation : {teacher.user.name}</h2>
                    <button onClick={onClose}><FaTimes /></button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-2">
                    {allModules.map(m => (
                        <label key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all">
                            <span className="text-sm font-bold text-slate-700">{m.name}</span>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(m.id)}
                                onChange={() => {
                                    selectedIds.includes(m.id)
                                        ? setSelectedIds(selectedIds.filter(id => id !== m.id))
                                        : setSelectedIds([...selectedIds, m.id])
                                }}
                                className="w-5 h-5 text-blue-600"
                            />
                        </label>
                    ))}
                </div>

                <button onClick={handleSave} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2">
                    <FaSave /> Valider l'affectation
                </button>
            </div>
        </div>
    );
};

export default AssignModuleModal;