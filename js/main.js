var game = {
    canvas: document.getElementById('game'),
    ctx: '',
    b: 'black',
    w: 'white',
    width: 800,
    height: 600,
    font: '30px Arial',
    font2: '50px Arial',
    textX: 400,
    textY: 500,
    cards: [],
    nextFrame:0,
    nextCard:0,
    texts:[],
    frames:[],
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
    start: function () {
        this.reset();
        this.canvas.addEventListener("click", clickEvent);
    },
    nFrame:function(frame){
        if (this.frames.length > frame) {
            this.clear();
            if(this.frames[frame].card == -1){
                this.showTitle(this.frames[frame].text1[0],this.frames[frame].text1[1]);
                this.showText(this.frames[frame].text2[0],1);
                this.showText(this.frames[frame].text2[1],2);
            }else {
                this.drawCard(this.frames[frame].card);
                this.showText(this.frames[frame].text1, 1);
                this.showText(this.frames[frame].text2, 2);
            }
            this.nextFrame++;
        }
    },
    showText: function (text, line, x = 0, y = 30) {  // max length for 1 row - 45
        this.ctx.textAlign = 'center';
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.w;
        this.ctx.fillText(text, this.textX + x, this.textY + y + ((line - 1) * 40));
    },
    clearText: function(){
        this.ctx.fillStyle = this.b;
        // this.ctx.fillStyle = 'red';
        this.ctx.fillRect(0, 490, this.width, this.height);
    },
    showTitle: function (text1, text2) {
        this.ctx.textAlign='center';
        this.ctx.fillStyle = this.w;
        this.ctx.font = this.font2;
        this.ctx.fillText(text1,400, 200 );
        this.ctx.font = this.font;
        this.ctx.fillText(text2,400, 300 );
    },
    drawCard: function (cardNumber) {
            this.ctx.drawImage(this.cards[cardNumber], 0, 0, this.cards[cardNumber].width, this.cards[cardNumber].height, 25, 25, 750, 430);
    },
    addCard:function (path) {   // (750 x 430) px
        var img = document.createElement('img');
        img.src = path;
        this.cards.push(img);
    },
    addText:function (text) {
        this.texts.push(text);
    },
    addFrame:function (card, text) {
        if(typeof card === typeof []){
            this.frames.push({card:-1,text1:card,text2:text});
        }else {
            this.frames.push({card: card, text1: this.texts[text[0]], text2: this.texts[text[1]]});
        }
    },
    startMaze:function () {

        this.interval = setInterval(update, 20);
    }
}

function init() {
    game.start();
    generateTexts();
    generateCards();
    generateFrames();
    game.nFrame(game.nextFrame);
}
function generateTexts() {
    game.addText('…через зупинку фінансування будівництва порту');
    game.addText('царем майбутнє Одеси було під загрозою.');
    game.addText('Тому місцеві купці вирішили задобрити царя і');
    game.addText('відправити йому подарунок - 3000 апельсинів');
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
}
function clickEvent() {
    game.nFrame(game.nextFrame);
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


