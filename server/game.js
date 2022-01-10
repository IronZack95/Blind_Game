const MAX_PLAYERS = 2;
const MAX_MINES = 15; //15
const MAX_CRYSTALS = 1; //20;

const WIDTH = 1200;         //...del canvas
const HEIGHT = 600;        //...del canvas
const LATO = 40;           //lato dei quadrati che formano i muri random
const RAGGIO_P = 12;

// per Perlin
const GRID_SIZE = Math.floor(WIDTH/LATO); //10 griglia
const RESOLUTION = 2; //2 ogni box contiente RESOLUTION X RESOLUTION muri dentro la griglia
const THRESHOLD = 100000;

const COLOR1 = '#0077ff';
const COLOR2 = '#e81b1b';

const DATAPATH = './data/data.json';

const utility = require('./utility')
// arrey di game state
var rooms = [];
// array di client
var players = [];


class GameState{
  constructor(){
      //  oggetto che contiene tutto quello che serve alla partita
      //console.log("creo nuovo oggetto GAME STATE");
      this.name = "";
      this.client = [];
      this.canvas = {width: WIDTH,
                    height: HEIGHT,
                    lato: LATO,
                    raggio_p: RAGGIO_P,
                    max_players: MAX_PLAYERS,
                    max_mines: MAX_MINES,
                    max_crystals: MAX_CRYSTALS
                  }; //width, height, lato muro
      this.playersNames = [];
      this.players = [];
      this.score = [];
      this.walls = [];
      this.mines =  [];
      this.crystals = [];
      this.startTime = null;
      this.timer = null;  //timer dell'ultimo evento o fine partita
    return this;
  }
  getClient(){
    return this.client;
  }
  setName(name){
    this.name = name;
  }
  getName(){
    return this.name;
  }
  getScore(){
    return this.score;
  }

  getGameState(){
    // DA RIFARE
    let walls = [];
    this.walls.forEach((item, i) => {
      walls.push(item.getPosition());
    });
    let mines = [];
    this.mines.forEach((item, i) => {
      mines.push(item.getPosition());
    });
    let crystals = [];
    this.crystals.forEach((item, i) => {
      crystals.push(item.getPosition());
    });
    //console.log(this.walls,walls)

    let gameState = {
      room: this.name,
      client: this.client,
      canvas: this.canvas,
      players: this.players,
      walls: walls,
      mines: mines,
      crystals:crystals,
      startTime: this.startTime
    }

    return gameState;

  }

  pushClient(clientID,name){
    this.client.push(clientID);
    this.playersNames.push(name);
    return this.getClient();
  }

  setMine(x,y,status){
    this.mines.forEach((item, i) => {
      if(item.getPosition().x == x && item.getPosition().y == y){
        item.setStatus(status);
        //console.log('stato mina',x,y,item.getStatus())
      }
    });
  }

  setCrystal(x,y,status){
    this.crystals.forEach((item, i) => {
      if(item.getPosition().x == x && item.getPosition().y == y){
        item.setStatus(status);
        //console.log('stato cristallo',x,y,item.getStatus())
      }
    });
  }

  setScore(id,score){
    this.client.forEach((item, i) => {
      if(item == id){this.score[i] = score;}
    });
  }

  setTimer(){
    this.timer = ((Date.now() - this.startTime)/ 1000).toFixed(1);;
  }

  getTimer(){
    return this.timer;
  }

  getPlayerNames(){
    return this.playersNames;
  }

  checkEndGame(){
    let ii = 0;
    this.crystals.forEach((item, i) => {
      if(item.getStatus() == true){
        ii++;
      }else{
        return false;
      }
    });
    if(ii == MAX_CRYSTALS){
      //console.log("partita finita",ii)
      return true;
    }else{
      //console.log("partita continua",ii)
    }
  }

