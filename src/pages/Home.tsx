import { motion } from "framer-motion";

import Hero from "../components/sections/Hero";
import Courses from "../components/sections/Courses";
import PartnerCard from "../components/ui/PartnerCard";
import Clients from '../components/sections/Clients';
import Testimonials from '../components/sections/Testimonials'; // Importation de la nouvelle section

import { PARTNERS } from "../constants";

const Home = () => {
  const expertiseCards = [
    {
      title: "Centres de Certification",
      description:
        "Partenaire agréé PECB, Cisco et Microsoft. Préparation et passage des examens internationaux les plus recherchés du marché.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
        </svg>
      )
    },
    {
      title: "Audit & Conseil IT",
      description:
        "Audit de sécurité, diagnostic d’infrastructures et accompagnement stratégique pour moderniser votre système d'information.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      )
    },
    {
      title: "Intégration & Support",
      description:
        "Déploiement de solutions Réseaux, VoIP, Cloud et supervision pour garantir performance et disponibilité.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. PARTNERS (CARTES FLOTTANTES) */}
      <section className="relative z-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative -top-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PARTNERS.slice(0, 4).map((partner) => (
                <PartnerCard
                  key={partner.name}
                  name={partner.name}
                  logo={partner.logo}
                />
              ))}
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-16 text-gray-400 font-bold text-xs uppercase tracking-[0.35em]"
          >
            Certifications reconnues mondialement
          </motion.p>
        </div>
      </section>

      {/* 3. EXPERTISE IT (360°) */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <p className="text-sm font-bold text-blue-600 uppercase tracking-[0.35em] mb-4">
              Expertise & Ingénierie
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Une expertise <span className="text-blue-600">360°</span> pour votre transformation digitale
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertiseCards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:border-blue-200 hover:shadow-2xl transition-all duration-500"
              >
                <div className="h-20 w-20 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-8">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{card.description}</p>
                <div className="mt-8 w-12 h-1 rounded-full bg-blue-500 group-hover:w-24 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NOS FORMATIONS */}
      <Courses />

      {/* 5. TÉMOIGNAGES (SOCIAL PROOF) */}
      <Testimonials />

      {/* 6. RÉFÉRENCES CLIENTS */}
      <Clients />
    </div>
  );
};

export default Home;