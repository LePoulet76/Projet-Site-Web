import React from "react";
import { Link } from "react-router-dom";
import JoinGame from "../components/JoinGame"; // Vérifie que le chemin est bon

export default function Home() {
  return (
    <div
      className="h-screen w-full flex flex-col bg-cover bg-center overflow-hidden" // Ajout de overflow-hidden pour éviter les scrolls inutiles
      style={{
        backgroundImage:
          'url("https://cdn.discordapp.com/attachments/1443532709996662844/1443608881715482805/Sans_titre_3_20251127152458.png?ex=6929b10a&is=69285f8a&hm=83355686689336ef277b3e96fecefe45a3c9440c0bca1d5aaf2f95a1d1583daf&")',
      }}
    >
      {/* Barre foncée du haut (Nettoyée) */}
      <div className="w-full h-6 bg-[#4b4cc5]"></div>

      {/* Barre violette claire */}
      <div className="w-full h-10 bg-[#8c8eff]"></div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col justify-center items-center relative px-6">
        
        {/* Conteneur de l'image avec position relative */}
        <div className="relative mb-10">
          <img
            src="https://i.postimg.cc/rw8y5Ln4/image0-(4).png"
            alt="Blindtest.io"
            className="w-auto h-auto max-h-[60vh] md:max-h-[70vh]" // Ajustement pour que ça rentre mieux
          />

          {/* Bouton : Aller dans le jeu (Milieu Droite) */}
          <Link
            to="/ingame"
            className="absolute bottom-1/2 right-10 transform translate-y-1/2 text-white px-6 py-3 rounded-lg text-lg transition shadow-lg hover:scale-105"
            style={{ backgroundColor: "#FF69B4" }}
          >
            Aller dans le jeu
          </Link>

          {/* Bouton : Créer une partie (Milieu Gauche) */}
          <Link
            to="/lobbycreation"
            className="absolute bottom-1/2 left-10 transform translate-y-1/2 text-white px-6 py-3 rounded-lg text-lg transition shadow-lg hover:scale-105"
            style={{ backgroundColor: "#FF69B4" }}
          >
            Créer une partie
          </Link>

          {/* Bouton : Connexion (Bas Gauche) */}
          <Link
            to="/login"
            className="absolute bottom-0 left-0 text-white px-6 py-3 rounded-lg text-lg transition shadow-lg hover:bg-pink-400"
            style={{ backgroundColor: "#FF69B4" }}
          >
            Connexion
          </Link>

          {/* Bouton : Inscription (Haut Gauche) */}
          <Link
            to="/inscription"
            className="absolute top-0 left-0 text-white px-6 py-3 rounded-lg text-lg transition shadow-lg hover:bg-pink-400"
            style={{ backgroundColor: "#FF69B4" }}
          >
            Inscription
          </Link>

          {/* COMPONENT JOIN GAME (Bas Droite) */}
          {/* Je l'ai mis en absolute pour qu'il apparaisse sur l'image */}
          <div className="absolute bottom-0 right-0">
             <JoinGame />
          </div>

        </div>
      </div>

      {/* Barre violette claire */}
      <div className="w-full h-12 bg-[#7a7ff5]"></div>

      {/* Barre foncée du bas */}
      <div className="w-full h-6 bg-[#4b4cc5]"></div>
    </div>
  );
}