

class Perlin_Map{

  constructor(grid,res,threshold) {
   const COLOR_SCALE = 1000000;
   let num_pixels = grid / res;    // 5
   let perlin = new Perlin();
   //let ctx = p.drawingContext;
   let vector = [];

   for (let y = 0; y < grid; y += num_pixels / grid){    //y fino a 10 a step di 0.5
     vector[y]=[];
     for (let x = 0; x < grid; x += num_pixels/ grid){  //x fino a 10 a step di 0.5
        let v = parseInt(perlin.get(x, y) * COLOR_SCALE);
       if(v>threshold){
         vector[y][x]=true;
       }else{
          vector[y][x]=false;
       }

     }
   }
   return vector;
  }
}

// PERLIN OBJECT //
class Perlin{
  constructor(){
      this.gradients = {};
      this.memory = {};
  }

  rand_vect(){

     let theta = Math.random() * 2 * Math.PI;

     return {x: Math.cos(theta), y: Math.sin(theta)};

  }

  dot_prod_grid(x, y, vx, vy){

         let g_vect;
         let d_vect = {x: x - vx, y: y - vy};

         if (this.gradients[[vx,vy]]) {
             g_vect = this.gradients[[vx,vy]];
         } else {
             g_vect = this.rand_vect();
             this.gradients[[vx, vy]] = g_vect;
         }

     return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
  }

  smootherstep(x) {
     return 6*x**5 - 15*x**4 + 10*x**3;
     //return x - x + x;
  }

  interp(x, a, b){
     return a + this.smootherstep(x) * (b-a);
  }

  get(x, y) {

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
