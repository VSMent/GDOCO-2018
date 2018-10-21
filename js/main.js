const game = {
    canvas: document.getElementById('game'),
    ctx: '',
    mouse:'',
    mouseStart:'',
    player: '',
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
    mazeObjSize:20,
    mazeMargin: 25,
    mazePaddingX: 15,
    mazePaddingY: 13,
    mouseFramer:true,   // next frame on mouse click
    cards: [],
    texts:[],
    frames:[],
    lvls:[],
    start: function () {
        this.reset();
        this.canvas.style.display ='block';
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
        this.ctx.beginPath();
        this.ctx.moveTo(50, 480);
        this.ctx.lineTo(750, 480);
        this.ctx.closePath();
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
    showText: function (text, line, x = 0, y = 30) {
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
    nFrame:function(frame) {
        if (this.frames.length > frame) {
            this.clear();
            if (this.frames[frame].card === -1) { // title screen
                this.showTitle(this.frames[frame].text1[0], this.frames[frame].text1[1]);
                this.showText(this.frames[frame].text2[0], 1);
                this.showText(this.frames[frame].text2[1], 2);
            } else if (typeof this.frames[frame].card === typeof '') { // maze
                this.mouseFramer = false;
                this.startMaze(this.frames[frame].card);
                this.showText(this.lvls[parseInt(this.frames[frame].card) - 1].mazeName, 1);
                this.showText(this.frames[frame].text2, 2);
            } else { // story
                this.drawCard(this.frames[frame].card);
                this.showText(this.frames[frame].text1, 1);
                this.showText(this.frames[frame].text2, 2);
            }
            this.nextFrame++;
        }else{
            document.location.reload();
        }
    },
    drawObj: function (lvlObject) {
        let mO = lvlObject.mazeObjects;
        let l = mO.length;
        this.resetMaze();
        for(let i = 0; i < l; i++){
            mO[i].x = this.mazeMargin + this.mazePaddingX + mO[i].x*this.mazeObjSize;
            mO[i].y = this.mazeMargin + this.mazePaddingY + mO[i].y*this.mazeObjSize;
        }
        this.lvls[this.currentLvl].mazeObjects = mO;
        this.player = this.lvls[this.currentLvl].player;
        this.player.x = this.mazeMargin + this.mazePaddingX + (this.player.x+.5)*this.mazeObjSize;
        this.player.y = this.mazeMargin + this.mazePaddingY + (this.player.y+.5)*this.mazeObjSize;
    },
    updatePlayer(){
        this.player.x+=this.playerAcceleration[0];
        this.player.y+=this.playerAcceleration[1];
        this.ctx.strokeStyle = this.b;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x,this.player.y,6,0,2*Math.PI);
        this.ctx.closePath();
        this.ctx.stroke();
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
            }else if(mO[i].type === "finish"){
                this.ctx.fillStyle = this.b;
                this.ctx.fillRect(mO[i].x,mO[i].y,5,5);
                this.ctx.fillRect(mO[i].x+10,mO[i].y,5,5);
                this.ctx.fillRect(mO[i].x+5,mO[i].y+5,5,5);
                this.ctx.fillRect(mO[i].x+15,mO[i].y+5,5,5);
                this.ctx.fillRect(mO[i].x,mO[i].y+10,5,5);
                this.ctx.fillRect(mO[i].x+10,mO[i].y+10,5,5);
                this.ctx.fillRect(mO[i].x+5,mO[i].y+15,5,5);
                this.ctx.fillRect(mO[i].x+15,mO[i].y+15,5,5);
            }
        }
    },
    updateScreen:function () {
        this.resetMaze();
        this.updatePlayer();
        this.checkCollisions();
    },
    checkCollisions:function () {
        for (let i = 0; i < this.lvls[this.currentLvl].mazeObjects.length; i++) {
            let obj = this.lvls[this.currentLvl].mazeObjects[i];
            if ( // Top
            (this.player.x >= obj.x && this.player.x <= obj.x + this.mazeObjSize) &&
            (this.player.y - this.mazeObjSize*2/5 >= obj.y && this.player.y - this.mazeObjSize*2/5 <= obj.y + this.mazeObjSize)
            ) {
                this.player.y += 1;
                this.playerAcceleration = [0, 0];
                if(obj.type === "finish") this.finish();
            }
            if ( // Right
            (this.player.y >= obj.y && this.player.y < obj.y + this.mazeObjSize) &&
            (this.player.x + this.mazeObjSize*2/5 >= obj.x && this.player.x + this.mazeObjSize*2/5 <= obj.x + this.mazeObjSize)
            ) {
                this.player.x -= 1;
                this.playerAcceleration = [0, 0];
                if(obj.type === "finish") this.finish();
            }
            if ( // Left
            (this.player.y >= obj.y && this.player.y <= obj.y + this.mazeObjSize) &&
            (this.player.x - this.mazeObjSize*2/5 <= obj.x + this.mazeObjSize && this.player.x - this.mazeObjSize*2/5> obj.x)
            ) {
                this.player.x += 1;
                this.playerAcceleration = [0, 0];
                if(obj.type === "finish") this.finish();
            }
            if ( // Bottom
            (this.player.x >= obj.x && this.player.x <= obj.x + this.mazeObjSize) &&
            (this.player.y + this.mazeObjSize*2/5 >= obj.y && this.player.y + this.mazeObjSize*2/5 <= obj.y + this.mazeObjSize)
            ) {
                this.player.y -= 1;
                this.playerAcceleration = [0, 0];
                if(obj.type === "finish") this.finish();
            }
        }
    },
    finish:function () {
        clearInterval(this.interval);
        this.clear();
        this.mouseFramer = true;
        this.nFrame(game.nextFrame);
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
    game.addText('царем, майбутнє Одеси було під загрозою.');
    game.addText('Тому місцеві купці вирішили задобрити царя і');
    game.addText('відправити йому подарунок - 3000 апельсинів');
    game.addText('Для цього вони вибрали найвправнішого - Мандарина.');
    game.addText('Завантаживши апельсини на віз, він вирушив у дорогу.');
    game.addText('Більшість доріг Одеси були викладені бруківкою,');
    game.addText('тому віз сильно трясло і апельсини погубилися…');
    game.addText('Переміщення свайпами, зупинка - кліками');   // maze
    game.addText('Отримавши подарунок - цар дуже зрадів');
    game.addText('і надав гроші та право на побудову порту');
    game.addText('Так апельсини врятували місто');
    game.addText('______The END______');
}
function generateCards() {
    game.addCard('img/c1.png');
    game.addCard('img/c2.png');
    game.addCard('img/c3.png');
    game.addCard('img/c4.png');
    game.addCard('img/c5.png');
    game.addCard('img/c6.png');
    game.addCard('img/c7.png');
    game.addCard('img/c8.png');
}
function generateFrames() {
    game.addFrame(['Як апельсини Одесу рятували','Керування лише мишкою. Натисни щоб продовжити'],['Для GDOCO 2018, ОНАХТ','Команда "Вісімнадцять по", Тернопіль']);
    game.addFrame(0,[0,1]);
    game.addFrame(1,[0,1]);
    game.addFrame(2,[2,3]);
    game.addFrame(3,[4,5]);
    game.addFrame(4,[4,5]);
    game.addFrame(5,[6,7]);
    game.addFrame('1',[8,8]);   // maze 1
    game.addFrame(6,[9,10]);
    game.addFrame(7,[11,12]);
    game.addFrame(['Кінець гри',':)'],['Для GDOCO 2018, ОНАХТ','Команда "Вісімнадцять по", Тернопіль']);
}
function generateLvls() {
    let data = JSON.parse(lvlsData);
    for(let k = 0; k < data.levels.length; k++) {    // all levels
        let pattern = data.levels[k].pattern;
        let objects = [];
        let player = '';
        for (let i = 0; i < pattern.length; i++) {    // 20 rows
            for (let j = 0; j < pattern[i].length; j++) { // 35 cols
                if (pattern[i][j] === 1) {
                    objects.push(new Obj(j, i, 'wall'));
                } else if (pattern[i][j] === 2) {
                    player = new Obj(j, i, 'player');
                } else if (pattern[i][j] === 3) {
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
    constructor(x,y,type = 'empty',c = 'black'){
        this.x = x;
        this.y = y;
        this.type = type;
        this.c = c;
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
        game.playerAcceleration = [0, 0];
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
            game.playerAcceleration = [2, 0];
        } else if (dir.h < 0 && Math.abs(dir.h) > Math.abs(dir.v)) {    //right
            game.playerAcceleration = [-2, 0];
        } else if (dir.v > 0 && Math.abs(dir.h) < Math.abs(dir.v)) {    //up
            game.playerAcceleration = [0, 2];
        } else if (dir.v < 0 && Math.abs(dir.h) < Math.abs(dir.v)) {    //down
            game.playerAcceleration = [0, -2];
        }
    }
}
function update() {
    game.updateScreen();
}
function prevent(ev) {
    ev.preventDefault();
}