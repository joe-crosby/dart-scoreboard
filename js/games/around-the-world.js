class AroundTheWorld extends DartGame{
  static #categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', 'BULL'];
  static #scoreValues = [
    null,
    `<svg height="100%" viewBox="0 0 40 40" stroke="black">
       <g>
         <path d="M30 6 L6 30 L9 34 L34 9 Z" />
         <path d="M9 6 L34 31 L30.5 34 L5.5 9.5 Z" />
       </g>
     Sorry, your browser does not support inline SVG.
    </svg>`,
  ];

  constructor(){
    super('Around The World', AroundTheWorld.#categories, null, null, AroundTheWorld.#scoreValues);

    this.categoryClosed =  1;
    this.maxDisplayCount = 1;
  }
}
