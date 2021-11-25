
 const WIDTH = 800;             //...del canvas
 const HEIGHT = 600;            //...del canvas
 const LATO = 40;               //lato dei quadrati che formano i muri random 
 const RAGGIO = 13;             //raggio del giocatore
 const RAGGIO_O = 15;           //raggio oggetti mina e cristallo
 
 let sketch = function(p) {
   /*
   p.preload = function(){
     mine_S = p.loadSound('sounds/mine.mp3');
     crystal_S = p.loadSound('sounds/crystal.mp3')
     //other sounds....
     console.log('sounds loaded')
   }
   */
/**********************************************************/
  p.setup = function() {
    if(type == 'SinglePlayer'){g = new GameLogic();}
    else{g = new GameLogicMulti();}
  }

  p.draw = function() {
    p.clear();
    p.background(0);
    g.update();
  }

/**********************************************************/

class GameLogic{

  constructor(){
    let ctx =  p.createCanvas(WIDTH, HEIGHT);
    this.p = new Player(p.width/2,580);

    let perlin_map = new Perlin_Map(ctx);
    this.walls = this.createWalls(perlin_map, this.p);

    this.objects = this.createObjects(NUM_MINES*2, this.p.x, this.p.y,  this.walls);
    this.mines = this.objects.mines;
    this.crystals = this.objects.crystals;

    //console.log('creati questi random walls: ', this.randomWalls);
    console.log('creati questi oggetti: mine: ', this.mines, 'cristalli: ',this.crystals, 'walls: ',this.walls);

    //this.s = new SoundLogic(this.p, this.mines, this.crystals);
  }

  update(){
  
    this.p.update();
    //for(var i = 0; i < this.walls.length; i++) { this.walls[i].checkCollisions(this.p.x, this.p.y); }

    for(var i = 0; i < this.walls.length; i++) { this.walls[i].updateWall(); }
    for(var i = 0; i < this.mines.length; i++) { this.mines[i].updateMine(); }
    for(var i = 0; i < this.crystals.length; i++) { this.crystals[i].updateCrystal(); }
    //check collisioni con muro
    for(var i = 0; i < this.walls.length; i++) { 
      this.walls[i].checkCollisions(this.p.x, this.p.y); }
    //check mangiato cristallo
    for(var i = 0; i < this.crystals.length; i++) {
      this.crystals[i].checkEatCrystal(this.p.x, this.p.y, this.crystals, i); }
    //check esploso su mina
    for(var i = 0; i < this.mines.length; i++) {
      this.mines[i].checkExplosion(this.p.x, this.p.y, this.mines, i); }
    
    // TODO: gestion punteggio ********

    //update suoni
    //this.s.update(this.p, this.mines, this.crystals);

    //console.log("x: "+mouseX+" y: "+mouseY);
  }

  //CREAZIONE MURI RANDOM
  createWalls(map){
    let walls=[];
    console.log(map);

    for(var keys1 in map){
      //console.log(map[keys1]);
      for(var keys2 in map[keys1]){
        let v = map[keys1][keys2];
        let row = p.floor(keys1*p.width/10);
        let col = p.floor(keys2*p.width /10);
        if(v == true && row<p.height && col <= p.width){
          //console.log('row: '+row+' column: '+col+' value: ' +v);
          let w = new Wall(col,row);
          walls.push(w);
        }
      }
    }
    //elimino alcune file di muri
    walls = walls.filter(function(el){return el.y != 560;});
    walls = walls.filter(function(el){return el.y != 0;});
    walls = walls.filter(function(el){return el.x != 0;});
    walls = walls.filter(function(el){return el.x != 760;});
    //ritorno oggetto contenente tutti i muri istanziati
    return walls;
  }

  //CREAZIONE DEGLI OGGETTI MINA E CRISTALLO ***************

  createObjects(numObj, playerX, playerY, walls) {
    let mines = []; 
    let crystals = []; 
    let x_r, y_r;  
    let temp = []; 
    
    for (var i = 0; i < numObj; i++){
      //creo delle coordinate ipotetiche
      //min + Math.floor(Math.random() * max / step) * step;
      x_r = 30 + p.floor(p.random(0,1) *(p.width-50)/ 30)*30;
      y_r = 30 + p.floor(p.random(0,1) *(p.height-50)/ 30)*30;
      const vero = (element) => element === true;
      
      //finchè cadono su muri o giocatore ricalcoliamole
      while (checkEveryWall(walls, x_r, y_r).some(vero)) {
        console.log('oops');
        x_r = 30 + p.floor(p.random(0,1) *(p.width-50)/ 30)*30;
        y_r = 30 + p.floor(p.random(0,1) *(p.height-50)/ 30)*30;
      } 

      //quando vanno bene piazziamole negli array
      if(i < numObj/2 ){
        mines[i] = new Mine(x_r, y_r)
      } else {
        crystals[i-(NUM_MINES)] = new Crystal(x_r, y_r)
      }
    } //end of for loop

    return {mines, crystals};

    function checkEveryWall(walls, x_r, y_r){
      for (var i = 0; i < walls.length; i++){
        temp[i] = walls[i].checkOverlap(x_r,y_r);
      }
      return temp;   //array di true and false
    }

    function checkPlayer(x_r, y_r, playerX, playerY){
      return x_r == playerX && y_r == playerY;
    }

  } //end of createObjects()

} // end of GameLogic

class GameLogicMulti extends GameLogic{

  constructor(p,){
    let ctx =  p.createCanvas(WIDTH, HEIGHT);
    //CREO giocatore (not really random)
    this.p = new Player(p.width/2,580);

    let perlin_map = new Perlin_Map(ctx);
    this.walls = this.createWalls(perlin_map, this.p);

    //CREO elemento che può diventare cristallo o mina
    this.objects = this.createObjects(NUM_MINES*2, this.p);
    this.mines = this.objects.mines;
    this.crystals = this.objects.crystals;

    //console.log('creati questi random walls: ', this.randomWalls);
    console.log('creati questi oggetti: mine: ', this.mines, 'cristalli: ',this.crystals, 'walls: ',this.walls);

    //this.s = new SoundLogic(this.p, this.mines, this.crystals);
  }

  update(){

  }

  //CREAZIONE MURI RANDOM
  createWalls(map, player){

  }

  //CREAZIONE DEGLI OGGETTI MINA E CRISTALLO
  createObjects(numObj, player) {  //passo un numero di oggetti totali che voglio e il player

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
      let panning = map(p.mouseX, 0, p.width, -1.0, 1.0);
      this.mines[i].bip.pan(panning);

      //compute distances
      this.mine_distance = dist(this.player.x, this.player.y, this.mines[i].x, this.mines[i].y);

      //nested "if" to compute volume
      if(this.mine_distance >= MINE_DISTANCE) {
        this.mines[i].bip.setVolume(0);
      } else {
        let temp = p.sqrt(this.mine_distance / MINE_DISTANCE);
        let temp1 = 0.7 * (1-temp);
        this.mines[i].bip.setVolume(temp1);
        console.log('suona la mina '+[i])
      }
    }

    //CRYSTALS
    for (var i=0; i < this.crystals.length; i++){
      //panning
      let panning = p.map(mouseX, 0, width, -1.0, 1.0);
      this.crystals[i].bip.pan(panning);

      //compute distances
      this.crystal_distance = p.dist(this.player.x, this.player.y, this.crystals[i].x, this.crystals[i].y);

      //nested "if" to compute volume
      if(this.crystal_distance >= CRYSTAL_DISTANCE) {
        this.crystals[i].bip.setVolume(0);
      } else {
        let temp = p.sqrt(this.crystal_distance / CRYSTAL_DISTANCE);
        let temp1 = 0.7 * (1-temp);
        this.crystals[i].bip.setVolume(temp1);
        console.log('suona il cristallo '+[i])
      }
    }
  }  //**end update**/
}

