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

  getScores(category){
    return this.scores[category];
  }

  getScore(category){
    return this.#getSum(this.scores[category]);
  }

  addScores(collection){
    // Only add scores in the scores collection
    for (let category in this.scores){
      let values = collection[category];

      if (values && values.length > 0){
        values.forEach((item, i) => {
          let currentTotal = this.#getSum(this.scores[category]);
          let newTotal = currentTotal + item;

          if (this.maxDisplayCount && currentTotal == this.maxDisplayCount){
            /* Do not add any other scores, possibly collect and return any extras for scoring in the future. */
          }
          else if (this.maxDisplayCount && newTotal > this.maxDisplayCount){
            this.scores[category].push(this.maxDisplayCount - currentTotal);
          }
          else{
            this.scores[category].push(item);
          }
        });
      }
    }
  }

  clearScores(){
    for (let category in this.scores){
      this.scores[category] = [];
    }
  }

  #getSum(collection){
    if (collection && collection.length > 0){
      return collection.reduce((res, item) => res + item, 0);
    }

    return 0;
  }
}
