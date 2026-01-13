import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { useInfoJoueur } from "../pages/InfoJoueurContext";

export default function JoinGame() {
    const [codeJoin, setCodeJoin] = useState("");
    const navigate = useNavigate();
    const { joueur } = useInfoJoueur();
    useEffect(() => {
        const handleSuccess = (data) => {
            console.log("Rejoindre succès, redirection vers :", data.lobbyId);
            navigate(`/ingame/${data.lobbyId}`);
        };
        socket.on("join_success", handleSuccess);
        return () => {
            socket.off("join_success", handleSuccess);
        };
    }, [navigate]);
    
    const handleJoin = (e) => {
        e.preventDefault();
        console.log("1. Bouton cliqué !");
        console.log("2. Statut Socket connecté ?", socket.connected);
        console.log("3. ID Socket :", socket.id);
        socket.emit("join_lobby", {
            lobbyId: codeJoin.toUpperCase(),
            playerName: joueur?.username || "Invité_",
            password: ""
        });
        
    };
    
    return (
        <div className="w-72">
            <form onSubmit={handleJoin} className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-2xl border border-gray-100">                     
                <h3 className="text-gray-500 font-bold text-center mb-4 text-xs uppercase tracking-wider">
                    Code de la partie
                </h3>

                <div className="mb-4">
                    <input 
                        type="text" 
                        value={codeJoin}
                        maxLength={4}
                        placeholder="ABCD"
                        onChange={(e) => setCodeJoin(e.target.value)}
                        className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] uppercase text-gray-800 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF69B4] focus:ring-4 focus:ring-[#FF69B4]/10 transition-all placeholder-gray-300"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-[#FF69B4] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-pink-500/30 transition-transform active:scale-95"
                >
                    REJOINDRE
                </button>
            </form>
        </div>
    );
}



