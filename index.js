// moduco che contiene tutte le connessioni
const server = require('./server/server')
const game = require('./server/game')


// socket IO instances
server.io.on("connection", (socket) => {

  if(game.players.length <2){
    game.players.push(socket.id);
    console.log("Connessi "+ server.io.engine.clientsCount +" client: "+ game.players);
  }else{
    console.log("Server Pieno");
  }

  // KEYS key pressed
  socket.on("keys", (data) => {
    console.log(data);
  });

  // DATA  dati di posizione
  socket.on("data", (data) => {
    //console.log(data);
  });

  // GAME  dati di posizione  ACKNOWLEDGMENT
  socket.on("startGame", (data, callback) => {
    let response;
    console.log(data);
    if(game.players.length == 1){
      let room = game.room;
      room["client"][0] = socket.id;
      room["room"] = "stanza";
      game.rooms[0] = room;
      response = "wait";
    }else if(game.players.length == 2){
      game.rooms[0]["client"].push(socket.id);
      console.log("giocatori pronti!")
      response = "Via!";
    }
    console.log(game.rooms[0])
    callback({
      status: response
    });
  });


  // GAME  dati di posizione  ACKNOWLEDGMENT
  socket.on("game", (data, callback) => {
    console.log(data);
    callback({
      status: "ack: ok"
    });
  });


  socket.on("disconnect", () => {
    console.log("disconnected client : " + socket.id);
    game.players.pop(socket.id);
  });

});
