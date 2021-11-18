function setup() {
  createCanvas(800, 600);
  background(153);
  p = new Player(width / 2, height / 10);
}

function draw() {
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
    circle(this.x, this.y, 20);
    triangle(this.x - this.diameter / 2, this.y, this.x + this.diameter / 2, this.y, mouseX, mouseY);
    //triangle(this.x - this.diameter / 2, this.y, this.x + this.diameter / 2, this.y, this.x, this.y + this.diameter / 2);
  }
   
   
  updateDirection(){
    
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