class Player{

    constructor(x_start, y_start){
      this.v = p.createVector(p.width / 2, p.height / 2);
      this.diameter = 2*RAGGIO;
      this.x = x_start;
      this.y = y_start;

      this.walking = false;  //di default è fermo
      this.dead = false;     //di default il player non è morto
    }

    update(){

      // update direction
      this.v.x = p.cos(2*p.PI*(p.mouseX+p.width/2)/ p.width);
      this.v.y = p.sin(2*p.PI*(p.mouseX+p.width/2)/ p.width);
      //this.v.x = ((mouseX-width/2)/width);
      //this.v.y = ((mouseY-height/2)/height);
      //console.log("x: "+this.v.x+" y: "+this.v.y);

      // update position
      // (store first the last position)
      this.old_x = this.x;  this.old_y = this.y;
      
      if (p.keyIsDown(p.LEFT_ARROW) && this.x > 0 + this.diameter / 2){
        this.x -= 1;          
      }
      if (p.keyIsDown(p.RIGHT_ARROW) && this.x < WIDTH - this.diameter / 2){
          this.x += 1;
      }
      if (p.keyIsDown(p.UP_ARROW) && this.y > 0 + this.diameter / 2){
        this.y -= 1;
      }
      if (p.keyIsDown(p.DOWN_ARROW) && this.y < HEIGHT - this.diameter / 2){
         this.y += 1;
      }

     //console.log(mouseX);
     this.drawPlayer();
    }

