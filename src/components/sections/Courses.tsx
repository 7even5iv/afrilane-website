import CourseCard from '../ui/CourseCard';
import { COURSES } from '../../constants';

const Courses = () => {
    return (
        <section className="bg-afrilane-light-grey py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-sm font-bold text-afrilane-blue uppercase tracking-[0.2em] mb-2">
                            Nos Programmes
                        </h2>
                        <p className="text-3xl md:text-4xl font-black text-afrilane-dark-grey">
                            Formations <span className="text-blue-600 italic">Certifiantes</span>
                        </p>
                    </div>
                    <button className="mt-4 md:mt-0 text-afrilane-blue font-bold border-b-2 border-afrilane-blue pb-1 hover:text-blue-800 transition-all">
                        Voir tout le catalogue
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COURSES.map((course) => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Courses;