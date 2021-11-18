function setup() {
  createCanvas(800, 600);
  background(153);
  p = new Player(400,30);
}


function draw() {
  background(153);
  p.update();
}

class Player{

  constructor(x_start,y_start){
    this.x = x_start;
    this.y = y_start;
    circle(this.x, this.y, 20);
  }
  
  update(){
    circle(this.x, this.y, 20);
  }
 
}

function keyPressed() {
        if (key == 'a') {
          p.x -= 1;
        } else if (key == 'd') {
          p.x += 1;
        }else if (key == 'w') {
          p.y -= 1;
        } else if (key == 's') {
          p.y += 1;
        }
    }
