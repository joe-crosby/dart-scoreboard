const GAMES = {
  'Cricket': ['Cricket', '20', '19', '18', '17', '16', '15', 'BULL'],
  'Shanghi': ['Shanghi', '1', '2', '3', '4', '5', '6', '7'],
}

const GAMERULES = {
  'Cricket': {
    'EnforceOrder': true,
    'EnforceSingleRounds': false,
    'CategoryClosed': 3,
    'DisplayNoScore': false,
    'MaxDisplayCount': 3,
    'DisplayCountValues': [],
    'IncludeTotals': false,
  },
  'Shanghi': {
    'EnforceOrder': true,
    'EnforceSingleRounds': true,
    'CategoryClosed': null,
    'DisplayNoScore': true,
    'MaxDisplayCount': null,
    'DisplayCountValues': [],
    'IncludeTotals': true,
  }
}

let gameInfo = [];
let gameCategories = [];
let gameRules = {};
let currentCategory = null;
let players = [];

let currentPlayer = null;
let gameStarted = false;
let gameOver = false;
let tableIsDrawn = false;

// add the games for selections
let gdc = document.getElementsByClassName('game-dropdown-content')[0];
for (var key in GAMES){
  let l = document.createElement('label', {'innerHTML': key});
  l.innerHTML = key;
  addClickEvent(l, gameSelectionChanged);
  gdc.appendChild(l)
};

function initialize(){
  setCurrentCategory(null);
  // clear the players
  clearPlayers();
  gameStarted = false;
  gameOver = false;
  drawScoreboard();
}

function endGame(){
  // End the game
  gameOver = true;
  setCurrentCategory(null);

  let winners = getWinners();
  if (winners.length > 1){
    alert(`We have a tie!`);
  }
  else{
    alert(`${winners[0].name} wins!`);
  }
}

function getWinners(){
  if (gameRules['IncludeTotals']){
    let highScore = Math.max(...players.map(p => p.totalScore));
    return players.filter(p => p.totalScore == highScore);
  }
  else {
    // Cricket - First to bull out -- Need to account for scoring in the future.
    return currentPlayer;
  }
}

function gameSelectionChanged(e){
  e.preventDefault();

  // update the UI
  gameInfo = GAMES[`${e.target.innerHTML}`];
  gameCategories = gameInfo.slice(1);
  gameRules = GAMERULES[`${e.target.innerHTML}`];
  initialize();
}

function getIndexAfterLastClosedCategory(){
  if (currentPlayer == null || gameRules['CategoryClosed'] == null){
    return 0;
  }

  // check for max closed category on players
  let maxCategory = null;

  for (let index = 0; index < gameCategories.length; index++){
    let category = gameCategories[index];

    let total = currentPlayer.getScore(category);

    if (total >= gameRules['CategoryClosed']){
      maxCategory = category;
    }
  }

  if (maxCategory == null){
    return 0;
  }

  // We must use the gameCategories list because javascript objects (dicts) do not preserve order.
  return gameCategories.indexOf(maxCategory) + 1;
}

// populate the svg dart board scoreboard
let dartboard = null;
function dartboardCallback(results){
  if (!confirm(`Is this correct: ${results}?`)){
    return;
  }

  let maxIndex = getIndexAfterLastClosedCategory();
  let upToCurrentCategories = gameCategories.filter((item, index) => index <= maxIndex);
  let validScores = results.reduce((a, c, i) => {
    if (gameRules['EnforceOrder']){
      if (gameRules['CategoryClosed'] != null){
        // values before current
        upToCurrentCategories.forEach((cat, i) => {
          let currentCount = getCount(c, cat);
          if (currentCount > 0){
            a.push(c);
          }
        });

        // Figure out how to allow players to move past their max closed category.
        // need to get the current user score plus the added score.

        let cat = gameCategories[maxIndex];
        let userScore = currentPlayer.getScore(cat);
        while(getCollectionCount(a, cat) + userScore >= gameRules['CategoryClosed']){
          cat = getNextCategory(cat);

          if (getCount(c, cat) > 0){
            a.push(c);
          }
        }
      }
      else {
        if (c.includes(currentCategory)){
          a.push(c);
        }
      }
    }
    else {
      a.push(c);
    }

    return a;
  }, []);

  currentPlayer.addScores(validScores);

  dartboard.hide();
  updateScoreboard();
  setNextPlayer();
}

