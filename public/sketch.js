
let lobby
let single
let multi

// Inizio del programma
lobby = new Lobby();

// eventi
singleplayer.onclick = function(){
  lobby.getText().innerText = "Play!!";
  setTimeout(function(){ lobby.destructor(); delete pagina; single = new SinglePlayer();},2000)

}
