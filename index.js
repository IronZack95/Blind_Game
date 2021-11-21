// moduco che contiene tutte le connessioni
const server = require('./server/server')
const game = require('./server/game')
//const game = require('./server/game')


// socket IO instances
server.io.on("connection", (socket) => {

    game.players.push(socket.id);
    console.log("Connessi "+ server.io.engine.clientsCount +" client: "+ game.players);

  // KEYS key pressed
  socket.on("keys", (data) => {
    console.log(data);
  });

  // DATA  dati di posizione
  socket.on("data", (data) => {
    //console.log(data);
  });

  // GAME  start game  ACKNOWLEDGMENT
  socket.on("startGame", (callback) => {
    let response;
    let stanza;
    if(game.room.client.length == 0){
      game.room.name = "Stanza01";
      game.room.client.push(socket.id);
      // iscrivo il primo client alla stanza
      //socket.join(game.room.game.room)
      console.log("giocatore pronto!");
      response = "wait"
      stanza = game.room.name
    }else if(game.room.client.length == 1){
      game.room.client.push(socket.id);
      // iscrivo il secondo client alla stanza
      //socket.join(game.room.game.room);
      console.log("giocatori pronti!");
      response = "start"
      stanza = game.room.name
    }else if(game.room.client.length >= 2){
      console.log("full");
      response = "full"
      stanza = "---"
    }
    console.log(game.room)
    callback({
      status: response,
      room: stanza
    });
  });

  socket.on("startMultiplayer", (wantedroom) => {
    console.log("Inizio Multiplayer: "+ wantedroom+ " "+game.room.client)
    server.io.in(game.room.client[1]).in(game.room.client[0]).emit("startMultiplayer!");
  });

  // scambio messaggi privati
  socket.on("game.room message", (room, msg) => {
      if(game.room.client[0] == socket.id){
        socket.to(room.client[1]).emit("private message", socket.id, msg);
      }else{
        socket.to(room.client[0]).emit("private message", socket.id, msg);
      }
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
    game.room = game.roomDefault;
    //game.room = JSON.parse(game.room);
  });

});
