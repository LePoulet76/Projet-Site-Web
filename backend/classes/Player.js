const Joker = require('./Joker.js');
const JOKER_POOL = [
    { name: "RevealArtist", effect: "Révèle l'artiste du morceau." },
    { name: "DoublePoints", effect: "Double les points obtenus sur ce round." },
    { name: "SkipRound", effect: "Passe le round avec le minimum de point." },
];
class Player {
    constructor(pseudo, score = 0, profilePictureLink, socketId) {
        this.socketId = this.socketId;
        this.pseudo = pseudo;
        this.score = score;
        this.profilePicture = profilePictureLink;
        this.listOfJokers = [];
    }
    initJokers(numberOfJokers) {
        for (let i = 0; i < numberOfJokers; i++) {
            const randomIndex = Math.floor(Math.random() * JOKER_POOL.length);
            const jokerData = JOKER_POOL[randomIndex];
            const newJokerInstance = new Joker(jokerData.name, jokerData.effect);
            this.listOfJokers.push(newJokerInstance);
        }
    }
    addScore(points) {
        this.score += points;
    }
    rmScore(points) {
        this.score -= points;
    }
    getScore() {
        return this.score; 
    }
    addJoker(joker) {
        this.listOfJokers.push(joker);
    }
    useJoker(jokerName) {
        if (this.listOfJokers.includes(jokerName)) {
            this.listOfJokers.splice(jokerName);
            jokerName.use();
            return true;
        }
        return false;
    }
}
export { Player };