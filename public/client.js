const socket = io();

// POST
async function post(data){
  // chiedo i dati
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const response =  await fetch('/game',options);
  let risultato = await response.json();
  console.log(risultato);

};

// SOCKET.IO
socket.on("connect", () => {
  console.log("Il mio socket ID è: "+socket.id);
});

socket.on("disconnect", () => {
  console.log("Mi sono disconnesso: "+socket.id);
});

function transmit(){
  var body = {"id": socket.id};
  var a = snake.getBody()
  for(var i in a){
   body[i] = {"x": a[i]["x"],"y":a[i]["y"]}
  }
  //console.log(body);
  socket.volatile.emit("data", body);
}

function readyFunc(bool){
  var data = {"id": socket.id, "ready": bool}
  socket.emit("game",data, (response) => {
      console.log(response.status); // ok
  });
  console.log(data)
}
