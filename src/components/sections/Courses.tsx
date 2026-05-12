'use client';

import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // 1. Import de Link
import CourseCard from "../ui/CourseCard";
import { COURSES } from "../../constants";

const Courses = () => {
    return (
        <section className="relative py-28 overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

            {/* Blur Effects */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20"
                >

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold text-afrilane-blue uppercase tracking-[0.35em] mb-4">
                            Nos Programmes
                        </p>

                        <h2 className="text-4xl md:text-5xl font-black text-afrilane-dark-grey leading-tight">
                            Formations{" "}
                            <span className="text-blue-600">
                                Certifiantes
                            </span>{" "}
                            & Expertise IT
                        </h2>

                        <p className="mt-6 text-gray-500 leading-relaxed text-lg">
                            Développez des compétences recherchées
                            grâce à des programmes orientés pratique,
                            certifications internationales et projets réels.
                        </p>
                    </div>

                    {/* CTA - LIEN AJOUTÉ ICI */}
                    <Link to="/certifications" className="self-start lg:self-auto">
                        <motion.div
                            whileHover={{
                                scale: 1.04,
                                y: -2
                            }}
                            whileTap={{
                                scale: 0.97
                            }}
                            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl cursor-pointer"
                        >
                            {/* Hover Effect */}
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                            <span className="relative flex items-center gap-2">
                                Voir tout le catalogue
                            </span>
                        </motion.div>
                    </Link>

                </motion.div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {COURSES.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1
                            }}
                            whileHover={{
                                y: -8
                            }}
                        >
                            <CourseCard {...course} />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-24"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 md:p-14 shadow-2xl">
                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
                            <div>
                                <h3 className="text-5xl font-black mb-2">500+</h3>
                                <p className="text-blue-100 font-medium">Professionnels formés</p>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black mb-2">95%</h3>
                                <p className="text-blue-100 font-medium">Taux de satisfaction</p>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black mb-2">20+</h3>
                                <p className="text-blue-100 font-medium">Certifications internationales</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Courses;