class X01 extends DartGame{
  static #categories = ['20', '19', '18', '17', '16', '15', 'BULL'];
  static #singleScoreValues = {'BULL': 25};

  constructor(x){
    super(`${x}01`, X01.#categories, null, X01.#singleScoreValues);
    this.doubleInOption = true;
    this.doubleOutOption = true;
    this.enforceOrder = false;
    this.startingScore = parseInt(`${x}01`);
    this.singleColumnScores = true;
    this.playToZero = true;
    this.enforcePositiveScores = true;
  }
}
