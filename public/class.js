
class Schermo {
  // variabili private
  #schermo
  constructor(){
    // creo elemento schermo di tipo SINGLETON
    if(!Schermo._instance){
        Schermo._instance = this;
        let div= document.createElement("div");
        this.#schermo = div;
        this.#schermo.id= "schermo";
        document.body.appendChild(this.#schermo);
    }
    return Schermo._instance;
  }

  static getInstance() {
    return this._instance;
  }

  getSchermo() {
    return this.#schermo;
  }

  destructor(){
    /* distruggo tutto quello che ho stampato a schermo */
    document.getElementById(this.#schermo.id).innerHTML = "";
  }
}

class Lobby extends Schermo{    // costruisco la pagina della lobby

  constructor() {
    super();    // chiamo il costruttore della superclasse

    // Creo Titolo
    let h1 = document.createElement("h1");
    h1.id= "title";
    h1.innerHTML = "S N A K E"
    super.getSchermo().appendChild(h1);

    // Center  Panel
    //const div= super.div;
    let centerPanel = document.createElement("div");
    centerPanel.className = "center panel";
    super.getSchermo().appendChild(centerPanel);
    let text = '<div id = "text">Come vuoi giocare?</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);
    let bottone = '<button id = "singleplayer" class = "button">Singleplayer</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);
    bottone = '<button id = "multiplayer" class = "button">Multiplayer</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);

  }

  getText(){
    return document.getElementById("text");
  }

}



class SinglePlayer extends Schermo{    // costruisco la pagina della lobby
  // variabili private
  #snake;
  #resolution = 20;
  #food;
  #score = 0;
  #canvasWidth = 400;
  #canvasHeight = 400;


  constructor() {
    super();    // chiamo il costruttore della superclasse

    // Creo Titolo E Sottotitolo
    let h = document.createElement("h1");
    h.id= "title";
    h.innerHTML = "S N A K E"
    super.getSchermo().appendChild(h);

    h = document.createElement("h2");
    h.id= "title";
    h.innerHTML = "Single Player"
    super.getSchermo().appendChild(h);

    // Creo Canvas
    let canvasCountainer = document.createElement('div');
    new p5(sketch, canvasCountainer);
    super.getSchermo().appendChild(canvasCountainer);
    canvasCountainer.id = "canvas";
    document.getElementById(canvasCountainer.id).children[0].style.visibility= "visible"
    //cnv = new Canvas(this.#canvasWidth,this.#canvasHeight, this.#resolution);

    // Creo counter
    let c = document.createElement("div");
    let n = document.createElement("h3");
    c.id = "counter";
    n.id = "testoCounter"; 
    n.innerHTML = "0";
    super.getSchermo().appendChild(c);
    c.appendChild(n)
    }

    startGame(){
      frameRate(5);
      snake = new Snake();
      foodLocation();
    }
}

class Canvas{
  #w;
  #h;
  #id;
  #cnv;    // canvas element
  constructor(canvasWidth,canvasHeight,resolution){
    // Canvas

    this.#cnv = createCanvas(canvasWidth, canvasHeight);
    this.#id = this.#cnv["canvas"]["id"];
    console.log(this.#cnv)
    background(220);
    this.centerCanvas()
    this.#w = floor(width / resolution);
    this.#h = floor(height / resolution);
    return this.#cnv;
  }

  getCanvasId(){
    return this.#id;
  }

  centerCanvas(){
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    this.#cnv.position(x, y);
  }
}
