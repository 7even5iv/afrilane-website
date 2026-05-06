interface CourseProps {
    title: string;
    category: string;
    duration: string;
    level: string;
    description: string;
}

const CourseCard = ({ title, category, duration, level, description }: CourseProps) => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-afrilane-blue text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {category}
                </span>
                <span className="text-gray-400 text-sm font-medium">{duration}</span>
            </div>

            <h3 className="text-xl font-bold text-afrilane-dark-grey mb-3 group-hover:text-afrilane-blue transition-colors">
                {title}
            </h3>

            <p className="text-gray-500 text-sm mb-6 flex-grow">
                {description}
            </p>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Niveau: {level}
                </span>
                <button className="text-afrilane-blue font-bold text-sm hover:underline">
                    Détails →
                </button>
            </div>
        </div>
    );
};

export default CourseCard;