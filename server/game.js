const MAX_PLAYERS = 2;
const MAX_MINES = 20;
const MAX_CRYSTALS = 20;
const WIDTH = 800;
const HEIGHT = 600;

const utility = require('./utility')

// arrey di game state
var rooms = [];
// array di client
var players = [];


class GameState{
  constructor(){
      //  json che contiene tutto quello che serve alla partita
      this.state = {
      name:"",
      client:[],
      canvas:{width: WIDTH,height: HEIGHT},//width, height
      gameState: {
        playerPos: [{x:null,y:null},{x:null,y:null}],
        wallsPos: [],
        minePos:  [],
        crystalPos: []
      }
    }
    console.log("creo nuovo oggetto GAME STATE");
    return this;
  }
  getClient(){
    return this.state.client;
  }
  setName(name){
    this.state.name = name;
  }
  getName(){
    return this.state.name;
  }
  getGameState(){
    return this.state.gameState;
  }
  pushClient(client){
    this.state.client.push(client);
    return this.getClient();
  }
  createMatch(){
    let map = new utility.Perlin_Map();
    this.state.gameState.wallsPos = [];
    // filtro i valori della perlin map
    for(var keys1 in map){
      //console.log(map[keys1]);
      for(var keys2 in map[keys1]){
        let v = map[keys1][keys2];
        let row = Math.floor(keys1*this.state.canvas.width/10);
        let col = Math.floor(keys2*this.state.canvas.width/10);
        if(v == true && row<this.state.canvas.height && col <= this.state.canvas.width){
          //console.log('row: '+row+' column: '+col+' value: ' +v);
          let w = {x:col,y:row};
          this.state.gameState.wallsPos.push(w);
        }
      }
    }
    //elimino ultima fila di muri così player è sempre libero
    this.state.gameState.wallsPos = this.state.gameState.wallsPos.filter(function(el){return el.y != 560;});
  }

}

module.exports = {MAX_PLAYERS,rooms,players,GameState};
