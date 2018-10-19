var game = {
    canvas: document.getElementById('game'),
    ctx: '',
    b: 'black',
    w: 'white',
    width: 800,
    height: 600,
    font: '30px Arial',
    textX: 25,
    textY: 500,
    cards: [],
    nextCard:0,
    texts:[],
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
    showText: function (text, line, x = 10, y = 30) {  // max length for 1 row - 45
        if(this.texts.length == 2){
            this.texts[0] = this.texts[1];
            this.texts.push('text');
        }
        if()
        this.clearText();
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.w;
        this.ctx.fillText(text, this.textX + x, this.textY + y + ((line - 1) * 40));
    },
    // showTitle: function (text,text2) {
    //     this.ctx.font = this.font;
    //     this.ctx.fillStyle = this.w;
    //     this.ctx.fillText(text,this.textX+x, this.textY+y + ((line-1) * 40));
    // },
    drawCard: function (cardNumber) {
        if (this.cards.length > cardNumber){
            console.log(this.nextCard);
            this.ctx.drawImage(this.cards[cardNumber], 0, 0, this.cards[cardNumber].width, this.cards[cardNumber].height, 25, 25, 750, 430);
            this.nextCard++;
        }
    },
    addCard:function (path) {   // (750 x 430) px
        var img = document.createElement('img');
        img.src = path;
        this.cards.push(img);
    },
    startMaze:function () {

        this.interval = setInterval(update, 20);
    }
}

function init() {
    game.start();
    generateCards();
    game.showText('a☝sdasdasdasdasdasdasdasdasdsadadssadsadsadss',1);
    game.showText('asd',2);
}
function generateCards() {
    game.addCard('img/Odessa.png');
    game.addCard('img/r1.png');
    game.addCard('img/r2.png');
    game.addCard('img/r1.1.png');
    game.addCard('img/r1.2.png');
}
function clickEvent() {
    game.drawCard(game.nextCard);
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


