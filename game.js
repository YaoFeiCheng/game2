
var g = null;
var div = document.getElementById('score');
var end = document.getElementById('over');
var score = div.getElementsByTagName('span')[0];
var cvs = document.getElementById('cvs');
var ctx = cvs.getContext('2d');

var sprite = new Image();
var explosion = new Image();
var bullet = new Image();
sprite.src = 'images/sprite.png';
explosion.src = 'images/explosion.png';
bullet.src = 'images/bullet.png';


function start() {
    g = new Game();
    g.render();
    g.update();
}

function Game() {
    var _this = this;
    this.score = 0;
    this.x=[];
    this.y=[];
    this.bar = null;
    this.enemy = [];
    this.bullet = [];
    this.tools = [];
    this.width = 20;
    this.strong = 0;
    this.temp = 0;
    this.cd = 10;
    this.frame = 0;
    this.lastFrame = 0;
    document.onclick = function() {
        if(_this.frame>=_this.lastFrame+_this.cd){
            _this.bullet.push(new Bullet(_this.bar.angle,_this.bar.positionX,_this.bar.positionY)) ;
            _this.lastFrame = _this.frame;
        }
    };
    this.render = function () {
        _this.bar = new Draw();
    };
    this.update =  function() {
        ctx.clearRect(0,0,cvs.width,cvs.height);
        _this.temp++;
        _this.frame++;
        if(_this.temp % 20 == 0){
            _this.enemy.push(new Enemy());
        };
        if(_this.temp % 1000 == 0){
            _this.tools.push(new Tools())
        };
        _this.bar.updatePos();
        _this.bar.drawBar();
        _this.tools.forEach(function (val,index) {
            val.updatePos();
            for(var i=0;i<_this.x.length;i++){
                val.updateStatus(_this.x[i],_this.y[i],_this.width,20);
            };
            val.drawTools();
            if(val.dead){
                _this.tools.splice(index,1);
                _this.strong ++ ;
            }
        });
        _this.enemy.forEach(function (val,index) {
            val.updatePos();
            val.gameOver();
            for(var i=0;i<_this.x.length;i++){
                val.updateStatus(_this.x[i],_this.y[i]);
            }
            val.drawEnemy();
            if(val.dead){
                _this.enemy.splice(index,1);
                for (var j=0;j<16;j++){
                    val.explosion();
                }
                _this.score++;
                score.innerHTML = _this.score;
            }
            if(val.over){
                end.open = true;
                end.onclick = function(){
                    location.reload();
                };
            }
        });
        _this.bullet.forEach(function (val,index) {
            val.updatePos();
            val.updateStatus();
            val.drawBullet1();

            if (_this.strong >=1){
                val.drawBullet2();
                _this.width = 40;
            }
            if (_this.strong >=2){
                val.drawBullet3();
                _this.width = 60;
            }


            _this.x[index] = val.positionX;
            _this.y[index] = val.positionY;
            if(val.dead){
                _this.bullet.splice(index,1);
                _this.x.splice(index,1);
                _this.y.splice(index,1);
            }
        });
        window.requestAnimationFrame(_this.update)
    };
}

function Draw() {
    var _this = this;
    this.angle = 0;
    this.rotate = 0;
    this.positionX = 0;
    this.positionY = 0;

    this.drawBar = function () {
        ctx.save();
        ctx.translate(cvs.width/2,cvs.height/2);
        ctx.rotate(_this.rotate);
        ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200,200);
        ctx.restore();

        ctx.save();
        ctx.translate(_this.positionX,_this.positionY);
        ctx.rotate(_this.angle + Math.PI*90/180);
        ctx.drawImage(sprite, 200, 0, 75, 75, -28, 0, 50,50);
        ctx.restore();
        /*ctx.beginPath();
        ctx.arc(cvs.width/2,cvs.height/2,100,0,Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();*/

        /*ctx.beginPath();
        ctx.moveTo(cvs.width/2,cvs.height/2);
        ctx.lineTo(_this.positionX,_this.positionY);
        ctx.strokeStyle = 'red';
        ctx.stroke();*/
    };
    this.updatePos = function () {
        _this.rotate+=0.01;
        if(_this.rotate == 360){
            _this.rotate == 0;
        }
        _this.positionX = cvs.width/2 + 150 * Math.cos(_this.angle);
        _this.positionY = cvs.height/2 + 150 * Math.sin(_this.angle);
    };
    cvs.onmousemove = function (e) {
        _this.angle = Math.atan2(e.pageY-cvs.height/2 ,e.pageX-cvs.width/2);
    }
}

