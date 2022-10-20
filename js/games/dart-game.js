class DartGame{
  #name = null;
  #categories = null;
  #singlePointValues = null;
  #scoreValues = null;
  #singleScoreValues = null;
  doubleInOption = false;
  doubleInEnabled = false;
  doubleOutOption = false;
  doubleOutEnabled = false;
  singleColumnScores = false;
  playToZero = false;
  enforcePositiveScores = false;
  startingScore = null;
  enforceOrder = true;
  enforceSingleRounds = false;
  categoryClosed =  null;
  pointsWhenClosedOption = false;
  pointsWhenClosedEnabled = false;
  /* When the number is 0, display 0 */
  displayNoScore =  false;
  maxDisplayCount =  null;
  includeTotals =  false;
  instantWinner =  function(player, results, validScores){
    return false;
  }

  constructor(gameName, gameCategories, gameSinglePointValues, singleScoreValues, gameScoreValues){
    this.#name = gameName;
    this.#categories = gameCategories;
    this.#singlePointValues = gameSinglePointValues;
    this.#singleScoreValues = singleScoreValues;
    this.#scoreValues = gameScoreValues;
  }

  getName(){
    return this.#name;
  }

  getNameWithCategories(){
    return [this.#name, ...this.#categories.slice(0)];
  }

  getCategories(){
    return this.#categories;
  }

  getScoreValues(){
    return this.#scoreValues;
  }

  getSinglePointValues(){
    return this.#singlePointValues;
  }

  getSingleScoreValues(){
    return this.#singleScoreValues;
  }

  convertToCollection(arrOfDict){
    return arrOfDict.reduce((res, item) => {
      if (item.value.length > 0){
        res[item.key] = item.value;
      }
      return res;
    }, {});
  }
}
