class Player{
  #categories;
  #scores;
  #maxDisplayCount;
  #points;
  #singlePointValues;
  #totalScore;
  #totalScoreCollection = [];
  #enforcePositiveScores;
  #singleScoreValues;
  #doubledIn = false;
  doubledOut = false;

  #previousScores;

  constructor(name, categories, startingScore, enforcePositiveScores, maxDisplayCount, singlePointValues, singleScoreValues){
    this.id = Date.now() + Math.floor(((Math.random() + 1) * 10));
    this.name = name;
    this.#categories = categories;
    this.#scores = categories.reduce((res, item) => {
      res[item] = [];
      return res;
    }, {});
    this.#previousScores = categories.reduce((res, item) => {
      res[item] = [];
      return res;
    }, {});
    this.#maxDisplayCount = maxDisplayCount;
    this.#points = JSON.parse(JSON.stringify(this.#scores));
    this.#singlePointValues = singlePointValues;
    this.#totalScore = 0;
    if (startingScore > 0){
      // May need to clone this
      this.#totalScoreCollection.push(startingScore);
    }
    this.#enforcePositiveScores = enforcePositiveScores;
    this.#singleScoreValues = singleScoreValues;
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

  getTotalScoreCollection(){
    return this.#totalScoreCollection;
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

  addScores(collection, doubleIn){
    this.#clearPreviousScores();

    if (doubleIn && !this.#doubledIn){
      // filter all scores that are not a double and keep all remaining values after.
      for (let index = 0; index < collection.length; index++){
        let dict = collection[index];
        let key = dict.key;
        let newScores = dict.value;
        let indexOfDouble = newScores.indexOf(2);
        if (indexOfDouble < 0){
          collection[index].value = [];
        }
        else{
          collection[index].value = newScores.slice(indexOfDouble);
        }

        if (collection[index].value.length > 0){
          this.#doubledIn = true;
          break;
        }
      }

      if (!this.#doubledIn){
        return;
      }
    }

    let newCollection = collection.reduce((res, item) => {
      if (item.value.length > 0){
        res[item.key] = item.value;
      }
      return res;
    }, {});

    if (this.#totalScoreCollection.length > 0){
      // We take the last item in the totalScoreCollection and subtract the sum of the addScores
      // and add the result to the collection.
      let newScore  = 0;
      let multiple = 1;
      for (let category in newCollection){
        if (category in this.#singleScoreValues){
          multiple = this.#singleScoreValues[category];
        }
        else{
          multiple = category;
        }

        // Double out? - keep track of whether or not the the last point was a double.
        this.#setDoubledOut(newCollection[category].slice(-1)[0] == 2);
        newScore += this.#getSum(newCollection[category]) * multiple;
      }

      let currentScore = this.#totalScoreCollection.slice(-1)[0];

      if (newScore > 0){
        let newTotalScore = currentScore - newScore;
        if (this.#enforcePositiveScores){
          if (newTotalScore >= 0){
            this.#totalScoreCollection.push(newTotalScore);
          }
        }
        else{
          this.#totalScoreCollection.push(newTotalScore);
        }
      }

      this.#totalScore = this.#totalScoreCollection.slice(-1)[0];
    }
    else{
      let points = {};
      // Only add scores in the scores collection
      for (let category in this.#scores){
        let values = newCollection[category];

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
              this.#previousScores[category].push(score);
              // Double out? - keep track of whether or not the the last point was a double.
              this.#setDoubledOut(item == 2);
              this.#scores[category].push(score);
            }
            else{
              this.#previousScores[category].push(item);
              // Double out? - keep track of whether or not the the last point was a double.
              this.#setDoubledOut(item == 2);
              this.#scores[category].push(item);
            }
          });
        }
      }

      return points;
    }
  }

  #setDoubledOut(val){
    this.doubledOut = val;
  }

  removePreviousScores(){
    if (this.#totalScoreCollection && this.#totalScoreCollection.length > 1){
      this.#totalScoreCollection.pop();
    }
    else if (this.#previousScores){
      let count = 0;
      for (let category in this.#previousScores){
        this.#previousScores[category].forEach((item, i) => {
          if (count < 2){
            count = this.#scores[category].pop();
          }
        });
      }
    }
  }


  clearScores(){
    for (let category in this.#scores){
      this.#scores[category] = [];
    }
  }

  #clearPreviousScores(){
    for (let category in this.#previousScores){
      this.#previousScores[category] = [];
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
