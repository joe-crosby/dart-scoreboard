class Player{
  #categories;
  #scores;
  #maxDisplayCount;
  #points;
  #singlePointValues;
  #totalScore;

  constructor(name, categories, maxDisplayCount, singlePointValues){
    this.id = Date.now() + Math.floor(((Math.random() + 1) * 10));
    this.name = name;
    this.#categories = categories;
    this.#scores = categories.reduce((res, item) => {
      res[item] = [];
      return res;
    }, {});
    this.#maxDisplayCount = maxDisplayCount;
    this.#points = JSON.parse(JSON.stringify(this.#scores));
    this.#singlePointValues = singlePointValues;
    this.#totalScore = 0;
  }

  isClosed(category){
    return this.#getSum(this.#scores[category]) == this.#maxDisplayCount;
  }

  getLastClosedCategory(){
    if (this.#maxDisplayCount){
      for (let index = this.#categories.length - 1; index >= 0; index--){
        let category = this.#categories[index];
        if (this.#getSum(this.#scores[category]) == this.#maxDisplayCount){
          return category;
        }
      }
    }
  }

  addPoints(category, collection){
    // merge to the points collection
    this.#points[category] = this.#points[category].concat(collection);
  }

  getPoints(){
    return Object.keys(this.#points).reduce((res, key) => {
      let count = this.#getSum(this.#points[key])
      let categoryPointValue = key;
      if(count > 0){
        if (this.#singlePointValues && key in this.#singlePointValues){
          categoryPointValue = this.#singlePointValues[key];
        }
        res += count * categoryPointValue
      }
      return res;
    }, 0);
  }

  setTotalScore(value){
    this.#totalScore = value;
  }

  getTotalScore(){
    return this.#totalScore;
  }

  getScores(category){
    return this.#scores[category];
  }

  getScore(category){
    return this.#getSum(this.#scores[category]);
  }

  addScores(collection){
    let points = {};
    // Only add scores in the scores collection
    for (let category in this.#scores){
      let values = collection[category];

      if (values && values.length > 0){
        values.forEach((item, i) => {
          let currentTotal = this.#getSum(this.#scores[category]);
          let newTotal = currentTotal + item;

          if (this.#maxDisplayCount && currentTotal == this.#maxDisplayCount){
            this.#addToCollection(points, category, item);
          }
          else if (this.#maxDisplayCount && newTotal > this.#maxDisplayCount){
            let score = this.#maxDisplayCount - currentTotal;
            // add the rest to returnedPoints
            this.#addToCollection(points, category, Math.abs(item - score));
            this.#scores[category].push(score);
          }
          else{
            this.#scores[category].push(item);
          }
        });
      }
    }

    return points;
  }

  clearScores(){
    for (let category in this.#scores){
      this.#scores[category] = [];
    }
  }

  #getSum(collection){
    if (collection && collection.length > 0){
      return collection.reduce((res, item) => res + item, 0);
    }

    return 0;
  }

  #addToCollection(collection, key, value){
    if (!collection[key]){
      collection[key] = [];
    }

    collection[key].push(value);
  }
}
