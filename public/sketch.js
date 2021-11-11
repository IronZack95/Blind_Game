
let lobby
let single
let multi

// Inizio del programma
lobby = new Lobby();


/*
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}
*/



singleplayer.onclick = function(){
  lobby.getText().innerText = "Play!!";
  setTimeout(function(){ lobby.destructor(); delete pagina; single = new SinglePlayer();},2000)

}
