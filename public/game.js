
 const WIDTH = 1200;         //...del canvas
 const HEIGHT = 600;        //...del canvas
 const LATO = 40;           //lato dei quadrati che formano i muri random
 const RAGGIO_P = 12;       //raggio del giocatore
 const RAGGIO_C = 8;        //raggio cristalli
 const RAGGIO_M = 5;        //raggio mine

 // per Perlin
 const GRID_SIZE = Math.floor(WIDTH/LATO); //10 griglia
 const RESOLUTION = 2; //2 ogni box contiente RESOLUTION X RESOLUTION muri dentro la griglia
 const THRESHOLD = 100000;

 const NUM_MINE = 15;
 const NUM_CRISTALLI = 20;
 const MINE_DISTANCE = 100; //distanza entro cui inizio a sentire mina

 const CRYSTAL = 100;        //punti per un cristallo
 const EXPLOSION = 200;      //punti in meno per un'esplosione

 let sketch = function(p) {

  /* preload dei suoni *************************************/
  let mineSound1, mineSound2;

    p.preload = function(){
      p.soundFormats('mp3', 'ogg');
      mineSound1 = p.loadSound('sounds/mine');
      mineSound2 = p.loadSound('sounds/crystal')
      //other sounds....
     }

/**********************************************************/
  p.setup = function() {
    if(type == 'SinglePlayer'){g = new GameLogicSingle(WIDTH,HEIGHT);}
    else if(type == 'MultiPlayer'){g = new GameLogicMulti(gameState);}
  }

  p.draw = function() {
    p.clear();
    p.background(0);
    g.update();
  }

/**********************************************************/

class GameLogic{
  constructor(){
    this.playerScore = 0;  //punteggio default
    this.walls = [];
    this.mines = [];
    this.crystals = [];
    this.p = null;
    this.enemy = [];
    this.ctx =  p.createCanvas(WIDTH, HEIGHT);
  }
  update(){

    for(var i = 0; i < this.walls.length; i++) { this.walls[i].updateWall(); }
    for(var i = 0; i < this.mines.length; i++) { this.mines[i].updateMine(); }
    for(var i = 0; i < this.crystals.length; i++) { this.crystals[i].updateCrystal(); }
    for(var i = 0; i < this.enemy.length; i++) { this.enemy[i].update(); }
    this.p.update(this.walls);  //per ultimo così viene disegnato sopra a tutto

    //check mangiato cristallo + modifica punteggio
    for(var i = 0; i < this.crystals.length; i++) {
      if( this.crystals[i].checkEatCrystal(this.p.x, this.p.y, this.crystals, i )){
        this.playerScore += CRYSTAL;
      }; }

    //check esploso su mina + modifica punteggio
    for(var i = 0; i < this.mines.length; i++) {
      if( this.mines[i].checkExplosion(this.p.x, this.p.y, this.mines, i )) {
        this.playerScore -= EXPLOSION;
      }; }

    this.updateScore();

    //update suoni
    //this.s.update(this.p, this.mines);

  }

  updateScore(){
   document.getElementById('testoCounter').innerHTML = this.playerScore;
  }

}

class GameLogicSingle extends GameLogic{

  constructor(width, height){
    super(width,height);

    let perlin_map = new Perlin_Map(GRID_SIZE,RESOLUTION,THRESHOLD);
    this.walls = this.createWalls(perlin_map, this.p);

    let objects = this.createObjects(NUM_MINE + NUM_CRISTALLI, this.walls);
    this.mines = objects.mines;
    this.crystals = objects.crystals;
    this.p = new Player(p.width/2,580,'#0077ff');
    console.log('creati questi oggetti: mine: ', this.mines, 'cristalli: ',this.crystals, 'walls: ',this.walls);

    this.soundCollection = [mineSound1, mineSound2];
    console.log('loaded these sounds: ', this.soundCollection);
    //this.s = new SoundLogic(this.mines, this.soundCollection);
  }

  //CREAZIONE MURI RANDOM
  createWalls(map){
    let walls=[];
    console.log(map);
    for(var keys1 in map){
      //console.log(keys1,map[keys1]);
         for(var keys2 in map[keys1]){
           let v = map[keys1][keys2];
           let row = p.floor(keys1*p.width*RESOLUTION/(GRID_SIZE));
           let col = p.floor(keys2*p.width*RESOLUTION/(GRID_SIZE));
           if(v == true && row <= p.height && col <= p.width){
             //console.log('row: '+row+' column: '+col+' value: ' +v);
             let w = new Wall(col,row);
             walls.push(w);
           }
         }
    }
    //elimino alcune file di muri (volendo si può fare nel for qua sopra)

    walls = walls.filter(function(el){return el.y != (HEIGHT - LATO);});
    walls = walls.filter(function(el){return el.y != 0;});
    walls = walls.filter(function(el){return el.x != 0;});
    walls = walls.filter(function(el){return el.x != (WIDTH - LATO);});

    //ritorno oggetto contenente tutti i muri istanziati
    return walls;
  }

  //CREAZIONE DEGLI OGGETTI MINA E CRISTALLO ***************

  createObjects(numObj, walls) {
    let mines = [];
    let crystals = [];
    let x_r, y_r;
    let temp = [];
    let approvati = [];

    for (var i = 0; i < numObj; i++){
      //creo delle coordinate ipotetiche
      //min + Math.floor(Math.random() * max / step) * step;
      x_r = LATO + Math.floor(Math.random() *(p.width - LATO)/ 50)* 50;
      y_r = LATO + Math.floor(Math.random() *(p.height - LATO*1.5)/ 50)* 50;

      //finchè cadono su muri o giocatore ricalcoliamole
      while (checkEveryWall(walls, x_r, y_r).some(e => e === true) ||
             approvati.some(e => (e.x == x_r) && (e.y == y_r))) {
        console.log('oops');
        x_r = LATO + Math.floor(Math.random() *(p.width - LATO)/ 50)* 50;
        y_r = LATO + Math.floor(Math.random() *(p.height - LATO*1.5)/ 50)* 50;
      }

      approvati[i] = {x: x_r, y: y_r};

      //quando vanno bene piazziamole negli array
      if(i < NUM_MINE ){
        mines[i] = new Mine(x_r, y_r)
      } else {
        crystals[i-(NUM_MINE)] = new Crystal(x_r, y_r)
      }
    } //end of for loop

    return {mines, crystals};

    function checkEveryWall(walls, x_r, y_r){
      for (var i = 0; i < walls.length; i++){
        temp[i] = walls[i].checkOverlapPlayer(x_r,y_r);
      }
      return temp;   //array di true and false
    }

  } //end of createObjects()

} // end of GameLogic

class GameLogicMulti extends GameLogic{

  constructor(state){
    super(state.canvas.width, state.canvas.height);

    this.walls = this.createWalls(state.walls);
    this.mines = this.createMines(state.mines);
    this.crystals = this.createCrystals(state.crystals);

    state.players.forEach((item, i) => {
      if(state.myid == item.id){this.p = new Player(item.position.x,item.position.y,item.color);}
      else{this.enemy.push(new Enemy(item.position.x,item.position.y,item.color,item.id))}
    });

    this.t = new Transmit(this.p,this.enemy);
    this.r = new Recive(this.p,this.enemy);

    console.log('creati questi oggetti: mine: ', this.mines, 'cristalli: ',this.crystals, 'walls: ',this.walls);

    this.soundCollection = [mineSound1, mineSound2];
    console.log('loaded these sounds: ', this.soundCollection);
    //this.s = new SoundLogic(this.mines, this.soundCollection);
  }

  update(){

    this.t.transmitPosition();
    this.t.transmitDirection(); //da sistemare
    super.update();
  }

  //CREAZIONE MURI DA MAPPA
  createWalls(wallsMap){
    let walls = [];
    wallsMap.forEach((item, i) => {
      let w = new Wall(item.x,item.y);
      walls.push(w);
    });
    return walls;
  }

  //CREAZIONE MINE DA MAPPA
  createMines(minesMap){
    let mines = [];
    minesMap.forEach((item, i) => {
      let w = new Mine(item.x,item.y);
      mines.push(w);
    });
    return mines;
  }

  //CREAZIONE CRISTALLI DA MAPPA
  createCrystals(crystalsMap){
    let crystals = [];
    crystalsMap.forEach((item, i) => {
      let w = new Crystal(item.x,item.y);
      crystals.push(w);
    });
    return crystals;
  }

} //end of GameLogicMulti

class SoundLogic {

  constructor(mines, soundCollection) {
    this.mines = mines;
    this.minesSounds = [];  //creerò array di suoni per ogni mina
    this.soundCollection = soundCollection;

    //creo un array coi suoni di ciascuna mina
    for (var i = 0; i < this.mines.length; i++){
      //let temp = this.soundCollection[i];
      this.minesSounds[i] = mineSound1;
      this.minesSounds[i].play();
    }
    console.log(this.mines[0].x, this.mines[0].y, this.minesSounds[0].url )
  }

  update(player, mines){

    this.mines_distances = [];

    for ( var i = 0; i < mines.length; i++ ){
      //calcolo distanze
      this.mines_distances[i] = p.dist(player.x, player.y, mines[i].x, mines[i].y);

      if( this.mines_distances[i] <= MINE_DISTANCE ) {
        //se sono abbastanza vicino calcolo il volume
        let temp = Math.sqrt(this.mines_distances[i] / MINE_DISTANCE);  //calcolo distanza normalizzata etc
        let temp1 = 0.7 * (1-temp);   //calcolo volume, 0.7 abbassa a 70% di 1
        this.minesSounds[i].setVolume(temp1);
        console.log('suona la mina '+[i]+ ' at volume '+temp1);
      } else {
        this.minesSounds[i].setVolume(0);
      }
    }
  }
}  //end of SoundLogic

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
  checkCollisionsPlayer(playerX, playerY) {
    //let playerX = giocatoreX; let playerY = giocatoreY; let player = giocatore;
    if (this.checkOverlapPlayer(playerX, playerY)){
      console.log('OUCH!!');
      return true;
    } else {
      return false;};
  }

  checkOverlapPlayer(playerX, playerY){

        //trovo il punto più vicino tra il muro quadrato e il centro del cerchio
        let Xn = Math.max(this.x, Math.min(playerX, this.x + LATO));
        let Yn = Math.max(this.y, Math.min(playerY, this.y + LATO));
        //trovo distanza tra punto più vicino e centro del cerchio
        let Dx = Xn - playerX;
        let Dy = Yn - playerY;
        return (Dx*Dx + Dy*Dy) <= (RAGGIO_P**2);
  }

  checkContain(x,y){  //al momento non serve a niente questa, magari la cancelliamo
    return ( this.x <= x && x <= (this.x+LATO) && this.y <= y && y <= (this.y+LATO));
  }

}  //end of class Wall

