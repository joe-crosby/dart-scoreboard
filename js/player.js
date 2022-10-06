class Player{
  constructor(name, scoresCollection, maxDisplayCount){
    this.id = Date.now() + Math.floor(((Math.random() + 1) * 10));
    this.name = name;
    this.scores = scoresCollection;
    this.maxDisplayCount = maxDisplayCount;
    this.points = 0;
    this.totalScore = 0;
  }

  setTotalScore(value){
    this.totalScore = value;
  }

  getScores(){
    return this.scores;
  }

  getScore(category){
    return this.scores[category];
  }

  addScores(collection){
    // Only add scores in the scores collection
    for (let category in this.scores){
      let value = collection[category];

      if (!isNaN(value)){
        if (this.maxDisplayCount > 0){
          if (value > this.maxDisplayCount){
            value = this.maxDisplayCount;
          }
        }

        this.scores[category] += value;
      }
    }
  }

  clearScores(){
    for (let category in this.scores){
      this.scores[category] = 0;
    }
  }
}
