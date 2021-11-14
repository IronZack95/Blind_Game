///////////////////////////////////////////////////////////
// FUNZIONI BACK END PER MULTIPLAYER //////////////////////
// da mettere in index.js

const state = {};
const clientRooms = {};
const nomi = ["pitone", "anaconda", "boa", "vipera"];   //array generare nomi a caso per le room

server.io.on('connection', client => {
  console.log('sei connesso!');

  client.on('newMultiPlayerGame', handleMultiPlayerGame);
  client.on('newJoinMultiPlayer', handleJoinMultiplayerGame);
  
  function handleMultiPlayerGame() {
    let roomName = Math.floor(Math.random() * nomi.length);   //genero un nome per la stanza
    clientRooms[client.id];     //assegno al client la stanza
    client.emit('roomName', roomName);    //emetto il nome della stanza a front end
    client.join(roomName);   //ammetto il giocatore 1 alla stanza
    client.number = 1;
    client.emit('init', 1);   //assegno numero
    // ....a questo punto aspetto un giocatore 2...
  }

  function handleJoinMultiplayerGame(roomName) {
    //roomName era stata definita in handleMultiPlayerGame()
    const room = io.sockets.adapter.rooms[roomName];
    let allUsers;

    //verifico che room esista
    if (room) {   
      allUsers = room.sockets;
    }

    let numClients =0;
    //conto i giocatori già nella room
    if (allUsers) {
      numClients = Object.keys(allUsers).length;   
    }

    //verifico numero giocatori
    if (numClients ===0){
      client.emit('unknownRoom');
      return;
    } else if (numClients >1){
      client.emit('tooManyPlayers');
      return;
    }

    //se tutto va bene...
    clientRooms[client.id] = roomName; //assegno al giocatore 2 la stanza!
    client.join(roomName);    //lo faccio entrare...
    client.number = 2;  
    client.emit('init', 2);   //gli assegno il numero...
  }
 }
)

////////////////////////////////////////////////////////////
// CLASSi INTERFACCE PER MULTIPLAYER //////////////////////////////////
// da mettere in class.js

class MultiPlayer extends Schermo{    

  constructor() {
    super();  
    let h = document.createElement("h1");
    h.id= "message";
    h.innerHTML = "Il nome della room è..."
    super.getSchermo().appendChild(h);

    h = document.createElement("h2");
    h.id= "roomName";
    h.innerHTML = ""
    super.getSchermo().appendChild(h);
  }
}   



////////////////////////////////////////////////////////////////////////////////////////
/// FUNZIONI FRONTEND PER MULTIPLAYER //////////////////////////////////////////////////
// da mettere forse in sketch.js

socket.on('roomName', handleRoomName);   //per mostrare nome stanza
socket.on('init', handleInit);           //per settare numero del giocatore
socket.on('gameOver', handleGameOver);
socket.on('unknownRoom', handleUnknownRoom);
socket.on('tooManyPlayers', handleTooManyPlayers);

const roomNameDisplay = document.getElementById('roomName');

function handleInit(number) {
  playerNumber = number;
  console.log('Sei il giocatore 1');
}

function handleRoomName(roomName) {
  roomNameDisplay.innerText = roomName;
}

function handleGameOver(data) {
  //TODO
}

function handleUnknownRoom() {
  //TODO
}

function handleTooManyPlayers() {
  //TODO
}





