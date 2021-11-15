
class Schermo {
  // variabili private
  #schermo
  constructor(){
    // creo elemento schermo di tipo SINGLETON
    //console.log(Schermo._instance);
    if(!Schermo._instance){
        Schermo._instance = this;
        let div= document.createElement("div");
        this.#schermo = div;
        this.#schermo.id= "schermo";
        document.body.appendChild(this.#schermo);
    }
    return Schermo._instance;
  }

  getSchermo() {
    return document.getElementById(this.#schermo.id);
  }


}

class Pagina{
  constructor(){
    this.schermo = new Schermo();
  }

  getSchermo(){
    return this.schermo.getSchermo();
  }

  destructor(){
    /* distruggo tutto quello che ho stampato a schermo */
    let padre = this.getSchermo();
    for(var i = 0; i < padre.childElementCount; i++){
      padre.removeChild(padre.children[i]);
    }
  }
}

class Lobby extends Pagina{    // costruisco la pagina della lobby

  constructor() {
    super();    // chiamo il costruttore della superclasse

    // Creo Titolo
    let h1 = document.createElement("h1");
    h1.id= "title";
    h1.innerHTML = "MUSICAL S N A K E"
    super.getSchermo().appendChild(h1);

    // Center  Panel
    //const div= super.div;  
    let centerPanel = document.createElement("div");
    //centerPanel.className = "center panel";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);
    let text = '<div id = "text">Come vuoi giocare?</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);

    //IMMAGINI
    let image1 = document.createElement("img");
    image1.src = "Images/SnakeGreen.png";
    image1.classList.add("snakeGreen");
    document.body.appendChild(image1);

    let image2 = document.createElement("img");
    image2.src = "Images/SnakeRed.png";
    image2.classList.add("snakeRed");
    document.body.appendChild(image2);

    
    let bottone = '<button id = "singleplayer" class = "button">SinglePlayer</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);
   

    /*
    pulsante_singlePLayer = document.createElement("button");
    pulsante_singlePLayer.classList.add("button");
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante_singlePLayer);
    */

    bottone = '<button id = "multiplayer" class = "button">MultiPlayer</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);

    bottone = '<button id = "joinGame" class = "button">JoinGame</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);

    let lobby = this;
    singleplayer.onclick = function(){
      let txt = lobby.getText()
      txt.innerText = "Play!!";
      setTimeout(function(){ lobby.destructor(); delete this; single = new SinglePlayer();},1000)
      //delete lobby;
    }
    multiplayer.onclick = function(){
      setTimeout(function(){ lobby.destructor(); delete this; single = new MultiPlayer();},1000)
      //delete lobby;
    }
  }

  getText(){
    return document.getElementById("text");
  }

};



class SinglePlayer extends Pagina{    // costruisco la pagina della lobby
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
    let canvasContainer = document.createElement('div');
    new p5(sketch, canvasContainer);
    super.getSchermo().appendChild(canvasContainer);
    canvasContainer.id = "canvas";
    document.getElementById(canvasContainer.id).children[0].style.visibility= "visible"
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

}

/*
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
*/
class MultiPlayer extends Schermo{    

  constructor() {
    super();  
    let h = document.createElement("h1");
    h.id= "message";
    h.innerHTML = "Il nome della room è "
    super.getSchermo().appendChild(h);

    let m = document.createElement("h2");
    m.id= "roomName";
    m.innerHTML = "xxx"
    h.appendChild(m);
    
  }
}   