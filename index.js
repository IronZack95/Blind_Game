// moduco che contiene tutte le connessioni
const server = require('./server/server')
//const game = require('./server/game')
var room = '{"room":"","client":[]}';
var room = JSON.parse(room);
var players = [];

// socket IO instances
server.io.on("connection", (socket) => {

    players.push(socket.id);
    console.log("Connessi "+ server.io.engine.clientsCount +" client: "+ players);

  // KEYS key pressed
  socket.on("keys", (data) => {
    console.log(data);
  });

  // DATA  dati di posizione
  socket.on("data", (data) => {
    //console.log(data);
  });

  // GAME  dati di posizione  ACKNOWLEDGMENT
  socket.on("startGame", (callback) => {
    let response;
    let stanza;
    if(room.client.length == 0){
      room.room = "Stanza01";
      room.client.push(socket.id);
      // iscrivo il primo client alla stanza
      //socket.join(room.room)
      console.log("giocatore pronto!");
      response = "wait"
      stanza = room.room
    }else if(room.client.length == 1){
      room.client.push(socket.id);
      // iscrivo il secondo client alla stanza
      //socket.join(room.room);
      console.log("giocatori pronti!");
      response = "start"
      stanza = room.room
    }else if(room.client.length >= 2){
      console.log("full");
      response = "full"
      stanza = "---"
    }
    console.log(room)
    callback({
      status: response,
      room: stanza
    });
  });

  socket.on("startMultiplayer", (wantedRoom) => {
    console.log("Inizio Multiplayer: "+ wantedRoom)
    socket.to(room.client[0]).emit("startMultiplayer!");
    socket.to(room.client[1]).emit("startMultiplayer!");
  });

  // scambio messaggi privati
  socket.on("room message", (room, msg) => {
      if(room.client[0] == socket.id){
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
    players.pop(socket.id);
    room = '{"room":"","client":[]}';
    room = JSON.parse(room);
  });

});
