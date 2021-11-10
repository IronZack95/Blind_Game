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

module.exports = {express,app,io};
