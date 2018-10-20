var game = {
    canvas: document.getElementById('game'),
    ctx: '',
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
        this.canvas.addEventListener("click", clickEvent);
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
            this.frames.push({card: card,text1:text,text2:''});
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
                this.showText(this.lvls[parseInt(this.frames[frame].card)].mazeName, 1);
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
        this.ctx.fillStyle = this.w;
        // this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.mazeMargin, this.mazeMargin, this.width-this.mazeMargin*2, 425);
        for(let i = 0; i < l; i++){

            this.ctx.fillStyle = this.b;

            this.ctx.fillRect(
                this.mazeMargin + this.mazePaddingX + mO[i].x*this.mazeObjSize,
                this.mazeMargin + this.mazePaddingY + mO[i].y*this.mazeObjSize,
                this.mazeObjSize,
                this.mazeObjSize
            );
            // this.ctx.font = this.font3;
            // this.ctx.fillStyle = 'red';
            // this.ctx.fillText(
            //     mO[i].x*20+mO[i].y,
            //     this.mazeMargin + this.mazePaddingX + mO[i].x*this.mazeObjSize+10,
            //     this.mazeMargin + this.mazePaddingY + mO[i].y*this.mazeObjSize+10
            // );
        }
    },
    startMaze:function (lvlNumber) {
        this.drawObj(this.lvls[parseInt(lvlNumber)-1]);
        this.interval = setInterval(update, 20);
    }
}
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
        for (let i = 0; i < pattern.length; i++) {    // 20 rows
            for (let j = 0; j < pattern[i].length; j++) { // 35 cols
                /*if (pattern[i][j] == 0) { //empty
                    continue;
                } else */if (pattern[i][j] == 1) {
                    objects.push(new Obj(j, i, 'wall', 'black'));
                } else if (pattern[i][j] == 2) {
                    objects.push(new Obj(j, i, 'player'));
                } else if (pattern[i][j] == 3) {
                    objects.push(new Obj(j, i, 'friend'));
                } else if (pattern[i][j] == 4) {
                    objects.push(new Obj(j, i, 'enemy'));
                } else if (pattern[i][j] == 5) {
                    objects.push(new Obj(j, i, 'finish'));
                }
            }
        }
        game.lvls.push({
            mazeName:data.levels[k].name,
            mazeObjects:objects
        });
    }

    // console.log(a);
    // game.addLvl("Вулиця 1",generateObjects('lvl1'));
}
class Obj{
    constructor(x,y,type = 'empty',c = 'white'){
        this.type = type;
        this.x = x;
        this.y = y;
        this.c = c;
    }
}
function clickEvent() {
    if(game.mouseFramer) {
        game.nFrame(game.nextFrame);
    }
}
function update() {

    // console.log('a')
}




    function keyDown(e){
        if(e.shiftKey){
            shift = true;
        }else{
            shift = false;
        }
        kCode = e.keyCode;
    }
    function keyUp(){
        kCode = 0;
    }


