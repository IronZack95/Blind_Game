
 const WIDTH = 800;   //del canvas
 const HEIGHT = 600;  //del canvas
 const GRID_SIZE = 8;
 const RESOLUTION = 2;
 const COLOR_SCALE = 500;
 let ctx, perlin_map, player;   //canvas e perlin

/**********************************************************/ 
  function setup(){
    ctx =  createCanvas(WIDTH, HEIGHT);
    //graphics = createGraphics(WIDTH, HEIGHT, new Perlin_Map(ctx));
    //perlin_map = new Perlin_Map(ctx);
    player = new Player(400,400);
  }

  function draw(){
    clear();
    perlin_map = new Perlin_Map(ctx);
    player.update();
  }
/**********************************************************/


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

 class Perlin_Map {
    constructor(cnvs) {
        let pixel_size = cnvs.width / RESOLUTION;
        let num_pixels = GRID_SIZE / RESOLUTION;
        let ctx = drawingContext;

        for (let y = 0; y < GRID_SIZE; y += num_pixels / GRID_SIZE){

            for (let x = 0; x < GRID_SIZE; x += num_pixels / GRID_SIZE){

                let v = parseInt(perlin.get(x, y) * COLOR_SCALE);

                //ctx.fillStyle = 'hsl(' + v + ', 100%, 25%)';
                ctx.fillStyle = 'rgb(' + v + ', 30, 30)';

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


 ///// PERLIN OBJECT ////////////////////////////////////////

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
                    //return 2*x**8 - 10*x**7 + 6*x**6;
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

                    this.memory[[x,y]] = v;

                    return v;
                }
 }

 perlin.seed();





