export class Bettor {

    key;
    name;
    betAmount;
    predictScore;

    /**
     * 
     * @param {number} key 
     * @param {string} name 
     */
    constructor(key: number, name: string) {
        this.key = key;
        this.name = name;
        this.betAmount = 0;
        this.predictScore = [0, 0];
    }

    getName() {
        return this.name;
    }

    getKey() {
        return this.key;
    }

    getBetAmount() {
        return this.betAmount;
    }

    getPredictScore() {
        return this.predictScore;
    }

    setPredictScore(score: number[]) {
        this.predictScore = score;
    }

    setBetAmount(amount: number) {
        this.betAmount = amount;
    }

    equals(bettor: Bettor) {
        return this.key === bettor.getKey() && this.name === bettor.getName();
    }

    toJson() {
        return {
            key: this.key,
            name: this.name,
            betAmount: this.betAmount,
            predictScore: this.predictScore,
        }
    }
}