class Mine{
  constructor(x,y){
    //setInterval(function(){mine_S.play();},1000);
    //this.bip = mine_sound;
    this.x = x;
    this.y = y;
    this.exploded = false;          //di default la mina non è stata esplosa
    this.color = p.color(204,0,0);  //di default è rossa (in realtà nera)
  }

  updateMine(){
    this.drawMine();
  }

  drawMine(){
    p.fill(this.color);
    p.circle(this.x, this.y, 2*RAGGIO_M);
  }

  checkExplosion(playerX, playerY, mines, index){
    //first it checks the collision between the two circles
    var dx = (this.x + RAGGIO_P) - (playerX + RAGGIO_M);
    var dy = (this.y + RAGGIO_P) - (playerY + RAGGIO_M);
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < RAGGIO_M + RAGGIO_P && this.exploded === false){

      console.log('sono esploso');
      mines[index].exploded = true;   //funzionale alla singola mina
      mines[index].color = p.color(128,128,128);
      //mines.splice(index,1);
      return true;
    } else {
      return false;
    }
  }

}

class Crystal{
  constructor(x,y){
    //setInterval(function(){crystal_S.play();},1000);
    this.x = x;
    this.y = y;
    this.eaten = false;    //di default il cristallo non è stato trovato
    this.color = p.color(153, 255, 255);
  }

