class DartGame{
  #name = null;
  #categories = null;
  #scoreValues = null;
  enforceOrder = true;
  enforceSingleRounds = false;
  categoryClosed =  null;
  /* When the number is 0, display 0 */
  displayNoScore =  false;
  maxDisplayCount =  null;
  includeTotals =  false;
  instantWinner =  function(player, results, validScores){
    return false;
  }

  constructor(gameName, gameCategories, gameScoreValues){
    this.#name = gameName;
    this.#categories = gameCategories;
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
}
