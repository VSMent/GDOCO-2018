window.onload = init;

function init(){
    var width = window.innerWidth;
    var height = window.innerHeight;

    var canvas = document.getElementById('game');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    // canvas.tabIndex = 1000;
    canvas.onkeydown = keyDown;
    canvas.onkeyup = keyUp;
    var context = canvas.getContext('2d');

    var b = 'black'
    var w = 'white'

    canvasReset();	// BG set

    // 		Generate blocks
    var blockScaleX = 70, blockScaleY = 20, marginX = 5, marginY = 5;
    var borderLeft = 40, borderTop = 40, borderRight = 40, borderFromTop = 120;

    class Block{
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }

    var blocks = [];
    var x = borderLeft, y = borderTop;
    console.log(`width = ${width}`);
    console.log(`height = ${height}`);

    for(let i = 0; i < ( (borderFromTop - borderTop) / (blockScaleY + marginY) ); i++){
        x = borderLeft;
        for(let j = 0; j < ( (width - borderLeft - borderRight - blockScaleX) / (blockScaleX + marginX) ); j++){
            blocks[blocks.length] = new Block(x,y);
            x += (blockScaleX+marginX);
            x += 1;
        }
        y += (blockScaleY+marginY);
    }
    //

    // 		Pad vars
    var shift;
    var padWidth = 100, padHeight = 40;
    var padPosX = 0, padPosY = 250;
    var padLeftX = (width / 2) - (padWidth / 2) + padPosX,
        padTopY = (height / 2) - (padHeight / 2) + padPosY,
        padBottomY = padTopY + padHeight,
        padRightX = padLeftX + padWidth;
    var kCode;
    var padSpeed = 10;
    //

    // 		Ball vars
    var ballDirX = Math.round(Math.random()), // 0 <- -> 1
        ballDirY = 1; // 1 UP, 0 DOWN
    var ballX = width / 2, ballY = height / 1.2, Radius = 7;
    var ballSpeed = 5;
    var ballArea = ballSpeed>Radius ? ballSpeed : Radius;
    //

    // 		Score vars
    var scoreSize = (width*width*width)/(height*height*height)*20;	// 200
    var scoreX = borderLeft, scoreY = height - borderFromTop; // 100, 500
    var scoreValue = 0;
    //


    (function loop(){
        stats.begin();
        canvasReset();
        // Draw Score
        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.strokeStyle = 'rgba(255,255,255,0.1)';
        context.font = `${scoreSize}px Times New`;
        context.fillText(`Score: ${scoreValue}`, scoreX, scoreY);
        context.strokeText(`Score: ${scoreValue}`, scoreX, scoreY);
        // draw score
        // 		Draw blocks
        context.fillStyle = blu;
        for(let i = 0; i < blocks.length; i++){
            // console.log(blocks[i].x);
            context.fillRect(blocks[i].x, blocks[i].y, blockScaleX, blockScaleY);
        }
        //

        // 		Draw pad
        context.fillStyle = brow;
        if(padLeftX > borderLeft-10){
            if(kCode == 37 && shift){
                padLeftX -= padSpeed*2;
            }
            if(kCode == 37 && !shift){
                padLeftX -= padSpeed;
            }
        }
        if(padLeftX + padWidth < width - borderRight+10){
            if(kCode == 39 && shift){
                padLeftX += padSpeed*2;
            }
            if(kCode == 39 && !shift){
                padLeftX += padSpeed;
            }
        }
        context.fillRect( padLeftX, padTopY, padWidth, padHeight);
        //

        //		Draw ball
        if(ballDirX == 1 && ballX < (width - borderRight/2 - ballArea*2)){
            ballX += ballSpeed;
        }else{
            ballDirX = 0;
        }
        if(ballDirX == 0 && ballX > borderLeft/2 + ballArea*2){
            ballX -= ballSpeed;
        }else{
            ballDirX = 1;
        }
        if(ballDirY == 1 && ballY > borderTop/2 + ballArea*2){
            ballY -= ballSpeed;
        }else{
            ballDirY = 0;
        }
        if(ballDirY == 0 && ballY < height - borderTop/2 - ballArea*2){
            ballY += ballSpeed;
        }else{
            ballDirY = 1;
        }
        // Collisions
        // 			Pad
        padRightX = padLeftX + padWidth;
        // Top side
        if((ballY >= padTopY - ballArea && ballY <= padTopY) && (ballX >= padLeftX && ballX <= padRightX)){
            ballDirY = 1;
        }
        // Left side
        if((ballY >= padTopY && ballY <= padBottomY) && (ballX >= padLeftX - ballArea && ballX <= padLeftX)){
            ballDirX = 0;
        }
        // Right side
        if((ballY >= padTopY && ballY <= padBottomY) && (ballX >= padRightX && ballX <= padRightX + ballArea)){
            ballDirX = 1;
        }
        // Bottom side
        if((ballY >= padBottomY && ballY <= padBottomY + ballArea) && (ballX >= padLeftX && ballX <= padRightX)){
            ballDirY = 0;
        }

        // Corners
        // Top-Left
        if((ballY >= padTopY-ballArea && ballY <= padTopY) && (ballX >= padLeftX-ballArea && ballX <= padLeftX)){
            ballDirY = 1;
            ballDirX = 0;
        }
        // Top-Right
        if((ballY >= padTopY-ballArea && ballY <= padTopY) && (ballX >= padRightX && ballX <= padRightX+ballArea)){
            ballDirY = 1;
            ballDirX = 1;
        }
        // Bottom-Left
        if((ballY >= padBottomY+ballArea && ballY <= padBottomY) && (ballX >= padLeftX-ballArea && ballX <= padLeftX)){
            ballDirY = 0;
            ballDirX = 0;
        }
        // Bottom-Right
        if((ballY >= padBottomY+ballArea && ballY <= padBottomY) && (ballX >= padRightX && ballX <= padRightX+ballArea)){
            ballDirY = 0;
            ballDirX = 1;
        }

        // corners
        // 	pad

        // 			Blocks
        for(let i = 0; i < blocks.length; i++){
            // Top side
            if((ballY >= blocks[i].y - ballArea && ballY <= blocks[i].y) && (ballX >= blocks[i].x && ballX <= blocks[i].x + blockScaleX)){
                ballDirY = 1;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }
            // Left side
            if((ballY >= blocks[i].y && ballY <= blocks[i].y + blockScaleY) && (ballX >= blocks[i].x - ballArea && ballX <= blocks[i].x)){
                ballDirX = 0;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }
            // Right side
            if((ballY >= blocks[i].y && ballY <= blocks[i].y + blockScaleY) && (ballX >= blocks[i].x + blockScaleX && ballX <= blocks[i].x + blockScaleX + ballArea)){
                ballDirX = 1;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }
            // Bottom side
            if((ballY >= blocks[i].y + blockScaleY && ballY <= blocks[i].y + blockScaleY + ballArea) && (ballX >= blocks[i].x && ballX <= blocks[i].x + blockScaleX)){
                ballDirY = 0;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }

            // Corners
            // Top-Left
            if((ballY >= blocks[i].y-ballArea && ballY <= blocks[i].y) && (ballX >= blocks[i].x-ballArea && ballX <= blocks[i].x)){
                ballDirY = 1;
                ballDirX = 0;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }
            // Top-Right
            if((ballY >= blocks[i].y-ballArea && ballY <= blocks[i].y) && (ballX >= blocks[i].x + blockScaleX && ballX <= blocks[i].x + blockScaleX+ballArea)){
                ballDirY = 1;
                ballDirX = 1;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }
            // Bottom-Left
            if((ballY >= blocks[i].y + blockScaleY+ballArea && ballY <= blocks[i].y + blockScaleY) && (ballX >= blocks[i].x-ballArea && ballX <= blocks[i].x)){
                ballDirY = 0;
                ballDirX = 0;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }
            // Bottom-Right
            if((ballY >= blocks[i].y + blockScaleY+ballArea && ballY <= blocks[i].y + blockScaleY) && (ballX >= blocks[i].x + blockScaleX && ballX <= blocks[i].x + blockScaleX+ballArea)){
                ballDirY = 0;
                ballDirX = 1;
                blocks.splice(i,1);
                scoreValue++;
                break;
            }
            // corners
        }
        // blocks
        // collisions
        context.strokeStyle = 'black';
        context.fillStyle = 'silver';
        drawBall(ballX, ballY, Radius,1);
        // 	draw ball


        stats.end();
        requestAnimationFrame(function(){loop();});
    })();


    // function genSet(){
    // 	var strS = document.getElementById('strS').value;
    // 	var fillS = document.getElementById('fillS').value;
    // 	var lineW = document.getElementById('lineW').value;
    // 	var lineC = document.getElementById('lineC').value;
    // 	ct.strokeStyle = strS;
    // 	ct.lineWidth = lineW;
    // 	ct.lineCap = lineC;
    // }

    // function lineLineTo(){
    // 	var llt = document.getElementById('llt').value;
    // 	var llt2 = document.getElementById('llt2').value;
    // 	ct.lineTo(llt,llt2);
    // }

    // function lineMoveTo(){
    // 	var lmt = document.getElementById('lmt').value;
    // 	var lmt2 = document.getElementById('lmt2').value;
    // 	ct.moveTo(lmt,lmt2);
    // }

    // function canvasSetArc(a){
    // 	if(a == "cl"){
    // 		canvasClear();
    // 	}
    // 	var arcXC = document.getElementById('arcXC').value;
    // 	var arcYC = document.getElementById('arcYC').value;
    // 	var arcR = document.getElementById('arcR').value;
    // 	var arcSA = document.getElementById('arcSA').value;
    // 	var arcEA = document.getElementById('arcEA').value;
    // 	ct.arc(arcXC,arcYC,arcR,arcSA,arcEA);
    // 	ct.stroke();
    // }

    function drawBall(ballX, ballY, Radius, fill){
        context.beginPath();
        context.arc(ballX, ballY, Radius, 0, 2*Math.PI);
        if(fill){
            context.fill();
        }
        context.stroke();
    }

    function canvasReset(){
        let cw = canvas.width;
        canvas.width = cw;
        context.fillStyle = yel;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(0, 0, 0, 0.4)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // canvasClear(borderLeft, borderTop, width - borderRight*2,height - borderTop*2);
        context.fillStyle = yel;
        context.fillRect(20, 20, canvas.width-40, canvas.height-40);
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(20, 20, canvas.width-40, canvas.height-40);
    }
    function canvasClear(x1, y1, width, height){
        context.fillStyle = yel;
        context.fillRect(x1, y1, width, height);
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(x1, y1, width, height);
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

}

