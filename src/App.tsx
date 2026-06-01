import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout publics
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './components/auth/AuthContext';

// Pages publiques
import Home from './pages/Home';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Certifications from './pages/Certifications';
import About from './pages/About';
import Formations from './pages/Formations';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Messages from './pages/admin/Messages';

// UI
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollToTop from './components/ui/ScrollToTop';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Détection améliorée : si l'URL commence par /admin ou est /login ou /register, on cache le Header/Footer public
  const isControlPanel = location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <AnimatePresence>
          {isLoading && <LoadingScreen />}
        </AnimatePresence>

        {!isLoading && (
          <>
            {/* On n'affiche le header public QUE si on n'est pas en admin ou sur les pages d'auth */}
            {!isControlPanel && <Header />}

            {/* Supprimer le padding si on est en admin ou sur les pages d'auth */}
            <main className={`flex-grow ${isControlPanel ? "" : "pt-28 lg:pt-32"}`}>
              <Routes>
                {/* Routes Publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/expertise" element={<Services />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/formations" element={<Formations />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<PostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/messages" element={<Messages />} />

                {/* Route Admin sécurisée */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {/* On n'affiche le footer public QUE si on n'est pas en admin ou sur les pages d'auth */}
            {!isControlPanel && <Footer />}
          </>
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;