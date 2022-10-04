class Player{
  constructor(name, scoresDictionary){
    this.id = Date.now() + Math.floor(((Math.random() + 1) * 10));
    this.name = name;
    this.scoresDictionary = scoresDictionary;
    this.totalScore = 0;
  }

  setTotalScore(value){
    this.totalScore = value;
  }

  getScores(){
    return this.scoresDictionary;
  }

  getScore(category){
    let total = 0;
    for (let item in this.scoresDictionary[category]){
      let multiple = 0;

      if (item == 's'){
        multiple = 1;
      }
      else if (item == 'd'){
        multiple = 2;
      }
      else if (item == 't'){
        multiple = 3;
      }
      total += this.scoresDictionary[category][item].reduce((sum, i) => sum += i * multiple, 0);
    }

    return total;
  }

  addScores(scores){
    scores.forEach((item, i) => {
      if (item != '0'){
        let values = item.split('-');

        let section = this.scoresDictionary[values[1].toUpperCase()];
        if (section){
          section[values[0]].push(1);
        }
      }
    });
  }

  clearScores(){
    for (let category in this.scoresDictionary){
      for (let collection in this.scoresDictionary[category]){
        this.scoresDictionary[category][collection] = [];
      }
    }
  }
}
