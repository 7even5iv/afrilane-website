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
        <div
            className="relative bg-cover bg-center rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full group min-h-[400px]"
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            {/* Overlay sombre pour la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 group-hover:from-black/50 group-hover:via-black/40 transition-all duration-300"></div>

            {/* Contenu */}
            <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase backdrop-blur-sm">
                        {category}
                    </span>
                    <span className="bg-black/40 text-white/90 text-sm font-medium px-2 py-1 rounded-lg backdrop-blur-sm">
                        {duration}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {title}
                </h3>

                <p className="text-white/90 text-sm mb-6 flex-grow leading-relaxed">
                    {description}
                </p>

                <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                            Niveau:
                        </span>
                        <span className="text-xs font-bold text-blue-300 bg-blue-600/30 px-2 py-1 rounded">
                            {level}
                        </span>
                    </div>
                    <button className="text-white font-bold text-sm hover:text-blue-300 transition-colors flex items-center gap-1 group/btn">
                        Détails
                        <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;