    drawPlayer(){
      p.fill(p.color(48, 208, 0));
      p.circle(this.x, this.y, 25);
      p.line(this.x, this.y, this.x+this.diameter/2*this.v.x, this.y+this.diameter/2*this.v.y);
    }

}

class FIXED_Wall{
    //TODO
}

class Wall{
  constructor(x,y){
      this.x = x;
      this.y = y;
  }

  updateWall(){
    this.drawWall();
  }

  drawWall(){
      p.fill(p.color(0,100,10));
      p.rect(this.x, this.y, LATO);
  }

  //funzione che per ogni singolo muro controlla se il player ci è sbattuto addosso
  checkCollisions(playerX, playerY) {
    //let playerX = giocatoreX; let playerY = giocatoreY; let player = giocatore;
    if (this.checkOverlap(playerX, playerY)){console.log('OUCH!!')}else{return};
  }

  checkOverlap(playerX, playerY){
    let radius = RAGGIO;  //raggio del giocatore, TODO creare const

        //trovo il punto più vicino tra il muro quadrato e il centro del cerchio
        let Xn = Math.max(this.x, Math.min(playerX, this.x + LATO));
        let Yn = Math.max(this.y, Math.min(playerY, this.y + LATO));
        //trovo distanza tra punto più vicino e centro del cerchio
        let Dx = Xn - playerX;
        let Dy = Yn - playerY;
        return (Dx*Dx + Dy*Dy) <= (radius*radius);
  }

  checkContain(x,y){  //al momento non serve a niente questa, magari la cancelliamo
    return ( this.x <= x && x <= (this.x+LATO) && this.y <= y && y <= (this.y+LATO));
  }

}  //end of class Wall

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
    p.fill(p.color(204,0,0));
    p.circle(this.x, this.y, RAGGIO_O);
  }

  checkExplosion(playerX, playerY, mines, index){
    //first it checks the collision between the two circles
    var dx = (this.x + RAGGIO_O) - (playerX + RAGGIO);
    var dy = (this.y + RAGGIO_O) - (playerY + RAGGIO);
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < RAGGIO_O + RAGGIO){
      console.log('sono esploso');
      mines.splice(index,1);
    } else {
      return;
    }
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
    p.fill(p.color(153, 255, 255));
    p.circle(this.x, this.y, RAGGIO_O);
  }

  checkEatCrystal(playerX, playerY, crystals, index){
    //first it checks the collision between the two circles
    var dx = (this.x + RAGGIO_O) - (playerX + RAGGIO);
    var dy = (this.y + RAGGIO_O) - (playerY + RAGGIO);
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < RAGGIO_O + RAGGIO){
      console.log('ho mangiato un cristallo');
      crystals.splice(index,1);
    } else {
      return;
    }
  }
}

}
