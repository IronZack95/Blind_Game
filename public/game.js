
let sketch = function(p) {

  let skull; //images...
  let mine_S, crystal_S;  //sounds....

  p.preload = function(){
    mine_S = p.loadSound('sounds/mine.mp3');
    crystal_S = p.loadSound('sounds/crystal.mp3')
    //other sounds....
    console.log('sounds loaded')
  }

  /*************************************/

  p.setup = function() {

    p.createCanvas(800, 600);
    p.background(153);
    g = new GameLogic();

    skull = p.loadImage('images/skull-40.png')   //provvisoria, TEST

  }

  p.draw = function() {
    p.clear();
    p.background(64,64,64);
    g.update();

    p.image(skull, 200, p.height/2, 20,20)   //provvisoria, TEST
  }

  /*
  function mousePressed() {
    song.play();
  }
  */
  /*************************************/

  class GameLogic{
    constructor(){
      this.p = new Player(p.width / 2, p.height -50);
      this.m = new Mine(p.width/8, p.height/8);
      this.mineList = [];
      /*
      for(var i=0;i<4;i++){
        this.mineList[i] = new Mine(random[0,width],random[0,height]);
      }
      */

      this.c = new Crystal(p.width-300, p.height-220);
      //this.a = new Audio();
    }
    update(){
      this.p.update();
      this.m.update();
      this.c.update();
      //this.a.update();
      //console.log("x: "+mouseX+" y: "+mouseY);
    }

    volume_DistancefromMine() {
      let mineVolume;
      let mineDistance = p.dist(this.p.x, this.p.y, this.m.x, this.m.y );

      if (mineDistance>=300){ //300 è arbitrario, è la distanza entro la quale inizio a sentire la mina
        return mineVolume = 0;
      } else {   //sotto 300 la sento...
        let normMineDistance = p.sqrt(  mineDistance /  (300));   //nuova normalizzazione esponenziale
        let mineVolume = 0.7 * (1 - normMineDistance);
        return mineVolume;
      }}

    volume_DistancefromCrystal() {
      let crystalVolume;
      let crystalDistance = p.dist(this.p.x, this.p.y, this.c.x, this.c.y );

      if (crystalDistance>200){ //200 è arbitrario, è la distanza entro la quale inizio a sentire la mina
        return crystalVolume = 0;
      } else {   //sotto 200 lo sento...
        let normCrystalDistance = p.sqrt(  crystalDistance /  (200));   //nuova normalizzazione esponenziale
        let crystalVolume = 0.7 * (1 - normCrystalDistance);
        return crystalVolume;
     }}
  }

  class GameLogicMulti extends GameLogic{
    //metodi che cambiano
    constructor(p,m,c){

    }
  }

  class Audio{
    constructor(p,listamine,listacristalli){

    }
    update(){

    }

  }


  class Player{

    constructor(x_start, y_start){
      this.v = p.createVector(p.width / 2, p.height / 2);
      this.diameter = 20;
      this.x = x_start;
      this.y = y_start;
    }

    update(){

      // update direction
      this.v.x = p.cos(2*p.PI*(p.mouseX+p.width/2)/ p.width);
      this.v.y = p.sin(2*p.PI*(p.mouseX+p.width/2)/ p.width);
      //this.v.x = ((mouseX-width/2)/width);
      //this.v.y = ((mouseY-height/2)/height);
      //console.log("x: "+this.v.x+" y: "+this.v.y);

      // update position
      if (p.keyIsDown(p.LEFT_ARROW)){
        this.x -= 1;
      }if (p.keyIsDown(p.RIGHT_ARROW)){
        this.x += 1;
      }if (p.keyIsDown(p.UP_ARROW)){
        this.y -= 1;
      }if (p.keyIsDown(p.DOWN_ARROW)){
         this.y += 1;
     }

     //panning e volumi
     let panning = p.map(p.mouseX, 0, p.width, -1.0, 1.0);

     mine_S.pan(panning);
     mine_S.setVolume(g.volume_DistancefromMine());
     crystal_S.pan(panning);
     crystal_S.setVolume(g.volume_DistancefromCrystal());

     //console.log(mouseX);
     this.drawPlayer();
    }

    drawPlayer(){
      p.fill(p.color(255, 255, 255));
      p.circle(this.x, this.y, 20);
      p.line(this.x, this.y,   this.x+this.diameter/2*this.v.x, this.y+this.diameter/2*this.v.y);
    }
  }

  class Mine{
    constructor(x,y){
      setInterval(function(){mine_S.play();},1000);
      this.x = x;
      this.y = y;
    }

    update(){
      this.drawMine();
    }

    drawMine(){
      p.fill(p.color(0, 0, 255));
      p.rect(this.x, this.y, 60, 60);
    }
  }

  class Crystal{
    constructor(x,y){
      setInterval(function(){crystal_S.play();},1000);
      this.x = x;
      this.y = y;
    }

    update(){
      this.drawCrystal();
    }

    drawCrystal(){
      p.fill(p.color(153, 255, 255));
      p.rect(this.x, this.y, 30,30);
    }
  }


}
