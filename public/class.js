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

    // Sfondo
    let sfondo = document.createElement("img");
    sfondo.id = "sfondo";
    sfondo.src= "images/Sfondo.png"
    super.getSchermo().appendChild(sfondo);

    // Creo Titolo
    let titolo = document.createElement("img");
    titolo.src= "images/titolo_v0.png";
    titolo.id = "titleImage"
    super.getSchermo().appendChild(titolo);

    // Center  Panel
    //const div= super.div;
    let centerPanel = document.createElement("div");
    //centerPanel.className = "center panel";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);
    let text = '<div id = "text" class = "text">How do you want to play?</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);

    let buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";
    centerPanel.appendChild(buttonContainer);
    //centerPanel.insertAdjacentHTML('beforeEnd', buttonContainer);

    let bottone = '<button id = "singleplayer" class = "button">SinglePlayer</button>';
    buttonContainer.insertAdjacentHTML('beforeEnd', bottone);

    bottone = '<button id = "multiplayer" class = "button">MultiPlayer</button>';
    buttonContainer.insertAdjacentHTML('beforeEnd', bottone);

    let input = '<input type="text" id="PlayerName" class=""placeholder="Insert your name">';
    centerPanel.insertAdjacentHTML('beforeEnd', input);

    let control = '<img src="images/Rules.png" id="WASD"/>'
    let rules = '<ul>  <li>Collect all the crystals</li>  <li>Listen carefully</li>  <li>Find the Bonus</li></ul><br>(Tip: use headphones)';
    let tabella =   '<table id = "RulesPanel"><tr><th>Controls:</th><th>Rules:</th></tr>'+'<tr><td>'+control+'</td><td>'+rules+'</td></tr></table>'
    super.getSchermo().insertAdjacentHTML('beforeEnd', tabella);

    let self = this;
    singleplayer.onclick = function(){
      singleplayer.disabled = true;
      multiplayer.disabled = true;
      let txt = self.getText()
      txt.innerText = "Play!!";
      inputFieldCaputre();
      setTimeout(function(){ pagina = new SinglePlayer();},1000)
    }
    multiplayer.onclick = function(){
      multiplayer.disabled = true;
      singleplayer.disabled = true;
      inputFieldCaputre();
      setTimeout(function(){ pagina = new MultiPlayerLobby();},1000)
    }

    function inputFieldCaputre() {
      let text = document.getElementById("PlayerName").value;
      if(text.length == 0){
        let promise = randomName();
        promise.then(function(result) {
          playerName = result;
        });
      }else{
        playerName = text;
      }
    }

  }

  getText(){
    return document.getElementById("text");
  }

}

class SinglePlayer extends Pagina{    // costruisco la pagina della lobby

  constructor() {
    //// prova Prova prova
    super();    // chiamo il costruttore della superclasse

    // Sfondo
    let sfondo = document.createElement("img");
    sfondo.id = "sfondo";
    sfondo.src= "images/Sfondo.png"
    super.getSchermo().appendChild(sfondo);

    //this.canvas = new Canvas();
    let canvasContainer = document.createElement('div');
    let cnv = new Canvas(canvasContainer,'SinglePlayer',super.getSchermo())

    // Creo pannello contenente nome, counter + timer e punteggio
    let bottomPanel = document.createElement("div");
    bottomPanel.id = "bottomPanel";
    super.getSchermo().appendChild(bottomPanel);

    // Creo counter
    let c = document.createElement("div");
    c.id = "counter";
    c.className = "game text"
    c.innerHTML = "0";
    bottomPanel.appendChild(c);

    // Creo timer
    let f = document.createElement("div");
    f.id = "timer";
    f.className = "game text";
    f.innerHTML = "0";
    bottomPanel.appendChild(f);

    //creo player getName   // DA SISTEMARE
    let name = document.createElement("div");
    name.id= "name";
    name.className = "game text";
    name.innerHTML = playerName;
    bottomPanel.appendChild(name);
  }
}

