import { useInfoJoueur } from "../pages/InfoJoueurContext";

export default function BoutonStart({ socket, lobbyId, players }) {
    const { joueur } = useInfoJoueur();
    
    //verifie si le joueur est l'hôte, on le fait dans le back mais ici c'est pour l'affichage
    const monProfil = players.find(p => p.pseudo === joueur.username);
    const isHost = monProfil && monProfil.est_hote === 1;

    const handleStart = () => {
        socket.emit("start_game", {lobbyId: lobbyId});
    };
    if (isHost) {
        return (
            <button 
                onClick={handleStart}
                className="px-8 py-3 bg-pink-400 text-white font-bold rounded shadow hover:bg-pink-400">
                LANCER LA PARTIE
            </button>
        );
    }

    return <div className="text-pink-500 font-bold animate-pulse">En attente de l'hôte...</div>;
}