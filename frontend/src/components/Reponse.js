import { useState } from "react";
import { useInfoJoueur } from "../pages/InfoJoueurContext";

export default function Reponse({ socket, lobbyId }) {
  const [guess, setGuess] = useState("");
  const { joueur } = useInfoJoueur();
  
  //Fonction pour gérer envoie du formulaire (ici on communique avec le back via socket.io)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    let pseudoFinal = "Joueur_Inconnu";
    if (joueur && joueur.username) {
        pseudoFinal = joueur.username;
    }

    // On envoie la réponse au serveur, traitement dans le back via VerifyAnswer
    socket.emit("guess_answer", { 
        lobbyId: lobbyId, 
        pseudo: pseudoFinal, 
        text: guess 
    });

    // On vide le champ pour la prochaine tentative
    setGuess(""); 
  };
    return (
        <div className="flex-row flex gap-4 items-center ">
            <form onSubmit={handleSubmit} className="flex-1 flex gap-4 items-center">
                <input 
                    type="text" 
                    className="border p-2 w-[500px] rounded flex-1 text-lg"
                    placeholder="Devinez le titre de l'oeuvre..."
                    value={guess || ''}
                    onChange={(e) => setGuess(e.target.value)}
                />
                <button type="submit" className="h-[45px] px-6 bg-white text-pink-500 font-bold rounded-lg hover:bg-pink-100 transition whitespace-nowrap">
                    Guess
                </button>
            </form>
        </div>
    );
}