class Shanghai extends DartGame{
  static #categories = ['1', '2', '3', '4', '5', '6', '7'];

  constructor(){
    super('Shanghai', Shanghai.#categories);

    this.enforceSingleRounds = true;
    this.displayNoScore =  true;
    this.includeTotals =  true;
    this.instantWinner =  function(player, validScores){
      // to get a Shanghai and automatically win, the user must have all 3 darts
      // in the same category and include a single, a double, and a tripple.

      let scoreDict = this.convertToDictionary(validScores);

      // Only get the scores from the first category
      let scores = scoreDict[Object.keys(scoreDict)[0]];

      // check for Shanghai
      if (scores){
        let shanghai = scores.includes(1) && scores.includes(2) && scores.includes(3);
        if (shanghai){
          return `${player.name} got Shanghai!`;
        }
      }
    }
  }
}
