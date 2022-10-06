class Dartboard{
  #disabled = true;

  #resultCallback;
  #dartBoardContainer;

  #boardViewBoxX = 0;
  #boardViewBoxY = 0;
  #boardViewBoxSize = 200;
  #sliceStrokeWidth = .5;
  #outer_y = 2;
  #textWidth = 20;
  #textHeight = 20;

  #center_x;
  #center_y;

  #radius;
  #area;

  #archLength;
  #borderArchX1;
  #borderArchX2;

  #doubleArchX1;
  #doubleArchX2;
  #double_outer_y;

  #n1ArchX1;
  #n1ArchX2;
  #n1_outer_y;

  #trippleArchX1;
  #trippleArchX2;
  #tripple_outer_y;

  #n2ArchX1;
  #n2ArchX2;
  #n2_outer_y;

  #textX;
  #textY;

  #svgNamespace;
  #sliceHeadings;

  #selections;

  constructor(resultCallback, dartboardContainer){
    this.#resultCallback = resultCallback;
    this.#dartBoardContainer = dartboardContainer;

    this.#center_x = this.#boardViewBoxSize / 2;
    this.#center_y = this.#boardViewBoxSize / 2;

    this.#radius = (this.#boardViewBoxSize / 2);
    this.#area = Math.PI * (this.#radius^2);

    this.#archLength = (this.#area/20) * 1.95;
    this.#borderArchX1 = this.#radius + (this.#archLength / 2);
    this.#borderArchX2 = this.#borderArchX1 - this.#archLength;

    this.#doubleArchX1 = this.#borderArchX1 - (this.#borderArchX1 * .022);
    this.#doubleArchX2 = this.#borderArchX2 + (this.#borderArchX2 * .031);
    this.#double_outer_y = this.#outer_y + 15;

    this.#n1ArchX1 = this.#borderArchX1 - (this.#borderArchX1 * .0287);
    this.#n1ArchX2 = this.#borderArchX2 + (this.#borderArchX2 * .040);
    this.#n1_outer_y = this.#outer_y + 20;

    this.#trippleArchX1 = this.#borderArchX1 - (this.#borderArchX1 * .070);
    this.#trippleArchX2 = this.#borderArchX2 + (this.#borderArchX2 * .095);
    this.#tripple_outer_y = this.#outer_y + 50;

    this.#n2ArchX1 = this.#borderArchX1 - (this.#borderArchX1 * .077);
    this.#n2ArchX2 = this.#borderArchX2 + (this.#borderArchX2 * .105);
    this.#n2_outer_y = this.#outer_y + 55;

    this.#textX = this.#borderArchX1 - 21;
    this.#textY = this.#outer_y + 8;

    this.#svgNamespace = "http://www.w3.org/2000/svg";
    this.#sliceHeadings = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

    this.#selections = [];
  }

  create(){
    this.#dartBoardContainer.innerHTML = null;

    let board = document.createElementNS(this.#svgNamespace, 'svg');
    board.setAttribute('id', 'dart-board');
    board.setAttribute('viewBox', `${this.#boardViewBoxX} ${this.#boardViewBoxY} ${this.#boardViewBoxSize} ${this.#boardViewBoxSize}`);

    board.setAttribute('style', `border-radius: 50%; border: 0px solid #782a2a; background: silver`);

    let startingPieRotationDegrees = 0;
    let fillColor = 'green';
    let background = 'tan';

    for (let i = 0; i < this.#sliceHeadings.length; i++){
      let number = this.#sliceHeadings[i];

      if (i % 2 == 0){
        fillColor = 'red';
        background = 'black';
      }
      else{
        fillColor = 'green';
        background = 'tan';
      }

      // group
      let group = document.createElementNS(this.#svgNamespace, 'g');
      group.classList.add(`pie${number}`);
      if (i > 0){
        group.setAttribute("style", `transform: rotate(${startingPieRotationDegrees}deg); transform-origin: 50% 50%;`);
      }
      startingPieRotationDegrees += 18;


      // border
      let border = this.#createPath(`border-${number}`, `M${this.#center_x} ${this.#center_y} L${this.#borderArchX1} ${this.#outer_y} A100 100 1 0,0 ${this.#borderArchX2},${this.#outer_y} L${this.#center_x} ${this.#center_y}Z`, 'black');
      let borderId = `border${number}`;
      border.setAttribute('id', borderId)
      this.#addClickEvent(border);
      group.appendChild(border);

      let textGroup = document.createElementNS(this.#svgNamespace, 'g');
      let t = document.createElementNS(this.#svgNamespace, 'text');
      t.setAttribute('fill', 'white');
      t.setAttribute('font-size', '10px');
      t.setAttribute('x', this.#textX);
      // center single character numbers
      if (number.toString().length == 1){
        t.setAttribute('x', this.#textX + 2);
      }
      t.setAttribute('y', this.#textY);
      t.setAttribute('width', this.#textWidth);
      t.setAttribute('height', this.#textHeight);
      if (i > 5 && i < 15){
        t.setAttribute('transform',`translate(-10,-25) rotate(180, ${(this.#textWidth / 2) + this.#textX}, ${(this.#textHeight / 2) + this.#textY})`);
      }
      t.innerHTML = number;

      group.appendChild(t);

      // double
      let double = this.#createPath(`d-${number}`, `M${this.#center_x} ${this.#center_y} L${this.#doubleArchX1} ${this.#double_outer_y} A100 100 1 0,0 ${this.#doubleArchX2},${this.#double_outer_y} L${this.#center_x} ${this.#center_y}Z`, fillColor, 'silver');
      this.#addClickEvent(double);
      group.appendChild(double);

      // normal
      let n1 = this.#createPath(`n1-${number}`, `M${this.#center_x} ${this.#center_y} L${this.#n1ArchX1} ${this.#n1_outer_y} A100 100 1 0,0 ${this.#n1ArchX2},${this.#n1_outer_y} L${this.#center_x} ${this.#center_y}Z`, background, 'silver')
      this.#addClickEvent(n1);
      group.appendChild(n1);

      // tripple
      let tripple = this.#createPath(`t-${number}`, `M${this.#center_x} ${this.#center_y} L${this.#trippleArchX1} ${this.#tripple_outer_y} A80 80 1 0,0 ${this.#trippleArchX2},${this.#tripple_outer_y} L${this.#center_x} ${this.#center_y}Z`, fillColor, 'silver');
      this.#addClickEvent(tripple);
      group.appendChild(tripple);

      // normal
      let n2 = this.#createPath(`n2-${number}`, `M${this.#center_x} ${this.#center_y} L${this.#n2ArchX1} ${this.#n2_outer_y} A80 80 1 0,0 ${this.#n2ArchX2},${this.#n2_outer_y} L${this.#center_x} ${this.#center_y}Z`, background, 'silver');
      this.#addClickEvent(n2);
      group.appendChild(n2);

      board.appendChild(group);
    }

    // Bullseye
    let bullseye = this.#createCircle('s-bull', 7, 'green');
    this.#addClickEvent(bullseye);
    board.appendChild(bullseye);

    let doubleBullseye = this.#createCircle('d-bull', 3, 'red');
    this.#addClickEvent(doubleBullseye);
    board.appendChild(doubleBullseye);

    this.#dartBoardContainer.appendChild(board);
  }

  #createPath(id, data, fillColor, stroke = null){
    let p = document.createElementNS(this.#svgNamespace, 'path');

    if (id){
      p.setAttribute('id', id);
    }

    p.setAttribute('d', data);
    if (fillColor != null)
      p.setAttribute('fill', fillColor);
    p.setAttribute('stroke-width', this.#sliceStrokeWidth);

    if (stroke != null)
      p.setAttribute('stroke', stroke);

    return p;
  }

  #createCircle(id, r, fill){
    let c = document.createElementNS(this.#svgNamespace, 'circle');

    if (id){
      c.setAttribute('id', id);
    }

    c.setAttribute('cx', 100);
    c.setAttribute('cy', 100);
    c.setAttribute('r', r);
    c.setAttribute('stroke-width', this.#sliceStrokeWidth);
    c.setAttribute('stroke', 'silver');
    c.setAttribute('fill', fill);

    return c;
  }

  #clicked(e){
    e.preventDefault();

    if (this.#selections.length < 3){
      let element = e.target;
      let value = element.id.replace('n1', 's').replace('n2', 's').trim();
      // When the user clicks the border, they have indicated that the dart did
      // not hit a valid position on the board
      if (value.includes('border')){
        value = '0';
      }

      this.#selections.push(value);
      this.#highlightElement(element);
    }
  }

  #highlightElement(e){
    e.classList.add('highlight');
    setTimeout(function() {
        this.#unHighlightElement(e)
    }.bind(this), 500);
  }

  #unHighlightElement(e){
    e.classList.remove('highlight');

    if (this.#selections.length == 3){
      // send selections to the callback method
      this.#resultCallback(this.#selections);
      this.#selections.length = 900;
    }
  }

  #addClickEvent(element){
    element.addEventListener('click', this.#clicked.bind(this));
    element.addEventListener('touchstart', this.#clicked.bind(this));
  }

  display(){
    this.#dartBoardContainer.classList.add('showDartBoard');
    this.#selections = [];
  }

  hide(){
    this.#dartBoardContainer.classList.remove('showDartBoard');
  }
}
