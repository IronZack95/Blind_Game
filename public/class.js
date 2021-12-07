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

let playerName;
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

    let input = '<input type="text" id="PlayerName" value="Your name">';
    centerPanel.insertAdjacentHTML('afterEnd', input);

    let self = this;
    singleplayer.onclick = function(){
      let txt = self.getText()
      txt.innerText = "Play!!";
      inputFieldCaputre();
      setTimeout(function(){ pagina = new SinglePlayer();},1000)
    }
    multiplayer.onclick = function(){
      inputFieldCaputre();
      setTimeout(function(){ pagina = new MultiPlayerLobby();},1000)
    }

    function inputFieldCaputre() {
      playerName = document.getElementById("PlayerName").value;
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
    c.appendChild(n);

    // Creo timer
    let f = document.createElement("div");
    let g = document.createElement("h3");
    f.id = "timer";
    g.id = "testoTimer";
    g.innerHTML = "0";
    super.getSchermo().appendChild(f);
    f.appendChild(g);

    //creo player getName   // DA SISTEMARE
    let name = document.createElement("div");
    name.id= "PlayerName";
    name.innerHTML = playerName;
    super.getSchermo().appendChild(name);
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
    /*
    let pulsante2 = '<button id = "createGame" class = "button">Create Game</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante2);

    let pulsante3 = '<button id = "joinGame" class = "button">Join Game</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante3);
    */
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
        let msg = {name: playerName};
        socket.emit("Lobby", msg ,(response) => {
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

class EndGame extends Pagina{    // costruisco la pagina della lobby

  constructor(name, score, time){
    super();    // chiamo il costruttore della superclasse
    this.name = name;
    this.score = score;
    this.time = time;

    // creo titolo
    let h1 = document.createElement("h1");
    h1.id= "title";
    h1.innerHTML = "GAME OVER"
    super.getSchermo().appendChild(h1);
  }

}

class EndGameSingle extends EndGame{    // costruisco la pagina della lobby

  constructor(name, score, time){
    super(name, score, time);    // chiamo il costruttore della superclasse

    // Center  Panel
    let centerPanel = document.createElement("div");
    //centerPanel.className = "center";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);

    // Bottom  Panel
    let bottomPanel = document.createElement("div");
    bottomPanel.classList.add("bottom")
    super.getSchermo().appendChild(bottomPanel);

    let text = '<div id = "text">CONGRATS!!</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);

    //punteggi fine partita
    let a = document.createElement("h3");

    a.id = "finalscore";

    // SOCKET
    socket = io();

    socket.on("connect", () => {
      console.log("Il mio socket ID è: "+socket.id);
      let msg = {name: this.name, score:this.score, time: this.time};
      //console.log(msg)
      socket.emit("EndGame",msg, (response) => {
        //console.log(response.status);
        let classifica = '';
        var i = 1;
        var position;
        for( let key in response.status){
          if(response.status[key].name == this.name && response.status[key].score == this.score && response.status[key].time == this.time){position = i;}
          classifica = classifica + i + '° '+response.status[key].name + ' SCORE: ' + response.status[key].score + ' TIME: ' + response.status[key].time+ '<br>';
          //classifica = JSON.stringify(response.status[key]) + classifica;
          i++;
        }
        //console.log(classifica);
        a.innerHTML = 'Final score:  ' + this.score + '<br>'+'Time :   ' + this.time + '<br>' + 'POSITION: ' + position +'°';
        centerPanel.appendChild(a);
        a = document.createElement("div");
        a.id = "CloudScore";
        //a.className = "center";
        a.innerHTML = classifica;
        bottomPanel.appendChild(a);
      });
    });

    socket.on("disconnect", () => {
      console.log("Mi sono disconnesso: "+socket.id);
    });
  }

}

class EndGameMulti extends EndGame{    // costruisco la pagina della lobby

  constructor(name, score, time){
    super(name, score, time);    // chiamo il costruttore della superclasse

    // Center  Panel
    let centerPanel = document.createElement("div");
    //centerPanel.className = "center";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);

    // Bottom  Panel
    let bottomPanel = document.createElement("div");
    bottomPanel.classList.add("bottom")
    super.getSchermo().appendChild(bottomPanel);

    let text = '<div id = "text">CONGRATS!! MULTI</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);

    //punteggi fine partita
    let a = document.createElement("h3");
    a.className = "finalscore";
    a.id = "finalscore";
    let txt = '';
    name.forEach((item, i) => {
      txt = txt + item + ' SCORE: ' + score[i];
      if(i == 0){
        txt = txt+ '<br> VS. <br>'
      }
    });

    a.innerHTML = txt;
    centerPanel.appendChild(a);

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

      // Creo timer
      let f = document.createElement("div");
      let g = document.createElement("h3");
      f.id = "timer";
      g.id = "testoTimer";
      g.innerHTML = "0";
      super.getSchermo().appendChild(f);
      f.appendChild(g)

      }
  }

class Transmit{
  constructor(player,enemyArrey,crystalsArrey,minesArrey){
    this.message = {};
    this.address_id = [];
    enemyArrey.forEach((item, i) => {
      this.address_id.push(item.getID());
    });
    this.c = crystalsArrey;
    this.m = minesArrey;
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
  transmitEaten(index,room,score){
    if(this.c[index].getEaten()){
      let msg = this.c[index].getPosition();
      msg['address'] = this.address_id;
      msg['score'] = score;
      msg['room'] = room;
      msg['status'] = this.c[index].getEaten();
      console.log("CRISTALLO mando un messaggio",msg);
      socket.emit("sendEaten", msg);
    }
  }
  transmitExplosion(index,room,score){
    if(this.m[index].getExplosion()){
      let msg = this.m[index].getPosition();
      msg['address'] = this.address_id;
      msg['score'] = score;
      msg['room'] = room;
      msg['status'] = this.m[index].getExplosion();
      socket.emit("sendExplosion", msg);
    }
  }

}

class Recive{
  constructor(player,enemyArrey,crystalsArrey,minesArrey){
    this.p = player;
    this.enemyArrey = enemyArrey;
    this.c = crystalsArrey;
    this.m = minesArrey;
    this.endgame = false;
    this.msg = null;

    socket.on("recivePosition", (msg) => {
      //console.log(msg);
      this.enemyArrey.forEach((item, i) => {
        if(msg.sender == item.getID()){item.updatePosition(msg.x,msg.y)}
      });

    });

    socket.on("reciveDirection", (msg) => {
      //console.log(msg);
      this.enemyArrey.forEach((item, i) => {
        if(msg.sender == item.getID()){item.updateDirection(msg.dir)}
      });

    });

    socket.on("getEaten", (msg) => {
      //console.log(msg);
      this.c.forEach((item, i) => {
        if(msg.x == item.getPosition().x && msg.y == item.getPosition().y){item.setEaten(msg.status);}
      });

    });

    socket.on("getExplosion", (msg) => {
      //console.log(msg);
      this.m.forEach((item, i) => {
        if(msg.x == item.getPosition().x && msg.y == item.getPosition().y){item.setExplosion(msg.status);}
      });

    });

    socket.on("EndGameMulti", (msg) => {
      console.log(msg);
      this.msg = msg;
      this.endgame = true;
    });

  }

  endGame(){
    if(this.endgame){
      return msg;
    }else{
      return null;
    }
  }


}
