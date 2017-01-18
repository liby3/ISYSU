function gameExec(game) {
	if (game.state != "exec")
		return ;
	var BGwidth = 815, BGheigth = 445, groundHeight = 30;
	
	var MyObject = function() {						//自定义object类
		this.dw = arguments[0];
		this.dh = arguments[1];
		this.sx = arguments[2];
		this.sy = arguments[3];
		this.dx = BGwidth;
		this.dy = 0;
	};

	MyObject.prototype.isImpact = function(obj) {	//碰撞检测
		var cx = this.dx+this.sx+this.dw/2, cy = this.dy+this.sy+this.dh/2;
		var cx_ = obj.dx+obj.sx+obj.dw/2, cy_ = obj.dy+obj.sy+obj.dh/2;
		if (Math.abs(cx-cx_) < this.dw/2+obj.dw/2)
			if (Math.abs(cy-cy_) < this.dh/2+obj.dh/2)
				return true;
		return false;
	};

	MyObject.prototype.move = function(speed) {
		this.dx -= speed/24;
	};

	var Chicken = function() {
		MyObject.call(this, 80*350/500, 80*460/500, 80*70/500, 0);
		this.dx = 100;
		this.dy = BGheigth-groundHeight-80;
		this.hp = 2;
		this.state = "run1";
		this.isProtected = false;
	
		//这里修改跳跃的高度，和跳跃的速度？？？
		this.jump = function(){
			var v0 = 900 , a = 2*v0;
			var t = Timer-startTime;
			t = t/1000;
		
			if (t < 0.01)
				return;
			this.dy = startDy-v0*t+a/2*t*t;
			if (this.dy >= BGheigth-groundHeight-80)
			{
				this.dy = BGheigth-groundHeight-80;
				this.state = "run1";
			}
		};
	
		this.isImpact = false;
	};

	var Moon = function() {
		MyObject.call(this, 10*350/800, 10*460/800, 10*70/800, 0);
		this.dx = 900;
		this.dy = 10;
	};
	Moon.prototype = new MyObject();
	
	var Tree = function(){
		MyObject.call(this, 4, 7, 0, 0);
		this.dx = BGwidth;
		this.dy = BGheigth-groundHeight-130*17/20;
		this.id = "tree";
	};
	Tree.prototype = new MyObject();

	var XTree = function(){
		MyObject.call(this, 18, 28, 64, 48);
		this.dx = BGwidth;
		this.dy = BGheigth-groundHeight-130*17/20;
		this.id = "xtree";
	};
	XTree.prototype = new MyObject();

	var PhysicalTest = function() {
		MyObject.call(this, 18, 28, 64, 48);
		this.dx = BGwidth;
		this.dy = BGheigth-groundHeight-100*11/20;
		this.id = "physical_test";
	};
	PhysicalTest.prototype = new MyObject();

	var Medicinebox = function() {
		MyObject.call(this, 85, 68, 15, 8);
		this.dx = BGwidth;
		this.dy = 100+170*Math.random();
		this.id = "medicinebox";
	};
	Medicinebox.prototype = new MyObject();

	var Schoolarship = function() {
		MyObject.call(this, 85, 68, 15, 8);
		this.dx = BGwidth;
		this.dy = 100+200*Math.random();
		this.id = "schoolarship";
	}
	Schoolarship.prototype = new MyObject();
	
	var Pipa = function() {
		MyObject.call(this, 85, 68, 15, 8);
		this.dx = BGwidth;
		this.dy = 120+200*Math.random();
		this.id = "pipa";
	}
	Pipa.prototype = new MyObject();

	var Offer = function() {
		MyObject.call(this, 85, 68, 15, 8);
		this.dx = BGwidth;
		this.dy = 150+200*Math.random();
		this.id = "offer";
	}
	Offer.prototype = new MyObject();


	var Cloud = function() {
		MyObject.call(this, 0, 0, 0, 0);
		this.dx = BGwidth;
		/* 数值越小，云朵越高 */
		this.dy = 10+10*Math.random();
		this.size = 1;
		this.speed = 1;
		this.id = "cloud";
	};
	Cloud.prototype = new MyObject();


	var FG=document.getElementById("myFrontGround");
	var context=FG.getContext("2d");
	context.font = "25px Arial";

	var counterSchoolarships = 0;
	var getSchoolarships = 0;
	var counterFailed = 0;
	var getOffer = 0;
	var getPipa = 0;

	var FGspeed = 150;
	var score = 0, distance = 0;
	var startDy, startTime;
	
	var Obstacle = [],func = [];
	var clouds = [];
	var schoolarship = 0, schoolarObj = new Schoolarship();
	var medicinebox = 0 ,medObj = new Medicinebox();
	var offer = 0, offerObj = new Offer();
	var pipa = 0, pipaObj = new Pipa();

	var clock, Timer = 0;
	var chicken = new Chicken();
	var skymoon = new Moon();
	func.push(Tree);
	func.push(XTree);
	func.push(PhysicalTest);

	var addObs = function(type) {						//添加障碍物函数
		var obs_tree = new func[0]();
		var obs_xtree= new func[1]();
		var obs_physicaltest = new func[2]();
		if (type == 1) {
			Obstacle.push(obs_tree);
		}
		else if (type == 2) {
			Obstacle.push(obs_xtree);
		}
		else if (type == 3) {
			Obstacle.push(obs_physicaltest);
		}
	};

	//进行画面更新的函数
	var mainFunc = function() {
		context.clearRect(0, 0, BGwidth, BGheigth);
		myImage=document.getElementById("moon");
		context.drawImage(myImage, skymoon.dx, skymoon.dy, 35, 35);

		//云的动作
		for(var i = 0; i < clouds.length;i++) {
			if (clouds[0].dx+400 < 0) {
				clouds.shift();
				continue;
			}
			clouds[i].move(FGspeed*clouds[i].speed);
			myImage=document.getElementById(clouds[i].id);
			context.drawImage(myImage, clouds[i].dx, clouds[i].dy, 300*clouds[i].size, 200*clouds[i].size);
		}
		
		if (0.98 < Math.random()) {
			if (clouds.length < 3||clouds[clouds.length-3].dx < 550) {
				var c = new Cloud();
				c.size = 0.2+0.4*Math.random();
				c.speed = 0.2+0.5*Math.random();
				clouds.push(c);
			}
		}
		//障碍物的动作
		for (var i = 0;i < Obstacle.length;i++) {
			var obs = Obstacle[i];
			obs.move(FGspeed*0.9);
			if (!chicken.isProtected && 100-160 < obs.dx && obs.dx < 200) {
				if (obs.isImpact(chicken)) {
					chicken.hp--;
					if (chicken.hp == 0) {
						clearInterval(clock);
						game.state = "end";			
					}
					chicken.isProtected = true;
					var myDate = new Date();
					startTime = Timer;
				}
			}
			myImage=document.getElementById(obs.id);
			context.drawImage(myImage, obs.dx, obs.dy, 120, 120);
		}

		if ((score > 999 && score < 1000) || (score > 1999 && score < 2000)) {
			addObs(1);	
		}
		if ((score > 499 && score < 500) || (score > 1499 && score < 1500)) {
			addObs(2);
		}
		if ((score > 99 && score < 100) || (score > 899 && score < 900) || (score > 2999) && score < 3000) {
			addObs(3);
		}
		//药箱 
		if (medicinebox == 0) {
			if (chicken.hp == 1&&0.98 < Math.random()) {
				medObj = new Medicinebox();
				medicinebox = 1;
				if (Obstacle.length != 0) {
					if (medObj.isImpact(Obstacle[Obstacle.length-1])) {
						medObj.dy-150;
					}
				}
			}
		}
		else {
			medObj.move(FGspeed);
			myImage=document.getElementById(medObj.id);
			context.drawImage(myImage, medObj.dx, medObj.dy, 113, 75);
			if (medObj.isImpact(chicken)) {
				medicinebox = 0;
				if (chicken.hp == 1)
					chicken.hp++;
					counterFailed++;
			}
			if (medObj.dx+150 < 0)
				medicinebox = 0;
		}
		//奖学金
		if (schoolarship == 0) {
			if (0.98 < Math.random() && score < 5500 && score > 1500) {
				schoolarObj = new Schoolarship();
				schoolarship = 1;
				counterSchoolarships++;
				if (Obstacle.length != 0) {
					if (schoolarObj.isImpact(Obstacle[Obstacle.length-1])) {
						schoolarObj.dy-150;
					}
				}
			}
		}
		else {
			schoolarObj.move(FGspeed);
			myImage=document.getElementById(schoolarObj.id);
			context.drawImage(myImage, schoolarObj.dx, schoolarObj.dy, 113, 75);
			if (schoolarObj.isImpact(chicken)) {
				counterSchoolarships++;
				getSchoolarships++;
				schoolarship = 0;
			}
			if (schoolarObj.dx+150 < 0) {
				schoolarship = 0;
			}
		}
		//Offer
		if (offer == 0) {
			if (0.98 < Math.random() && score < 7200 && score > 5700) {
				offerObj = new Offer();
				offer = 1;
				if (Obstacle.length != 0) {
					if (offerObj.isImpact(Obstacle[Obstacle.length-1])) {
						offerObj.dy-150;
					}
				}
			}
		}
		else {
			offerObj.move(FGspeed);
			myImage=document.getElementById(offerObj.id);
			context.drawImage(myImage, offerObj.dx, offerObj.dy, 113, 75);
			if (offerObj.isImpact(chicken)) {
				getOffer++;
				offer = 0;
			}
			if (offerObj.dx+150 < 0) {
				offer = 0;
			}
		}
		//琵琶
		if (pipa == 0) {
			if (score < 5060 && score > 5050) {
				pipaObj = new Pipa();
				pipa = 1;
				if (Obstacle.length != 0) {
					if (pipaObj.isImpact(Obstacle[Obstacle.length-1])) {
						pipaObj.dy-150;
					}
				}
			}
		}
		else {
			pipaObj.move(FGspeed);
			myImage=document.getElementById(pipaObj.id);
			context.drawImage(myImage, pipaObj.dx, pipaObj.dy, 113, 75);
			if (pipaObj.isImpact(chicken)) {
				getPipa++;
				pipa = 0;
			}
			if (pipaObj.dx+150 < 0) {
				pipa = 0;
			}
		}

		var health = "";//鸡的动作
		if (chicken.hp < 2) {
			health = "h";
		}
		if (chicken.state == "run1") {
			myImage=document.getElementById("run1"+health);
			context.drawImage(myImage, chicken.dx, chicken.dy, 80, 80);
			chicken.state="run2";
		}
		else if (chicken.state == "jump") {
			myImage=document.getElementById("run1"+health);
			context.drawImage(myImage, chicken.dx, chicken.dy, 80, 80);
			chicken.jump();
		}
		else {
			myImage=document.getElementById("run2"+health);
			context.drawImage(myImage, chicken.dx, chicken.dy, 80, 80);
			chicken.state="run1";
		}
	
		if (chicken.isProtected) {
			var myDate = new Date(), millisec = myDate.getMilliseconds();
			millisec = Math.floor(millisec/1000*24);
			if (millisec%2 == 0)
				myImage=document.getElementById("null");
				context.drawImage(myImage, chicken.dx, chicken.dy, 80, 80);
			if (Timer - startTime >= 1000)
				chicken.isProtected = false;
		}

		if (game.state == "end") {
			context.clearRect(0, 0, BGwidth, BGheigth);
			(function() {
				$("#marquee1").kxbdMarquee.stopLoop();
			})();
			clearInterval(clock);
			myImage=document.getElementById("gameover");
			context.drawImage(myImage, 200, 100, 400, 100);
			myImage=document.getElementById("hint");
			context.drawImage(myImage, 400-937/4/2, 220, 937/4, 137/4);
			return ;
		}
		if (score >= 8010) {
			clearInterval(clock);
			context.clearRect(0, 0, BGwidth, BGheigth);
			myImage = document.getElementById("background");
			context.drawImage(myImage, 0, 0, BGwidth, BGheigth);
			(function() {
				$("#marquee1").kxbdMarquee.stopLoop();
			})();
			myImage=document.getElementById("sheet");
			context.drawImage(myImage, 10, 10, 200, 100);
			
			myImage=document.getElementById("time_schoolarship");
			context.drawImage(myImage, 10, 100, 137, 60);
			context.fillText(getSchoolarships, 155, 145);

			myImage=document.getElementById("time_failed");
			context.drawImage(myImage, 10, 140, 137, 90);
			context.fillText(counterFailed, 155, 195);

			myImage=document.getElementById("time_offer");
			context.drawImage(myImage, 10, 190, 137, 90);
			context.fillText(getOffer, 155, 245);

			//保研资格……
			if (counterFailed ==0 && getSchoolarships > 0) {
				myImage=document.getElementById("tuimian");
				context.drawImage(myImage, 10, 250, 220, 90);
			}
			//offer收割机……
			if (getOffer > 5) {
				myImage=document.getElementById("shougeji");
				context.drawImage(myImage, 10, 300, 220, 90);
			}
			//Pipa
			if (getPipa == 1) {
				myImage=document.getElementById("wei");
				context.drawImage(myImage, 10, 360, 260, 90);
			}
			return ;
		}

		score += 0.1*FGspeed/24;								//分数，时钟，速度等的更新
		myImage = document.getElementById("score");
		context.drawImage(myImage, 10, 10, 68, 25);
		context.fillText(Math.ceil(score), 85, 30);
		Timer += 1000/24;
		FGspeed += 0.1;
	}

	document.addEventListener("keydown",function(e) {
		//按下了空格键
		if (e.keyCode == 32 && chicken.state != "jump" && game.state == "exec") {
			startDy = chicken.dy;
			var myDate = new Date();
			startTime = Timer;
			chicken.state = "jump";
		}

		//按下了p键
		if (e.keyCode == 80 && chicken.hp != 0) {
			//正在执行变为暂停
			if (game.state == "exec") {
				game.state = "pause";
				(function() {
					$("#marquee1").kxbdMarquee.stopLoop();
				})();
				clearInterval(clock);
				myImage=document.getElementById("pause");
				context.drawImage(myImage, 332, 100, 137, 56);
			}
			//暂定恢复为正在执行
			else if (game.state == "pause") {
				game.state = "exec";
				clock = setInterval(mainFunc, 1000/24);
				(function(){
					$("#marquee1").kxbdMarquee({direction:"left",scrollDelay:50,loop:1});
				})();
			}
		}
	},false);
	clock = setInterval(mainFunc, 1000/24);
}

function showRule(game) {
	var BGwidth = 815, BGheigth = 445;
	if (game.state != "rule")
		return ;
	var FG=document.getElementById("myFrontGround");
	var context=FG.getContext("2d");
	context.clearRect(0, 0, BGwidth, BGheigth);
	myImage = document.getElementById("rulebackground");
	context.drawImage(myImage, 0, 0, BGwidth, BGheigth);
	
	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 32 && game.state == "rule") {
			game.state = "end";
			return ;
		}
	},false);
}