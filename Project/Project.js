function setup() {
  createCanvas(800, 600);
  background(153);
  p = new Player(width / 2, height / 10);
}

function draw() {
  clear();
  background(153);
  p.update();
}


class Player{ 
  
  constructor(x_start, y_start){
    this.v = createVector(width / 2, height / 2);
    this.diameter = 20;
    this.x = x_start;
    this.y = y_start;
    circle(this.x, this.y, this.diameter);
    triangle(this.x - this.diameter / 2, this.y, this.x + this.diameter / 2, this.y, this.x, this.y + this.diameter / 2);
  }
  
  update(){
    // update direction
    this.v.x = cos(2*PI*(-mouseX+width/2)/width);
    this.v.y = sin(2*PI*(-mouseX+width/2)/width);
    // update position
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 1;
    }if (keyIsDown(RIGHT_ARROW)) {
      this.x += 1;
    }if (keyIsDown(UP_ARROW)) {
      this.y -= 1;
    }if (keyIsDown(DOWN_ARROW)) {
       this.y += 1;
   }
    console.log(mouseX);
    this.drawPlayer();
    //triangle(this.x - this.diameter / 2, this.y, this.x + this.diameter / 2, this.y, mouseX, mouseY);
    //triangle(this.x - this.diameter / 2, this.y, this.x + this.diameter / 2, this.y, this.x, this.y + this.diameter / 2);
  }
   
   
  drawPlayer(){
    circle(this.x, this.y, 20);
    line(this.x, this.y, this.x+this.diameter/2*this.v.x,this.y+this.diameter/2*this.v.y);
  } 
}
