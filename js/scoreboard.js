const GAMES = {
  'Cricket': ['Cricket', '20', '19', '18', '17', '16', '15', 'BULL'],
  'Shanghi': ['Shanghi', '1', '2', '3', '4', '5', '6', '7'],
}

const GAMESCORES = {
  'Cricket': [
    null,
    `<svg height="100%" viewBox="0 0 40 40" stroke="black">
      <path d="M30 6 L6 30 L9 34 L34 9 Z" />
      Sorry, your browser does not support inline SVG.
     </svg>`,
    `<svg height="100%" viewBox="0 0 40 40" stroke="black">
       <g>
         <path d="M30 6 L6 30 L9 34 L34 9 Z" />
         <path d="M9 6 L34 31 L30.5 34 L5.5 9.5 Z" />
       </g>
     Sorry, your browser does not support inline SVG.
    </svg>`,
    `<svg height="100%" viewBox="0 0 15 15" stroke="black">
       <circle cx="7.5" cy="7.5" r="6" stroke="black" stroke-width="2" fill="none" />
     </svg>`,
  ],
  'Shanghi': null,
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
    'InstantWinner': function(values){
      return false;
    },
  },
  'Shanghi': {
    'EnforceOrder': true,
    'EnforceSingleRounds': true,
    'CategoryClosed': null,
    'DisplayNoScore': true,
    'MaxDisplayCount': null,
    'DisplayCountValues': [],
    'IncludeTotals': true,
    'InstantWinner': function(player, results, validScores){
      let scoreCount = 0;
      for (let c in validScores){
        scoreCount++;
      }
      if (scoreCount < 1 || results.length < 0){
        return false;
      }

      let number = Object.keys(validScores)[0];

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
    },
  }
}

let gameInfo = [];
let gameCategories = [];
let gameRules = {};
let gameScores = [];
let currentCategory = null;
let players = [];
let currentPlayer = null;
let gameStarted = false;
let gameOver = false;
let tableIsDrawn = false;

