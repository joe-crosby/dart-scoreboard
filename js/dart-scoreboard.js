
let boardViewBoxX = 0;
let boardViewBoxY = 0;
let boardViewBoxSize = 200;
let sliceStrokeWidth = .5;

let center_x = boardViewBoxSize / 2;
let center_y = boardViewBoxSize / 2;

let outer_y = 2;

let radius = (boardViewBoxSize / 2);
let area = Math.PI * (radius^2);

let archLength = (area/20) * 1.95;
let borderArchX1 = radius + (archLength / 2);
let borderArchX2 = borderArchX1 - archLength;

let doubleArchX1 = borderArchX1 - (borderArchX1 * .022);
let doubleArchX2 = borderArchX2 + (borderArchX2 * .031);
let double_outer_y = outer_y + 15;

let n1ArchX1 = borderArchX1 - (borderArchX1 * .0287);
let n1ArchX2 = borderArchX2 + (borderArchX2 * .040);
let n1_outer_y = outer_y + 20;

let trippleArchX1 = borderArchX1 - (borderArchX1 * .070);
let trippleArchX2 = borderArchX2 + (borderArchX2 * .095);
let tripple_outer_y = outer_y + 50;

let n2ArchX1 = borderArchX1 - (borderArchX1 * .077);
let n2ArchX2 = borderArchX2 + (borderArchX2 * .105);
let n2_outer_y = outer_y + 55;

let textX = borderArchX1 - 21;
let textWidth = 20;
let textY = outer_y + 8;
let textHeight = 20;

const svgNamespace = "http://www.w3.org/2000/svg";
const sliceHeadings = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

let selections = [];

function clicked(e){
  e.preventDefault();

  if (selections.length == 3){
    return;
  }

  let element = e.target;
  highlightElement(element);
  let value = element.id.replace('-', ' ').replace('n1', '').replace('n2', '').trim();
  selections.push(value);
}

function highlightElement(e){
  e.classList.add('highlight');
  setTimeout(function() {
      unHighlightElement(e)
  }, 500);
}
// TODO :: Use Jquery for the dialog boxes. They look nicer and are more customizeable.
function unHighlightElement(e){
  e.classList.remove('highlight');
  if (selections.length == 3){
    if (!confirm(`You clicked ${selections}. Is this correct?`)){
      selections = [];
    }
    else {
      // UPDATE SCORE OR SEND TO OTHER CLASS AND RESET SELECTIONS
      alert("UPDATE SCORE OR SEND TO OTHER CLASS AND RESET SELECTIONS");
      selections = [];
    }
  }
}

function addClickEvent(element){
  element.addEventListener('click', clicked);
  element.addEventListener('touchstart', clicked);
}

function createBoard(){
  let board = document.createElementNS(svgNamespace, 'svg');
  board.setAttribute('id', 'dart-board');
  board.setAttribute('viewBox', `${boardViewBoxX} ${boardViewBoxY} ${boardViewBoxSize} ${boardViewBoxSize}`);

  board.setAttribute('style', `border-radius: 50%; border: 0px solid #782a2a; background: silver`);

  let startingPieRotationDegrees = 0;
  let fillColor = 'green';
  let background = 'tan';

  for (let i = 0; i < sliceHeadings.length; i++){
    let number = sliceHeadings[i];

    if (i % 2 == 0){
      fillColor = 'red';
      background = 'black';
    }
    else{
      fillColor = 'green';
      background = 'tan';
    }

    // group
    let group = document.createElementNS(svgNamespace, 'g');
    group.classList.add(`pie${number}`);
    if (i > 0){
      group.setAttribute("style", `transform: rotate(${startingPieRotationDegrees}deg); transform-origin: 50% 50%;`);
    }
    startingPieRotationDegrees += 18;


    // border
    let border = createPath(`border-${number}`, `M${center_x} ${center_y} L${borderArchX1} ${outer_y} A100 100 1 0,0 ${borderArchX2},${outer_y} L${center_x} ${center_y}Z`, 'black');
    let borderId = `border${number}`;
    border.setAttribute('id', borderId)
    group.appendChild(border);

    let textGroup = document.createElementNS(svgNamespace, 'g');
    let t = document.createElementNS(svgNamespace, 'text');
    t.setAttribute('fill', 'white');
    t.setAttribute('font-size', '10px');
    t.setAttribute('x', textX);
    // center single character numbers
    if (number.toString().length == 1){
      t.setAttribute('x', textX + 2);
    }
    t.setAttribute('y', textY);
    t.setAttribute('width', textWidth);
    t.setAttribute('height', textHeight);
    if (i > 5 && i < 15){
      t.setAttribute('transform',`translate(-10,-25) rotate(180, ${(textWidth / 2) + textX}, ${(textHeight / 2) + textY})`);
    }
    t.innerHTML = number;

    group.appendChild(t);

    // double
    let double = createPath(`d-${number}`, `M${center_x} ${center_y} L${doubleArchX1} ${double_outer_y} A100 100 1 0,0 ${doubleArchX2},${double_outer_y} L${center_x} ${center_y}Z`, fillColor, 'silver');
    addClickEvent(double);
    group.appendChild(double);

    // normal
    let n1 = createPath(`n1-${number}`, `M${center_x} ${center_y} L${n1ArchX1} ${n1_outer_y} A100 100 1 0,0 ${n1ArchX2},${n1_outer_y} L${center_x} ${center_y}Z`, background, 'silver')
    addClickEvent(n1);
    group.appendChild(n1);

    // tripple
    let tripple = createPath(`t-${number}`, `M${center_x} ${center_y} L${trippleArchX1} ${tripple_outer_y} A80 80 1 0,0 ${trippleArchX2},${tripple_outer_y} L${center_x} ${center_y}Z`, fillColor, 'silver');
    addClickEvent(tripple);
    group.appendChild(tripple);

    // normal
    let n2 = createPath(`n2-${number}`, `M${center_x} ${center_y} L${n2ArchX1} ${n2_outer_y} A80 80 1 0,0 ${n2ArchX2},${n2_outer_y} L${center_x} ${center_y}Z`, background, 'silver');
    addClickEvent(n2);
    group.appendChild(n2);

    board.appendChild(group);
  }

  // Bullseye
  let bullseye = createCircle('bull', 7, 'green');
  addClickEvent(bullseye);
  board.appendChild(bullseye);

  let doubleBullseye = createCircle('d-bull', 3, 'red');
  addClickEvent(doubleBullseye);
  board.appendChild(doubleBullseye);

  return board;
}

function createPath(id, data, fillColor, stroke = null){
  let p = document.createElementNS(svgNamespace, 'path');

  if (id){
    p.setAttribute('id', id);
  }

  p.setAttribute('d', data);
  if (fillColor != null)
    p.setAttribute('fill', fillColor);
  p.setAttribute('stroke-width', sliceStrokeWidth);

  if (stroke != null)
    p.setAttribute('stroke', stroke);

  return p;
}

function createCircle(id, r, fill){
  let c = document.createElementNS(svgNamespace, 'circle');

  if (id){
    c.setAttribute('id', id);
  }

  c.setAttribute('cx', 100);
  c.setAttribute('cy', 100);
  c.setAttribute('r', r);
  c.setAttribute('stroke-width', sliceStrokeWidth);
  c.setAttribute('stroke', 'silver');
  c.setAttribute('fill', fill);

  return c;
}

let boardDisplay = document.getElementById('board-display');
boardDisplay.appendChild(createBoard());
