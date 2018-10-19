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
        this.interval = setInterval(update, 20);
    },
    showText: function (text, line, x = 10, y = 30) {  // max length for 1 row - 45
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

    }
}

function init() {
    game.start();
    generateCards();
    game.showText('a☝sdasdasdasdasdasdasdasdasdsadadssadsadsadss',1);
    game.showText('asd',2);
}

function update() {
    // console.log('a')
}

function generateCards() {
    // game.cards.push();
    var c = document.createElement("canvas");
    // c.width =
}

    function drawBall(ballX, ballY, Radius, fill){
        ctx.beginPath();
        ctx.arc(ballX, ballY, Radius, 0, 2*Math.PI);
        if(fill){
            ctx.fill();
        }
        ctx.stroke();
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


