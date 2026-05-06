import Header from './components/layout/Header';
import Home from './pages/Home';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20"> {/* pt-20 pour compenser le header fixe */}
        <Home />
      </main>
      {/* On ajoutera le Footer plus tard ici */}
    </div>
  );
}

export default App;