function validateScores(value){
  if(gameRules['EnforceOrder']){
    return value.includes(currentCategory);
  }
  else{
    return true;
  }
}

function getCount(item, value){
  let split = item.split('-');

  if (split.length > 0 && split[1] == value.toLowerCase()){
    let multiple = 0;
    if (split[0] == 's'){
      multiple = 1;
    }
    else if (split[0] == 'd'){
      multiple = 2;
    }
    else if (split[0] == 't'){
      multiple = 3;
    }

    return multiple;
  }

  return 0;
}

function getCollectionCount(categories, value){
  let total = 0;
  categories.forEach((item, i) => {
    let split = item.split('-');

    if (split.length > 0 && split[1] == value){
      let multiple = 0;
      if (split[0] == 's'){
        multiple = 1;
      }
      else if (split[0] == 'd'){
        multiple = 2;
      }
      else if (split[0] == 't'){
        multiple = 3;
      }

      total += 1 * multiple;
    }
  });

  return total;
}

function calculateScore(scores, value){
  let calculatedScore = 0;
  for (let category in scores[value]){
    let multiple = 1;
    if (category == 'd'){
      multiple = 2;
    }
    else if (category == 't'){
      multiple = 3;
    }

    // calculate their value
    if (scores[value][category].length > 0){
      calculatedScore += scores[value][category].reduce((total, item) => total + item) * multiple;
    }
  }

  return calculatedScore;
}

function updateScoreboard(){
  // get the scores
  let scores = currentPlayer.getScores();
  let totalScore = 0;
  for (let value in scores){
    let calculatedScore = calculateScore(scores, value);
    totalScore += calculatedScore;
    let element = document.getElementById(`c${currentPlayer.id}-${value}`);

    // update the UI
    element.innerHTML = calculatedScore;

    if (calculatedScore == 0){
      if (gameRules['DisplayNoScore'] && value <= currentCategory){
        element.innerHTML = 0;
      }
      else{
        element.innerHTML = null;
      }
    }
  }

  // Update the Totals
  if (gameRules['IncludeTotals']){
    currentPlayer.setTotalScore(totalScore);
    let totals = document.getElementById(`c${currentPlayer.id}-totals`);
    totals.innerHTML = currentPlayer.totalScore;
  }
}

let boardDisplay = document.getElementById('board-display');
dartboard = new Dartboard(dartboardCallback, boardDisplay);
dartboard.create();

function clearPlayers(){
  currentPlayer = null;
  players = [];
}

// load the game Scoreboard
function drawScoreboard(){
  if (gameInfo){
    // reset
    clearPlayers();
    gameStarted = false;

    let currentTable = document.getElementById('scoreboard-table');
    if (currentTable){
      currentTable.remove();
    }

    let scoreboardTable = document.createElement('table');
    scoreboardTable.setAttribute('id', 'scoreboard-table');

    gameInfo.forEach((item, i) => {
      // main row
      let r = getRow();

      // header
      if (i == 0){
        r.setAttribute('id', 'scoreboad-header');
        r.appendChild(getHeader(item, `score-${i}`));
      }
      else{
        // rows
        r.setAttribute('id', `r${item}`);
        r.appendChild(getColumn(item, `score-${item}`));
      }

      scoreboardTable.appendChild(r);
    });

    if (gameRules['IncludeTotals']){
      let r = getRow(null, 'scoreboard-totals');
      r.appendChild(getColumn('Totals', `score-totals`));
      scoreboardTable.appendChild(r);
    }

    document.getElementById('scoreboard-container').appendChild(scoreboardTable);

    tableIsDrawn = true;
  }
}

function getRow(value, id){
  let e = document.createElement('tr');
  setAtt(e, value, id);
  return e;
}

function getHeader(value, id, addListener){
  let e = document.createElement('th');
  if(addListener){
    addClickEvent(e, showDartBoard);
  }
  setAtt(e, value, id);
  return e;
}

