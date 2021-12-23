 const WIDTH = 1200;        //...del canvas
 const HEIGHT = 600;        //...del canvas
 const LATO = 40;           //lato dei quadrati che formano i muri random
 const RAGGIO_P = 12;       //raggio del giocatore
 const RAGGIO_C = 10;       //raggio cristalli
 const RAGGIO_M = 5;        //raggio mine

 // per Perlin
 const GRID_SIZE = Math.floor(WIDTH/LATO); //10 griglia
 const RESOLUTION = 2; //2 ogni box contiente RESOLUTION X RESOLUTION muri dentro la griglia
 const THRESHOLD = 100000;

 const NUM_MINE = 30;
 const NUM_CRISTALLI = 1;//35
 const NUM_MAGIC_CRYSTAL = 1;
 const MINE_DISTANCE = 80;   //distanza entro cui inizio a sentire mina

 const CRYSTAL = 100;        //punti per un cristallo
 const EXPLOSION = 200;      //punti in meno per un'esplosione
 const MAGIC_CRYSTAL = 1000; //punti per un cristallo magico
 const MAGIC_CRYSTAL_DISTANCE = 350; //distanza a cui inizio a sentire suono filtrato

 let sketch = function(p) {

  /* preload dei suoni e delle immagini *********************/
  let mine_sound_array = [];
  let walls_imgs = [];
  let background_imgs = [];
  let crystal_sound, crystal_img, skull_img;

  p.preload = function(){
      //suoni
      p.soundFormats('mp3', 'ogg');
      //for(var i=0; i < NUM_MINE; i++){mine_sound_array[i] = p.loadSound('sounds/mine_sonar')};
      for(var i=0; i < NUM_MINE; i++){mine_sound_array[i] = p.loadSound('sounds/bip')};
      crystal_sound = p.loadSound('sounds/crystal');
      walk_sound = p.loadSound('sounds/walk');
      carillon_sound = p.loadSound('sounds/BackgroundMusic.mp3')
      console.log('Loaded these sounds: ', mine_sound_array, crystal_sound, walk_sound);
      //immagini
      crystal_img = p.loadImage('images/crystal.png');
      magic_crystal_img = p.loadImage('images/magic_crystal.png');
      skull_img = p.loadImage('images/skull.png');
      for(var i = 0; i<6; i++){let e = p.loadImage('images/walls/1.png'); walls_imgs.push(e)};
      walls_imgs.push(p.loadImage('images/walls/2.png'));
      walls_imgs.push(p.loadImage('images/walls/3.png'));
      walls_imgs.push(p.loadImage('images/walls/4.png'));

    };

/**********************************************************/

  p.setup = function() {
    if(type == 'SinglePlayer'){g = new GameLogicSingle(WIDTH,HEIGHT);}
    else if(type == 'MultiPlayer'){g = new GameLogicMulti(gameState);}
  }

  p.draw = function() {
    p.clear();
    p.background(p.color(25,26,27));
    g.update();
  }

/**********************************************************/

class GameLogic{
  constructor(){
    this.playerScore = 0;
    this.lastPlayerScore = this.playerScore;
    this.walls = [];
    this.mines = [];
    this.crystalEvent = {status: false, index: null};
    this.mineEvent = {status: false, index: null};   //flag che comunicano che è successo un evento
    this.crystals = [];
    this.room = null;
    this.p = null;
    this.enemy = [];
    this.ctx =  p.createCanvas(WIDTH, HEIGHT);
    this.s = null;
    this.gameOver = new GameOver();
    this.startGameTime = Date.now(); //per timer
    this.timer = 0; //per timer
    this.i = 0; //per timer
    this.gamebackground = new GameBackground(WIDTH, HEIGHT);
  }

  update(){
    this.gamebackground.update(WIDTH, HEIGHT);
    this.walls.forEach(function(wall){wall.updateWall(); })
    this.mines.forEach(function(mine){mine.updateMine(); })
    this.crystals.forEach(function(crystal){crystal.updateCrystal(); })
    this.enemy.forEach(function(enemy){enemy.update(); })
    this.p.update(this.walls);  //per ultimo così viene disegnato sopra a tutto

    this.crystalEvent.status = false;  //flag che dice se è successo un evento
    //check mangiato cristallo + modifica punteggio (SINGLE PLAYER)
    for(var i = 0; i < this.crystals.length; i++) {
      if( this.crystals[i].checkEatCrystal(this.p.x, this.p.y)){
        this.playerScore += CRYSTAL;
        this.crystalEvent.status = true;
        this.crystalEvent.index = i;
        this.s.crystalSound();
      }; }

    this.mineEvent.status = false;    //flag che dice se è successo un evento
    //check esploso su mina + modifica punteggio
    for(var i = 0; i < this.mines.length; i++) {
      if( this.mines[i].checkExplosion(this.p.x, this.p.y)) {
        this.playerScore -= EXPLOSION;
        this.mineEvent.status = true;
        this.mineEvent.index = i;

      }; }
      //console.log(this.crystalEvent)


    this.updateScore();
    this.updateTimer();
  }

  updateScore(){
    if(this.playerScore != this.lastPlayerScore){
      document.getElementById('counter').innerHTML = this.playerScore;
      this.lastPlayerScore = this.playerScore;
    }
  }

  updateTimer(){
    this.i++;
    let now = Date.now();
    let temp = ((now - this.startGameTime)/ 1000).toFixed(1);

    if(this.i%10 == 0){
      document.getElementById('timer').innerHTML = temp;
      this.timer = temp;
    }
  }

  EndGameProcedure(){    //stoppa i suoni del player e delle mine
      for(let i=0; i<NUM_MINE; i++){
        let suono = mine_sound_array[i];
        suono.stop();
      }
      walk_sound.stop();

      //fermo il player
      this.p.stopWalk();

      //chiamo il testo GAME OVER
      this.gameOver.update();
      // fermo il loop dell'update
      p.noLoop();}
    // subordino il resto alle classi figlie
} //fine GameLogic() superclass

class GameLogicSingle extends GameLogic{

  constructor(width, height){
    super(width,height);

    let perlin_map = new Perlin_Map(GRID_SIZE,RESOLUTION,THRESHOLD);
    this.walls = this.createWalls(perlin_map, this.p);

    let objects = this.createObjects(NUM_MINE + NUM_CRISTALLI + NUM_MAGIC_CRYSTAL, this.walls);
    this.mines = objects.mines;
    this.crystals = objects.crystals;
    this.magic_crystals = objects.magic_crystals;
    this.p = new Player(p.width/2,580,'#0077ff');
    this.s = new SoundLogic();

    console.log('creati questi oggetti: mine: ', this.mines,
                'cristalli: ',                   this.crystals,
                'walls: ',                       this.walls,
                'magic crystals: ',              this.magic_crystals);
  }

  update(){
    super.update();
    this.s.update(this.p, this.mines, this.magic_crystals);

    //questione cristallo magico:
    this.magic_crystals.forEach(function(magic_crystal){magic_crystal.updateCrystal(); })
    //check cristallo magico:
    for(var i = 0; i < this.magic_crystals.length; i++) {
      if( this.magic_crystals[i].checkEatCrystal(this.p.x, this.p.y)){
        this.playerScore += MAGIC_CRYSTAL;
        //this.crystalEvent.status = true;
        //this.crystalEvent.index = i;
        //this.s.crystalSound();
      }; }

    // verifico il fine partita;
    this.checkEndGame();
  }

  //CREAZIONE MURI RANDOM
  createWalls(map){
    let walls=[];
    //console.log(map);
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

  createObjects(numObj, walls){
    let mines = [];
    let crystals = [];
    let magic_crystals = [];
    let x_r, y_r;
    let temp = [];
    let approvati = [];

    for (var i = 0; i < numObj; i++){
      //creo delle coordinate ipotetiche
      //min + Math.floor(Math.random() * max / step) * step;
      x_r = LATO + Math.floor(Math.random() *(p.width - LATO*1.5) / 50)* 50;
      y_r = LATO + Math.floor(Math.random() *(p.height - LATO * 1.5)/ 50)* 50;

      //finchè cadono su muri o giocatore ricalcoliamole
      while (checkEveryWall(walls, x_r, y_r).some(e => e === true) ||
             approvati.some(e => (e.x == x_r) && (e.y == y_r))) {
        console.log('oops');
        x_r = LATO + Math.floor(Math.random() *(p.width - LATO*1.5) / 50)* 50;
        y_r = LATO + Math.floor(Math.random() *(p.height - LATO * 1.5)/ 50)* 50;
      }
      approvati[i] = {x: x_r, y: y_r};

      //quando vanno bene piazziamole negli array
      if(i < NUM_MINE ){
        mines[i] = new Mine(x_r, y_r)
      } else if(i >= NUM_MINE && i < (numObj-1)) {
        crystals[ i- (NUM_MINE) ] = new Crystal(x_r, y_r)
      } else {
        magic_crystals[i - NUM_MINE - NUM_CRISTALLI] = new MagicCrystal(x_r, y_r)
      }
    } //end of for loop

    return {mines, crystals, magic_crystals};

    function checkEveryWall(walls, x_r, y_r){
      for (var i = 0; i < walls.length; i++){
        temp[i] = walls[i].checkOverlapPlayer(x_r,y_r);
      }
      return temp;   //array di true and false
    }

} //end of createObjects()

  checkEndGame(){
    if(this.crystals.some(e => e.eaten === false)){
      return;
    } else if(this.crystals.every(e => e.eaten === true)) {
      super.EndGameProcedure();
      let score = this.playerScore;
      let timer = this.timer;
      setTimeout(function(){pagina = new EndGameSingle(playerName, score, timer); p.remove();}, 3000);
    };
  }
} // end of GameLogic

class GameLogicMulti extends GameLogic{

  constructor(state){
    super(state.canvas.width, state.canvas.height);
    this.room = state.room;
    this.walls = this.createWalls(state.walls);
    this.mines = this.createMines(state.mines);
    this.crystals = this.createCrystals(state.crystals);
    this.startGameTime = state.startTime;
    this.s = new SoundLogic();

    state.players.forEach((item, i) => {
      if(state.myid == item.id){this.p = new Player(item.position.x,item.position.y,item.color);}
      else{this.enemy.push(new Enemy(item.position.x,item.position.y,item.color,item.id))}
    });

    //creo gli oggetti trasmittente e ricevente
    this.t = new Transmit(this.p,this.enemy,this.crystals,this.mines);
    this.r = new Recive(this.p,this.enemy,this.crystals,this.mines);

    console.log('creati questi oggetti: mine: ', this.mines, 'cristalli: ',this.crystals, 'walls: ',this.walls);

  }

  update(){
    this.t.transmitPosition();
    this.t.transmitDirection();
    super.update();
    this.s.update(this.p, this.mines);
    // verifico il fine partita
    let result = this.r.endGame();
    if(result != null){ this.checkEndGame(result)}

    let score = this.playerScore;
    if(this.crystalEvent.status == true){
      this.t.transmitEaten(this.crystalEvent.index,this.room,score);
      this.crystalEvent.status = false;
    }
    if(this.mineEvent.status == true){
      this.t.transmitExplosion(this.mineEvent.index,this.room,score);
      this.mineEvent.status = false;
    }
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

  checkEndGame(msg){
    super.EndGameProcedure();
    let name = msg.name;
    let score = msg.score;
    let timer = msg.timer;
    setTimeout(function(){pagina = new EndGameMulti(name, score, timer); p.remove();}, 3000);
  }

} //end of GameLogicMulti

class SoundLogic {

  constructor() {
    this.interval = 1;

    //MINE
    for(var i=0; i<mine_sound_array.length; i++){
      let suono = mine_sound_array[i];
      suono.setVolume(0);
      suono.pan(0);
      suono.loop(2,1,1,null,this.interval);
      suono.rate(1);
    }
    //SUONO CAMMINATA
    walk_sound.setVolume(0);
    walk_sound.loop();

    //SUONO CRISTALLO MAGICO (x single)
    /* carillon_sound.setVolume(0);
    carillon_sound.loop();
    this.filter = new p5.LowPass();
    carillon_sound.connect(this.filter);
    this.freq = 300;  //Hz
    filter.freq(this.freq); */

  };

  //update per single con cristallo magico
  update(player, mines, magicCrystal){
     // SUONI DELLE MINE
     for (var i=0; i<mines.length; i++){
      //...calcolo distanza dal player
      let dist = p.dist(player.x, player.y, mines[i].x, mines[i].y);

      if( dist <= MINE_DISTANCE && mines[i].exploded === false) {

        //se sono abbastanza vicino calcolo il volume e il panning
        let temp = Math.sqrt(dist / MINE_DISTANCE);  //calcolo distanza normalizzata etc
        let temp1 = 0.5 * (1-temp);
        console.log(temp1)
        let rate = p.map(temp1, 0.001, 0.27, 0.8, 2)

        //setto il volume
        let suono = mine_sound_array[i];

        //setto il rate
        suono.rate(rate)

        //setto il panning
        let v1 = p.createVector( mines[i].x-player.x+0.5,  mines[i].y-player.y-player.w/2+13.5);

        //calcolo l'angolo tra sguardo player e vettore verso mina (deg)
        let angle = p.degrees((player.v).angleBetween(v1) ) ;
        //console.log(angle)
        if (angle >= 0 && angle < 100){
          let panning = p.map(angle, 0,100, 0, 1);
          suono.pan(panning)
          suono.setVolume(temp1);
        } else if (angle < 0 && angle > -100) {  //da centro a sinistra fino a -100°
          let panning = p.map(angle, 0,-100, 0, -1)
          suono.pan(panning)
          suono.setVolume(temp1);
        } else {  //dietro (volume basso)
          suono.setVolume(temp1*0.5);
        }


        //console.log('suona la mina '+[i]+ ' at volume '+temp1);
      } else {
        let suono = mine_sound_array[i];
        suono.setVolume(0);
      }
     }

     //SUONO CRISTALLO MAGICO
    /*  for (var i=0; i<magicCrystal.length; i++){
       //...calcolo distanza dal player
      let dist = p.dist(player.x, player.y, magicCrystal[i].x, magicCrystal[i].y);

      if( dist <= MAGIC_CRYSTAL_DISTANCE && magicCrystal[i].found === false){
        let temp = Math.sqrt(dist / MINE_DISTANCE);  //calcolo distanza normalizzata etc
        let temp1 = 0.5 * (1-temp);

        let hertz = p.map(temp1, 0.001, 0.27, 20, 20000);
        this.filter.freq(hertz)   //setto frequenza

      }

     } */

     //SUONO DELLA CAMMINATA
     if(player.walk === true){
       walk_sound.setVolume(0.7);
     } else {
       walk_sound.setVolume(0);
     }

  }

  //update per multi
  update(player, mines){
    // SUONI DELLE MINE

    for (var i=0; i<mines.length; i++){
      //...calcolo distanza dal player
      let dist = p.dist(player.x, player.y, mines[i].x, mines[i].y);

      if( dist <= MINE_DISTANCE && mines[i].exploded === false) {

        //se sono abbastanza vicino calcolo il volume e il panning
        let temp = Math.sqrt(dist / MINE_DISTANCE);  //calcolo distanza normalizzata etc
        let temp1 = 0.5 * (1-temp);
        console.log(temp1)
        let rate = p.map(temp1, 0.001, 0.27, 0.8, 2)

        //setto il volume
        let suono = mine_sound_array[i];

        //setto il rate
        suono.rate(rate)

        //setto il panning
        let v1 = p.createVector( mines[i].x-player.x+0.5,  mines[i].y-player.y-player.w/2+13.5);

        //calcolo l'angolo tra sguardo player e vettore verso mina (deg)
        let angle = p.degrees((player.v).angleBetween(v1) ) ;
        //console.log(angle)
        if (angle >= 0 && angle < 100){
          let panning = p.map(angle, 0,100, 0, 1);
          suono.pan(panning)
          suono.setVolume(temp1);
        } else if (angle < 0 && angle > -100) {  //da centro a sinistra fino a -100°
          let panning = p.map(angle, 0,-100, 0, -1)
          suono.pan(panning)
          suono.setVolume(temp1);
        } else {  //dietro (volume basso)
          suono.setVolume(temp1*0.5);
        }


        //console.log('suona la mina '+[i]+ ' at volume '+temp1);
      } else {
        let suono = mine_sound_array[i];
        suono.setVolume(0);
      }
     }

     //SUONO DELLA CAMMINATA
     if(player.walk === true){
       walk_sound.setVolume(0.7);
     } else {
       walk_sound.setVolume(0);
     }

  }

  crystalSound() {
    crystal_sound.setVolume(0.5);
    crystal_sound.play();
  }
} //end of SoundLogic

class Wall{
  constructor(x,y){
      this.x = x;
      this.y = y;
      this.img = getRandomImg();

      function getRandomImg(){
        let img = walls_imgs[Math.floor(Math.random()*walls_imgs.length)];
        return img;
      }
  }

  updateWall(){
    this.drawWall();
  }

  drawWall(){
    p.image(this.img, this.x, this.y, LATO, LATO);
  }

  checkCollisionsPlayer(playerX, playerY) {
    //let playerX = giocatoreX; let playerY = giocatoreY; let player = giocatore;
    if (this.checkOverlapPlayer(playerX, playerY)){
      //console.log('OUCH!!');
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

}  //end of class Wall

class Mine{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.exploded = false;
    this.color = p.color(204,0,0);  //di default è rossa (in realtà nera)
    //per mettere le mine nere:
    //this.color = p.color(0);
  }

  getExplosion(){
    return this.exploded;
  }
  getPosition(){
    return {x:this.x,y:this.y};
  }
  setExplosion(status){
    this.exploded = status;
  }

  updateMine(){
    if(!this.exploded){this.drawMine();} else {
      p.image(skull_img, this.x-12, this.y-12, 25, 23)
    }

  }

  drawMine(){
    p.fill(this.color);
    p.circle(this.x, this.y, 2*RAGGIO_M);
  }

  checkExplosion(playerX, playerY){
    if(this.exploded == true){   // verifico che non sia già stato mangiato
            this.color = p.color(128,128,128);
    }else{
      //first it checks the collision between the two circles
      var dx = (this.x + RAGGIO_P) - (playerX + RAGGIO_M);
      var dy = (this.y + RAGGIO_P) - (playerY + RAGGIO_M);
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < RAGGIO_M + RAGGIO_P && this.exploded == false){
        console.log('sono esploso');
        this.exploded = true;   //funzionale alla singola mina
        this.color = p.color(128,128,128);
        return true;
      } else {
        return false;
      }
    }
  }
}

class Crystal{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.eaten = false;
    this.dimensions = 2*RAGGIO_C;
    //this.color = p.color(153, 255, 255);
  }

  getEaten(){
    return this.eaten;
  }

  setEaten(status){
    this.eaten = status;
  }

  getPosition(){
    return {x:this.x,y:this.y};
  }

  updateCrystal(){
    if(this.eaten == false){this.drawCrystal();}
  }

  drawCrystal(){
    p.image(crystal_img, this.x-RAGGIO_M, this.y-RAGGIO_M, 25, 23);
  }

  checkEatCrystal(playerX, playerY){
    if(this.eaten == true){   // verifico che non sia già stato mangiato
     return;
    }else{
      //first it checks the collision between the two circles
      var dx = (this.x + RAGGIO_P) - (playerX + RAGGIO_C);
      var dy = (this.y + RAGGIO_P) - (playerY + RAGGIO_C);
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < RAGGIO_C + RAGGIO_P && this.eaten == false){

        console.log('ho mangiato un cristallo');
        this.eaten = true;   //funzionale al singolo cristallo
        return true;

      } else {
        return false;
      }
    }
  }
}

class MagicCrystal extends Crystal{
  constructor(x,y){
    super(x,y);
  }

  drawInvisibleCrystal(){
    //da rendere invisibile poi...
    p.fill(p.color(0,255,0));
    p.circle(this.x, this.y, 1.5*RAGGIO_C);
  }

  drawFoundCrystal(){
    p.image(magic_crystal_img, this.x-RAGGIO_M, this.y-RAGGIO_M, 25, 23);
  }

  updateCrystal(){
    if(this.eaten == false){
      this.drawInvisibleCrystal();
    } else {
      this.drawFoundCrystal();

    }
  }

}

class Player{
  constructor(x,y,color){
    this.x = x;
    this.y = y;
    this.diameter = 2*RAGGIO_P;
    this.dir = 0;               //"dir" is used for eyes movements
    this.v = null;
    this.box_radius = RAGGIO_P; //radius used to check for collisions
    this.dead = false;          //TODO: funzione per ucciderlo
    this.walk = false;
    this.color = color;
    this.i = 0;
  }

  update(walls){
    //if(this.walk == true){
      if(this.i > p.frameRate()){ this.i = 0; }
      else{ this.i ++; }
    //}else{this.i = 0;}
    this.walk = false;
    //console.log(p.deltaTime)

    this.v = p.createVector(p.mouseX-this.x+0.5, p.mouseY-this.y-this.w/2+13.5); //vettore da centro testa a mouse
    this.dir = this.v.heading();

    //let dir =  Number.parseFloat( 2 * p.PI * p.winMouseX / p.windowWidth).toFixed(2);  //tra 0 e 1
    //if(dir <= 2 * p.PI && dir > 0){ this.dir = dir; }

    if (p.keyIsDown(/*p.LEFT_ARROW*/ 65) && this.x > 0 + this.diameter / 2 ) {
      let temp = this.x - 1;
      if (walls.every(element => element.checkCollisionsPlayer(temp, this.y) === false)){
        this.walk = true;
        this.x = temp;
      }
    }

    if (p.keyIsDown(/*p.RIGHT_ARROW*/ 68) && this.x < WIDTH - this.diameter / 2) {
      let temp = this.x + 1;
      if (walls.every(element => element.checkCollisionsPlayer(temp, this.y) === false)){
        this.walk = true;
        this.x = temp;
      }
    }

    if (p.keyIsDown(/*p.UP_ARROW*/ 87) && this.y > 0 + this.diameter / 2 ) {
      let temp = this.y - 1;
      if (walls.every(element => element.checkCollisionsPlayer(this.x, temp) === false)){
        this.walk = true;
        this.y = temp;
      }
    }

    if (p.keyIsDown(/*p.DOWN_ARROW*/ 83)  && this.y < HEIGHT - this.diameter / 2 ) {
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
    } else if(this.i  >= p.frameRate()/4 && this.i <= 2*p.frameRate()/4 && this.walk == true){
      //console.log('-1')
      p.rect(this.xBody, this.yBody+this.w/2, this.w/4, this.w/1.5-this.w/8,this.radius);
      p.rect(this.xBody+this.w-this.w/4, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
    } else if(this.i >= 3*p.frameRate()/4 && this.walk == true){
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
    let x_sx = p.cos(dir + p.PI/6);
    let y_sx = p.sin(dir + p.PI/6);
    let x_dx = p.cos(dir - p.PI/6);
    let y_dx = p.sin(dir - p.PI/6);

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

  stopWalk(){
    this.walk = false;
  }
}

class Enemy extends Player{
  constructor(x,y,color,id){
    super(x,y,color)
    this.id = id;
    this.nextX = x;
    this.nextY = y;
  }
  update(){
    if(this.nextX != this.x || this.nextY != this.y){
      if(this.i > p.frameRate()){ this.i  = 0; }
      else{ this.i ++; }
      this.walk = true;
      this.x = this.nextX;
      this.y = this.nextY;
    }else{
      this.walk = false;
      this.i = 0;
    }
    this.draw();
  }
  updatePosition(x,y){
    this.nextX = x;
    this.nextY = y;
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

class GameOver {
  constructor(timeValue){
    this.x = WIDTH/2;
    this.y = HEIGHT/2;
    this.time = timeValue;
  }

  update() {

    p.fill(p.color(255,0,0));
    p.textSize(50);
    p.textAlign(p.CENTER);
    p.text('GAME OVER', this.x, this.y);
  }
 }

 class GameBackground {
   constructor(width, height){

     let gcd = computeGCD(width, height);
     this.latoQuadrato = gcd / 6 //px
     this.righe = height / this.latoQuadrato;
     this.colonne = width / this.latoQuadrato;
     this.matrix = new Array(this.righe);
     this.border = 5;  //px

     //console.log('colonne: ', this.colonne, 'righe: ', this.righe, 'px: ', this.latoQuadrato)

     for(var i = 0; i < this.righe; i++){
       this.matrix[i] = new Array(this.colonne);
     }

     //riempio le colonne
     for(var i = 0; i < this.colonne; i++){
       for(var j = 0; j < this .righe; j++){
        this.matrix[j][i] = getRandomImg();
       }
     }

     function computeGCD(a,b){  //massimo comune divisore
      if (a == 0){return b};
      while (b != 0) {
        if (a > b){a = a - b;} else {b = b - a; return a;}
      }
    }

      function getRandomImg(){
        let img = background_imgs[Math.floor(Math.random()*background_imgs.length)];
        return img;
      }
   }

   update(width, height){
     //disegno le colonne
     //TODO : mi disegna solo metà, devo sistemare
     /* for(var i = 0; i < this.colonne; i++){
       for(var j = 0; j < this.righe; j++){
        p.image(this.matrix[j][i], j*this.latoQuadrato, [i]*this.latoQuadrato, this.latoQuadrato, this.latoQuadrato);
       }
    } */

    p.fill(p.color(159,129,105));
    p.rect(0, 0, this.border, height );
    p.rect(0, 0, width, this.border );
    p.rect(width-this.border, 0, this.border, height );
    p.rect(0, height-this.border, width, this.border );
   }
 } //fine classe background
}
// FINE