// add the games for selections
let gdc = document.getElementById('select-game-dropdown');
for (var key in GAMES){
  let l = document.createElement('label');
  l.innerHTML = key;
  addClickEvent(l, gameSelectionChanged);
  addTouchStartEvent(l, gameSelectionChanged);
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

function endGame(message){
  // End the game
  gameOver = true;
  setCurrentCategory(null);

  if (message){
    alert(message);
  }
  else{
    let winners = getWinners();
    if (winners.length > 1){
      alert(`We have a tie!`);
    }
    else{
      alert(`${winners[0].name} wins!`);
    }
  }
}

function getWinners(){
  if (gameRules['IncludeTotals']){
    let highScore = Math.max(...players.map(p => p.totalScore));
    return players.filter(p => p.totalScore == highScore);
  }
  else {
    // Cricket - First to bull out -- Need to account for scoring in the future.
    return [currentPlayer];
  }
}

function gameSelectionChanged(e){
  e.preventDefault();

  // update the UI
  gameInfo = GAMES[`${e.target.innerHTML}`];
  gameCategories = gameInfo.slice(1);
  gameRules = GAMERULES[`${e.target.innerHTML}`];
  gameScores = GAMESCORES[`${e.target.innerHTML}`];
  initialize();
  // Display the user info section
  document.getElementById('user-info-section').classList.add('show');
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

function addToResultsCollection(collection, key, value){
  if (!collection[key]){
    collection[key] = [];
  }

  collection[key].push(value);
}

function getSum(collection){
  if (collection && collection.length > 0){
    return collection.reduce((res, item) => res + item, 0);
  }

  return 0;
}

// populate the svg dart board scoreboard
let dartboard = null;
function dartboardCallback(results){
  if (!confirm(`You hit:   ${results.join(',  ')}`)){
    dartboard.reset();
    return;
  }

  dartboard.hide();

  let maxIndex = getIndexAfterLastClosedCategory();
  let upToCurrentCategories = gameCategories.filter((item, index) => index <= maxIndex);

  let validScores = results.reduce((a, c, i) => {
    if (gameRules['EnforceOrder']){
      if (gameRules['CategoryClosed'] != null){
        // values before current
        upToCurrentCategories.forEach((cat, i) => {
          let currentCount = getCount(c, cat);
          if (currentCount > 0){
            addToResultsCollection(a, `${cat}`, currentCount);
          }
        });

        // Figure out how to allow players to move past their max closed category.
        // need to get the current user score plus the added score.

        let cat = gameCategories[maxIndex];
        let userScore = currentPlayer.getScore(cat);
        while(getSum(a[`${cat}`]) + userScore >= gameRules['CategoryClosed']){
          cat = getNextCategory(cat);
          let currentCount = getCount(c, cat);
          if (currentCount > 0){
            addToResultsCollection(a, `${cat}`, currentCount);
          }
        }
      }
      else {
        if (c.includes(currentCategory)){
          let cat = c.split('-')[1];
          let currentCount = getCount(c, cat);
          if (currentCount > 0){
            addToResultsCollection(a, `${cat}`, currentCount);
          }
        }
      }
    }
    else {
      let cat = c.split('-')[1];
      let currentCount = getCount(c, cat);
      if (currentCount > 0){
        addToResultsCollection(a, `${cat}`, currentCount);
      }
    }

    return a;
  }, []);

  // joe testing
  if (isInstantWinner(results, validScores)){
    return;
  }

  currentPlayer.addScores(validScores);

  updateScoreboard();
  setNextPlayer();
}

function isInstantWinner(results, validScores){
  let response = gameRules['InstantWinner'](currentPlayer, results, validScores);

  if (response){
    endGame(response);
    return true;
  }

  return false;
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

  if (split.length > 1 && split[1].toUpperCase() == value.toUpperCase()){
    let multiple = 0;
    if (split[0].toUpperCase() == 'S'){
      multiple = 1;
    }
    else if (split[0].toUpperCase() == 'D'){
      multiple = 2;
    }
    else if (split[0].toUpperCase() == 'T'){
      multiple = 3;
    }

    return multiple;
  }

  return 0;
}

function updateScoreboard(){
  if (currentPlayer == null){
    return;
  }
  // get the scores
  let totalScore = 0;
  for (let i = 0; i < gameCategories.length; i++){
    let category = gameCategories[i];
    let scores = currentPlayer.getScores(category);
    let score = getSum(scores);

    totalScore += score;
    let element = document.getElementById(`c${currentPlayer.id}-${category}`);

    // update the UI
    element.innerHTML = null;

    if (gameScores){
      let displayScoreIndex = 0;
      scores.forEach((item, i) => {
        displayScoreIndex += item;
        element.innerHTML += gameScores[displayScoreIndex];
      });
    }
    else {
      element.innerHTML = score;
    }

    if (score == 0){
      if (gameRules['DisplayNoScore'] && parseInt(category) <= currentCategory){
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
    scoreboardTable.classList.add('absolute-centered');

    gameInfo.forEach((item, i) => {
      // main row
      let r = getRow();

      // header
      if (i == 0){
        r.setAttribute('id', 'scoreboad-header');
        r.appendChild(getScoreHeader(item, i));
      }
      else{
        // rows
        r.setAttribute('id', `r${item}`);
        r.appendChild(getScoreColumn(item, item));
      }

      scoreboardTable.appendChild(r);
    });

    if (gameRules['IncludeTotals']){
      let r = getRow(null, 'scoreboard-totals');
      r.appendChild(getScoreColumn('Totals', `totals`));
      scoreboardTable.appendChild(r);
    }

    document.getElementById('scoreboard-container').appendChild(scoreboardTable);

    tableIsDrawn = true;
  }
}

function getScoreHeader(value, id){
  let e = document.createElement('th');
  e.classList.add('score');
  setAtt(e, value, `score-${id}`);
  return e;
}

function getScoreColumn(value, id){
  let e = document.createElement('td');
  e.classList.add('score');
  setAtt(e, value, `score-${id}`);
  return e;
}

function getRow(value, id){
  let e = document.createElement('tr');
  setAtt(e, value, id);
  return e;
}

function getHeader(value, id, addListener){
  let e = document.createElement('th');
  if(addListener){
    addClickEvent(e, showDartBoardClicked);
    addTouchStartEvent(e, showDartBoardTouchStart);
  }
  setAtt(e, value, id);
  return e;
}

function getColumn(value, id, addListener){
  let e = document.createElement('td');
  if(addListener){
    addClickEvent(e, showDartBoardClicked);
    addTouchStartEvent(e, showDartBoardTouchStart);
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

    // keep the score section in the center
    moveScoreColumn();
  }
}

function moveScoreColumn(){
  // remove the dummy blank column
  let fakeColumns = document.querySelectorAll('.fakeColumn');
  [...fakeColumns].forEach((item, i) => {
    item.remove();
  });

  if (players.length == 1 || players.length % 2 != 0){
    let currentTable = document.getElementById('scoreboard-table');
    [...currentTable.rows].forEach((item, i) => {
      let cells = [...item.cells];
      let scoreCol = item.querySelector('[id^="score-"]');
      let nextElement = cells[cells.indexOf(scoreCol) + 1];

      item.insertBefore(nextElement, scoreCol);
    });

    // Add dummy blank column so the table stays centered
    if (players.length % 2 != 0){
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
          let h = getHeader(null, null);
          h.classList.add('fakeColumn');
          r.appendChild(h);
        }
        else{
          // rows
          let c = getColumn(null, null);
          c.classList.add('fakeColumn');
          r.appendChild(c);
        }
      });

      if (gameRules['IncludeTotals']){
        let r = document.querySelector('#scoreboard-totals');
        let c = getColumn(null, null);
        c.classList.add('fakeColumn');
        r.appendChild(c);
      }
    }
  }
}

function newPlayerEnterPressed(e){
    if (e.keyCode == 13) {
        e.preventDefault();
        document.activeElement.blur();
        newPlayerCLicked(e);
    }
}

function newPlayerCLicked(e){
  e.preventDefault();

  if (!tableIsDrawn){
    return;
  }

  // append new column to Scoreboard
  let playerTb = document.getElementById('new-player-name');
  let playerName = playerTb.value;
  if (playerName) {
    players.push(new Player(playerName, createNewScoresDictionary(), gameRules['MaxDisplayCount']));

    // add the user to the Scoreboard
    addPlayerToScoreboard(players[players.length - 1]);

    playerTb.value = null;
  }
}

function createNewScoresDictionary(){
  let newDict = {}

  gameCategories.forEach((value, i) => {
    newDict[value.toString()] = [];
  });

  return newDict;
}

function showDartBoardClicked(e){
  e.preventDefault();

  if (!gameStarted || gameOver){
    return;
  }

  dartboard.display();
}

function showDartBoardTouchStart(e){
  if(e.touches.length > 1){
    e.preventDefault();

    if (!gameStarted || gameOver){
      return;
    }

    dartboard.display();
  }
}

function startNewGame(e){
  e.preventDefault();

  if (players.length < 1){
    return;
  }

  if (gameStarted || gameOver){
    return;
  }

  // set the current player
  setNextPlayer();

  gameStarted = true;

  // reset the currentCategory
  setCurrentCategory(getNextCategory(null));

  document.getElementById('user-info-section').classList.remove('show');
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
  let elements = document.getElementsByClassName(`currentCategory`);
  for (var i = 0; i < elements.length; i++) {
     elements.item(i).classList.remove('currentCategory');
  }

  if (gameRules['EnforceSingleRounds']){
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
    nextPlayerIndex = players.indexOf(currentPlayer) + 1;
  }

  // Check for game over
  let next = getIndexAfterLastClosedCategory();
  if(next >= gameCategories.length){
    endGame();
    return;
  }

  if (nextPlayerIndex >= players.length){
    // reset to first player;
    nextPlayerIndex = 0;

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
  }

  let elements = document.getElementsByClassName('currentPlayer');
  for (var i = 0; i < elements.length; i++) {
     elements.item(i).classList.remove('currentPlayer');
  }

  currentPlayer = players[nextPlayerIndex];

  getHeaderElement().classList.add('currentPlayer');
}

function getHeaderElement(){
  return document.getElementById(`c${currentPlayer.id}-${gameInfo[0]}`);
}

function selectGameClicked(e){
  e.preventDefault();

  document.getElementById('select-game-dropdown').classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
function closeDropDown(e){
  if (!e.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// add addEventListeners
document.getElementById('new-player-name').addEventListener('keypress', newPlayerEnterPressed);
addClickEvent(window, closeDropDown);
addTouchStartEvent(window, closeDropDown);
addClickEvent(document.getElementById('select-game-btn'), selectGameClicked);
addTouchStartEvent(document.getElementById('select-game-btn'), selectGameClicked);
addClickEvent(document.getElementById('new-player-btn'), newPlayerCLicked);
addTouchStartEvent(document.getElementById('new-player-btn'), newPlayerCLicked);
addClickEvent(document.getElementById('start-game-btn'), startNewGame);
addTouchStartEvent(document.getElementById('start-game-btn'), startNewGame);

function addClickEvent(e, callback){
  e.addEventListener('click', callback);
}

function addTouchStartEvent(e, callback){
  e.addEventListener('touchstart', callback);
}