function getColumn(value, id, addListener){
  let e = document.createElement('td');
  if(addListener){
    addClickEvent(e, showDartBoard);
  }
  setAtt(e, value, id);
  return e;
}

function setAtt(element, value, id){
  if (value){
    element.innerHTML = value;
  }

  if (id){
    element.setAttribute('id', id);
  }
}

function addPlayerToScoreboard(player){
  if (gameInfo){
    gameInfo.forEach((item, i) => {
      // row
      let r = null;

      if (i == 0){
        r = document.querySelector('#scoreboad-header');
      }
      else{
        r = document.querySelector(`#r${item}`);
      }

      // header
      if (i == 0){
        r.appendChild(getHeader(player.name, `c${player.id}-${item}`));
      }
      else{
        // rows
        r.appendChild(getColumn(null, `c${player.id}-${item}`, true))
      }
    });

    if (gameRules['IncludeTotals']){
      let r = document.querySelector('#scoreboard-totals');
      r.appendChild(getColumn(null, `c${player.id}-totals`, true))
    }
  }
}

function newPlayerCLicked(e){
  e.preventDefault();

  if (!tableIsDrawn){
    return;
  }

  // append new column to Scoreboard
  let playerName = document.getElementById('new-player-name').value;
  if (playerName) {
    players.push(new Player(playerName, createNewScoresDictionary()));

    // add the user to the Scoreboard
    addPlayerToScoreboard(players[players.length - 1]);
  }
}

function createNewScoresDictionary(){
  let newDict = {}

  gameCategories.forEach((value, i) => {
    newDict[value.toString()] = {
      's': [],
      'd': [],
      't': [],
    }
  });

  return newDict;
}

function showDartBoard(e){
  e.preventDefault();

  if (!gameStarted || gameOver){
    return;
  }

  boardDisplay.classList.add('showDartBoard');
}

function startNewGame(){
  if (players.length < 1){
    return;
  }

  try{
    if (gameStarted || gameOver){
      initialize();
      return;
    }

    // set the current player
    setNextPlayer();

    gameStarted = true;
  }
  finally{
    // reset the currentCategory
    setCurrentCategory(getNextCategory(null));
  }
}

function getNextCategory(value){
  let nextIndex = 0;
  if (value != null){
    nextIndex = gameCategories.indexOf(value) + 1;
  }

  if (nextIndex >= gameCategories.length){
    return gameCategories[0]
  }

  return gameCategories[nextIndex];
}

function setCurrentCategory(value){
  if (gameRules['EnforceSingleRounds']){
    if (currentCategory != null){
      let element = document.getElementById(`score-${currentCategory}`);
      if (element){
        element.classList.remove('currentCategory');
      }
    }

    if (value != null){
      currentCategory = value;
      let element = document.getElementById(`score-${currentCategory}`);
      if (element){
        element.classList.add('currentCategory');
      }
    }
  }
}

function setNextPlayer(){

  let nextPlayerIndex = 0;

  if (currentPlayer != null){
    getHeaderElement().classList.remove('currentPlayer');
    nextPlayerIndex = players.indexOf(currentPlayer) + 1;
  }

  // Check for game game
  let next = getIndexAfterLastClosedCategory();
  if(next >= gameCategories.length){
    endGame();
    return;
  }

  if (nextPlayerIndex >= players.length){
    if (currentCategory != null){
      nextCategoryIndex = gameInfo.indexOf(currentCategory) + 1;
      if (nextCategoryIndex < gameInfo.length){
        setCurrentCategory(getNextCategory(currentCategory));
      }
      else{
        // End the game
        endGame();
        return;
      }
    }

    currentPlayer = players[0];
  }
  else {
    currentPlayer = players[nextPlayerIndex];
  }

  getHeaderElement().classList.add('currentPlayer');
}

function getHeaderElement(){
  return document.getElementById(`c${currentPlayer.id}-${gameInfo[0]}`);
}

// add addEventListeners
addClickEvent(document.getElementById('new-player-btn'), newPlayerCLicked);
addClickEvent(document.getElementById('start-new-game-btn'), startNewGame);

function addClickEvent(e, callback){
  e.addEventListener('click', callback);
  e.addEventListener('touchstart', callback);
}
