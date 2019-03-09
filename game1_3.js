window.onload = init;

var canvas;
var ctx;
var upPressed = false;
var downPressed = false;
var ballX = 300;
var ballY = 400;
var mePaddleY = 250;
var comPaddleY = 250;
var paddleHeight = 100;
var paddleWidth = 10;
var moveX = 13;
var moveY = 6;
var meScore = 0;
var comScore = 0;
var winScore = 3;
var result = false;
var audio = new Audio("Mr_Tea.mp3");

document.addEventListener("keyup", keyUpHandler, false); //(위)키보드 이벤트를 위한 이벤트리스너
document.addEventListener("keydown", keyDownHandler, false); //(아래)키보드 이벤트를 위한 이벤트리스너

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
  if(meScore >= winScore || comScore >= winScore) { //내 점수 또는 컴퓨터 점수가 3점보다 크거나 같을시
    result = true; //결과창이 나오게 한다.
  }
  moveX = -moveX; //초기화 후 튕겨나갈 수 있도록 한다.
  ballX = canvas.width/2; //공의 x좌표는 캔버스 가로 / 2;
  ballY = canvas.height/2; //공의 y좌표는 캔버스 세로 / 2;
}

function comPaddle() {
  var comPaddle = comPaddleY + (paddleHeight / 2); //컴퓨터 막대의 중심은 컴퓨터 막대의 y좌표 + 막대 높이/2
  if(comPaddle - ballY < 0) { //컴퓨터 막대의 중심에서 공의 y좌표를 뺀 게 0보다 작다면 (공이 막대보다 밑에 있다면)
    comPaddleY += 6; //컴퓨터 막대의 y좌표는 3 증가된다. (아래로 내려간다.)
  }
  else if(comPaddle - ballY > 0) { //컴퓨터 막대의 중심에서 공의 y좌표를 뺀 게 0보다 크다면 (공이 막대보다 위에 있다면)
    comPaddleY -= 6; //컴퓨터 막대의 y좌표는 3 감소된다. (위로 올라간다.)
  }
}

function hit() { 
  if(result == true) { //결과창이 나오면
    return false; //false를 리턴한다. (공 멈추도록)
  }
  comPaddle(); //컴퓨터 막대의 이동을 실행하는 함수 호출
  ballX += moveX; //튕겨 나갈 수 있도록 한다.
  ballY += moveY; //튕겨 나갈 수 있도록 한다.
  if (ballX > canvas.width) { //캔버스의 가로보다 공의 x좌표가 더 클 때 (오른쪽 벽에 부딪혔을 때)
    if(ballY > comPaddleY && ballY < comPaddleY + paddleHeight) { //공의 y좌표가 컴퓨터의 y좌표보다 크고 컴퓨터의 y좌표 + 막대 높이보다 작을 때
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
      comScore ++; //컴퓨터 점수 증가
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
  Rect(canvas.width - paddleWidth, comPaddleY, paddleWidth, paddleHeight, "black"); //오른쪽 막대(컴퓨터 막대) 그리기
  Circle(ballX, ballY, 10, "black"); //공 그리기
  ctx.font = "80px 고딕";
  ctx.fillText(meScore, 170, 100); //내 점수 출력
  ctx.fillText(comScore, 590, 100); //컴퓨터 점수 출력

  if(result == true) { //결과창
    if(meScore >= winScore) { //내 점수가 3점보다 같거나 클시
      ctx.font = "60px 고딕"; 
      ctx.fillText("당신이 승리하였습니다!", 95, 180); //승리 문구 출력
    }
    else if(comScore >= winScore) { //컴퓨터 점수가 3점보다 같거나 클시
      ctx.font = "60px 고딕";
      ctx.fillText("컴퓨터가 승리하였습니다!", 70, 180); //승리 문구 출력
    }
  }
}