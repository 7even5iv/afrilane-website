interface CourseProps {
    title: string;
    category: string;
    duration: string;
    level: string;
    description: string;
    imageUrl: string;
}

const CourseCard = ({ title, category, duration, level, description, imageUrl }: CourseProps) => {
    return (
        <div className="group relative h-full min-h-[420px] overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]">
            {/* Image de fond avec zoom au survol */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Overlay moderne dégradé bleu profond */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-blue-900/70 to-gray-800/30" />

            {/* Effet glassmorphism sur le bas de la carte */}
            <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm" />

            {/* Contenu principal */}
            <div className="relative flex h-full flex-col justify-between p-6">
                {/* Header avec badges */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="inline-block rounded-full border border-white/30 bg-blue-500/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
                            {category}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
                            <svg className="h-3 w-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-medium text-white">{duration}</span>
                        </div>
                    </div>
                </div>

                {/* Contenu du bas avec glassmorphism */}
                <div className="transform transition-all duration-500 group-hover:translate-y-[-8px]">
                    {/* Titre avec soulignement animé */}
                    <div className="relative mb-3 inline-block">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                            {title}
                        </h3>
                        <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-400 transition-all duration-500 group-hover:w-full" />
                    </div>

                    {/* Description */}
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-200">
                        {description}
                    </p>

                    {/* Métadonnées et actions */}
                    <div className="space-y-4">
                        {/* Niveau avec indicateur visuel */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                                    Niveau
                                </span>
                                <div className="flex gap-1">
                                    {level === 'Débutant' && (
                                        <>
                                            <div className="h-1.5 w-6 rounded-full bg-blue-400" />
                                            <div className="h-1.5 w-6 rounded-full bg-gray-600" />
                                            <div className="h-1.5 w-6 rounded-full bg-gray-600" />
                                        </>
                                    )}
                                    {level === 'Intermédiaire' && (
                                        <>
                                            <div className="h-1.5 w-6 rounded-full bg-blue-400" />
                                            <div className="h-1.5 w-6 rounded-full bg-blue-400" />
                                            <div className="h-1.5 w-6 rounded-full bg-gray-600" />
                                        </>
                                    )}
                                    {level === 'Avancé' && (
                                        <>
                                            <div className="h-1.5 w-6 rounded-full bg-blue-400" />
                                            <div className="h-1.5 w-6 rounded-full bg-blue-400" />
                                            <div className="h-1.5 w-6 rounded-full bg-blue-400" />
                                        </>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-blue-300">
                                {level}
                            </span>
                        </div>

                        {/* Bouton avec effet moderne */}
                        <button className="group/btn flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-blue-400/50 hover:bg-blue-500/20">
                            <span className="text-sm font-semibold text-white">
                                Voir les détails
                            </span>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover/btn:bg-blue-500">
                                <svg
                                    className="h-3.5 w-3.5 transform text-white transition-transform duration-300 group-hover/btn:translate-x-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Effet de brillance au survol */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute -inset-full h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
            </div>
        </div>
    );
};

export default CourseCard;