  createMatch(){
    // CREATE PLAYERS
    let player = {id:null ,position:{x: null,y: null },color:null};
    let p1 = JSON.parse(JSON.stringify(player));
    p1.id = this.getClient()[0];
    p1.position.x = this.canvas.width/2;
    p1.position.y = this.canvas.height -20;
    p1.color = COLOR1;
    this.players.push(p1);
    let p2 = JSON.parse(JSON.stringify(player));
    p2.id = this.getClient()[1];
    p2.position.x = this.canvas.width/2;
    p2.position.y = 20;
    p2.color = COLOR2;
    this.players.push(p2);

    // Setto lo SCORE
    this.players.forEach((item, i) => {
      this.score.push(0);
    });

    // CREATE WALLS
    let map = new utility.Perlin_Map(GRID_SIZE,RESOLUTION,THRESHOLD);
    let walls = [];
    // filtro i valori della perlin map
    for(var keys1 in map){
      //console.log(map[keys1]);
      for(var keys2 in map[keys1]){
        let v = map[keys1][keys2];
        let row = Math.floor(keys1*WIDTH*RESOLUTION/(GRID_SIZE));
        let col = Math.floor(keys2*WIDTH*RESOLUTION/(GRID_SIZE));
        if(v == true && row<=HEIGHT && col <= WIDTH){
          //console.log('row: '+row+' column: '+col+' value: ' +v);
          let w = {x:col,y:row};
          walls.push(w);
        }
      }
    }
    //elimino ultima fila di muri così player è sempre libero
    walls = walls.filter(function(el){return el.y != (HEIGHT - LATO);});
    walls = walls.filter(function(el){return el.y != 0;});
    walls = walls.filter(function(el){return el.x != 0;});
    walls = walls.filter(function(el){return el.x != (WIDTH - LATO);});
    // creo gli oggetti muro
    for(var i = 0; i< walls.length ; i++){
      this.walls[i] = new Wall(walls[i].x,walls[i].y);
    }

    // CREATE OBJECTS
    let mines = [];
    let crystals = [];
    let numObj = MAX_MINES+MAX_CRYSTALS;
    let x_r, y_r;
    let temp = [];
    let approvati = [];

    for (var i = 0; i < numObj; i++){
      //creo delle coordinate ipotetiche
      //min + Math.floor(Math.random() * max / step) * step;
      x_r = LATO + Math.floor(Math.random() *(WIDTH - LATO)/ 50)* 50;
      y_r = LATO + Math.floor(Math.random() *(HEIGHT - LATO*1.5)/ 50)* 50;

      //finchè cadono su muri o giocatore ricalcoliamole
      while (checkEveryWall(this.walls, x_r, y_r).some(e => e === true) ||
             approvati.some(e => (e.x == x_r) && (e.y == y_r))) {
        //console.log('oops');
        x_r = LATO + Math.floor(Math.random() *(WIDTH - LATO)/ 50)* 50;
        y_r = LATO + Math.floor(Math.random() *(HEIGHT - LATO*1.5)/ 50)* 50;
      }

      approvati[i] = {x: x_r, y: y_r};

      //quando vanno bene piazziamole negli array
      if(i < MAX_MINES ){
        this.mines[i] = new Mine(x_r, y_r)
      } else {
        this.crystals[i-(MAX_MINES)] = new Crystal(x_r, y_r)
      }
    } //end of for loop

    // Inizializzo tempo
    this.startTime = Date.now();

    function checkEveryWall(walls, x_r, y_r){
      for (var i = 0; i < walls.length; i++){
        temp[i] = walls[i].checkOverlapPlayer(x_r,y_r);
      }
      return temp;   //array di true and false
    }
    // ho creato tutto posso ritornare l'oggetto Game State
    return this;
  }
}

class Object{
 constructor(x,y,s,color){
   this.x = x;
   this.y = y;
   this.status = s; // di default la mina non è eplosa e il cristallo non trovato e il player vivo
   this.color = color;
   return this;
 }

 getPosition(){
   return {x: this.x, y: this.y};
 }

 getStatus(){
   return this.status;
 }

 setStatus(status){
   this.status = status;
 }

 getColor(){
   return this.color;
 }
}

class Player extends Object{
  constructor(x,y,color){
    super(x,y,true,color);  // di default è vivo
  }
}

class Wall extends Object{
  constructor(x,y){
    super(x,y,true,'#ffffff');  // di default è intera
  }

  checkOverlapPlayer(playerX, playerY){
    //trovo il punto più vicino tra il muro quadrato e il centro del cerchio
    let Xn = Math.max(this.x, Math.min(playerX, this.x + LATO));
    let Yn = Math.max(this.y, Math.min(playerY, this.y + LATO));
    //trovo distanza tra punto più vicino e centro del cerchio
    let Dx = Xn - playerX;
    let Dy = Yn - playerY;
    return (Dx*Dx + Dy*Dy) <= (RAGGIO_P**2);
  }
}  //end of class Wall

class Crystal extends Object{
  constructor(x,y){
    super(x,y,false,'#0033aa');
    }
}

class Mine extends Object{
  constructor(x,y){
    super(x,y,false,'#880044');
  }
}

module.exports = {DATAPATH,MAX_PLAYERS,rooms,players,GameState};
