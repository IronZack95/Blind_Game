

/*
TEST CON WEB AUDIO API 
*/



/* class SoundLogic {
  
    constructor(mines, player) {
      this.mines = mines;
      this.player = player;
  
      this.audioContext = new AudioContext();  // creo il global audio context
      this.mine_sound = document.getElementById('mine_s');
      this.minesBipping = []; //array of all mines source nodes
      this.minesVolumes = [];  //array of all mines volumes
      this.minesPannings = []; //array of all mines pannings
      this.volume_control = 0;
      this.pan_control = 0;
  
      for (var i = 0; i < mines.length; i++){
        
        //creo i nodes necessari per ogni mina e li metto negli array appositi
        this.minesBipping[i] = this.audioContext.createMediaElementSource(this.mine_sound);
        this.minesVolumes[i] = this.audioContext.createGain();
        this.minesPannings[i] = this.audioContext.createStereoPanner();
        //...li connetto tra di loro 
        this.minesBipping[i].connect(this.minesPannings[i]);
        this.minesPannings[i].connect(this.minesVolumes[i]);
        this.minesVolumes[i].connect(this.audioContext.destination);
        //setto panning e volume uguali a zero
        this.minesPannings[i].pan.setValueAtTime(this.pan_control, this.audioContext.currentTime);
        this.minesVolumes[i].gain.setValueAtTime(this.volume_control, this.audioContext.currentTime);
  
        // check if context is in suspended state (autoplay policy)
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
          }
  
        this.minesBipping[i].play();
      }
      console.log(this.minesBipping)
    }
  
    update(){
      // 1) controllo le distanze tra player e ogni mina
      // 2) se sì ne setto volume e panning
      this.mines_distances = [];
      
      for (var i=0; i < this.mines.length; i++){
        this.mines_distances[i] = dist(this.player.x, this.player.y, this.mines[i].x, this.mines[i].y);
  
        if(this.mines_distances[i] <= MINE_DISTANCE) {
          let temp = Math.sqrt(this.mines_distances[i] / MINE_DISTANCE);  //calcolo distanza normalizzata etc
          volume_control = 0.7 * (1-temp);   //calcolo volume
          this.minesVolumes[i].gain.setValueAtTime(volume_control, audioContext.currentTime);  //setto volume
  
          console.log('suona la mina '+[i])
        } else {
  
          mine_volume.gain.setValueAtTime(volume_control, audioContext.currentTime);
        }
      }
    }
  } */