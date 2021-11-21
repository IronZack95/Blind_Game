var room = '{"name":"","client":[]}';
var roomDefault = {
  name:"",
  client:[],
  canvas:[800,600],//width, height
  gameState: {
    playerPos: [{x:null,y:null},{x:null,y:null}],
    minePos:  [{x:null,y:null},{x:null,y:null},{x:null,y:null},{x:null,y:null}],
    crystalPos: [{x:null,y:null},{x:null,y:null}]
  }
};
room = roomDefault;
//var room = JSON.parse(room);
var players = [];

function randomCanvas(gamestate,numPlayers,numMine,numCrystals){
  for(var i = 0; i< numMine; i++){
      

  }
}


module.exports = {room,roomDefault,players};