  updateCrystal(){
    this.drawCrystal();
  }

  drawCrystal(){
    p.fill(this.color);
    p.circle(this.x, this.y, 2*RAGGIO_C);
  }

  checkEatCrystal(playerX, playerY, crystals, index){
    //first it checks the collision between the two circles
    var dx = (this.x + RAGGIO_P) - (playerX + RAGGIO_C);
    var dy = (this.y + RAGGIO_P) - (playerY + RAGGIO_C);
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < RAGGIO_C + RAGGIO_P && this.eaten === false){

      console.log('ho mangiato un cristallo');
      crystals[index].eaten = true;   //funzionale al singolo cristallo
      crystals[index].color = p.color(0);
      return true;

    } else {
      return false;
    }
  }
}

class Player{
  constructor(x,y,color){
    this.x = x;
    this.y = y;
    this.diameter = 2*RAGGIO_P;
    this.dir = 0;  //"dir" is used for eyes movements
    this.box_radius = RAGGIO_P; //radius used to check for collisions
    this.dead = false;  //TODO: funzione per ucciderlo
    this.walk = false;
    this.color = color;
    this.i = 0;
  }

  update(walls){
    if(this.i > p.frameRate()){ this.i  = 0; }
    else{ this.i ++; }

    this.walk = false;

    let dir =  Number.parseFloat( 2 * p.PI * p.winMouseX / p.windowWidth).toFixed(2);  //tra 0 e 1
    if(dir <= 2 * p.PI && dir > 0){ this.dir = dir; }

    if (p.keyIsDown(p.LEFT_ARROW) && this.x > 0 + this.diameter / 2 ) {
      let temp = this.x - 1;
      if (walls.every(element => element.checkCollisionsPlayer(temp, this.y) === false)){
        this.walk = true;
        this.x = temp;
      }
    }

    if (p.keyIsDown(p.RIGHT_ARROW) && this.x < WIDTH - this.diameter / 2) {
      let temp = this.x + 1;
      if (walls.every(element => element.checkCollisionsPlayer(temp, this.y) === false)){
        this.walk = true;
        this.x = temp;
      }
    }

    if (p.keyIsDown(p.UP_ARROW) && this.y > 0 + this.diameter / 2 ) {
      let temp = this.y - 1;
      if (walls.every(element => element.checkCollisionsPlayer(this.x, temp) === false)){
        this.walk = true;
        this.y = temp;
      }
    }

    if (p.keyIsDown(p.DOWN_ARROW)  && this.y < HEIGHT - this.diameter / 2 ) {
      let temp = this.y + 1;
      if (walls.every(element => element.checkCollisionsPlayer(this.x, temp) === false)){
        this.walk = true;
        this.y = temp;
      }
    }
    this.draw();
  }

