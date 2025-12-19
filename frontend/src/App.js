import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useInfoJoueur } from './pages/InfoJoueurContext';
// Import des pages
import Home from "./pages/home";
import InGame from "./pages/InGame";
import Inscription from "./pages/inscription";
import Login from "./pages/login";
import lobbyCreation from "./pages/lobbyCreation";
import { InfoJoueurProvider } from "./pages/InfoJoueurContext";

// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <InfoJoueurProvider>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobbyCreation" element={<lobbyCreation />} />
          <Route path="/ingame" element={<InGame />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </InfoJoueurProvider>
    {/* <Footer /> */}
    </Router >
  );
}

export default App;
