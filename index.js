// modulo che contiene tutte le connessioni
const server = require('./server/server')
const game = require('./server/game')
//const game = require('./server/game')


// socket IO instances
server.io.on("connection", (socket) => {

  // Messaggio che avviene alla connessione di un nuovo Client
  game.players.push(socket.id);
  console.log("Connessi "+ server.io.engine.clientsCount +" client: "+ game.players);

  // Gestisce la disconnessione di un client
  socket.on("disconnect", () => {
    console.log("disconnected client : " + socket.id);
    let removeThisIndex;
    game.players.pop(socket.id);
    game.rooms.forEach(
      function(room, index) {
          room.getClient().forEach((client, i) => {
          if(client == socket.id){removeThisIndex = i;}
        });
      }
    )
    game.rooms.splice(removeThisIndex,1);
    //game.room = JSON.parse(game.room);
  });

  // GAME  start game  ACKNOWLEDGMENT
  socket.on("startGame", (callback) => {
    let response;
    let stanza;
    let lastIndex = parseInt(game.rooms.length-1);
    if(game.rooms.length == 0 || game.rooms[lastIndex].getClient().length >= game.MAX_PLAYERS){
      game.rooms.push(new game.GameState());
      lastIndex = parseInt(game.rooms.length-1);
      //assegno un nome casuale alla stanza
      game.rooms[lastIndex].setName("Stanza"+Math.floor(Math.random()*10000));
      game.rooms[lastIndex].pushClient(socket.id);
      // iscrivo il primo client alla stanza
      //socket.join(game.room.game.room)
      console.log("giocatore pronto!");
      response = "wait";
      stanza = game.rooms[lastIndex].getName();
    }else if(game.rooms[lastIndex].getClient().length == 1){
      game.rooms[lastIndex].pushClient(socket.id)
      // iscrivo il secondo client alla stanza
      //socket.join(game.room.game.room);
      console.log("giocatori pronti!");
      response = "start";
      stanza = game.rooms[lastIndex].getName();
    }

    /*
    else if(game.room.client.length >= game.MAX_PLAYERS){
      console.log("full");
      response = "full"
      stanza = "---"
    }
    */
    // stampo l'ultimo game state aggiunto
    console.log(game.rooms[game.rooms.length-1])
    callback({
      status: response,
      room: stanza
    });
  });

  socket.on("startMultiplayer", (wantedroom) => {
    let client, index;
    game.rooms.forEach((room, i) => {
      if(room.getName() == wantedroom){client = room.getClient(); index=i;}
    });

    console.log("Inizio Multiplayer: "+ wantedroom+ " "+ client)
    // GENERO CAMPO E GAME STATE
    game.rooms[index].createMatch();
    console.log("Genero campo: ",game.rooms[index].getGameState());
    server.io.in(game.rooms[index].getClient()[1]).in(game.rooms[index].getClient()[0]).emit("startMultiplayer!",game.rooms[index].getGameState());
  });

  // GAME  dati di posizione senza ACKNOWLEDGMENT
  socket.on("sendPosition", (data) => {
    console.log(data);
    let msg = {sender: socket.id, x: data.x, y: data.y};
    //inoltro il messaggio all'avversario
    data.address.forEach((item, i) => {
      server.io.in(item).volatile.emit("recivePosition",msg);
    });
  });

    // GAME  dati di direzione senza ACKNOWLEDGMENT
  socket.on("sendDirection", (data) => {
    console.log(data);
    let msg = {sender: socket.id, dir: data.dir};
    //inoltro il messaggio all'avversario
    data.address.forEach((item, i) => {
      server.io.in(item).volatile.emit("reciveDirection",msg);
    });

  });

  // scambio messaggi privati DA SISTEMARE
  socket.on("game.room message", (room, msg) => {
      if(game.room.client[0] == socket.id){
        socket.to(room.client[1]).emit("private message", socket.id, msg);
      }else{
        socket.to(room.client[0]).emit("private message", socket.id, msg);
      }
  });

  //  ************** OPTIONAL ********************

  // KEYS key pressed
  socket.on("keys", (data) => {
    console.log(data);
  });



});
