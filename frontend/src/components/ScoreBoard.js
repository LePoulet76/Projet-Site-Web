import { useInfoJoueur } from "../pages/InfoJoueurContext";

export default function ScoreBoard({ socket, lobbyId, players}) {
    const { joueur } = useInfoJoueur();
    const listeJoueurs = players || [];
    
    return (
        <div className="bg-blue-600 p-4 rounded-xl text-white w-64 backdrop-blur-sm border border-white/10">
            <h3 className="text-lg font-bold mb-3 text-center border-b border-white/20 pb-2">
                🏆 Classement
            </h3>
            <ul>
                {listeJoueurs.map((player, index) => {
                    const isMe = player.pseudo === joueur?.username;
                    
                    return (
                        <li 
                            key={index} 
                            className={`flex justify-between items-center py-2 px-3 rounded mb-1 ${
                                isMe ? "bg-pink-600 font-bold scale-105 shadow-lg" : "hover:bg-pink-500/20"
                            }`}
                        >
                            <div className="flex gap-2">
                                <span className="w-4 text-white font-mono">{index + 1}.</span>
                                <span>{player.pseudo}</span>
                            </div>
                            <span className="font-mono text-yellow-400">{player.score}</span>
                        </li>
                    );
                })}
                
                {listeJoueurs.length === 0 && (
                    <li className="text-center text-white text-sm italic py-2">
                        En attente...
                    </li>
                )}
            </ul>
        </div>
    );
}