  draw(){
    //fill(255,255,255)
    this.w = 16;
    this.radius = 10;  //raggio angoli rect
    this.xBody = this.x-this.w/2;
    this.yBody = this.y-this.w/2;
    this.xHead = this.x;
    this.yHead = this.y-this.w/2;

    p.fill(this.color);
    p.stroke(this.color);
    p.rect(this.xBody, this.yBody, this.w, this.w-this.w/7,this.radius);
    // testa
    p.circle(this.xHead, this.yHead,this.w);

    // gambe partenza // walk cycle
    if( (this.i  >= 0 && this.i< p.frameRate()/4) || (this.i  > 2*p.frameRate()/4 && this.i < 3*p.frameRate()/4) || (this.walk == false)){
      //console.log('0')
      p.rect(this.xBody, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
      p.rect(this.xBody+this.w-this.w/4, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
     } else if(this.i  >= p.frameRate()/4 && this.i <= 2*p.frameRate()/4){
      //console.log('-1')
      p.rect(this.xBody, this.yBody+this.w/2, this.w/4, this.w/1.5-this.w/8,this.radius);
      p.rect(this.xBody+this.w-this.w/4, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
    } else if(this.i >= 3*p.frameRate()/4){
      //console.log('1')
      p.rect(this.xBody, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
      p.rect(this.xBody+this.w-this.w/4, this.yBody+this.w/2, this.w/4, this.w/1.5-this.w/8,this.radius);
    }
    // walk cycle

    //fill(255,255,255);

    //circle(this.xHead-this.w/6, this.yHead-this.w/5,this.w/3);
    //circle(this.xHead+this.w/6, this.yHead-this.w/5,this.w/3);
    //console.log(this.dir)

    // occhi
    p.stroke(0);
    let dir = Number.parseFloat(this.dir);
    let x_sx = p.cos(dir+p.PI/6);
    let y_sx = p.sin(dir+p.PI/6);
    let x_dx = p.cos(dir-p.PI/6);
    let y_dx = p.sin(dir-p.PI/6);
    if(y_sx <= 0){p.fill(155,155,155);}
    else{p.fill(255,255,255);}
    //console.log(x_sx, y_sx)
    p.circle(this.xHead+x_sx*this.w/2, this.yHead+(1/2)*(y_sx*this.w/2),this.w/3);
    if(y_dx <= 0){p.fill(155,155,155);}
    else{p.fill(255,255,255);}
    p.circle(this.xHead+x_dx*this.w/2, this.yHead+(1/2)*(y_dx*this.w/2),this.w/3);
  }

  getPosition(){
    return {x: this.x, y:this.y};
  }

  getDirection(){
    let dir = Number.parseFloat(this.dir).toFixed(2);
    //console.log(dir);
    return dir;
  }


}

class Enemy extends Player{
  constructor(x,y,color,id){
    super(x,y,color)
    this.id = id;
  }
  update(){
    if(this.i > p.frameRate()){ this.i  = 0; }
    else{ this.i ++; }
    this.draw();
  }
  updatePosition(x,y){
    this.x = x;
    this.y = y;
  }
  updateDirection(dir){
    this.dir = dir;
  }
  getID(){
    return this.id;
  }
  toggleWalk(){
    this.walk = !this.walk;
  }

}

} //fine del mondo
