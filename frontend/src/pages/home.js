import React from "react";
import { Link } from "react-router-dom";


export default function Home() {
  return (
    <div
      className="h-screen w-full flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://cdn.discordapp.com/attachments/1443532709996662844/1443608881715482805/Sans_titre_3_20251127152458.png?ex=6929b10a&is=69285f8a&hm=83355686689336ef277b3e96fecefe45a3c9440c0bca1d5aaf2f95a1d1583daf&")',
 }}
    >
      {/* Barre foncée du haut */}
      
      <div className="w-full h-6 bg-[#4b4cc5]">
        
        <div className="h-screen w-full flex flex-row bg-cover bg-center">
         

    
    </div>
    <div className="h-screen w-full flex flex-row bg-cover bg-center">
     
    
    </div>
      </div>

      {/* Barre violette claire */}
      <div className="w-full h-10 bg-[#8c8eff]"></div>

      <div className="flex-1 flex flex-col justify-center items-center relative px-6">
  {/* Conteneur de l'image avec position relative */}
  <div className="relative mb-10">
    <img
      src="https://i.postimg.cc/rw8y5Ln4/image0-(4).png"
      alt="Blindtest.io"
      className="w-auto h-768 md:h-256"
    />

    {/* Bouton en bas à droite de l'image */}
    <Link
            to="/ingame"
            className="absolute bottom-80 right-10 text-white px-6 py-3 rounded-lg text-lg transition"
            style={{ backgroundColor: '#FF69B4' }} // rose vif
          >
      Aller dans le jeu
    </Link>

    <Link
            to="/lobbycreation"
            className="absolute bottom-80 left-10 text-white px-6 py-3 rounded-lg text-lg transition"
            style={{ backgroundColor: '#FF69B4' }} // rose vif
          >
      Créer une partie
    </Link>
    <Link
            to="/login"
            className="absolute bottom-0 left-0 text-white px-6 py-3 rounded-lg text-lg transition"
            style={{ backgroundColor: '#FF69B4' }} // rose vif
          >
         Connexion
         </Link>

    <Link
            to="/inscription"
            className="absolute top-0 left-20 text-white px-6 py-3 rounded-lg text-lg transition"
            style={{ backgroundColor: '#FF69B4' }} // rose vif
          >
      Inscription
    </Link>
  </div>
</div>


      {/* Barre violette claire */}
      <div className="w-full h-12 bg-[#7a7ff5]"></div>

      {/* Barre foncée du bas */}
      <div className="w-full h-6 bg-[#4b4cc5]"></div>
    </div>
  );
}