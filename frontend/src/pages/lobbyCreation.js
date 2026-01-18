import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useInfoJoueur } from "./InfoJoueurContext";
import { useNavigate } from "react-router-dom";

export default function LobbyCreation() {
    const [nomLobby, setNomLobby] = useState("");
    const [maxJoueurs, setMaxJoueurs] = useState(10);
    const [nbTours, setNbTours] = useState(20);
    const [genre, setGenre] = useState("Anime");
    const navigate = useNavigate();
    const { joueur } = useInfoJoueur();
    console.log("CONTENU COMPLET DE JOUEUR :", joueur);
    const changement = (e) => {
        e.preventDefault(); //PAS DE RECHARGEMENT DE PAGE
        if (!joueur || !joueur.username) {
            alert("⛔ Vous devez être connecté pour créer une partie !");
            navigate('/login'); // Redirection immédiate
            return;
        }

        //On verifie que le lobby a un nom, meme si on l'utilise pas au final
        if (!nomLobby.trim()) {
            alert("Veuillez donner un nom à votre BlindTest !");
            return;
        }
        const settings = {
            nom: nomLobby,
            maxPlayers: maxJoueurs,
            rounds: nbTours,
            genre: genre,
            playerName: joueur?.username || "Hôte"
        };
        //gestion de la connexion socket avant envoi, sinon ça plante
        if (socket.connected) {
            // Si dejà connecté d'une partie précédente
            socket.emit("create_lobby", settings);
        } else {
            //Sinon on le connecte au lobby puis on envoie la création
            console.log("🔌 Connexion en cours...");
            socket.connect();
            socket.once("connect", () => {
                socket.emit("create_lobby", settings);
            });
        }
};
    useEffect(() => {
        socket.on("lobby_created", (data) => {
            navigate(`/ingame/${data.lobbyId}`);
        });

        return () => socket.off("lobby_created");
    }, [navigate]);

    return (
        <div
      className="min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
 }}
    >
        <div className="flex flex-col items-center justify-center h-screen ">
            <h1 className="text-4xl font-bold mb-6">Creation du BlindTest</h1>
            <form onSubmit={changement} className="bg-white p-6 rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nom du BlindTest</label>
                    <input 
                        type="text" 
                        value={nomLobby}
                        onChange={(e) => setNomLobby(e.target.value)}/>
                    <label className="block text-gray-700 mb-2 mt-4">Nombre de Joueurs Max</label>
                    <input 
                        type="text" 
                        value={maxJoueurs}
                        onChange={(e) => setMaxJoueurs(e.target.value)}/>
                    <label className="block text-gray-700 mb-2 mt-4">Nombre de Tours</label>
                    <input 
                        type="text" 
                        value={nbTours}
                        onChange={(e) => setNbTours(e.target.value)}/>
                    <label className="block text-gray-700 mb-2 mt-4">Genre Musical</label>
                    <select 
                        className="w-full p-2 border border-gray-300 rounded"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}>  
                        <option>Anime</option>
                        <option>Film</option>
                        <option>Serie</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Créer le BlindTest</button>
            </form>
        </div>

        </div>
    );
}
