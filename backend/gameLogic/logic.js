import { Lobby } from "../classes/Lobby";
import { Player } from "../classes/Player";
import { Joker } from "../classes/Joker";


socket.on('answer_received', (data) => {
        if (data.isCorrect) {
            const player = lobby.players.get(data.socketId);
            const vrai = checkAnswer(data);
            if (vrai) { 
                player.addScore(10);
                lobby.io.to(lobby.id).emit('update_score', { 
                    socketId: data.socketId, 
                    newScore: player.getScore() });
            }
        }
    });

function checkAnswer(data) {
    const currentSong = lobby.getCurrentSong();
    currentSong.toLowerCase();
    data.toLowerCase();
    if (currentSong === data) return true;
    else {
        return false;}
}
