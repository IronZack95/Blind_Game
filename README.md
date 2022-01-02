<center><img src="design/titolo_v0.png" alt="title image"  width="50%"/> </center> <p>
You're a miner and you got trapped in a cave. Find all crystals and beat your rivals' time! Watch out for mines!


 ### Authors \- **"Good kids of the teacher"**
- [Zaccaria Eliseo Carrettoni](https://github.com/IronZack95)
- [Wendy Wang](https://github.com/WendyWang29)
- [Alessandro Zullo](https://github.com/Alessandro199762)
- [Lorenzo Lellini](https://github.com/LorenzoLellini)

<!---![alt text](https://imag.malavida.com/mvimgbig/download-fs/among-us-28791-5.jpg) --->

## After cloning this repo (only the first time):
1. _open the terminal_
2. _go to the project path_
3. _run:_ **$ npm install**
4. _wait for the operation to finish_

## How to run this code:
1. _open the terminal_
2. _go to the project path_
3. _run:_ **$ npm run dev**  (FOR DEVELOPMENTS)
4. _run:_ **$ npm run start**  (FOR RELEASE)
5. _follow the instructions on the console for accessing the browser interface_
6. _to stop node js run_ CTRL+C : **$ ^C**

<span style="color:lightgreen"> Tested and optimized for Chrome, Brave, Edge. </span><span style="color:coral">DOES NOT WORK on Safari.</span>

- - -

# Documentation:
1. [Introduction](#intro)
2. [Gameplay](#gameplay)
3. [One Page App](#onepageapp)
4. [Server](#server)

# Intro <a name = "intro"></a>
 **Advanced Coding Tools**  _and Metodologies_ \- **Final Project**  
Our main objective was to develop an audio based video game running on a self hosted environment,
emulating full stack development and deployment.

## Gameplay <a name = "gameplay"></a>
info sugli oggetti di gioco sigle
- [p5.js](https://p5js.org/) is a JavaScript library which allowed us, by creating a new p5 instance, to work on a _canvas_ element following the same procedures available in Processing, i.e. setting up the _setup_ and the _draw_ functions. The library also came in handy for images/sounds file handling, vectorial computations and sound file manipulations. For the sound effects in our game we exploited the [p5.Sound](https://p5js.org/reference/#/libraries/p5.sound) core library, which extends p5 with Web Audio funcionalities.   

- game logic (player, muro, mine, crystals) // LORE

<center><img src="design/panning_scheme.png" alt="title image"  width="50%"/> </center> <br>
- Audio logic (panning, sounds, volume, rate, walls check)  // LORE 

<!---(Lorenzo ti ho scritto la parte dei muri qui sotto. W)--->

**Wall detection** : the "green crystal" object is invisible but can be found by the player if he gets close enough to it as glimmering sound will be heard. If between the crystal and the player there is a wall, the sound comes muffled, otherwise it comes bright and clear. To detect if there's a wall or not between the player and the crystal the game computes line intersections. If the line that goes from the head of the player to the center of the crystal intersects one of the 4 walls of a wall the sound comes muffled.
<center><img src="design/walldetection_scheme.png" alt="title image"  width="50%"/> </center> <br>

- Utilities(perlin noise)                   // ALE

## One Page APP <a name = "onepageapp"></a>
info sulle pagine
- page division                                                         // ALE

- singleton (class schermo, metodi astratti)                          // WENDY  
The _singleton_ design pattern is a way of creating a single object that is shared among a bunch of other resources in the app. An app can have only one instantiation of this kind of object at a time.
In our project the "Schermo" object is a singleton. The class constructor verifies if an instance of the object already exists before creating a new one. "Schermo" is associated to an empty div meant to fill the whole window and it's shared by all of our "page type" classes (Lobby, SinglePlayer and Multiplayer game pages, GameOver pages...)

- Score system (database, lettura file sincrona, noSQL, .gitignore)  // ALE
- automatic naming (API)                                            //ALE

## Server <a name = "server"></a>
info sul MultiPlayer
- Node.js (npm, express, nodemon)                                  // WENDY
- Socket.io(volatile, )                                            // ZACK..
- GameState (oggetti server game.js, moduli)
- Docker (reverse proxy, https, routing)
