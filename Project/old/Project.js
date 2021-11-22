
// CONSTANTS & VARS //
//in px, distanze alle quali inizio a sentire i vari oggetti
const MINE_DISTANCE = 200;   
const CRYSTAL_DISTANCE = 100;
const NUM_MINES = 10;

let mine_S, crystal_S; //sounds....

function preload(){
  mine_S = loadSound('data/sounds/mine.mp3');
  crystal_S = loadSound('data/sounds/crystal.mp3');
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
  background(100,100,100);
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
    //CREO giocatore (not random)
    this.p = new Player(width / 2, height -50);

    //CREO muri fissati alle estremità della canvas ***DA FARE***
    // TODO this.fixedWalls ...
    
    //CREO muri random
    this.randomWalls = this.createRandomWalls(NUM_MINES*2, this.p);

    //CREO elemento che può diventare cristallo o mina
    this.objects = this.createObjects(NUM_MINES*2, this.p, this.randomWalls);
    this.mines = this.objects.mines; 
    this.crystals = this.objects.crystals;
    console.log(this.mines); console.log(this.crystals);
   
    console.log('creati questi random walls: ', this.randomWalls);
    console.log('creati questi oggetti: mine: ', this.mines, 'cristalli: ',this.crystals);

    //this.s = new SoundLogic(this.p, this.mines, this.crystals);
  }

  update(){
    //update posizione giocatore
    this.p.update();
    
    //update di tutti i muri, le mine ed i cristalli 
    for(var i=0; i < this.randomWalls.length; i++) {this.randomWalls[i].updateRANDOM_Wall(); };
    for(var i = 0; i < this.mines.length; i++) { this.mines[i].updateMine(); }
    for(var i = 0; i < this.crystals.length; i++) { this.crystals[i].updateCrystal(); }
    
    //update suoni
    //this.s.update(this.p, this.mines, this.crystals);

    //console.log("x: "+mouseX+" y: "+mouseY);
  }
  
  //CREAZIONE DEGLI OGGETTI MINA E CRISTALLO 
  createObjects(numObj, player) {  //passo un numero di oggetti totali che voglio e il player
    let mines = []; let crystals = [];

    for (var i=0; i < numObj; i++ ){
     let giocatore = player;
     let x_rand, y_rand;
   
     x_rand = floor(random(20, width-20));  //valori arbitrari per minimi e massimi
     y_rand = floor(random(40, height-50));
  
      if( x_rand == giocatore.x && y_rand == giocatore.y){
        x_rand = floor(random(20, width-20));  
        y_rand = floor(random(40, height-50));
      } 
      else {
        if(i < numObj/2 ){ 
          mines[i] = new Mine(x_rand, y_rand)
        } else { 
          crystals[i-(NUM_MINES)] = new Crystal(x_rand, y_rand)}
    }
   }
   return {mines, crystals};
  }

  //CREAZIONE MURI RANDOM
  createRandomWalls(numWalls, player) {
    let randomWalls = [];

    for (var i=0; i < numWalls; i++ ){
     let giocatore = player;
     let x_rand, y_rand;
   
     x_rand = 50 + floor(random(0,1) *(width-50)/ 100)*100;
     y_rand = 50 + floor(random(0,1) *(width-50)/ 100)*100;
  
      if(x_rand == giocatore.x && y_rand == giocatore.y) {
        x_rand = 50 + floor(random(0,1) *(width-50)/ 100)*100;
        y_rand = 50 + floor(random(0,1) *(width-50)/ 100)*100;
      } 
      else {
          randomWalls[i] = new RANDOM_Wall(x_rand, y_rand);
    }
   }
   return randomWalls;
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
    this.diameter = 25;
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
    fill(color(48, 208, 0));
    circle(this.x, this.y, 25);
    line(this.x, this.y, this.x+this.diameter/2*this.v.x, this.y+this.diameter/2*this.v.y);
  } 
}

class RANDOM_Wall{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  
  updateRANDOM_Wall(){
    this.drawRANDOM_Wall();
  }
  
  drawRANDOM_Wall(){
    fill(color(150,75,0));
    rect(this.x, this.y, 75, 20);
  }
}

class FIXED_Wall{
  //TODO
}

class Mine{
  constructor(x,y){
    //setInterval(function(){mine_S.play();},1000);
    this.x = x;
    this.y = y;
    this.exploded = false; //di default la mina non è stata esplosa
  }
  
  updateMine(){
    this.drawMine();
  }
  
  drawMine(){
    fill(color(204,0,0));
    circle(this.x, this.y, 15, 15);
  }
}

class Crystal{
  constructor(x,y){
    //setInterval(function(){crystal_S.play();},1000);
    this.x = x;
    this.y = y;
    //setto il file mp3 per il cristallo
    this.found = false;    //di default il cristallo non è stato trovato
  }
  
  updateCrystal(){
    this.drawCrystal();
  }
  
  drawCrystal(){
    fill(color(153, 255, 255));
    circle(this.x, this.y, 15,15);
  }
}
