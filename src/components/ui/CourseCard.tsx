interface CourseProps {
    title: string;
    category: string;
    duration: string;
    level: string;
    description: string;
    imageUrl: string;
}

const CourseCard = ({ title, category, duration, level, description, imageUrl }: CourseProps) => {
    const getLevelBadgeStyle = (level: string) => {
        switch (level.toLowerCase()) {
            case 'débutant':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'intermédiaire':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'avancé':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            default:
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        }
    };

    return (
        <div className="group relative h-full min-h-[420px] overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
            {/* Image de fond avec zoom au survol */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Overlay dégradé moderne */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-900/50 group-hover:from-gray-950/90 group-hover:via-gray-950/70 transition-all duration-500" />

            {/* Effet glassmorphism sur le bas */}
            <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent backdrop-blur-sm" />

            {/* Contenu principal */}
            <div className="relative z-10 flex h-full flex-col p-6">
                {/* Header avec badges */}
                <div className="flex items-start justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm ring-1 ring-white/30">
                        {category}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md ring-1 ring-white/20">
                        <svg className="h-3 w-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {duration}
                    </span>
                </div>

                {/* Titre */}
                <div className="mb-3">
                    <h3 className="text-2xl font-bold text-white leading-tight transition-all duration-300 group-hover:text-blue-300 group-hover:translate-x-1">
                        {title}
                    </h3>
                    <div className="mt-2 h-0.5 w-12 bg-blue-400/50 rounded-full transition-all duration-500 group-hover:w-24 group-hover:bg-blue-400" />
                </div>

                {/* Description */}
                <p className="text-gray-200 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {description}
                </p>

                {/* Footer */}
                <div className="pt-5 border-t border-white/10 space-y-4">
                    {/* Niveau */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Niveau
                            </span>
                            <div className="flex gap-1">
                                {['Débutant', 'Intermédiaire', 'Avancé'].map((lvl, idx) => (
                                    <div
                                        key={lvl}
                                        className={`h-1.5 w-6 rounded-full transition-all duration-300 ${level === lvl
                                                ? `bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm shadow-blue-500/50`
                                                : 'bg-gray-600 group-hover:bg-gray-500'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${getLevelBadgeStyle(level)}`}>
                            {level}
                        </span>
                    </div>

                    {/* Bouton Détails */}
                    <button className="group/btn relative overflow-hidden flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-400/50">
                        <span className="text-sm font-semibold text-white">
                            Voir les détails
                        </span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover/btn:bg-blue-500">
                            <svg
                                className="h-3.5 w-3.5 transform text-white transition-transform duration-300 group-hover/btn:translate-x-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>

            {/* Effet de brillance au survol */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute -inset-full h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
            </div>

            {/* Bordure lumineuse au survol */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-white/0 transition-all duration-500 group-hover:ring-white/20" />
        </div>
    );
};

export default CourseCard;