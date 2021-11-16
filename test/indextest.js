// moduco che contiene tutte le connessioni
const server = require('./server/server')
const game = require('./server/game')


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

  // GAME  dati di posizione  ACKNOWLEDGMENT
  socket.on("startGame", (data, callback) => {
    let response;
    console.log(data);
    if(game.players.length == 1){
      let room = game.room;
      room["client"].push(socket.id);
      room["room"] = "AAA";
      game.rooms[0] = room;
      // iscrivo il primo client alla stanza
      socket.join(room["room"])
      console.log("giocatore pronto!");
      response = ["wait",room["room"]];
    }else if(game.players.length == 2){
      game.rooms[0]["client"].push(socket.id);
      // iscrivo il secondo client alla stanza
      socket.join(game.rooms[0]["room"]);

      console.log("giocatori pronti!");
      response = ["start",game.rooms[0]["room"]];
    }else if(game.players.length > 2){
      console.log("full");
      response = ["full","---"];
    }
    console.log(game.rooms[0])
    callback({
      status: response[0],
      room: response[1]
    });
  });

  socket.on("startMultiplayer", (room) => {
    console.log("Inizio Multiplayer stanza "+room)
    socket.to(game.rooms[0]["client"][0]).to(game.rooms[0]["client"][1]).emit("startMultiplayer")
  });

  // scambio messaggi privati
  socket.on("room message", (room, msg) => {
      if(game.rooms[0]["client"][0] == socket.id){
        socket.to(game.rooms[0]["client"][1]).emit("private message", socket.id, msg);
      }else{
        socket.to(game.rooms[0]["client"][0]).emit("private message", socket.id, msg);
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
    game.rooms = [];
  });

});
