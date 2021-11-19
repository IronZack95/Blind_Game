let song;

/*************************************/
function setup() {
  
  createCanvas(800, 600);
  background(153);
  g = new GameLogic();

}

function draw() {
  clear();
  background(153);
  g.update();
}
/*
function mousePressed() {
  song.play();
}
*/
/*************************************/

class GameLogic{
  constructor(){
    this.p = new Player(width / 2, height -50);
    this.m = new Mine(width/8, height/8);
  }
  update(){
    this.p.update();
    this.m.update();
    //console.log("x: "+mouseX+" y: "+mouseY);
  }

  volumeOnDistancefromMine() {
    let volumeOnDistance;
    let basicDistance = dist(this.p.x, this.p.y, this.m.x, this.m.y );   

    if (basicDistance>300){ //300 è arbitrario, è la distanza entro la quale inizio a sentire la mina
      return volumeOnDistance = 0;
    } 
    else 
    {   
      let weightedDistance = sqrt(  basicDistance /  (300));   //nuova mappatura esponenziale
      console.log("distanza normalizzata e pesata: ",weightedDistance);
      let volumeOnDistance = 0.3*(1-weightedDistance);
      return volumeOnDistance;
    }

  }
}


class Player{ 
  
  constructor(x_start, y_start){
    this.v = createVector(width / 2, height / 2);
    this.diameter = 20;
    this.x = x_start;
    this.y = y_start;
  }
  
  update(){

    // update direction
    this.v.x = cos(2*PI*(mouseX+width/2)/ width);
    this.v.y = sin(2*PI*(mouseX+width/2)/ width);
    //this.v.x = ((mouseX-width/2)/width);
    //this.v.y = ((mouseY-height/2)/height);
    console.log("x: "+this.v.x+" y: "+this.v.y);

    // update position
    if (keyIsDown(LEFT_ARROW)){
      this.x -= 1;
    }if (keyIsDown(RIGHT_ARROW)){
      this.x += 1;
    }if (keyIsDown(UP_ARROW)){
      this.y -= 1;
    }if (keyIsDown(DOWN_ARROW)){
       this.y += 1;
   }
   
   let panning = map(mouseX, 0, width, -1.0, 1.0);
   song.pan(panning);
   song.setVolume(g.volumeOnDistancefromMine());
   
   
  
   //console.log(mouseX);
   this.drawPlayer();
  }
   
  drawPlayer(){
    fill(color(255, 255, 255));
    circle(this.x, this.y, 20);
    line(this.x, this.y,   this.x+this.diameter/2*this.v.x, this.y+this.diameter/2*this.v.y);
  } 
}

class Mine{
  constructor(x,y){
    song = loadSound('data/game.mp3');
    setInterval(function(){song.play();},1000);
    this.x = x;
    this.y = y;
  }
  
  update(){
    this.drawMine();
  }
  
  drawMine(){
    fill(color(0, 0, 255));
    rect(this.x, this.y, 60, 60);
  }
}
