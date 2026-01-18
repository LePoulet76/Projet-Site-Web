import { Link } from "react-router-dom";
import { useState } from "react";
import JoinGame from "../components/JoinGame";
import { useInfoJoueur } from "./InfoJoueurContext";

export default function Home() {
  const { joueur } = useInfoJoueur();
  const [openCreator, setOpenCreator] = useState(false);
  return (
    
    <div
      className="min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
 }}
    >
   {/*Barre foncée du haut*/}
<div className="relative w-full z-25 h-10 bg-[#4b4cc5] flex items-center px-8">
  
  {/*Liens à gauche*/}
  <div className="flex z-50 gap-6 text-white text-sm font-semibold">
      {!joueur && (<>
        <Link to="/login" className="hover:underline">
          Connexion
        </Link>
        <Link to="/inscription" className="hover:underline">
          Inscription
        </Link>
    </>)}

  </div>

  {/* Texte centré */}
  <div className="absolute left-1/2 -translate-x-1/2 text-white text-sm font-semibold">
    Welcome To BlindTest.io
  </div>
  <div className="z-50 ml-auto">
    <Link to="/profil" className="hover:opacity-80 transition">
      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="profil" className="h-6 w-6" />
    </Link>
    </div>
</div>

{/* Barre claire fine */}
<div className="w-full h-2 bg-[#8c8eff] " />
      <div className="flex-1 flex flex-col justify-center items-center relative px-6 mt-16">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">
         <img src="https://image2url.com/images/1766275523180-139330d8-d3f2-4e49-afdb-b3cf27b66f6e.png"/>
        </div>     
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <img src="https://image2url.com/images/1766275792709-f477b06f-1612-44be-a2c4-85f5653263fb.png" />
        </div>
  {/* Conteneur de l'image avec position relative */}
  
{/* Zone centrale */}
<div className="flex flex-col  items-center px-20">

  <div className="flex items-center w-full justify-between">

    {/* Bouton gauche */}
    <div className="absolute z-50 left-1/3 top-1/2 -translate-y-1/2"> 
      <Link to="/lobbyCreation"
     className="text-white font-bold px-6 py-3 rounded-lg text-lg transition shadow-lg" 
      style={{ backgroundColor: "#FF69B4" }} > Créer une partie 
      </Link> 
      </div>

    {/* Logo centré */}
    <div className="absolute  -translate-x-1/2 mx-8">
      <img
        src="https://i.postimg.cc/rw8y5Ln4/image0-(4).png"
        alt="Blindtest.io"
        className="h-[128px] md:h-[768px] w-auto"  // Ajuste la taille ici
      />
    </div>

    {/* Bouton droit */}
    <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
  <div className="h-[50px] md:h-[200px] w-auto">
    <JoinGame />
  </div>
</div>

  </div>

</div>



   
  
</div>



      {/* Barre violette claire */}
      <div className="relative w-full h-5 bg-[#7a7ff5]"></div>

      {/* Barre foncée du bas */}
      <div className="relative w-full h-10 bg-[#4b4cc5]">
          {/* Bouton Créateur */}
  <button
    onClick={() => setOpenCreator(!openCreator)}
    className="relative left-6  text-white text-sm font-semibold hover:underline"
  >
    Créateur ▾
  </button>

  {/* Menu déroulant */}
  {openCreator && (
    <div className="abosulute flex flex-col absolute left-6 bottom-10 bg-white rounded shadow-lg w-40 overflow-hidden z-50">
      <div>Poulain Arthur </div>
      <div>Orain Emma </div>
      <div>XMA Gratien </div>
    </div>
  )}
        <div className="absolute left-1/2 bottom-1/2 text-white text-sm font-semibold">
    BlindTest.io
  </div>
      </div>
    </div>
  );
}