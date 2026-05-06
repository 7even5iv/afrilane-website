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

      {/* Section "Pourquoi choisir Afrilane ?" - Design Moderne */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold text-afrilane-blue uppercase tracking-widest mb-4">
            Notre Valeur Ajoutée
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-afrilane-dark-grey mb-16">
            Pourquoi faire confiance à <span className="text-afrilane-blue">AFRILANE</span> ?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Argument 1 */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-afrilane-blue mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-afrilane-dark-grey">Centres Agréés</h4>
              <p className="text-gray-500 leading-relaxed">Nous sommes partenaires officiels des plus grands certificateurs (Cisco, PECB, Microsoft).</p>
            </div>

            {/* Argument 2 */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-afrilane-blue mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-afrilane-dark-grey">Experts Certifiés</h4>
              <p className="text-gray-500 leading-relaxed">Nos formateurs sont des professionnels du terrain possédant une vaste expérience pratique.</p>
            </div>

            {/* Argument 3 */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-afrilane-blue mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-4 text-afrilane-dark-grey">Accélération de Carrière</h4>
              <p className="text-gray-500 leading-relaxed">Un taux de réussite exceptionnel aux examens pour une employabilité immédiate.</p>
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