import Hero from '../components/sections/Hero';
import PartnerCard from '../components/ui/PartnerCard';
import { PARTNERS } from '../constants';

const Home = () => {
  return (
    <div className="bg-afrilane-white">
      <Hero />

      {/* Section Partenaires */}
      <section className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Effet flottant SAFE */}
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
            Partenaires officiels de l'entreprise
          </p>
        </div>
      </section>

      {/* Section suivante */}
      <section className="bg-afrilane-light-grey py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-afrilane-dark-grey">
            Pourquoi choisir Afrilane ?
          </h2>
        </div>
      </section>
    </div>
  );
};

export default Home;