class DartGame{
  #name = null;
  #categories = null;
  #singlePointValues = null;
  #scoreValues = null;
  enforceOrder = true;
  enforceSingleRounds = false;
  categoryClosed =  null;
  pointsWhenClosed = false;
  /* When the number is 0, display 0 */
  displayNoScore =  false;
  maxDisplayCount =  null;
  includeTotals =  false;
  instantWinner =  function(player, results, validScores){
    return false;
  }

  constructor(gameName, gameCategories, gameSinglePointValues, gameScoreValues){
    this.#name = gameName;
    this.#categories = gameCategories;
    this.#singlePointValues = gameSinglePointValues;
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
}
