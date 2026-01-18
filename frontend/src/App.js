import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import des pages
import Home from "./pages/home";
import InGame from "./pages/InGame";
import Inscription from "./pages/inscription";
import Login from "./pages/login";
import LobbyCreation from "./pages/lobbyCreation";
import ChangingPassword from "./pages/changingpassword";
import ForgotPassword from "./pages/forgotpassword";
import Profil from "./pages/profil";
import { InfoJoueurProvider } from "./pages/InfoJoueurContext";

// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <InfoJoueurProvider>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ingame/:lobbyId" element={<InGame />} />
          <Route path="/lobbycreation" element={<LobbyCreation />} />
          <Route path="/ingame" element={<InGame />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/login" element={<Login />} />
          <Route path="/changingpassword" element={<ChangingPassword />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </main>
    </InfoJoueurProvider>
    {/* <Footer /> */}
    </Router >
  );
}

export default App;
