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

 const NUM_MINE = 20;
 const NUM_CRISTALLI = 1;//35
 const NUM_MAGIC_CRYSTAL = 1;
 const MINE_DISTANCE = 80;   //distanza entro cui inizio a sentire mina
 const PPS = 80; //player personal space entro cui non compaiono oggetti

 const CRYSTAL = 100;        //punti per un cristallo
 const EXPLOSION = 200;      //punti in meno per un'esplosione
 const MAGIC_CRYSTAL = 1000; //punti per un cristallo magico
 const MAGIC_CRYSTAL_SD = 250; //cristallo verde "sound distance" a cui inizio a sentirlo
 const MAGIC_CRYSTAL_VD = 80; //cristallo verde "view distance" a cui inizio a vederlo

 let sketch = function(p) {

  /* preload dei suoni e delle immagini *********************/
  let mine_sound_array = [];
  let walls_imgs = [];
  let crystal_sound, crystal_img, skull_img;

  p.preload = function(){

    //suoni
      p.soundFormats('mp3', 'ogg');
      var man_num_mine = 0;

      if(type == 'SinglePlayer'){
        man_num_mine = NUM_MINE;
      }
      else if(type == 'MultiPlayer'){
        man_num_mine = gameState.mines.length;
      }

      for(var i=0; i < man_num_mine; i++){mine_sound_array[i] = p.loadSound('sounds/bip')};
      crystal_sound = p.loadSound('sounds/crystal');
      walk_sound = p.loadSound('sounds/walk');
      glitter_sound_filter = p.loadSound('sounds/Green_Crystal_Sound_FILTERED.mp3');
      glitter_sound_nofilter = p.loadSound('sounds/Green_Crystal_Sound_NOT_FILTERED.mp3');
      background_sound = p.loadSound('sounds/background_mines.mp3');
      console.log('Loaded these sounds: ', mine_sound_array, crystal_sound,
                                          walk_sound, background_sound);

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
    this.gameframes = new GameFrames();  //cornice
  }

  update(){
    this.gameframes.update(WIDTH, HEIGHT);   //cornice
    this.walls.forEach(function(wall){wall.updateWall(); })
    this.mines.forEach(function(mine){mine.updateMine(); })
    this.crystals.forEach(function(crystal){crystal.updateCrystal(); })
    this.enemy.forEach(function(enemy){enemy.update(); })
    this.p.update(this.walls);  //per ultimo così viene disegnato sopra a tutto

    this.crystalEvent.status = false;  //flag che dice se è successo un evento

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

  EndGameProcedure(){    //stoppa i suoni
      for(let i=0; i<NUM_MINE; i++){
        let suono = mine_sound_array[i];
        suono.stop();
      }
      walk_sound.stop();
      background_sound.stop();
      glitter_sound_filter.stop();
      glitter_sound_nofilter.stop();

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
    this.p = new Player(p.width/2,580,'#0077ff');
    let objects = this.createObjects(NUM_MINE + NUM_CRISTALLI + 3, this.walls, this.p.x, this.p.y);
    this.mines = objects.mines;
    this.crystals = objects.crystals;

    //per il cristallo magico scelgo una posizione abbastanza lontana da giocatore (da una lista di 3 possibilità)
    let temp = objects.magic_crystal_possibilities.find(e => e.y < HEIGHT*0.8 );
    this.magic_crystal = new MagicCrystal(temp.x, temp.y);

    //creo set di muri vicino a cristallo verde (per la funzione visibilità attraverso muri)
    this.magic_crystal_area = this.magicCrystalArea(this.magic_crystal, this.walls);

    this.s = new SoundLogic(1);   //il valore 1 serve per dire alla sound logic di creare anche le cose riguardanti il cristallo magico

    console.log('creati questi oggetti: mine: ', this.mines,
                'cristalli: ',                   this.crystals,
                'walls: ',                       this.walls,
                'magic crystal: ',               this.magic_crystal);
  }

  update(){

    //update relativi solo al cristallo magico
    if(this.magic_crystal.checkEatCrystal(this.p.x, this.p.y)){
      this.playerScore += MAGIC_CRYSTAL;
      this.s.crystalSound();
    };
    this.magic_crystal.updateMagicCrystal(this.p.x, this.p.y, this.magic_crystal.x, this.magic_crystal.y, this.magic_crystal_area);

    //tutti gli altri update
    super.update();

    //update sound Logic
    this.s.updateSingle(this.p, this.mines, this.magic_crystal);

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

  createObjects(numObj, walls, p_x, p_y){
    let mines = [];
    let crystals = [];
    let magic_crystal_possibilities = [];
    let x_r, y_r;
    let temp = [];
    let approvati = [];

    for (var i = 0; i < numObj; i++){
      //creo delle coordinate ipotetiche : min + Math.floor(Math.random() * max / step) * step;
      x_r = LATO + Math.floor(Math.random() *(p.width - LATO*1.5) / 50)* 50;
      y_r = LATO + Math.floor(Math.random() *(p.height - LATO * 1.5)/ 50)* 50;

      //controllo che 1) no su muri, 2) a distanza da player, 3) non sovrapposti
      while (checkEveryWall(walls, x_r, y_r).some(e => e === true) ||
             ((x_r <= p_x + PPS) && (x_r > p_x - PPS) && (y_r <= p_y + PPS) && (y_r > p_y - PPS)) ||
             approvati.some(e => (e.x == x_r) && (e.y == y_r))) {

        x_r = LATO + Math.floor(Math.random() *(p.width - LATO * 1.5) / 50)* 50;
        y_r = LATO + Math.floor(Math.random() *(p.height - LATO * 1.5)/ 50)* 50;
      }
      approvati[i] = {x: x_r, y: y_r};

      //quando vanno bene piazziamole negli array
      if(i < NUM_MINE ){
        mines[i] = new Mine(x_r, y_r)
      } else if(i >= NUM_MINE && i < (numObj-3)) {
        crystals[ i- (NUM_MINE) ] = new Crystal(x_r, y_r)
      } else {
        magic_crystal_possibilities[i - NUM_MINE - NUM_CRISTALLI] = {x: x_r, y: y_r}
      }
    } //end of for loop

    return {mines, crystals, magic_crystal_possibilities};

    function checkEveryWall(walls, x_r, y_r){
      for (var i = 0; i < walls.length; i++){
        temp[i] = walls[i].checkOverlapPlayer(x_r,y_r);
      }
      return temp;   //array di true and false
    }

  } //end of createObjects()

  magicCrystalArea(crystal, walls){  //trova i muri vicini al cristallo magico
    let temp = walls.filter( e => ((e.x <= crystal.x + MAGIC_CRYSTAL_SD && e.x > crystal.x - MAGIC_CRYSTAL_SD) &&
                        (e.y <= crystal.y + MAGIC_CRYSTAL_SD && e.y > crystal.y - MAGIC_CRYSTAL_SD)))
    return temp;
  }

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
    this.s = new SoundLogic(0);   //0 dice di non creare anche le cose riguardanti il cristallo magico

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
    this.s.updateMulti(this.p, this.mines);

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

  constructor(value) {
    this.interval = 1;  //per loop mine

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

    //SUONO SOTTOFONDO MINIERA
    background_sound.setVolume(0.3);
    background_sound.loop();

    if(value){
      console.log('creo cose audio cristallo verde')
      //se questo value è true allora creo anche cose riguardanti cristallo verde:

      glitter_sound_filter.setVolume(0);
      glitter_sound_nofilter.setVolume(0);
      glitter_sound_filter.loop();
      glitter_sound_nofilter.loop();
    }
  };

  //update per single con cristallo magico *******************************************
  updateSingle(player, mines, magic_crystal){

     // SUONI DELLE MINE
     for (var i=0; i<mines.length; i++){
      //...calcolo distanza dal player
      let dist = p.dist(player.x, player.y, mines[i].x, mines[i].y);

      if( dist <= MINE_DISTANCE && mines[i].exploded === false) {

        //se sono abbastanza vicino calcolo il volume e il panning
        let temp = Math.sqrt(dist / MINE_DISTANCE);  //calcolo distanza normalizzata etc
        let temp1 = 0.9 * (1-temp);
        let rate = p.map(temp1, 0.001, 0.27, 0.7, 1.3)

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

      if(magic_crystal.hearable===true && magic_crystal.filter===true && magic_crystal.eaten===false){
       //se sono nel range ed è dietro a un muro... e non è stato mangiato
      console.log('filtrato')
      let dist = p.dist(player.x, player.y, magic_crystal.x, magic_crystal.y);
      let temp = Math.sqrt(dist / MAGIC_CRYSTAL_SD);
      let volume = 0.3 * (1-(0.8*temp));

      glitter_sound_filter.setVolume(volume);
      glitter_sound_nofilter.setVolume(0);


     } else if (magic_crystal.hearable===true && magic_crystal.filter===false && magic_crystal.eaten===false){
       //se sono nel range e NON è dietro a un muro... e non è stato mangiato
      console.log('non filtrato')
      let dist = p.dist(player.x, player.y, magic_crystal.x, magic_crystal.y);
      let temp = Math.sqrt(dist / MAGIC_CRYSTAL_SD);
      let volume = 0.3 * (1-(0.8*temp));

      glitter_sound_nofilter.setVolume(volume);
      glitter_sound_filter.setVolume(0);

     } else {
      glitter_sound_filter.setVolume(0);
      glitter_sound_nofilter.setVolume(0);
     }

     //SUONO DELLA CAMMINATA
     if(player.walk === true){
       walk_sound.setVolume(0.7);
     } else {
       walk_sound.setVolume(0);
     }

  }

  //update per multi ************************************************
  updateMulti(player, mines){
    // SUONI DELLE MINE

    for (var i=0; i<mines.length; i++){
      //...calcolo distanza dal player
      let dist = p.dist(player.x, player.y, mines[i].x, mines[i].y);

      if( dist <= MINE_DISTANCE && mines[i].exploded === false) {

        //se sono abbastanza vicino calcolo il volume e il panning
        let temp = Math.sqrt(dist / MINE_DISTANCE);  //calcolo distanza normalizzata etc
        let temp1 = 0.9 * (1-temp);
        let rate = p.map(temp1, 0.001, 0.27, 0.7, 1.3)

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

  crystalSound() { //per single e multi
    crystal_sound.setVolume(0.4);
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
    if (this.checkOverlapPlayer(playerX, playerY)){
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
    this.color = p.color(25,26,27);
    //per mettere le mine rosse:
    //this.color = p.color(204,0,0);  //di default è rossa (in realtà nera)
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
    p.stroke(this.color);
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
    this.found = false;    //verifica se è molto vicino ( e quindi compare l'icona del cristallo)
    this.hearable = false; //verifica se posso sentirlo filtrato
    this.filter = true;    //di default lo sento filtrato perchè c'è un muro
  }

  drawInvisibleCrystal(){
    p.stroke(p.color(25,26,27));
    p.fill(p.color(25,26,27));
    p.circle(this.x, this.y, 1.5 * RAGGIO_C);
  }

  drawFoundCrystal(){
    p.image(magic_crystal_img, this.x-RAGGIO_M, this.y-RAGGIO_M, 25, 23);
  }

  checkDistanceCrystal(playerX, playerY){

    if(this.eaten == false){   // verifico che non sia già stato mangiato

      var dx = (this.x + RAGGIO_P) - (playerX + RAGGIO_C);
      var dy = (this.y + RAGGIO_P) - (playerY + RAGGIO_C);
      var distance = Math.sqrt(dx * dx + dy * dy);

      if(distance < MAGIC_CRYSTAL_SD && distance > MAGIC_CRYSTAL_VD){
        this.hearable = true;
        this.found = false;
      } else if(distance <= MAGIC_CRYSTAL_VD) {
        this.found = true;
        this.hearable = true;
      } else {
        this.hearable = false;
        this.found = false;
        return;
      }
    }
 }

 checkWallsCrystal(playerX, playerY, crystalX, crystalY, list){
  //passo coordinate del player e del cristallo verde + lista muri vicino cristallo verde

  if (this.hearable === true && this.eaten === false){   //verifico di essere nel range

    let a = playerX;
    let b = playerY;
    let c = crystalX;
    let d = crystalY;
    this.checks = [];  //array dove mettere i true/false delle intersezioni coi muri

    for(var i=0; i < list.length; i++){  //...per ogni muro della lista....
     //lato superiore
     let cond1 = intersects(a,b,c,d, list[i].x, list[i].y, list[i].x + LATO, list[i].y );

     //lato inferiore
     let cond2 = intersects(a,b,c,d, list[i].x, list[i].y + LATO, list[i].x + LATO, list[i].y + LATO );

     //lato sinistro
     let cond3 = intersects(a,b,c,d, list[i].x, list[i].y, list[i].x, list[i].y + LATO );

     //lato destro
     let cond4 = intersects(a,b,c,d, list[i].x + LATO, list[i].y, list[i].x + LATO, list[i].y + LATO );

     if(cond1 === true || cond2 === true || cond3 === true || cond4 === true){
       this.checks[i] = false;   //ho almeno un'intersezione! quindi non lo vedo
     } else {
       this.checks[i] = true;    //lo posso vedere
     }

    }
    if (this.checks.every(e => e === true)){
       this.filter = false;
       console.log('NO muro :D')
     } else {
       this.filter = true;
       console.log('muro!')
     }
   } else {
     return
   };

   //returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
   function intersects(a,b,c,d,p,q,r,s){
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);  //this means intersection
      }
    };
  }


 updateMagicCrystal(playerX, playerY, crystalX, crystalY, list){
   //1) fa il check della distanza, del "trovato" e del  "posso sentirlo" (check del "mangiato" già fatto da Game Logic)
   //2) fa il check dell'effettiva "sentibilità" attraverso i muri
   this.checkDistanceCrystal(playerX, playerY);
   this.checkWallsCrystal(playerX, playerY, crystalX, crystalY, list)

   //check per grafica
  if(this.eaten == false && this.found == false){
    this.drawInvisibleCrystal();   //non trovato, non mangiato
  } else if(this.found == true && this.eaten == false ) {
    this.drawFoundCrystal();   //trovato, non mangiato
  } else if(this.found == true && this.eaten == true){
    this.drawInvisibleCrystal();   //trovato e mangiato
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
    p.textSize(60);
    p.textAlign(p.CENTER);
    p.textStyle(p.BOLD);
    p.text('GAME OVER', this.x, this.y);
  }
 }

class GameFrames {
   constructor(){
    this.border = 5;  //px
   }
   update(width, height){
    p.fill(p.color(159,129,105));
    p.rect(0, 0, this.border, height );
    p.rect(0, 0, width, this.border );
    p.rect(width-this.border, 0, this.border, height );
    p.rect(0, height-this.border, width, this.border );
   }
 }

}
// FINE
