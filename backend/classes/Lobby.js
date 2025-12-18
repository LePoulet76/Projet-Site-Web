class Lobby {
  constructor(id, hostSocket, ioInstance) {
    this.id = id;
    this.hostSocket = hostSocket;
    this.io = ioInstance;
    this.players = [];
    this.round = 0;
    this.maxRounds = 21;
    this.currentSong = null;
    this.LobbyState = "waiting"; // waiting, inGame, ended
    }

    addPlayer(player) {
        socket.join(this.id) // le joueur rejoint la room du lobby
        this.players.push(player); 
    }
    removePlayer(playerSocketId) {
        if(this.players.has(playerSocketId)){
            this.players.delete(playerSocketId);
            this.io.to(this.id).emit('player_left', { socketId: socketId, playerName: playerName });
        }
    }
    addRound() {
        this.round += 1;
    }
    getCurrentRound() {
        return this.round;
    }
    setCurrentSong(song) {
        this.currentSong = song;
    }
    getCurrentSong() {
        return this.currentSong;
    }
    setLobbyState(state) {
        this.LobbyState = state;
    }
    getLobbyState() {
        return this.LobbyState;
    }
    getLobbyId() {
        return this.id;
    }
}
export { Lobby };