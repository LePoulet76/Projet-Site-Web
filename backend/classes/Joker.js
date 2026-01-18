class Joker {
    constructor(name, effect) {
        this.name = name;
        this.effect = effect;
    }
    use() { //penser a rajouter le code de l'effet du joker
        console.log(`Using joker: ${this.name} with effect: ${this.effect}`);
        if (this.name === "RevealArtist") {
            // Code to reveal the artist of the current song
        } else if (this.name === "DoublePoints") {
            // Code to double the points for the current round
        } else if (this.name === "SkipRound") {
            // Code to skip the current round with minimum points
        }
    }
}
export { Joker };