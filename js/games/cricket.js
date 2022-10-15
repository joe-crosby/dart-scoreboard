class Cricket extends DartGame{
  static #categories = ['20', '19', '18', '17', '16', '15', 'BULL'];
  static #scoreValues = [
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
  ];

  constructor(){
    super('Cricket', Cricket.#categories, Cricket.#scoreValues);

    this.categoryClosed =  3;
    this.maxDisplayCount =  3;
  }
}
