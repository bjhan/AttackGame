(function(){
    window.ontouchstart = function(e) {
        e.preventDefault();
    };
    var bull = function(x,y,dir){
        this.x=x;
        this.y=y;
        this.dir=dir;
    }
    var bulls = [];//存放子弹
    var enemy = function (x,y,life){
        this.x = x;
        this.y = y;
        this.life = life;//1 活着 0 死亡
    }
    var enemys = [];//存放敌人
    var bulldir = 0;//作为英雄的方向

    var gameover = 0;
    var killenemy = 0;//统计杀死的敌人

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.height = 490;
    canvas.width = 490;

    var heropostion = {
        x: 229,
        y: 409,
        dir:0
    }
    var enemypostion = {
        x: 229,
        y: 0,
        dir:0
    }
    var bgimg = new Image();//背景图片
    bgimg.src = 'img/background.png';
    bgimg.onload = function(){
        context.drawImage(bgimg,0,0,canvas.width,canvas.height);
    }

    var heroimg = new Image();//英雄
    heroimg.src = 'img/hero.png';
    heroimg.onload = function(){
        touchfun();//监听触屏，实现上下左右
        bullet();//画子弹
        makeEnemys();//添加敌人
        context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
    }

    var enemyimg = new Image();//敌人
    enemyimg.src = 'img/monster.png';
    enemyimg.onload = function(){
        var ene = new enemy(enemypostion.x,enemypostion.y,1);
        enemys.push(ene);
    }


    document.onkeydown=keyevent;//监听上下左右按键

    document.getElementById('attack').onclick = function(){
        var dat = new bull(heropostion.x+16,heropostion.y+16,1);
        bulls.push(dat);
    }

    document.getElementById('rebegin').onclick = function(){
        makeEnemys();
    }
    var enemytimer;
    function makeEnemys(){
        enemytimer = setInterval(function(){
            var x = Math.round(Math.random()*460);
            var ene = new enemy(x,0,1);
            enemys.push(ene);
        },3000);
    }
    function drawEnemys(){
        for(var i=0;i<enemys.length;i++){
            if(enemys[i].life == 1){//活着
                enemys[i].y = enemys[i].y + 0.5;
                if(enemys[i].y > canvas.height){
                    gameover = 1;
                }
                context.drawImage(enemyimg,enemys[i].x,enemys[i].y,30,32);
            }
        }

    }
    function heromove(direction){
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(bgimg,0,0,canvas.width,canvas.height);
        if(direction == 37){//左
            heropostion.x = heropostion.x - 3;
            if(heropostion.x<0){
                heropostion.x=0;
            }
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        }
        if(direction == 38){//上
            heropostion.y = heropostion.y - 3;
            if(heropostion.y<0){
                heropostion.y=0;
            }
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        }
        if(direction == 39){//右
            heropostion.x = heropostion.x + 3;
            if(heropostion.x>canvas.width-32){
                heropostion.x= canvas.width-32;
            }
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        }
        if(direction == 40){//下
            heropostion.y = heropostion.y + 3;
            if(heropostion.y>canvas.height-32){
                heropostion.y= canvas.height-32;
            }
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        }

    }

    function keyevent(){
        if (event.keyCode==37)//左
            heromove(37);
        if (event.keyCode==38)//上
            heromove(38);
        if (event.keyCode==39)//右
            heromove(39);
        if (event.keyCode==40)//下
            heromove(40);
    }


    var timer;
    var biaoji = 0;
    function bullet(){
        //timer = setInterval(function(){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);

            drawEnemys();//画出敌人

            if(gameover == 1 && biaoji == 0){
                biaoji = 1;
                alert('游戏结束，共射杀了'+killenemy+'个敌人');
                enemys = [];
                clearInterval(enemytimer);
            }
            for(var i=0;i<bulls.length;i++){
                if(bulls[i].dir!=0){
                    context.beginPath();
                    context.fillStyle = 'red';
                    context.arc(bulls[i].x,bulls[i].y,3,0,2*Math.PI);
                    context.fill();
                    context.closePath();

                    if(bulls[i].dir==1){
                        if(bulls[i].y>canvas.height){
                            bulls[i].dir = 0;
                        }else {
                            attackcheck(bulls[i].x,bulls[i].y);
                            bulls[i].y = bulls[i].y - 2;
                        }

                    }
                }
            }
        //},10);

        timer = requestAnimationFrame(bullet);

    }

    function attackcheck(x,y){
        for(var i=0;i<enemys.length;i++){
            if(enemys[i].life == 1){
                if(enemys[i].x < x && (enemys[i].x+32) > x){
                    if(enemys[i].y < y && (enemys[i].y+32) > y){
                        enemys[i].life = 0;
                        killenemy ++;
                        document.getElementById('span').innerHTML = killenemy;
                    }
                }
            }
        }
    }

    var touchflag  = 1;
    var touched;
    function touchfun(){
        document.getElementById('heroup').addEventListener('touchstart', function(event){
            touched = setInterval(function(){
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(bgimg,0,0,canvas.width,canvas.height);

                heropostion.y = heropostion.y - 3;
                context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);

            },50);

        })
        document.getElementById('heroup').addEventListener('touchmove', function(event){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);

            heropostion.y = heropostion.y - 3;
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })
        document.getElementById('heroup').addEventListener('touchend', function(event){
            clearInterval(touched);
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })

        document.getElementById('herodown').addEventListener('touchstart', function(event){
            touched = setInterval(function(){
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(bgimg,0,0,canvas.width,canvas.height);

                heropostion.y = heropostion.y + 3;
                context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);

            },50);

        })
        document.getElementById('herodown').addEventListener('touchmove', function(event){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);

            heropostion.y = heropostion.y + 3;
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })
        document.getElementById('herodown').addEventListener('touchend', function(event){
            clearInterval(touched);
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })

        document.getElementById('heroleft').addEventListener('touchstart', function(event){
            touched = setInterval(function(){
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(bgimg,0,0,canvas.width,canvas.height);

                heropostion.x = heropostion.x - 3;
                context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);

            },50);

        })
        document.getElementById('heroleft').addEventListener('touchmove', function(event){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);

            heropostion.x = heropostion.x - 3;
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })
        document.getElementById('heroleft').addEventListener('touchend', function(event){
            clearInterval(touched);
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })

        document.getElementById('heroright').addEventListener('touchstart', function(event){
            touched = setInterval(function(){
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(bgimg,0,0,canvas.width,canvas.height);

                heropostion.x = heropostion.x + 3;
                context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);

            },50);

        })
        document.getElementById('heroright').addEventListener('touchmove', function(event){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);

            heropostion.x = heropostion.x + 3;
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })
        document.getElementById('heroright').addEventListener('touchend', function(event){
            clearInterval(touched);
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(bgimg,0,0,canvas.width,canvas.height);
            context.drawImage(heroimg,heropostion.x,heropostion.y,32,32);
        })

        document.getElementById('attack').addEventListener('touchstart', function(event){
            var dat = new bull(heropostion.x+16,heropostion.y+16,1);
            bulls.push(dat);

        })
        document.getElementById('attack').addEventListener('touchmove', function(event){
            event.stopPropagation();
            event.preventDefault();
        })
        document.getElementById('attack').addEventListener('touchend', function(event){
            event.stopPropagation();
            event.preventDefault();
        })
    }

})();