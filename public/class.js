
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
    this.destructor();
  }
  getSchermo(){
    return this.schermo.getSchermo();
  }
  destructor(){
    /* distruggo tutto quello che ho stampato a schermo */
    this.schermo.getSchermo().innerHTML = "";
  }
}

class Lobby extends Pagina{    // costruisco la pagina della lobby

  constructor() {
    super();    // chiamo il costruttore della superclasse

    // Creo Titolo
    let h1 = document.createElement("h1");
    h1.id= "title";
    h1.innerHTML = "B L I N D"
    super.getSchermo().appendChild(h1);

    // Center  Panel
    //const div= super.div;
    let centerPanel = document.createElement("div");
    //centerPanel.className = "center panel";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);
    let text = '<div id = "text">Come vuoi giocare?</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);
    /*
    //IMMAGINI
    let image1 = document.createElement("img");
    image1.src = "images/SnakeGreen.png";
    image1.classList.add("snakeGreen");
    super.getSchermo().appendChild(image1);

    let image2 = document.createElement("img");
    image2.src = "images/SnakeRed.png";
    image2.classList.add("snakeRed");
    super.getSchermo().appendChild(image2);
    */
    let bottone = '<button id = "singleplayer" class = "button">SinglePlayer</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);

    /*
    pulsante_singlePLayer = document.createElement("button");
    pulsante_singlePLayer.classList.add("button");
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante_singlePLayer);
    */

    bottone = '<button id = "multiplayer" class = "button">MultiPlayer</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);

    let self = this;
    singleplayer.onclick = function(){
      let txt = self.getText()
      txt.innerText = "Play!!";
      setTimeout(function(){ pagina = new SinglePlayer();},1000)
    }
    multiplayer.onclick = function(){
      setTimeout(function(){ pagina = new MultiPlayerLobby();},1000)
    }

  }

  getText(){
    return document.getElementById("text");
  }
}



class SinglePlayer extends Pagina{    // costruisco la pagina della lobby
  // variabili private
  #snake;
  #resolution = 20;
  #food;
  #score = 0;
  #canvasWidth = 400;
  #canvasHeight = 400;

  constructor() {
    //// prova Prova prova
    super();    // chiamo il costruttore della superclasse

    // Creo Titolo E Sottotitolo
    let h = document.createElement("h1");
    h.id= "title";
    h.innerHTML = "B L I N D"
    super.getSchermo().appendChild(h);

    h = document.createElement("h2");
    h.id= "subtitle";
    h.innerHTML = "Single Player"
    super.getSchermo().appendChild(h);

    //this.canvas = new Canvas();
    let canvasContainer = document.createElement('div');
    let cnv = new Canvas(canvasContainer,'SinglePlayer',super.getSchermo())

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

let type;
class Canvas{
  constructor(canvasContainer,t,schermo){
    // Creo Canvas
    //new sketch(canvasContainer,type)
    type = t; //tipo del gioco
    new p5(sketch, canvasContainer);
    schermo.appendChild(canvasContainer);
    canvasContainer.id = "canvas";
    document.getElementById(canvasContainer.id).children[0].style.visibility= "visible";
  }
}

let socket;
class MultiPlayerLobby extends Pagina{
  constructor() {
    super();

    // Creo Titolo E Sottotitolo
    let h = document.createElement("h1");
    h.id= "title";
    h.innerHTML = "B L I N D"
    super.getSchermo().appendChild(h);

    h = document.createElement("h2");
    h.id= "subtitle";
    h.innerHTML = "Multi Player Lobby"
    super.getSchermo().appendChild(h);

    let centerPanel = document.createElement("div");
    //centerPanel.className = "center panel";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);

    let text = '<div id = "text">Pronto?</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);

    let pulsante1 = '<button id = "quickGame" class = "button">Quick Game</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante1);

    let pulsante2 = '<button id = "createGame" class = "button">Create Game</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante2);

    let pulsante3 = '<button id = "joinGame" class = "button">Join Game</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante3);

    // SOCKET IO
    socket = io();

    socket.on("connect", () => {
      console.log("Il mio socket ID è: "+socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Mi sono disconnesso: "+socket.id);
    });

    socket.on("room message", (id, msg) => {
      console.log("id: "+id+" msg: "+msg);
    });

    socket.on("startMultiplayer!", (state) => {
      //Mi aspetto di ritorno il game state appena generato da Server
      // Allego al game state il mio soket ID
      state['myid'] = socket.id;
      console.log("GAME STATE: ",state);
      document.getElementById("text").innerText = "Inizio Partita!"
      setTimeout(function(){pagina = new MultiPlayer(state);},2000)
    });

    quickGame.onclick = function(){
        socket.emit("startGame",(response) => {
            console.log("Il server dice: "+response.status+ " la mia stanza è: "+response.room); // ok
            this.room = response.room;
            if(response.status == "start"){
              socket.emit("startMultiplayer", this.room);
            }else if(response.status == "wait"){
              document.getElementById("text").innerText = "Attesa secondo giocatore..."
            }else if(response.status == "full"){
              document.getElementById("text").innerText = "Server pieno!";
            }
        });
    }

  }
}

let gameState;
class MultiPlayer extends Pagina{
  constructor(state) {
    super();

      // Creo Titolo E Sottotitolo
      let h = document.createElement("h1");
      h.id= "title";
      h.innerHTML = "B L I N D"
      super.getSchermo().appendChild(h);

      h = document.createElement("h2");
      h.id= "subtitle";
      h.innerHTML = "Multi Player"
      super.getSchermo().appendChild(h);

      //this.canvas = new Canvas();
      gameState = state;
      let canvasContainer = document.createElement('div');
      let cnv = new Canvas(canvasContainer,'MultiPlayer',super.getSchermo())

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


class Transmit{
  constructor(player,enemyArrey){
    this.message = {};
    this.address_id = [];
    enemyArrey.forEach((item, i) => {
      this.address_id.push(item.getID());
    });
    this.p = player;
    let pos = this.p.getPosition();
    this.x = pos.x;
    this.y = pos.y;
    let dir = this.p.getDirection();
    this.dir = dir;
    this.event = null;
  }
  transmitPosition(){
    let pos = this.p.getPosition();

    if(pos.x != this.x || pos.y != this.y){
      let msg = {address: this.address_id, x: this.x, y: this.y};
      socket.volatile.emit("sendPosition", msg);
      this.x = pos.x;
      this.y = pos.y;
    }
  }
  transmitDirection(){
    let dir = this.p.getDirection();

    if(dir != this.dir){
      let msg = {address: this.address_id, dir: this.dir};
      socket.volatile.emit("sendDirection", msg);
      this.dir = dir;
    }
  }

}

class Recive{
  constructor(player,enemyArrey){
    this.p = player;
    this.enemyArrey = enemyArrey;

    socket.on("recivePosition", (msg) => {
      console.log(msg);
      this.enemyArrey.forEach((item, i) => {
        if(msg.sender == item.getID()){item.updatePosition(msg.x,msg.y)}
      });

    });

    socket.on("reciveDirection", (msg) => {
      console.log(msg);
      this.enemyArrey.forEach((item, i) => {
        if(msg.sender == item.getID()){item.updateDirection(msg.dir)}
      });

    });

  }
  recivePosition(){

  }
  reciveDirection(){

  }

}
