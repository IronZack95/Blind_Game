class Snake {   // oggetto serpente

  constructor() {
  	this.body = [];
    this.body[0] = createVector(floor(w/2), floor(h/2));
    this.xdir = 0;
    this.ydir = 0;
    this.len = 0;
    this.score = 0;   // score del serpente
  }

  setDir(x, y) {
  	this.xdir = x;
    this.ydir = y;
  }

  getBody(){
    return this.body;
  }

  update() {
  	let head = this.body[this.body.length-1].copy();
    this.body.shift();
    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);
  }

  grow() {
  	let head = this.body[this.body.length-1].copy();
    this.len++;
    this.body.push(head);
  }

  endGame() {
  	let x = this.body[this.body.length-1].x;
    let y = this.body[this.body.length-1].y;
    if(x > w-1 || x < 0 || y > h-1 || y < 0) {
       return true;
    }
    for(let i = 0; i < this.body.length-1; i++) {
    	let part = this.body[i];
      if(part.x == x && part.y == y) {
      	return true;
      }
    }
    return false;
  }

  eat(pos) {
  	let x = this.body[this.body.length-1].x;
    let y = this.body[this.body.length-1].y;
    if(x == pos.x && y == pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  show() {
  	for(let i = 0; i < this.body.length; i++) {
    	fill(0);
      noStroke();
      rect(this.body[i].x, this.body[i].y, 1, 1)
    }
  }

}


class Schermo {
  constructor(){
    // creo elemento schermo di tipo SINGLETON
    if(!Schermo._instance){
        Schermo._instance = this;
        const div= document.createElement("div");
        this.schermo = div;
        this.schermo.id= "schermo";
        document.body.appendChild(this.schermo);
    }
    return Schermo._instance;
  }

  static getInstance() {
    return this._instance;
  }

  getSchermo() {
    return this.schermo;
  }

  destructor(){
    /* distruggo tutto quello che ho stampato a schermo */
    document.getElementById(this.schermo.id).innerHTML = "";
  }
}

class Lobby extends Schermo{    // costruisco la pagina della lobby
  constructor() {
    super();    // chiamo il costruttore della superclasse

    // Creo Titolo
    this.h1 = document.createElement("h1");
    this.h1.id= "title";
    this.h1.innerHTML = "S N A K E"
    super.getSchermo().appendChild(this.h1);

    // Center  Panel
    const div= document.createElement("div");
    this.centerPanel = div;
    this.centerPanel.className = "center panel"
    super.getSchermo().appendChild(this.centerPanel);
    let text = '<div id = "text">Come vuoi giocare?</div>'
    this.centerPanel.insertAdjacentHTML('afterBegin', text);
    let bottone = '<button id = "singleplayer" class = "button">Singleplayer</button>'
    this.centerPanel.insertAdjacentHTML('beforeEnd', bottone);
    bottone = '<button id = "multiplayer" class = "button">Multiplayer</button>'
    this.centerPanel.insertAdjacentHTML('beforeEnd', bottone);

  }



}