function Bullet(angle,x,y) {
    var _this = this;
    this.angle = angle;
    this.positionX = x;
    this.positionY = y;
    this.v = 10;
    this.dt = 1;
    this.dead = false;
    this.drawBullet1 = function () {
        ctx.save();
        ctx.translate(_this.positionX,_this.positionY);
        ctx.rotate(_this.angle+Math.PI*90/180);
        ctx.drawImage(
            sprite,
            211,
            100,
            50,
            75,
            -10,
            0,
            20,
            30
        );
        ctx.restore();

        /*ctx.beginPath();
        ctx.arc(_this.positionX,_this.positionY,15,0,Math.PI*2);
        ctx.fillStyle = 'black';
        ctx.fill();*/
    };
    this.drawBullet2 = function () {
        ctx.save();
        ctx.translate(_this.positionX,_this.positionY);
        ctx.rotate(_this.angle+Math.PI*90/180);
        ctx.drawImage(
            sprite,
            211,
            100,
            50,
            75,
            0,
            0,
            20,
            30
        );
        ctx.restore();
    };
    this.drawBullet3 = function () {
        ctx.save();
        ctx.translate(_this.positionX,_this.positionY);
        ctx.rotate(_this.angle+Math.PI*90/180);
        ctx.drawImage(
            sprite,
            211,
            100,
            50,
            75,
            -20,
            0,
            20,
            30
        );
        ctx.restore();
    };

    this.updatePos = function () {
        _this.positionX += _this.v*_this.dt * Math.cos(-_this.angle);
        _this.positionY -= _this.v*_this.dt * Math.sin(-_this.angle);
        //console.log(_this.positionX);
    };
    this.updateStatus = function () {
        if(_this.positionX >= cvs.width-15 || _this.positionX <= 15 || _this.positionY <= 15 || _this.positionY >= cvs.height - 15){
            _this.dead = true;
        }
    }
}

function Enemy() {
    var _this = this;
    this.arr = [10,940];
    this.positionX = Math.random() * 1920;
    this.positionY = _this.arr[parseInt(Math.random()*2)];
    this.n = _this.positionY;
    this.angle =  Math.PI / 180 * (Math.random()*180);
    this.v =2+ Math.random()*5;
    this.dt = 1;
    this.temp1 = 0;
    this.temp2 = 0;
    this.dead = false;
    this.over = false;

    this.drawEnemy = function () {

        ctx.drawImage(sprite, 270, 0, 150, 150, _this.positionX,_this.positionY, 100,100);
        /* ctx.beginPath();
         ctx.arc(_this.positionX,_this.positionY,10,0,Math.PI * 2);
         ctx.fillStyle = 'green';
         ctx.fill();*/
    };
    this.updatePos = function () {
        _this.positionX += _this.v * _this.dt * Math.cos(_this.angle);
        if(_this.n < 100){
            _this.positionY += _this.v * _this.dt * Math.sin(_this.angle);
        }else {
            _this.positionY -= _this.v * _this.dt * Math.sin(_this.angle);
        }
    };
    this.updateStatus = function (x,y) {
        /* if(_this.positionX >= cvs.width-15 || _this.positionX <= 15 || _this.positionY >= 500){
             _this.dead = true;
         }*/
        var x1 = _this.positionX;
        var x2 = x;
        var y1 = _this.positionY;
        var y2 = y;
        var w1 = 100;
        var w2 = 20;
        var h1 = 100;
        var h2 = 30;

        if(!((x1 + w1)<x2 || (x2+w2)<x1 || (y1+h1)<y2 || (y2+h2)<y1)){
            _this.dead = true;
        }
        /*if(Math.sqrt(((_this.positionX+50)-(x+50))*((_this.positionX+50)-(x+50))+((_this.positionY+50)-(y+50))*((_this.positionY+50)-(y+50))) <= 60){
            _this.dead = true;
        }*/
    };
    this.gameOver = function () {
        var x1 = _this.positionX;
        var x2 = cvs.width/2-50;
        var y1 = _this.positionY;
        var y2 = cvs.height/2-50;
        var w1 = 100;
        var w2 = 100;
        var h1 = 100;
        var h2 = 100;

        if(!((x1 + w1)<x2 || (x2+w2)<x1 || (y1+h1)<y2 || (y2+h2)<y1)){
            _this.over = true;
        }
    };
    this.explosion = function () {

        ctx.drawImage(
            explosion,
            _this.temp1 * explosion.width/8,
            _this.temp2 * explosion.height/4,
            explosion.width/8,
            explosion.height/4,
            _this.positionX-50,
            _this.positionY-50,
            150,
            150,
        );
        _this.temp1++;
        if(_this.temp1 == 8){
            _this.temp1 = 0;
            _this.temp2++;
        }
    };
}

function Tools() {
    var _this = this;
    this.positionX = 0;
    this.positionY =50+ Math.random() * 850;
    this.v = 5 + Math.random() * 3;
    this.dead = false;

    this.drawTools = function () {
        ctx.drawImage(bullet,0,0,100,28,_this.positionX,_this.positionY,100,28);
    };
    this.updatePos = function () {
        var dt = 1;
        _this.positionX += _this.v *dt;
    };
    this.updateStatus = function (x,y) {
        var x1 = _this.positionX;
        var x2 = x;
        var y1 = _this.positionY;
        var y2 = y;
        var w1 = 100;
        var w2 = 20;
        var h1 = 28;
        var h2 = 30;

        if(!((x1 + w1)<x2 || (x2+w2)<x1 || (y1+h1)<y2 || (y2+h2)<y1)){
            _this.dead = true;
        }
    }
}