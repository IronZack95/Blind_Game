<center><img src="design/titolo_v0.png" alt="title image"  width="800"/> </center> <br>
You're a miner and you got trapped in a cave. Find all crystals and beat your rivals' time! Watch out for mines!


 ### Authors \- **"Good kids of the teacher"**
- [Zaccaria Eliseo Carrettoni](https://github.com/IronZack95)
- [Wendy Wang](https://github.com/WendyWang29)
- [Alessandro Zullo](https://github.com/Alessandro199762)
- [Lorenzo Lellini](https://github.com/LorenzoLellini)

![alt text](https://imag.malavida.com/mvimgbig/download-fs/among-us-28791-5.jpg)

## After cloning this repo (only the first time):
1. _open the terminal_
2. _go to the project path_
3. _run:_ **$ npm install**
4. _waiting operation to finish_

## How to run this code:
1. _open the terminal_
2. _go to the project path_
3. _run:_ **$ npm run dev**  (FOR DEVELOPMENTS)
4. _run:_ **$ npm run start**  (FOR RELEASE)
5. _follow the instrutions on the console for accessing the browser interface_
6. _for stop node js run_ CTRL+C : **$ ^C**

Tested and optimized for Chrome, Brave, Edge. DOES NOT WORK on Safari.

# Documentazione:
1. [Introduction](#intro)
2. [Gameplay](#gameplay)
3. [One Page App](#onepageapp)
4. [Server](#server)

# Intro <a name = "intro"></a>
 **Advanced Coding Tools**  _and Metodologies_ \- **Final Project**  
Our main objective was to develop an audio base video game running on a self hosted environment,
emulating full stack development and deployment.

## Gameplay <a name = "gameplay"></a>
info sugli oggetti di gioco sigle
- p5.js is a JavaScript library based on Processing and mostly used by creative coders.  
By creating a new p5 instance, we exploited the library primarily to draw on a _canvas_ element following the same workflow available in Processing i.e. 
setting the _setup_ and a _draw_ functions. Also, p5.js came in handy for sound files manipulation, multiple vectorial computations and more.   

- game logic (player, muro, mine, crystals) // LORE
- Audio logic (panning, sounds, volume, rate, walls check)  // LORE
- Utilities(perlin noise)                   // ALE

## One Page APP
info sulle pagine
- page division                                                         // ALE
- singleton (class schermo, metodi astratti)                          // WENDY
- Score system (database, lettura file sincrona, noSQL, .gitignore)  // ALE
- automatic naming (API)                                            //ALE

## Server
info sul MultiPlayer
- Node.js (npm, express, nodemon)                                  // WENDY
- Socket.io(volatile, )                                            // ZACK..
- GameState (oggetti server game.js, moduli)
- Docker (reverse proxy, https, routing)
