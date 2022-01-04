<p align="center">
  <img src="design/titolo_v0.png" alt="title image"  width="85%" />
</p>

You're a miner and you got trapped in a cave. Find all crystals :gem: and beat your rivals' time! Watch out for mines!


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

:warning: Tested and optimized for Chrome, Brave, Edge. </span><span style="color:coral">DOES NOT WORK on Safari. :warning:


# Documentation:
1. [Introduction](#intro)
2. [Gameplay](#gameplay)
3. [One Page App](#onepageapp)
4. [Server](#server)

# Introduction <a name = "intro"></a>
 **Advanced Coding Tools**  _and Metodologies_ \- **Final Project**  
Our main objective was to develop an audio based video game running on a self hosted environment,
emulating full stack development and deployment.

# Gameplay <a name = "gameplay"></a>

**[p5.js](https://p5js.org/)** is a JavaScript library which allowed us, by creating a new p5 instance, to work on a _canvas_ element following the same procedures available in Processing, i.e. setting up the _setup_ and the _draw_ functions. The library also came in handy for images/sounds file handling, vectorial computations and sound file manipulations. For the sound effects in our game we exploited the [p5.Sound](https://p5js.org/reference/#/libraries/p5.sound) core library, which extends p5 with Web Audio funcionalities.   

## Game Logic
**Player** : The player figure can be moved in the canvas area with W A S D keys and includes animations during the motion. Legs are moving during the walk and eyes can rotate of a 200 degrees angle (100 degrees on the left and 100 degrees on the right starting from the initial position) thanks to mouse movement on the x axis. 

<p align="center">
  <img src="design/panning_scheme.png" alt="title image"  width="60%" />
</p>

**Walls** : Walls are randomly generated with a prlin noise algorithm in every game and the player cannot move thru them. The player body is considered as a circle and when the its radius hits a wall perimeter and the wall detection function returns a true value, all the movements in the wall direction are forbidden.

**Mines and Crystals** : Mines and Crystals are created from the same array of objects, splitting them in 2 different sub arrays. If the player accidentally hits a mine, score will be decreases of 200 points, while, if he eats a crystal the score will be increased of 100 points. There is a special green crystal that scores 1000 points too. It has to be discovered by the player using the sound and it appears on the canvas only when the player is below a ceratin distance. The goal of the game is to collect all the crystals on the map avoiding the mines.
 
## Audio Logic

**Panning and Gain** : Player cannot see the mines and the green crystal on the canvas and the only way to locate them is to listen and rotate the eyes using the mouse. Eyes rotation is, in fact, related to sound panning. Moreover, the sound volume of these objects changes according with the player distance. Starting from a certain distance, the closer the player is to the mine, the higher the gain will be.

**Pitching** : In order to easily locate the mines, in addiction to the panning and gain variation, also the mine sound pitch changes according with player distance. The closer the player is to the mine, the higher the pitch will be.

**Wall Detection** : the green crystal object is invisible but can be found by the player if he gets close enough to it as glimmering sound will be heard. If between the crystal and the player there is a wall, the sound comes muffled, otherwise it comes bright and clear. To detect if there's a wall or not between the player and the crystal the game computes line intersections. If the line that goes from the head of the player to the center of the crystal intersects one of the 4 walls of a wall the sound comes muffled.

 <p align="center">
  <img src="design/walldetection_scheme.png" alt="title image"  width="60%" />
</p>

**Sounds** : All the sounds are loaded at the beginning of the game and loopped according with their duration. Player will hear only mines and green crystal sounds below a certain distance in pixel. Walk sound and eat crystal sound are loaded at the beginning of the game too but they are played only if the related event happens.

## Utilities // ALE
**Perlin Noise** : 

# One Page APP <a name = "onepageapp"></a>
info sulle pagine
- page division // ALE

- singleton (class schermo, metodi astratti)                          // WENDY  
The _singleton_ design pattern is a way of creating a single object that is shared among a bunch of other resources in the app. An app can have only one instantiation of this kind of object at a time.
In our project the "Schermo" object is a singleton. The class constructor verifies if an instance of the object already exists before creating a new one. "Schermo" is associated to an empty div meant to fill the whole window and it's shared by all of our "page type" classes (Lobby, SinglePlayer and Multiplayer game pages, GameOver pages...)

- Score system (database, lettura file sincrona, noSQL, .gitignore)  // ALE
- automatic naming (API)                                            //ALE

# Server <a name = "server"></a>
info sul MultiPlayer
- Node.js (npm, express, nodemon)                                  // WENDY  
Node.js is a Javascript runtime using non-blocking I/O (it does not block itself on only one request at a time) and asynchronous (uses callbacks) programming. npm is used to manage Node.js packages. In our project the following packages are included:  
:small_blue_diamond: Express, to setup a server listening to a specific port;  
:small_blue_diamond: Nodemon, that allowed us to automatically restart the server everytime a change was made in the code.    
 FORSE C'AGGIUNGO ALTRA ROBA 
- Socket.io(volatile, )                                            // ZACK..
- GameState (oggetti server game.js, moduli)
- Docker (reverse proxy, https, routing)

<p align="center">
  <img src="design/omino_JS.png" width="20%" />
  <img src="design/omino_p5.png" width="16%" /> 
  <img src="design/docker_img.png" width="22%" />
</p>
