class Shanghi extends DartGame{
  static #categories = ['1', '2', '3', '4', '5', '6', '7'];

  constructor(){
    super('Shanghi', Shanghi.#categories);

    this.enforceSingleRounds = true;
    this.displayNoScore =  true;
    this.includeTotals =  true;
    this.instantWinner =  function(player, results, validScores){
      let validScoresCollection = this.convertToCollection(validScores);

      let number = Object.keys(validScoresCollection)[0];

      let sameNumber = results.reduce((r, item) => {
        return number == parseInt(item.split('-')[1])
      }, false);

      let categories = results.reduce((r, item) => {
        let cat = item.split('-')[0];
        if (!r.includes(cat)) {
          r.push(cat);
        }
        return r; /* important to keep separate */
      }, []);

      // In darts you only have 3 darts per turn. Since the categories are Tripple, Double, and Single,
      // a user has a shanghi when the distinct category count is 3.
      if (sameNumber && categories.length == 3){
        return `${player.name} got Shanghi!`;
      }
    }
  }
}
