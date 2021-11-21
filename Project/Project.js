
// CONSTANTS & VARS //////////////////////////
//in px, distanze alle quali inizio a sentire i vari oggetti
const MINE_DISTANCE = 100;   
const CRYSTAL_DISTANCE = 150;


let mine_S, crystal_S, mine_S1, crystal_S1;  //sounds....

function preload(){
  mine_S = loadSound('data/sounds/mine.mp3');
  //mine_S1 = loadSound('data/sounds/mine1.mp3');
  crystal_S = loadSound('data/sounds/crystal.mp3');
  //crystal_S1 = loadSound('data/sounds/crystal1.mp3');
  //walk_S = loadSound('data/sounds/walk.mp3');
  console.log('sounds loaded');
}


/*************************************/

function setup() {
  
  createCanvas(800, 600);
  background(153);
  g = new GameLogic();
  
}

function draw() {
  clear();
  background(64,64,64);
  g.update(); 
  
}

//variabile gloable: let skull; 
//in update(): skull = loadImage('data/images/skull-40.png')   
//in draw() : image(skull, 200, height/2, 20,20)   //provvisoria, TEST


/*
function mousePressed() {
  song.play();
}
*/
/*************************************/



class GameLogic{

  constructor(){
    //giocatore, nasce in posizione fissa
    this.p = new Player(width / 2, height -50);

    //creo le mine (coordinate HARD-CODED PER ADESSOOOOOO
    this.mines = [
      new Mine(width/8, height/8, mine_S),
      new Mine(width/2, height/2, mine_S)
    ];
    console.log('create queste mine: ',this.mines)

    //creo i cristalli (coordinate HARD-CODED PER ADESSOOOOOO)
    this.crystals = [
      new Crystal(width-100, 500, crystal_S),
      new Crystal(width-200, 50, crystal_S)
    ];
    console.log('creati questi cristalli: ',this.crystals)

    this.s = new SoundLogic(this.p, this.mines, this.crystals);
  }

  update(){

    //update posizione giocatore
    this.p.update();
    //update grafica di tutte le mine e cristalli
    for(var i = 0; i < this.mines.length; i++) { this.mines[i].updateMine(); }
    for(var i = 0; i < this.crystals.length; i++) { this.crystals[i].updateCrystal(); }
    //update suoni
    this.s.update(this.p, this.mines, this.crystals);

    //console.log("x: "+mouseX+" y: "+mouseY);
  }
 
}



class SoundLogic {
  constructor(player, mines, crystals) {
    this.player = player;
    this.mines = mines; //array
    this.crystals = crystals; //array
  };

  update() { 
    //TODO: player walking sound

    //empty arrays 
    this.mine_distance, this.crystal_distances = [];

    // TODO: creare funzioni riutilizzabili per i cicli for qui sotto

    //MINES
    for (var i=0; i < this.mines.length; i++){
      //panning
      let panning = map(mouseX, 0, width, -1.0, 1.0);
      this.mines[i].bip.pan(panning);

      //compute distances
      this.mine_distance = dist(this.player.x, this.player.y, this.mines[i].x, this.mines[i].y);

      //nested "if" to compute volume
      if(this.mine_distance >= MINE_DISTANCE) {
        this.mines[i].bip.setVolume(0);
      } else {
        let temp = sqrt(this.mine_distance / MINE_DISTANCE);
        let temp1 = 0.7 * (1-temp);
        this.mines[i].bip.setVolume(temp1);
        console.log('suona la mina '+[i])
      }
    }

    //CRYSTALS
    for (var i=0; i < this.crystals.length; i++){
      //panning
      let panning = map(mouseX, 0, width, -1.0, 1.0);
      this.crystals[i].bip.pan(panning);

      //compute distances
      this.crystal_distance = dist(this.player.x, this.player.y, this.crystals[i].x, this.crystals[i].y);

      //nested "if" to compute volume
      if(this.crystal_distance >= CRYSTAL_DISTANCE) {
        this.crystals[i].bip.setVolume(0);
      } else {
        let temp = sqrt(this.crystal_distance / CRYSTAL_DISTANCE);
        let temp1 = 0.7 * (1-temp);
        this.crystals[i].bip.setVolume(temp1);
        console.log('suona il cristallo '+[i])
      }
    }

  }  //**end update**/

}



class Player{ 
  
  constructor(x_start, y_start){
    this.v = createVector(width / 2, height / 2);
    this.diameter = 20;
    this.x = x_start;
    this.y = y_start;

    this.walking = false;  //di default è fermo
    this.dead = false;     //di default il player non è morto
  }
  
  update(){

    // update direction
    this.v.x = cos(2*PI*(mouseX+width/2)/ width);
    this.v.y = sin(2*PI*(mouseX+width/2)/ width);
    //this.v.x = ((mouseX-width/2)/width);
    //this.v.y = ((mouseY-height/2)/height);
    //console.log("x: "+this.v.x+" y: "+this.v.y);

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
   
   //console.log(mouseX);
   this.drawPlayer();
  }
   
  drawPlayer(){
    fill(color(255, 255, 255));
    circle(this.x, this.y, 20);
    line(this.x, this.y, this.x+this.diameter/2*this.v.x, this.y+this.diameter/2*this.v.y);
  } 
}

class Mine{
  constructor(x,y,bip){
    setInterval(function(){mine_S.play();},1000);
    this.x = x;
    this.y = y;

    this.bip = bip;  //setto il file mp3 per la mina
    this.exploded = false; //di default la mina non è stata esplosa
  }
  
  updateMine(){
    this.drawMine();
  }
  
  drawMine(){
    fill(color(204,0,0));
    rect(this.x, this.y, 10, 10);
  }
}

class Crystal{
  constructor(x,y,bip){
    setInterval(function(){crystal_S.play();},1000);
    this.x = x;
    this.y = y;

    this.bip = bip;  //setto il file mp3 per il cristallo
    this.found = false;    //di default il cristallo non è stato trovato
  }
  
  updateCrystal(){
    this.drawCrystal();
  }
  
  drawCrystal(){
    fill(color(153, 255, 255));
    rect(this.x, this.y, 10,10);
  }
}


