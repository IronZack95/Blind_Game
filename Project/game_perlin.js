
 const WIDTH = 800;   //del canvas
 const HEIGHT = 600;  //del canvas
 const GRID_SIZE = 10;
 const RESOLUTION = 2;
 const COLOR_SCALE = 1000000;

 const NUM_MINES = 20; 
 
 let ctx, perlin_map, player;   //canvas e perlin

/**********************************************************/ 

  function setup(){
    ctx =  createCanvas(WIDTH, HEIGHT);
    g = new GameLogic();
  }

  function draw(){
    clear();
    background(0);
    perlin_map = new Perlin_Map(ctx);
    g.update();
  }
  
/**********************************************************/

class GameLogic{

  constructor(){
    //CREO giocatore (not random)
    this.p = new Player(width / 2, height -50);

    //CREO muri fissati alle estremità della canvas ***DA FARE***
    // TODO this.fixedWalls ...

    //CREO elemento che può diventare cristallo o mina
    this.objects = this.createObjects(NUM_MINES*2, this.p, this.randomWalls);
    this.mines = this.objects.mines; 
    this.crystals = this.objects.crystals;
  
    //console.log('creati questi random walls: ', this.randomWalls);
    console.log('creati questi oggetti: mine: ', this.mines, 'cristalli: ',this.crystals);

    //this.s = new SoundLogic(this.p, this.mines, this.crystals);
  }

  update(){
    //update posizione giocatore
    this.p.update();
    
    //update di tutti i muri, le mine ed i cristalli 
    //for(var i=0; i < this.randomWalls.length; i++) {this.randomWalls[i].updateRANDOM_Wall(); };
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

 class Perlin_Map {
    constructor(cnvs) {
        let pixel_size = cnvs.width / RESOLUTION;
        let num_pixels = GRID_SIZE / RESOLUTION;
        let ctx = drawingContext;

        for (let y = 0; y < GRID_SIZE; y += num_pixels / GRID_SIZE){

            for (let x = 0; x < GRID_SIZE; x += num_pixels/ GRID_SIZE){

                let v = parseInt(perlin.get(x, y) * COLOR_SCALE);

                //ctx.fillStyle = 'hsl(' + v + ', 100%, 25%)';
                //ctx.fillStyle = 'rgb(' + v + ', 0, 30)';
                ctx.fillStyle = 'rgb(' + v + ', 0, 0)';
              

                ctx.fillRect(
                    x / GRID_SIZE * cnvs.width,
                    y / GRID_SIZE * cnvs.width,
                    pixel_size,
                    pixel_size
                );
            }
        }
      }
}

 // PERLIN OBJECT //
 'use strict';
 let perlin = {  rand_vect: function(){
                    
                    let theta = Math.random() * 2 * Math.PI;

                    return {x: Math.cos(theta), y: Math.sin(theta)};
                    
                },

                dot_prod_grid: function(x, y, vx, vy){

                        let g_vect;
                        let d_vect = {x: x - vx, y: y - vy};

                        if (this.gradients[[vx,vy]]) {
                            g_vect = this.gradients[[vx,vy]];
                        } else {
                            g_vect = this.rand_vect();
                            this.gradients[[vx, vy]] = g_vect;
                        }

                    return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
                },

                smootherstep: function(x) {                    
                    return 6*x**5 - 15*x**4 + 10*x**3;
                    //return x - x + x;
                },

                interp: function(x, a, b){
                    return a + this.smootherstep(x) * (b-a);
                },

                seed: function(){
                    this.gradients = {};
                    this.memory = {};
                },

                get: function(x, y) {

                    if (this.memory.hasOwnProperty([x,y]))
                        return this.memory[[x,y]];
                        
                    let xf = Math.floor(x);
                    let yf = Math.floor(y);

                    //interpolate
                    let tl = this.dot_prod_grid(x, y, xf,   yf);
                    let tr = this.dot_prod_grid(x, y, xf+1, yf);
                    let bl = this.dot_prod_grid(x, y, xf,   yf+1);
                    let br = this.dot_prod_grid(x, y, xf+1, yf+1);
                    let xt = this.interp(x-xf, tl, tr);
                    let xb = this.interp(x-xf, bl, br);
                    let v = this.interp(y-yf, xt, xb);

                    this.memory[[x,y]] = v - 0.2;

                    return v;
                }
 }

 perlin.seed();
