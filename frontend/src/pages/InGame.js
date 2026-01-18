import Waveform from "../components/Waveform";
import ChatComponent from "../components/Tchat";
import { socket } from "../socket";
import ScoreBoard from "../components/ScoreBoard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Reponse from "../components/Reponse";
import BoutonStart from "../components/BoutonStart";
import { useInfoJoueur } from "./InfoJoueurContext";

export default function InGame() {
  const { joueur } = useInfoJoueur();
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState("waiting"); // etat de base de la partie, waiting, playing, finished
  const { lobbyId } = useParams();
  const [audioUrl, setAudioUrl] = useState(""); 
  const [isPlaying, setIsPlaying] = useState(false); // Play/Pause contrôlé par le serveur pour le Waveform
  const pseudoJoueur = joueur ? joueur.username : "Invité";
  console.log("InGame - ID récupéré de l'URL :", lobbyId);

  useEffect(() => {
    //Si perte de la connexion, on essaye de reconnecter (a cause du mode dev de React, ça peut arriver souvent)
    if (!socket.connected) {
        socket.connect();
    }
    // Écoute des événements du serveur
    socket.on("scoreboard_data", (data) => setPlayers(data.scores));
    socket.on("game_started", () => setGameStatus("playing"));
    socket.on("game_over", () => setGameStatus("finished"));
    socket.on("new_round", (data) => {
        setAudioUrl(data.audioUrl); 
        setIsPlaying(true);  
    });
    socket.emit("request_scoreboard", { lobbyId: lobbyId });
  }, [lobbyId]);
     
  return (
    <div
      className="relative min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
 }}
    >
    <div className="flex flex-col min-h-screen w-full ">
      {/* HEADER FIXED EN HAUT */}
      <div className="w-full h-14 bg-[#4b4cc5] flex items-center px-4 text-white text-xl font-bold">
        Blindtest.io
      </div>
       {/* Barre violette claire */}
      <div className="relative w-full h-5 bg-[#7a7ff5]"></div>

      {/* CONTENU SOUS LE HEADER */}
      
      
      

<div className="flex-1 flex flex-row">

  {/* LEFT */}
  <div className="flex flex-col gap-6 translate-x-[180px] translate-y-[140px]">
    
      <img src="https://image2url.com/r2/default/images/1768327279745-686a41e4-29fc-4b66-b693-5d51076f93d8.png"
      className="w-[200px] h-[200px]"
       />
       <img src="https://image2url.com/r2/default/images/1768327351124-d9e4147c-9e4f-40be-86b6-bcdb4389c319.png"
      className="w-[200px] h-[200px]"
       />
       <img src="https://image2url.com/r2/default/images/1768327377928-f268c937-dbfe-4dc6-8d2f-c23fd3ae113f.png"
      className="w-[200px] h-[200px]"
       />
    
  </div>

  {/* CENTER */}
  <div className="flex-1 relative flex-col items-center translate-x-[100px] flex-1">
    {/* Chat box */}
    {/* Input */}
    {/* Waveform */}
<div className="flex flex-row items-center gap-0 mt-24">
<div className="flex-1 flex flex-col items-center gap-6 mt-24 relative">

  {/*affichage avec le code du lobby*/}
  <div className="absolute -top-12 w-[300px] h-[40px] bg-pink-400 rounded-xl flex items-center justify-center gap-4 shadow-lg">
    <h1 className="font-bold text-white text-2xl">Lobby : {lobbyId}</h1>
  </div>



  <div className="flex gap-6 w-full justify-center">
    {/* CHAT CONTAINER */}
    
    <div className="w-[750px]">
      <ChatComponent socket={socket} lobbyId={lobbyId} />
    </div>

    
  </div>

  <div className="flex w-full justify-center">
    {/* GUESS BOX */}
    <div className="w-[700px] h-[90px] bg-pink-400 rounded-xl flex items-center justify-center gap-4 shadow-lg">
      
      <div>
        {gameStatus === "playing" && (
            <Reponse socket={socket} lobbyId={lobbyId} pseudo = {pseudoJoueur} />
        )}
      </div>
    </div>

    {/* SCOREBOARD */}
    

    {/* EMPTY SPACE FOR SCOREBOARD ALIGNMENT */}
    <div className="w-auto" />
  </div>
  {/* WAVEFORM */}
  <div className="w-[750px]">
    <Waveform audioUrl={audioUrl} isPlaying={isPlaying} />
  </div>
  {/*Bouton Start*/}
  <div className="translate-x-1/2">
    {gameStatus === "waiting" && (
        <BoutonStart socket={socket} lobbyId={lobbyId} players={players} />
    )}
  </div>
  {gameStatus === "finished" && (
      <div className="text-white text-2xl font-bold bg-black/50 p-4 rounded-xl border border-yellow-500">
          PARTIE TERMINÉE 
      </div>
  )}
</div>
<div className=" -translate-y-[200px] translate-x-[-300px] ">
<ScoreBoard players={players} socket={socket} />
</div>
    </div>
       </div>

  {/* RIGHT */}
  <div className="flex flex-col translate-x-1/2 translate-y-1/2" />
  <img src="https://image2url.com/images/1766274154544-6129e15f-3489-427e-b790-642fa02fadb4.png"
  className="w-[300px] h-[600px]"/>

</div>

 {/* Barre violette claire */}
      <div className="relative w-full h-5 bg-[#7a7ff5]"></div>

      {/* Barre foncÃ©e du bas */}
     
      <div className="relative w-full h-10 bg-[#4b4cc5] flex items-center justify-center text-white text-sm">
         2025 Blindtest.io
      </div>
    </div>
    </div>


  );
}