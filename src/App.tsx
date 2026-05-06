import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On simule un temps de chargement (par exemple 2 secondes)
    // En production, on pourrait attendre que window.onload soit déclenché
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* AnimatePresence permet d'animer la sortie du loader */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Header />
          <main className="flex-grow pt-20">
            <Home />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;