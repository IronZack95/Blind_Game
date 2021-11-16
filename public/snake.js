// SinglePlayer
let type; // tipo di gioco
const PLAIN_FOOD = 100;   //punti per cibo di tipo base

let sketch = function(p) {
  // variabili del canvas
  let snake;
  let rez = 40;
  let food;
  let w;
  let h;
  let nCibo = 0;

  console.log(type) //tipo del gioco




  class Snake{   // oggetto serpente

    constructor() {
    	this.body = [];
      this.body[0] = p.createVector(p.floor(w/2), p.floor(h/2));
      this.xdir = 0;
      this.ydir = 0;
      this.len = 0;
      this.score = 0;   // score del serpente
    }

    setDir(x, y) {
    	this.xdir = x;
      this.ydir = y;
    }

    getBody(){
      return this.body;
    }

    update() {
    	let head = this.body[this.body.length-1].copy();
      this.body.shift();
      head.x += this.xdir;
      head.y += this.ydir;
      this.body.push(head);
    }

    grow() {
    	let head = this.body[this.body.length-1].copy();
      this.len++;
      this.body.push(head);
    }

    endGame() {
    	let x = this.body[this.body.length-1].x;
      let y = this.body[this.body.length-1].y;
      if(x > w-1 || x < 0 || y > h-1 || y < 0) {
         return true;
      }
      for(let i = 0; i < this.body.length-1; i++) {
      	let part = this.body[i];
        if(part.x == x && part.y == y) {
        	return true;
        }
      }
      return false;
    }

    eat(pos) {
    	let x = this.body[this.body.length-1].x;
      let y = this.body[this.body.length-1].y;
      if(x == pos.x && y == pos.y) {
        this.grow();
        this.eatSound();
        return true;
      }
      return false;
    }

    show() {
    	for(let i = 0; i < this.body.length; i++) {
      	p.fill(0);
        p.noStroke();
        p.rect(this.body[i].x, this.body[i].y, 1, 1)
      }
    }

    eatSound() {
        var S_eat = document.getElementById("S_eat");
        S_eat.volume = 0.2;
        S_eat.play();
    }

  }

  class SnakeMulti extends Snake{
    // TODO


  }

  function foodLocation(snakeBody) {  //TODO devo sistemarla, non va (firmato: Wendy)

    let v = p.createVector( p.floor(p.random(w)), p.floor(p.random(h)) );

    //no food on top of snake
    for (i=0; i<snake.body.length; i++) {
      if (snake.body[i] == v) {
        return foodLocation();
      }
    }
    food = v;
  }


class GameLogic{

  constructor(){

      p.keyPressed = function() {

        if (p.keyCode === p.LEFT_ARROW) {
          snake.setDir(-1, 0);
          //socket.volatile.emit("keys", "LEFT");
        } else if (p.keyCode === p.RIGHT_ARROW) {
          snake.setDir(1, 0);
          //socket.volatile.emit("keys", "RIGHT");
        } else if (p.keyCode === p.DOWN_ARROW) {
          snake.setDir(0, 1);
          //socket.volatile.emit("keys", "DOWN");
        } else if (p.keyCode === p.UP_ARROW) {
          snake.setDir(0, -1);
          //socket.volatile.emit("keys", "UP");
        }
      }

      p.keyTyped = function(){
        if(p.key == ' ') {
          snake.grow();
        }
      }

      p.setup = function(){
        p.createCanvas(400, 400);
        w = p.floor(p.width / rez);
        h = p.floor(p.height / rez);
        p.frameRate(5);
        let snake = new Snake();
        let snakeBody = snake.getBody();
        foodLocation(snakeBody);
      }
      p.draw = function(){
        p.scale(rez);
        p.background(220);
        if (snake.eat(food)) {
          updateScore();
          foodLocation();
        }
        snake.update();
        snake.show();

        if (snake.endGame()) {
          p.print("END GAME");
          p.background(255, 0, 0);
          p.noLoop();
        }

        p.noStroke();
        p.fill(0, 255, 0);
        p.rect(food.x, food.y, 1, 1);

        function updateScore() {
          // TODO: altri cibi etc
          nCibo++;
          let punteggio = nCibo * PLAIN_FOOD;
          let counterText = document.getElementById('testoCounter');
          counterText.innerHTML = punteggio;
          return punteggio;
        }
      }
    }
  }

  let game = new GameLogic();
}
