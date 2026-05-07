import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Ajout du Router
import { AnimatePresence } from 'framer-motion';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';

// UI Components
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollToTop from './components/ui/ScrollToTop'; // Pour revenir en haut lors du changement de page

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule le chargement du site
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">

        {/* L'écran de chargement s'affiche au-dessus de tout */}
        <AnimatePresence>
          {isLoading && <LoadingScreen />}
        </AnimatePresence>

        {/* Le contenu du site n'apparaît qu'après le chargement */}
        {!isLoading && (
          <>
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Route pour la page d'accueil */}
                <Route path="/" element={<Home />} />

                {/* Routes pour les pages légales */}
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/confidentialite" element={<Confidentialite />} />

                {/* On pourra ajouter /formations, /services, etc. ici plus tard */}
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;