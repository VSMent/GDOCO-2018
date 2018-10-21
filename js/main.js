const game = {
    canvas: document.getElementById('game'),
    playerCanvas: document.createElement('canvas'),
    // canv2: document.getElementById('game'),
    ctx: '',
    mouse:'',
    mouseStart:'',
    player: '',
    // playerCords:[0,0],
    playerAcceleration:[0,0],
    b: 'black',
    w: 'white',
    font: '30px Arial',
    font2: '50px Arial',
    font3: '10px Arial',
    width: 800,
    height: 600,
    textX: 400,
    textY: 500,
    nextFrame:0,
    nextCard:0,
    currentLvl:0,
    mazeObjSize:21,
    mazeMargin: 25,
    mazePaddingX: 7.5,
    mazePaddingY: 2.5,
    mouseFramer:true,   // next frame on mouse click
    cards: [],
    texts:[],
    frames:[],
    lvls:[],
    start: function () {
        this.reset();
        let img = document.createElement('img');
        img.src = "img/player.png";
        let x = this.playerCanvas.getContext("2d");
            x.drawImage(img,0,0);
        this.playerCanvas.style.display = 'none';
        img.style.display = 'none';
        document.body.insertBefore(this.playerCanvas, document.body.childNodes[0]);
        document.body.insertBefore(img, document.body.childNodes[0]);
        this.canvas.addEventListener("mousedown", mouseDownEvent);
        this.canvas.addEventListener("mousemove", mouseMoveEvent);
        this.canvas.addEventListener("mouseup", mouseUpEvent);
        this.canvas.addEventListener("dragstart", prevent);
        this.canvas.addEventListener("dragover", prevent);
        this.canvas.addEventListener("dragend", prevent);
    },
    reset: function () {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.clear();
    },
    clear: function () {
        this.ctx.fillStyle = this.b;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = this.w;
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(50, 480);
        this.ctx.lineTo(750, 480);
        this.ctx.stroke();
    },
    addCard:function (path) {   // (750 x 430) px
        var img = document.createElement('img');
        img.src = path;
        this.cards.push(img);
    },
    drawCard: function (cardNumber) {
        this.ctx.drawImage(this.cards[cardNumber], 0, 0, this.cards[cardNumber].width, this.cards[cardNumber].height, 25, 25, 750, 430);
    },
    addText:function (text) {
        this.texts.push(text);
    },
    showText: function (text, line, x = 0, y = 30) {  // max length for 1 row - 45
        this.ctx.textAlign = 'center';
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.w;
        this.ctx.fillText(text, this.textX + x, this.textY + y + ((line - 1) * 40));
    },
    showTitle: function (text1, text2) {
        this.ctx.textAlign='center';
        this.ctx.fillStyle = this.w;
        this.ctx.font = this.font2;
        this.ctx.fillText(text1,400, 200 );
        this.ctx.font = this.font;
        this.ctx.fillText(text2,400, 300 );
    },
    addFrame:function (card, text) {
        if(typeof card === typeof []){
            this.frames.push({card:-1,text1:card,text2:text});
        }else if(typeof card === typeof ''){
            this.frames.push({card: card,text1:text[0],text2:this.texts[text[1]]});
        }else {
            this.frames.push({card: card, text1: this.texts[text[0]], text2: this.texts[text[1]]});
        }
    },
    nFrame:function(frame){
        if (this.frames.length > frame) {
            this.clear();
            if(this.frames[frame].card === -1){ // title screen
                this.showTitle(this.frames[frame].text1[0],this.frames[frame].text1[1]);
                this.showText(this.frames[frame].text2[0],1);
                this.showText(this.frames[frame].text2[1],2);
            }else if(typeof this.frames[frame].card === typeof ''){ // maze
                this.mouseFramer = false;
                this.startMaze(this.frames[frame].card);
                this.showText(this.lvls[parseInt(this.frames[frame].card)-1].mazeName, 1);
                this.showText(this.frames[frame].text2, 2);
            }else { // story
                this.drawCard(this.frames[frame].card);
                this.showText(this.frames[frame].text1, 1);
                this.showText(this.frames[frame].text2, 2);
            }
            this.nextFrame++;
        }
    },
    addLvl:function (name,objects) {
        this.lvls.push({name:name,objects:objects});
    },
    clearText: function(){
        this.ctx.fillStyle = this.b;
        // this.ctx.fillStyle = 'red';
        this.ctx.fillRect(0, 490, this.width, this.height);
    },
    drawObj: function (lvlObject) {
        let mO = lvlObject.mazeObjects;
        let l = mO.length;
        this.resetMaze();
        for(let i = 0; i < l; i++){
            if(mO[i].type === "wall") {
                mO[i].x = this.mazeMargin + this.mazePaddingX + mO[i].x*this.mazeObjSize;
                mO[i].y = this.mazeMargin + this.mazePaddingY + mO[i].y*this.mazeObjSize;
                this.ctx.fillStyle = this.b;
                this.ctx.fillRect(
                    mO[i].x,
                    mO[i].y,
                    this.mazeObjSize,
                    this.mazeObjSize
                );
            }
        }
        this.lvls[this.currentLvl].mazeObjects = mO;
        this.player = this.lvls[this.currentLvl].player;
        this.player.x = this.mazeMargin + this.mazePaddingX + this.player.x*this.mazeObjSize;
        this.player.y = this.mazeMargin + this.mazePaddingY + this.player.y*this.mazeObjSize;
    },
    updatePlayer(){
        // this.ctx.fillStyle = this.w;
        // this.ctx.fillStyle = 'yellow';
        // this.ctx.fillRect(
        //     this.player.x,
        //     this.player.y,
        //     this.mazeObjSize,
        //     this.mazeObjSize
        // );
        // this.drawObj(this.lvls[this.currentLvl]);
        this.player.x+=this.playerAcceleration[0];
        this.player.y+=this.playerAcceleration[1];
        // this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(
        //     this.playerCords[0],
        //     this.playerCords[1],
        //     this.mazeObjSize,
        //     this.mazeObjSize
        // );
        this.ctx.drawImage(
            this.playerCanvas,
            this.player.x,
            this.player.y
        );
    },
    startMaze:function (lvlNumber) {
        this.currentLvl = parseInt(lvlNumber)-1;
        this.drawObj(this.lvls[this.currentLvl]);
        this.interval = setInterval(update, 20);
    },
    resetMaze:function(lvlNumber = 0){
        this.ctx.fillStyle = this.w;
        this.ctx.fillRect(this.mazeMargin, this.mazeMargin, this.width-this.mazeMargin*2, 425);
        let mO = this.lvls[lvlNumber].mazeObjects;
        let l = mO.length;
        for(let i = 0; i < l; i++){
            if(mO[i].type === "wall") {
                this.ctx.fillStyle = this.b;
                this.ctx.fillRect(
                    mO[i].x,
                    mO[i].y,
                    this.mazeObjSize,
                    this.mazeObjSize
                );
            }
        }
    },
    updateScreen:function () {
        this.resetMaze();
        this.checkCollisions();
        this.updatePlayer();
    },
    checkCollisions:function () {
        for(let i = 0; i < this.lvls[this.currentLvl].mazeObjects.length; i++){
            let obj = this.lvls[this.currentLvl].mazeObjects[i];
            // if((obj.x <= this.player.x  &&  obj.x+this.mazeObjSize > this.player.x)  &&  (obj.y < this.player.y  && obj.y+this.mazeObjSize >= this.player.y)){
            //     this.playerAcceleration = [0,0];
            //     // this.player.x =
            // }
            // Top
            if(
                (this.player.x >= obj.x && this.player.x <= obj.x+this.mazeObjSize)  &&
                (this.player.y >= obj.y  &&  this.player.y <= obj.y + this.mazeObjSize)
            ){
                console.log('collide top');
            }
            // // Left side
            // if((ballY >= padTopY && ballY <= padBottomY) && (ballX >= padLeftX - ballArea && ballX <= padLeftX)){
            //     ballDirX = 0;
            // }
            // // Right side
            // if((ballY >= padTopY && ballY <= padBottomY) && (ballX >= padRightX && ballX <= padRightX + ballArea)){
            //     ballDirX = 1;
            // }
            // Bottom side
            if(
                (this.player.x >= obj.x && this.player.x <= obj.x+this.mazeObjSize)  &&
                (this.player.y+this.mazeObjSize >= obj.y  &&  this.player.y+this.mazeObjSize <= obj.y)
            ){
                console.log('collide bot');
            }
        }
    }
};
function init() {
    game.start();
    generateTexts();
    generateCards();
    generateFrames();
    generateLvls();
    game.nFrame(game.nextFrame);
}
function generateTexts() {
    game.addText('…через зупинку фінансування будівництва порту');
    game.addText('царем майбутнє Одеси було під загрозою.');
    game.addText('Тому місцеві купці вирішили задобрити царя і');
    game.addText('відправити йому подарунок - 3000 апельсинів');
    game.addText('Пройди лабіринт. Переміщення свайпами');   // maze
}
function generateCards() {
    game.addCard('img/c1.png');
    game.addCard('img/c2.png');
    game.addCard('img/c3.png');
}
function generateFrames() {
    game.addFrame(['Як апельсини Одесу рятували','Керування лише мишкою'],['Для GDOCO 2018, ОНАХТ','Команда "Вісімнадцять по", Тернопіль']);
    game.addFrame(0,[0,1]);
    game.addFrame(1,[0,1]);
    game.addFrame(2,[2,3]);
    game.addFrame('1',[4,4]);   // maze 1
}
function generateLvls() {
    let data = JSON.parse(lvlsData);
    for(let k = 0; k < data.levels.length; k++) {    // all levels
        let pattern = data.levels[k].pattern;
        let objects = [];
        let player = '';
        for (let i = 0; i < pattern.length; i++) {    // 20 rows
            for (let j = 0; j < pattern[i].length; j++) { // 35 cols
                /*if (pattern[i][j] == 0) { //empty
                    continue;
                } else */if (pattern[i][j] === 1) {
                    objects.push(new Obj(j, i, 'wall'));
                } else if (pattern[i][j] === 2) {
                    player = new Obj(j, i, 'player');
                } else if (pattern[i][j] === 3) {
                    objects.push(new Obj(j, i, 'friend'));
                } else if (pattern[i][j] === 4) {
                    objects.push(new Obj(j, i, 'enemy'));
                } else if (pattern[i][j] === 5) {
                    objects.push(new Obj(j, i, 'finish'));
                }
            }
        }
        game.lvls.push({
            mazeName:data.levels[k].name,
            mazeObjects:objects,
            player: player
        });
    }
}
class Obj{
    constructor(x,y,type = 'empty'){
        this.x = x;
        this.y = y;
        this.type = type;
    }
}
function mouseMoveEvent(ev) {
    game.mouse = {
        x:ev.clientX-Math.floor(game.canvas.getBoundingClientRect().x),
        y:ev.clientY-Math.floor(game.canvas.getBoundingClientRect().y)
    };
}
function mouseDownEvent() {
    if(game.mouseFramer) {
        game.nFrame(game.nextFrame);
    }else{
        game.mouseStart = game.mouse;
    }
}
function mouseUpEvent() {
    if (!game.mouseFramer) {
        let mouseEnd = game.mouse;
        let dir = {
            h: game.mouseStart.x - mouseEnd.x,
            v: game.mouseStart.y - mouseEnd.y,
        };
        if (dir.h > 0 && Math.abs(dir.h) > Math.abs(dir.v)) { //left
            console.log('l');
            game.playerAcceleration = [1, 0];
        } else if (dir.h < 0 && Math.abs(dir.h) > Math.abs(dir.v)) {    //right
            console.log('r');
            game.playerAcceleration = [-1, 0];
        } else if (dir.v > 0 && Math.abs(dir.h) < Math.abs(dir.v)) {    //up
            console.log('u');
            game.playerAcceleration = [0, 1];
        } else if (dir.v < 0 && Math.abs(dir.h) < Math.abs(dir.v)) {    //down
            console.log('d');
            game.playerAcceleration = [0, -1];
        }
    }
}
function update() {
    game.updateScreen();
    // console.log('a')
}
function prevent(ev) {
    ev.preventDefault();
}



    function keyDown(e){
        if(e.shiftKey){
            shift = true;
        }else{
            shift = false;
        }
        kCode = e.keyCode;
    }
    function keyUp() {
        kCode = 0;
    }


// $(game.canvas).on("click mousedown mouseup mousemove dragstart dragend",function(e){
//     if(e.type == 'dragstart'){
//         console.log('start');
//     }else if(e.type == 'dragend'){
//         console.log('end');
//     }
//     // console.log(e.type);
// });