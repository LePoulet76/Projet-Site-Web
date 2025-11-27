import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import des pages
import Home from "./pages/home";
import InGame from "./pages/InGame";
import Inscription from "./pages/inscription";
// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobbyCreation" element={<lobbyCreation/>} />
          <Route path="/hub" element={<hub/>} />
          <Route path="/ingame" element={<InGame />} />
          <Route path="/inscription" element={<Inscription />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
