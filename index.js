// modulo che contiene tutte le connessioni
const server = require('./server/server')
const game = require('./server/game')
const fs = require('fs')
//const game = require('./server/game')


function endGameFunction(room){
  let endMsg = {timer: room.getTimer(), player: room.getClient(), name: room.getPlayerNames() ,score: room.getScore()};
  room.getClient().forEach((item, ii) => {
    server.io.in(item).emit("EndGameMulti",endMsg);
  });
  // elimino la stanza se il gioco è finito
  let deleteElement = game.rooms.splice(game.rooms.indexOf(room), 1);
  // faccio vedere quante stanze rimangono
  if(deleteElement.length =! 0){console.log("Cancellata",room.getName(),"rimangono",game.rooms.length,"stanze");}
}

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
      function(room, roomIndex) {
          room.getClient().forEach((client, i) => {
          if(client == socket.id){
               endGameFunction(room);
          }
        });
      }
    )

  });

  // GAME  start game  ACKNOWLEDGMENT
  socket.on("Lobby", (msg,callback) => {
    let response;
    let stanza;
    let lastIndex = parseInt(game.rooms.length-1);
    if(game.rooms.length == 0 || game.rooms[lastIndex].getClient().length >= game.MAX_PLAYERS){
      game.rooms.push(new game.GameState());
      lastIndex = parseInt(game.rooms.length-1);
      //assegno un nome casuale alla stanza
      game.rooms[lastIndex].setName("Stanza"+Math.floor(Math.random()*10000));
      game.rooms[lastIndex].pushClient(socket.id,msg.name);
      // iscrivo il primo client alla stanza
      //socket.join(game.room.game.room)
      console.log("giocatore pronto!");
      response = "wait";
      stanza = game.rooms[lastIndex].getName();
    }else if(game.rooms[lastIndex].getClient().length == 1){
      game.rooms[lastIndex].pushClient(socket.id,msg.name)
      // iscrivo il secondo client alla stanza
      //socket.join(game.room.game.room);
      console.log("giocatori pronti!");
      response = "start";
      stanza = game.rooms[lastIndex].getName();
    }
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
    //console.log(data);
    let msg = {sender: socket.id, x: data.x, y: data.y};
    //inoltro il messaggio all'avversario
    data.address.forEach((item, i) => {
      server.io.in(item).volatile.emit("recivePosition",msg);
    });
  });

    // GAME  dati di direzione senza ACKNOWLEDGMENT
  socket.on("sendDirection", (data) => {
    //console.log(data);
    let msg = {sender: socket.id, dir: data.dir};
    //inoltro il messaggio all'avversario
    data.address.forEach((item, i) => {
      server.io.in(item).volatile.emit("reciveDirection",msg);
    });

  });

  // GAME  dati di cristalli con trasmissione TCP standard
  socket.on("sendEaten", (data) => {
    data['sender']= socket.id;
    let msg = JSON.parse(JSON.stringify(data));
    delete msg['address'];
    delete msg['room'];
    // setto il nuovo valore
    game.rooms.forEach((room, roomIndex) => {
      if(room.getName() == data.room){
        room.setCrystal(data.x,data.y,data.status);
        room.setScore(socket.id,data.score);
        room.setTimer();
        if(room.checkEndGame()){
          // verifico il check end game
          endGameFunction(room);
        }else{
          //inoltro il messaggio all'avversario
          data.address.forEach((item, i) => {
            server.io.in(item).emit("getEaten",msg);
          });
        }
      }
    });
    //console.log(data);
  });

  // GAME  dati di mine con trasmissione TCP standard
  socket.on("sendExplosion", (data) => {
    data['sender']= socket.id;
    let msg = JSON.parse(JSON.stringify(data));
    delete msg['address'];
    delete msg['room'];
    // setto il nuovo valore
    game.rooms.forEach((room, i) => {
      if(room.getName() == data.room){
        room.setMine(data.x,data.y,data.status);
        room.setScore(socket.id,data.score);
        room.setTimer();
        //inoltro il messaggio all'avversario
        data.address.forEach((item, i) => {
          server.io.in(item).emit("getExplosion",msg);
        });
      }
    });
    //console.log(data);
  });

  // GESTIONE END GAME SinglePlayer
  socket.on("EndGame", (data,callback) => {
    //console.log(data);
    var fileContents;
    try {
      fileContents = fs.readFileSync(game.DATAPATH);
      fileContents = JSON.parse(fileContents);
      fileContents.push(data);
      // ordino i campi secondo il punteggio e inversamente sul tempo impiegato
      fileContents.sort(function(a, b){
        return a.time-b.time;
      });

      fileContents.sort(function(a, b){
        return b.score-a.score;
      });

      //console.log('Update file', fileContents);
    } catch (err) {
      if (err.code === 'ENOENT') {  // controllo se il file esiste
        fileContents = [];
        fileContents.push(data);
        console.log('File not found! create file', fileContents);
      } else {
        fileContents = [];
        fileContents.push(data);
        console.log('Altro errore ', fileContents);
        throw err;
      }
    }
    // write file
    fs.writeFile(game.DATAPATH, JSON.stringify(fileContents),function(err, result) {
      if(err) console.log('error', err);}
    );
    // mando indietro la risposta
    callback({
      status: fileContents
    });

  });

  //  ************** OPTIONAL ********************

  // scambio messaggi privati DA SISTEMARE
  socket.on("game.room message", (room, msg) => {
      if(game.room.client[0] == socket.id){
        socket.to(room.client[1]).emit("private message", socket.id, msg);
      }else{
        socket.to(room.client[0]).emit("private message", socket.id, msg);
      }
  });
  // KEYS key pressed
  socket.on("keys", (data) => {
    console.log(data);
  });



});
