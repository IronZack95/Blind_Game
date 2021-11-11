// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA
let lobby;
let snake;
let rez = 20;
let food;
let w;
let h;
var nCibo = 0;
var score = 0;
const canvasWidth = 400;
const canvasHeight = 400;
var cnv;    // canvas element

const PLAIN_FOOD = 100;   //punti per cibo di tipo base


function setup() {
  lobby = new Lobby();
  /*
  cnv = createCanvas(canvasWidth, canvasHeight);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();
  foodLocation();
  */
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}
function windowResized() {
  centerCanvas();
}

function foodLocation() {

  let v = createVector( floor(random(w)), floor(random(h)) );
  
  //no food on top of snake
  for (i=0; i<snake.body.length; i++) {
    if (snake.body[i] == v) {
      return foodLocation();
    }
  }
  food = v;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
    socket.volatile.emit("keys", "LEFT");
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
    socket.volatile.emit("keys", "RIGHT");
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
    socket.volatile.emit("keys", "DOWN");
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
    socket.volatile.emit("keys", "UP");
  } else if (key == ' ') {
    snake.grow();
  }

}


function draw() {
  scale(rez);
  background(220);
  if (snake.eat(food)) {
    var s = "ho mangiato";
    var data = {}
    nCibo++;
    score = updateScore();

    data = {s: s, n: nCibo, p: score};
    //post(data)

    foodLocation();
  }
  snake.update();
  snake.show();
  transmit();



  if (snake.endGame()) {
    print("END GAME");
    background(255, 0, 0);
    noLoop();
  }

  noStroke();
  fill(0, 255, 0);
  rect(food.x, food.y, 1, 1);

  function updateScore() {
    // TODO: gestione 2 giocatori
    let punteggio = nCibo * PLAIN_FOOD;
    console.log('punteggio giocatore: ', punteggio);
    return punteggio;
  }
}
