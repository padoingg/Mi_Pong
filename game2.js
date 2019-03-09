window.onload = init;

var canvas;
var ctx;
var upPressed = false;
var downPressed = false;
var upPressed2 = false;
var downPressed2 = false;
var ballX = 300;
var ballY = 400;
var mePaddleY = 250;
var youPaddleY = 250;
var paddleHeight = 100;
var paddleWidth = 10;
var moveX = 10;
var moveY = 4;
var meScore = 0;
var youScore = 0;
var winScore = 5;
var result = false;
var audio = new Audio("Mr_Tea.mp3");

document.addEventListener("keyup", keyUpHandler, false); //(위)키보드 이벤트를 위한 이벤트리스너
document.addEventListener("keydown", keyDownHandler, false); //(아래)키보드 이벤트를 위한 이벤트리스너
document.addEventListener("keyup", keyUpHandler2, false); //(위)키보드 이벤트를 위한 이벤트리스너
document.addEventListener("keydown", keyDownHandler2, false); //(아래)키보드 이벤트를 위한 이벤트리스너

function init(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  setInterval(function() { //일정 시간마다 반복 실행
    hit(); //공이 벽과 막대에 부딪혔을 때 실행되는 함수 호출
    draw(); //막대와 공 그리고 점수와 결과 화면을 실행시키는 함수 호출
  }, 1000 / 30); //1000 / 30 -> 30fps (1초에 30번 실행)
}

function keyUpHandler(e) {
  if(e.keyCode == 38) { //윗 방향키의 키코드는 38
    upPressed = false;
  }
  else if(e.keyCode == 40) { //아래 방향키의 키코드는 40
    downPressed = false;
  }
}

function keyDownHandler(e) {
  if(e.keyCode == 38) { //윗 방향키의 키코드는 38
    upPressed = true;
  }
  else if(e.keyCode == 40) { //아래 방향키의 키코드는 40
    downPressed = true;
  }
}

function keyUpHandler2(v) {
  if(v.keyCode == 87) { //w키의 키코드는 87
    upPressed2 = false;
  }
  else if(v.keyCode == 83) { //s키의 키코드는 83
    downPressed2 = false;
  }
}

function keyDownHandler2(v) {
  if(v.keyCode == 87) { //w키의 키코드는 87
    upPressed2 = true;
  }
  else if(v.keyCode == 83) { //s키의 키코드는 83
    downPressed2 = true;
  }
}

function Rect(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
  ctx.fillRect(this.x, this.y, this.w, this.h);
  if(upPressed && mePaddleY >= 0) {
    mePaddleY -= 7;
  }
  else if(downPressed && mePaddleY < canvas.height - paddleHeight) {
    mePaddleY += 7;
  }
  if(upPressed2 && youPaddleY >= 0) {
    youPaddleY -= 7;
  }
  else if(downPressed2 && youPaddleY < canvas.height - paddleHeight) {
    youPaddleY += 7;
  }
}

function Circle(x, y, r, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.c = c;
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function reset() {
  if(meScore >= winScore || youScore >= winScore) { //내 점수 또는 컴퓨터 점수가 5점보다 크거나 같을시
    result = true; //결과창이 나오게 한다.
  }
  moveX = -moveX; //초기화 후 튕겨나갈 수 있도록 한다.
  ballX = canvas.width/2; //공의 x좌표는 캔버스 가로 / 2;
  ballY = canvas.height/2; //공의 y좌표는 캔버스 세로 / 2;
}

function hit() { 
  if(result == true) { //결과창이 나오면
    return false; //false를 리턴한다. (공 멈추도록)
  }
  ballX += moveX; //튕겨 나갈 수 있도록 한다.
  ballY += moveY; //튕겨 나갈 수 있도록 한다.
  if (ballX > canvas.width) { //캔버스의 가로보다 공의 x좌표가 더 클 때 (오른쪽 벽에 부딪혔을 때)
    if(ballY > youPaddleY && ballY < youPaddleY + paddleHeight) { //공의 y좌표가 컴퓨터의 y좌표보다 크고 컴퓨터의 y좌표 + 막대 높이보다 작을 때
      moveX = -moveX; //튕겨 나갈 수 있도록 한다.
    }
    else {
      meScore ++; //내 점수 증가
      reset(); //공의 위치 초기화
    }
  }
  if (ballX < 0) { //공의 x좌표가 0보다 작을 때 (왼쪽 벽에 부딪혔을 때)
    if(ballY > mePaddleY && ballY < mePaddleY + paddleHeight) { //공의 y좌표가 내 y좌표보다 크고 내 y좌표 + 막대 높이보다 작을 때
      moveX = -moveX; //튕겨 나갈 수 있도록 한다.
    }
    else {
      youScore ++; //컴퓨터 점수 증가
      reset(); //공의 위치 초기화
    }
  }
  if (ballY > canvas.height) { //공의 y좌표가 캔버스 높이보다 클 때 (아래쪽 벽에 부딪혔을 때)
    moveY = -moveY; //튕겨 나갈 수 있도록 한다.
  }
  if (ballY < 0) { //공의 y좌표가 0보다 작을 때 (위쪽 벽에 부딪혔을 때)
    moveY = -moveY; //튕겨 나갈 수 있도록 한다.
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //화면 지우기
  Rect(0, mePaddleY, paddleWidth, paddleHeight, "black"); //왼쪽 막대(내 막대) 그리기
  Rect(canvas.width - paddleWidth, youPaddleY, paddleWidth, paddleHeight, "black"); //오른쪽 막대(컴퓨터 막대) 그리기
  Circle(ballX, ballY, 10, "black"); //공 그리기
  ctx.font = "80px 함초롬바탕";
  ctx.fillText(meScore, 170, 100); //내 점수 출력
  ctx.fillText(youScore, 590, 100); //컴퓨터 점수 출력

  if(result == true) { //결과창
    if(meScore >= winScore) { //내 점수가 5점보다 같거나 클시
      ctx.font = "60px 함초롬바탕"; 
      ctx.fillText("왼쪽 플레이어", 230, 180);
      ctx.fillText("승리!", 345, 255);
    }
    else if(youScore >= winScore) { //컴퓨터 점수가 5점보다 같거나 클시
      ctx.font = "60px 함초롬바탕";
      ctx.fillText("오른쪽 플레이어", 210, 180);
      ctx.fillText("승리!", 345, 255);
    }
  }
}