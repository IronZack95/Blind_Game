/*
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json({limit : '2mb'}));

// Express functions
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
*/
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const port = 3000
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use(express.static('public'));
app.use(express.json({limit : '2mb'}));


httpServer.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})

// post del game
/*
app.post('/game',(req,res) => {
  console.log(req.body);
  res.json({
    status: 'success',
    data: "ok, grazie ho ricevuto!"
  });
});
*/
var players = [];

// socket IO instances
io.on("connection", (socket) => {
  if(players.length <2){
    players.push(socket.id);
    console.log("Connessi "+ io.engine.clientsCount +" client: "+ players);
  }else{
    console.log("Server Pieno");
  }

  socket.on("keys", (data) => {
    console.log(data);
  });

  socket.on("data", (data) => {
    console.log(data);
  });

});
io.on("connection", (socket) => {

});
