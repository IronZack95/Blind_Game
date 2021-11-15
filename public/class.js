
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
    this.schermo.getSchermo().innerHTML = "";
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
    super.getSchermo().appendChild(image1);

    let image2 = document.createElement("img");
    image2.src = "Images/SnakeRed.png";
    image2.classList.add("snakeRed");
    super.getSchermo().appendChild(image2);


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
      setTimeout(function(){ lobby.destructor(); delete this; multi = new MultiPlayerLobby();},1000)
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


class MultiPlayerLobby extends Pagina{

  constructor() {
    super();

    // Creo Titolo E Sottotitolo
    let h = document.createElement("h1");
    h.id= "title";
    h.innerHTML = "S N A K E"
    super.getSchermo().appendChild(h);

    h = document.createElement("h2");
    h.id= "title";
    h.innerHTML = "Multi Player Lobby"
    super.getSchermo().appendChild(h);

    let centerPanel = document.createElement("div");
    //centerPanel.className = "center panel";
    centerPanel.classList.add("center")
    super.getSchermo().appendChild(centerPanel);

    let text = '<div id = "text">Pronto?</div>'
    centerPanel.insertAdjacentHTML('afterBegin', text);

    let bottone = '<button id = "startGameMulti" class = "button">Start</button>'
    centerPanel.insertAdjacentHTML('beforeEnd', bottone);

    // SOCKET IO
    const socket = io();

    socket.on("connect", () => {
      console.log("Il mio socket ID è: "+socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Mi sono disconnesso: "+socket.id);
    });

    let lobby = this;

    startGameMulti.onclick = function(){
        let data = true;
        socket.emit("startGame",data, (response) => {
            console.log("Il server dice: "+response.status); // ok

            if(response.status == "start"){
              document.getElementById("text").innerText = "Inizio Partita!"
              setTimeout(function(){ lobby.destructor(); delete this; multi = new MultiPlayer();},1000)
            }else if(response.status == "wait"){
              document.getElementById("text").innerText = "Attesa secondo giocatore..."
            }else if(response.status == "full"){
              document.getElementById("text").innerText = "Server pieno";
            }
        });
    }
/*
    function transmit(){
      var body = {"id": socket.id};
      var a = snake.getBody()
      for(var i in a){
       body[i] = {"x": a[i]["x"],"y":a[i]["y"]}
      }
      //console.log(body);
      socket.volatile.emit("data", body);
    }

    //
    function readyFunc(bool){
      var data = {"id": socket.id, "ready": bool}
      socket.emit("game",data, (response) => {
          console.log(response.status); // ok
      });
      console.log(data)
    }
*/
  }
}


class MultiPlayer extends Pagina{
  constructor() {
    super();

      // Creo Titolo E Sottotitolo
      let h = document.createElement("h1");
      h.id= "title";
      h.innerHTML = "S N A K E"
      super.getSchermo().appendChild(h);

      h = document.createElement("h2");
      h.id= "title";
      h.innerHTML = "Multi Player"
      super.getSchermo().appendChild(h);
  }




}
