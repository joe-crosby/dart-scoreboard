class MessageBoard{
  #id;
    #displayMessageResponse = null;
    #board = `<div id="message-board" class="message-board">
      <div class="message-container">
      <div>
        <div id="message" class="message"></div>
        <button id="message-yes" class="message-yes">Yes</button>
        <button id="message-no" class="message-no">No</button>
        <button id="message-cancel" class="message-cancel">Cancel</button>
        <button id="message-ok" class="message-ok">Ok</button>
      </div>
      </div>
    </div>`;

    #text = null;
    #displayYesNo = false;
    #displayCancel = false;
    #callBack;
    constructor(text, displayYesNo, displayCancel, callBack){
      this.#id = Date.now() + Math.floor(((Math.random() + 1) * 10));
      this.#text = text;
      this.#displayYesNo = displayYesNo;
      this.#displayCancel = displayCancel;
      this.#callBack = callBack;

      this.#show();
    }

    #callTheCallBack(response){
      if(this.#callBack){
        this.#callBack(response);
      }
    }

    #show(){
      // display the messageboard overlay.
      let idPrefix = `id="${this.#id}-message`;
      let board = this.#board.replaceAll("id=\"message", idPrefix)
      document.body.insertAdjacentHTML('beforeend', board);

      this.messageBoard = document.getElementById(`${this.#id}-message-board`);
      this.message = document.getElementById(`${this.#id}-message`);

      this.yesBtn = document.getElementById(`${this.#id}-message-yes`);
      this.noBtn = document.getElementById(`${this.#id}-message-no`);
      this.cancelBtn = document.getElementById(`${this.#id}-message-cancel`);
      this.okBtn = document.getElementById(`${this.#id}-message-ok`);

      this.#initializeMessageBoard();
    }

    #initializeMessageBoard(){
      this.messageBoard.classList.add('pull-forward');
      this.message.innerHTML = this.#text;
      this.#displayMessageResponse = null;
      //
      if (this.#displayYesNo){
        this.yesBtn.classList.add('show-inline');
        this.yesBtn.addEventListener('click', ((e) => {
          e.preventDefault();
          this.#displayMessageResponse = 'yes';
          this.#callTheCallBack(this.#displayMessageResponse);
          this.#uninitializeMessageBoard();
        }));

        this.noBtn.classList.add('show-inline');
        this.noBtn.addEventListener('click', ((e) => {
          e.preventDefault();
          this.#displayMessageResponse = 'no';
          this.#callTheCallBack(this.#displayMessageResponse);
          this.#uninitializeMessageBoard();
        }));
      }
      else{
        this.okBtn.classList.add('show-inline');
        this.okBtn.addEventListener('click', ((e) => {
          e.preventDefault();
          this.#displayMessageResponse = 'ok';
          this.#callTheCallBack(this.#displayMessageResponse);
          this.#uninitializeMessageBoard();
        }));
      }

      if (this.displayCancel){
        this.cancelBtn.classList.add('show-inline');
        this.cancelBtn.addEventListener('click', ((e) => {
          e.preventDefault();
          this.#displayMessageResponse = 'cancel';
          this.#callTheCallBack(this.#displayMessageResponse);
          this.#uninitializeMessageBoard();
        }));
      }
    }

    #uninitializeMessageBoard(){
      this.messageBoard.remove();
    }
}