let type;
class Canvas{
  constructor(canvasContainer,t,schermo){
    // Creo Canvas
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

    // Sfondo
    let sfondo = document.createElement("img");
    sfondo.id = "sfondo";
    sfondo.src= "images/Sfondo.png"
    super.getSchermo().appendChild(sfondo);

     // Creo Titolo
     let titolo = document.createElement("img");
     titolo.src= "images/lobby.png";
     titolo.id = "lobbyImage"
     super.getSchermo().appendChild(titolo);

    let centerPanel = document.createElement("div");
    //centerPanel.className = "center panel";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);

    let text = '<div id = "text" class = "text">Ready?</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);

    let pulsante1 = '<button id = "quickGame" class = "button">Quick Game</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', pulsante1);

    let mainMenuButton = document.createElement("button");
    mainMenuButton.className = "button";
    mainMenuButton.innerText = "Main Menu";
    mainMenuButton.id = "mainMenuButton";
    super.getSchermo().appendChild(mainMenuButton);

    mainMenuButton.onclick = function(){
      //inputFieldCaputre();
      socket.disconnect();
      mainMenuButton.disabled = true;
      setTimeout(function(){ pagina = new Lobby();},1000)
    }

    // SOCKET IO
    socket = io({transports: ['websocket'], upgrade: false});

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
      //document.getElementById("text").innerText = "Inizio Partita!"
      setTimeout(function(){pagina = new MultiPlayer(state);},2000)
    });

    quickGame.onclick = function(){
        // disabilito temporaneamente il tasto della lobby finchè non ho una risposta dal server
        mainMenuButton.disabled = true;
        // disabilito il pulsante se l'ho già premuto una volta
        quickGame.disabled = true;
        let msg = {name: playerName};
        socket.emit("Lobby", msg ,(response) => {

            console.log("Il server dice: "+response.status+ " la mia stanza è: "+response.room); // ok
            this.room = response.room;
            if(response.status == "start"){
              socket.emit("startMultiplayer", this.room);
            }else if(response.status == "wait"){
              document.getElementById("text").innerText = "Waiting for second player...";
              //riattivo il pulsante uscita solo se sono in attesa
              mainMenuButton.disabled = false;
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
  }
}

class EndGameSingle extends EndGame{    // costruisco la pagina della lobby

  constructor(name, score, time){
    super(name, score, time);    // chiamo il costruttore della superclasse

    // Sfondo
    let sfondo = document.createElement("img");
    sfondo.id = "sfondo";
    sfondo.src= "images/SfondoEnd.png"
    super.getSchermo().appendChild(sfondo);

    // Creo Titolo
    let titolo = document.createElement("img");
    titolo.src= "images/gameover_single.png";
    titolo.id = "gameoverImage"
    super.getSchermo().appendChild(titolo);

    //punteggi fine partita
    let a = document.createElement("h3");
    a.id = "finalscore";


    //Pulsante per tornare alla lobby iniziale
    let mainMenuButton = document.createElement("button");
    mainMenuButton.className = "button";
    mainMenuButton.innerText = "Main Menu";
    mainMenuButton.id = "mainMenuButton";
    super.getSchermo().appendChild(mainMenuButton);

    mainMenuButton.onclick = function(){
      //inputFieldCaputre();
      mainMenuButton.disabled = true;
      setTimeout(function(){ pagina = new Lobby();},1000)
    }

    // Cloud  Panel
    let cloudpanel = document.createElement("div");
    cloudpanel.id = "CloudScore";
    super.getSchermo().appendChild(cloudpanel);

    // SOCKET
    socket = io({transports: ['websocket'], upgrade: false});

    socket.on("connect", () => {
      console.log("Il mio socket ID è: "+socket.id);
      let msg = {name: this.name, score:this.score, time: this.time};
      console.log(msg)
      socket.emit("EndGame",msg, (response) => {
        //console.log(response.status);
        let classifica = '<tr><th>POSITION</th><th>PLAYERS</th><th>SCORE</th><th>TIME</th></tr>';
        var i = 1;
        var position;

        for( let key in response.status){
          if(response.status[key].name == this.name && response.status[key].score == this.score && response.status[key].time == this.time)
          {
            position = i;
          }
          classifica = classifica + '<tr>'+'<td>'+ i + '°' + '</td><td>'+ response.status[key].name + '</td><td>' + response.status[key].score + '</td><td>' + response.status[key].time +'s'+ '</td>' + '</tr>';
          //classifica = JSON.stringify(response.status[key]) + classifica;
          i++;
        }

        //a.innerHTML = 'Final score:  ' + this.score + '<br>'+'Time :   ' + this.time + '<br>' + 'POSITION: ' + position +'°';
        a.innerHTML = 'Final score:  ' + this.score + '<br>'+'Time :   ' + this.time;
        //centerPanel.appendChild(a);
        a = document.createElement("table");
        a.id = "table";
        a.innerHTML = classifica;
        cloudpanel.appendChild(a);

        // Roba per fare l'highlight del nome
        let tbody = document.querySelector("tbody");
        tbody.children[position].style.backgroundColor = "green";

        // Rendo sticky la prima riga
        let firstLine = tbody.children[0];
        firstLine.id = "firstLine";

        //Adesso posso disconnettere il Socket
        socket.disconnect();
      });
    });

    socket.on("disconnect", () => {
      console.log("Mi sono disconnesso: "+socket.id);
    });
  }
}

let gameState;
class MultiPlayer extends Pagina{
  constructor(state) {
    super();

      // Sfondo
      let sfondo = document.createElement("img");
      sfondo.id = "sfondo";
      sfondo.src= "images/Sfondo.png"
      super.getSchermo().appendChild(sfondo);

      //this.canvas = new Canvas();
      gameState = state;
      let canvasContainer = document.createElement('div');
      let cnv = new Canvas(canvasContainer,'MultiPlayer',super.getSchermo())

      // Creo pannello contenente nome, counter + timer e punteggio
      let bottomPanel = document.createElement("div");
      bottomPanel.id = "bottomPanel";
      super.getSchermo().appendChild(bottomPanel);

      // Creo counter
      let c = document.createElement("div");
      c.id = "counter";
      c.className = "game text"
      c.innerHTML = "0";
      bottomPanel.appendChild(c);

      // Creo timer
      let f = document.createElement("div");
      f.id = "timer";
      f.className = "game text";
      f.innerHTML = "0";
      bottomPanel.appendChild(f);

      //creo player getName   // DA SISTEMARE
      let name = document.createElement("div");
      name.id= "name";
      name.className = "game text";
      name.innerHTML = playerName;
      bottomPanel.appendChild(name);
      }
  }

  class EndGameMulti extends EndGame{    // costruisco la pagina della lobby

    constructor(name, score, time){
      super(name, score, time);    // chiamo il costruttore della superclasse

      // Sfondo
      let sfondo = document.createElement("img");
      sfondo.id = "sfondo";
      sfondo.src= "images/SfondoEnd.png"
      super.getSchermo().appendChild(sfondo);

      // Creo Titolo
      let titolo = document.createElement("img");
      titolo.src= "images/gameover_multi.png";
      titolo.id = "gameoverImage"
      super.getSchermo().appendChild(titolo);

      // Center  Panel
      let centerPanel = document.createElement("div");
      //centerPanel.className = "center";
      centerPanel.classList.add("center")
      super.getSchermo().appendChild(centerPanel);

      // Bottom  Panel
      let bottomPanel = document.createElement("div");
      bottomPanel.classList.add("bottom")
      super.getSchermo().appendChild(bottomPanel);

      let mainMenuButton = document.createElement("button");
      mainMenuButton.className = "button";
      mainMenuButton.innerText = "Main Menu";
      mainMenuButton.id = "mainMenuButton";
      super.getSchermo().appendChild(mainMenuButton);

      mainMenuButton.onclick = function(){
        //inputFieldCaputre();
        mainMenuButton.disabled = true;
        setTimeout(function(){ pagina = new Lobby();},1000)
      }

      //punteggi fine partita
      let a = document.createElement("h3");
      a.className = "finalscore";
      a.id = "finalscore";
      let txt = '';
      name.forEach((item, i) => {
        txt = txt + item + ': ' + score[i];
        if(i == 0){
          txt = txt + '<br> VS. <br>'
        }
      });
      a.innerHTML = txt;
      centerPanel.appendChild(a);

      // ora poso disconnettere il clients
      socket.disconnect();
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
      return this.msg;
    }else{
      return null;
    }
  }
}
// FINE
