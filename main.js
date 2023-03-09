// tested with 60 Hz monitor

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// canvas image
var canvasImg = new Image();
canvasImg.src = 'bathroom.jpg';
//document.body.appendChild(canvasImg);
//ctx.drawImage(canvasImg, 0, 0); 


// user image 
var userImg = new Image();
userImg.src = 'Mason_original.jpg'; 

// cactus obstacle image
var cactusImg = new Image(50, 50);
cactusImg.src = 'poop_transparent.png'; 

// user's info
var dino = {
    x : 0,
    y : 150,
    width : 50,
    height : 100,
    draw(){
        //ctx.fillStyle = 'black';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(userImg, 0, 0, 2448, 3264, this.x, this.y, 50, 100);
        //ctx.drawImage(userImg, this.x, this.y);

    }
}

// obstacles' default info
class Cactus{

    constructor(){
        this.x = 1000;
        this.y = 200;
        this.width = 50;
        this.height = 50;
    }


    //number of cactus. Thus, the height randomly increase. Thus, addition images have to be added accordingly
    draw(){
        //ctx.fillStyle = 'white';
        ctx.fillStyle = "rgba(255, 255, 255, 0 )"; // transparent the background
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(cactusImg, this.x, 200);
        // 1 addition image added
        if (this.height > 50) {
            ctx.drawImage(cactusImg, this.x, 150);
        } 
        // 2 addition images added  
        if (this.height > 100) {
            ctx.drawImage(cactusImg, this.x, 100);
        }
    }
}

var score = 0; // user's score
var cactusSize = 0; // user's recent success jump of the poop's height

//var monitorHz = 60; // monitor's frame rate
var timer = 0; // frame counter
var cactusArray = []; 
var jumpTimer = 0; // user's jump frame counter
var animation; 

function eachFrameExe() {
 
    animation = requestAnimationFrame(eachFrameExe);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background image rendering
    ctx.drawImage(canvasImg, 0, 0, 1000, 542, 0, 0, canvas.width, 300); 

    // scoreboard rendering at top right corner
    ctx.font = "45px Calibri";
    ctx.fillStyle ='red';
    ctx.fillText(`score: ${score}`, 900, 50, 50)
   
    // New cactus obstacle spawns every 2 seconds for 60Hz monitor
    if (timer % 120 === 0){
        var cactus = new Cactus();

        var inc = Math.floor(Math.random() * 3); // randomed number of increased cactus height by max increment of 2 cactus

        // increasing randomized cactus height
        cactus.y  -= 50 * inc; 
        cactus.height += 50 * inc; 
        

        cactusArray.push(cactus);
    
    }

    // deletes any passed cactus
    cactusArray.forEach((a, i, arr)=>{
        if (a.x < 0) {

            // the poop's size calculation for score increment before its removal
            switch (arr[i].height) {
                case(50): 
                    cactusSize = 1;
                    break;
                case(100): 
                    cactusSize = 2;
                    break;
                case(150): 
                    cactusSize = 3;
                    break;
                default:
                    cactusSize = 0;
            }
            
            // deletes the passed cactus
            arr.splice(i, 1);

            // scores increment after the removed poop's size
            score += cactusSize;
        }

        collisionCheck(dino, a);

        a.x -= 5;
        a.draw();
    });

    // user jump motion max 60 frames 
    if (jumping) {
        // upward motion
        if (jumpTimer < 30) {
            dino.y -= 8; 
            jumpTimer++;
        }
        // downward motion
        else if (jumpTimer >= 30 && jumpTimer < 60) {
            dino.y += 8;
            jumpTimer++;
        }
        // jumping reset
        else{
            jumpTimer = 0;
            jumping = false;
        }
    }
    dino.draw();
}

eachFrameExe();

// user jump key
var jumping = false;

//space
document.addEventListener("keydown", function(key){
    if (key.code === 'Space') {
        jumpEnable();
    }
})

//click
document.addEventListener("click", jumpEnable);

function jumpEnable(){
    jumping = true;
}

// collision check
function collisionCheck(dino, cactus){
    // user and obstacle seperation diff
    var xDiff = cactus.x - (dino.x + dino.width);
    var yDiff = cactus.y - (dino.y + dino.height);

    // if user and obstacle overlaps, the canvas is cleared and the game stops and alerts
    if (xDiff <= 0 && yDiff <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);

        // background
        ctx.drawImage(canvasImg, 0, 0, 1000, 542, 0, 0, canvas.width, 300);

        // scoreboard
        ctx.font = "45px Calibri";
        ctx.fillStyle ='red';
        ctx.fillText(`score: ${score}`, 900, 50, 50)

        alert(`Ewww! You touched the POOP!\n${score} poops total.\n\nCan you do better?\nThen press F5.`);

    }
}