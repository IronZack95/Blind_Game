let i = 0;
let walk = false;

function setup() {
  createCanvas(400, 400);
  background(220);
  p = new Players(width/2,height/2);  
}

function draw() {
  clear();
  
  if(i>frameRate()){ i=0;}
  else{i++;}
  
  walk = false;
   let dir = (2*PI*winMouseX/windowWidth);  //tra 0 e 1
  if(dir <= 2*PI && dir > 0){p.dir = dir;}
  
  background(220);
  if (keyIsDown(LEFT_ARROW)) {
    p.x -= 1;
    walk = true;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    p.x += 1;
    walk = true;
  }

  if (keyIsDown(UP_ARROW)) {
    p.y -= 1;
    walk = true;
  }

  if (keyIsDown(DOWN_ARROW)) {
    p.y += 1;
    walk = true;
  }
  p.update();
}

class Players{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.dir = 0;
  }
  
  update(){
    //fill(255,255,255)
    fill(0,0,0);
    this.w = 30;
    this.radius = 10;
    this.xBody = this.x-this.w/2;
    this.yBody = this.y-this.w/2;
    this.xHead = this.x;
    this.yHead = this.y-this.w/2;
    rect(this.xBody, this.yBody, this.w, this.w-this.w/7,this.radius);
    // testa
    circle(this.xHead, this.yHead,this.w);
    
    // gambe partenza // walk cycle
    if( (i >= 0 && i< frameRate()/4) || (i > 2*frameRate()/4 && i< 3*frameRate()/4) || (walk == false)){
      //console.log('0')
      rect(this.xBody, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
      rect(this.xBody+this.w-this.w/4, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
    }else if( i >=frameRate()/4 && i<= 2*frameRate()/4){
      //console.log('-1')
      rect(this.xBody, this.yBody+this.w/2, this.w/4, this.w/1.5-this.w/8,this.radius);
      rect(this.xBody+this.w-this.w/4, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
    }else if(i>=3*frameRate()/4){
      //console.log('1')
      rect(this.xBody, this.yBody+this.w/2, this.w/4, this.w/1.5,this.radius);
      rect(this.xBody+this.w-this.w/4, this.yBody+this.w/2, this.w/4, this.w/1.5-this.w/8,this.radius);
    }
    // walk cycle
    
    //fill(255,255,255);
 
    //circle(this.xHead-this.w/6, this.yHead-this.w/5,this.w/3);
    //circle(this.xHead+this.w/6, this.yHead-this.w/5,this.w/3);
    //console.log(this.dir)
    
    // occhi
    let x_sx = cos(this.dir+PI/6);
    let y_sx = sin(this.dir+PI/6);
    let x_dx = cos(this.dir-PI/6);
    let y_dx = sin(this.dir-PI/6);
    if(y_sx <= 0){fill(155,155,155);}
    else{fill(255,255,255);}
    //console.log(x_sx, y_sx)
    circle(this.xHead+x_sx*this.w/2, this.yHead+(1/2)*(y_sx*this.w/2),this.w/3);
    if(y_dx <= 0){fill(155,155,155);}
    else{fill(255,255,255);}
    circle(this.xHead+x_dx*this.w/2, this.yHead+(1/2)*(y_dx*this.w/2),this.w/3);

  }
}
