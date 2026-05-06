import Hero from '../components/sections/Hero';
import Courses from '../components/sections/Courses'; // N'oublie pas d'importer le nouveau composant
import PartnerCard from '../components/ui/PartnerCard';
import { PARTNERS } from '../constants';

const Home = () => {
  return (
    <div className="bg-afrilane-white">
      <Hero />

      {/* Section Partenaires */}
      <section className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -top-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PARTNERS.slice(0, 4).map((partner) => (
                <PartnerCard
                  key={partner.name}
                  name={partner.name}
                  logo={partner.logo}
                />
              ))}
            </div>
          </div>
          <p className="text-center mt-16 text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">
            Certifications reconnues mondialement
          </p>
        </div>
      </section>
      {/* Section "Notre Expertise" (Pourquoi Afrilane) */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold text-afrilane-blue uppercase tracking-[0.3em] mb-4">
            Expertise & Ingénierie
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-afrilane-dark-grey mb-16">
            Une expertise <span className="text-afrilane-blue">360°</span> au service de votre SI
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Pilier 1 : Certifications Internationales */}
            <div className="flex flex-col items-center p-8 rounded-3xl hover:bg-afrilane-light-grey transition-all duration-300">
              <div className="h-20 w-20 bg-blue-100 rounded-2xl flex items-center justify-center text-afrilane-blue mb-8">
                {/* Icône diplôme/certification */}
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-afrilane-dark-grey uppercase tracking-tight">Centres de Certification</h4>
              <p className="text-gray-500 leading-relaxed text-sm">
                Partenaire agréé <strong>PECB, Cisco et Huawei</strong>. Nous vous préparons et vous faisons passer les examens internationaux les plus prestigieux du marché.
              </p>
            </div>

            {/* Pilier 2 : Audit & Conseil */}
            <div className="flex flex-col items-center p-8 rounded-3xl hover:bg-afrilane-light-grey transition-all duration-300">
              <div className="h-20 w-20 bg-blue-100 rounded-2xl flex items-center justify-center text-afrilane-blue mb-8">
                {/* Icône Loupe/Analyse */}
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-afrilane-dark-grey uppercase tracking-tight">Audit & Conseil IT</h4>
              <p className="text-gray-500 leading-relaxed text-sm">
                Diagnostic de vos infrastructures, <strong>audit de sécurité</strong> et accompagnement stratégique pour la modernisation de votre système d'information.
              </p>
            </div>

            {/* Pilier 3 : Solutions Entreprises */}
            <div className="flex flex-col items-center p-8 rounded-3xl hover:bg-afrilane-light-grey transition-all duration-300">
              <div className="h-20 w-20 bg-blue-100 rounded-2xl flex items-center justify-center text-afrilane-blue mb-8">
                {/* Icône Réseau/Cloud */}
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-afrilane-dark-grey uppercase tracking-tight">Intégration & Support</h4>
              <p className="text-gray-500 leading-relaxed text-sm">
                Mise en place de solutions <strong>Réseaux, VoIP, Cloud</strong> et infogérance. Nous assurons la disponibilité et la performance de vos outils numériques.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section Formations (sur fond gris clair pour le contraste) */}
      <Courses />

    </div>
  );
};

export default Home;