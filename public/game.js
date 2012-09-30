//Initialize Canvas Width/Height
var jrx = Math.floor($("canvas").width()/4);
var jry = Math.floor($("canvas").height()/2);
var jrb = Math.floor($("canvas").height()*(3/100)),
	jrf = Math.floor($("canvas").width()*(2/100));
var jro = 0,
	jra = 0,
	jrax = 0,
	jray = 0;
var reboundquotient = -0.25;
var propellerquotient = 0.25;
var speedthreshold = 50;
var bulletlist = new Array();
var thrusters = new Array();
var keys = {};
var levels = {};
levels[1] = 1;
levels[2] = 2;
var thislevel = 1;
function initializeCanvas() {
	var c = document.getElementById('c');
	c.width = $('body').width();
	c.height = $('body').height();
	c.style.width = $('body').width();
	c.style.height = $('body').height();
	$("canvas").drawRect({
		fillStyle: "#000",
		x: 0, y: 0,
		width: $("canvas").width(),
		height: $("canvas").height(),
		fromCenter: false
	});
}
/*$(window).resize(function() {
	initializeCanvas();
});*/

////////////////////////////////////////////////////////////////
/* This funtion will draw the bullets and push it into an array.*/
/*Game loop should have a sub which redraws the bullet         */
////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/* Show thrust output from junior							   */
/////////////////////////////////////////////////////////////////

function Junior() {
	this.maxperceivedspeed = 5;
	this.draw = function () {
		$("canvas").draw(function(ctx) {
			ctx.strokeStyle = 'green'; 
			ctx.beginPath();
			ctx.moveTo(jrx,jry);
			ctx.lineTo(jrx + jrb*Math.cos(toRadians(jro-140)),jry + jrb*Math.sin(toRadians(jro-140)));
			ctx.lineTo(jrx + jrf*(Math.cos(toRadians(jro))),jry + jrf*Math.sin(toRadians(jro)));
			ctx.lineTo(jrx + jrb*Math.cos(toRadians(jro+140)),jry + jrb*Math.sin(toRadians(jro+140)));
			ctx.closePath();
			ctx.stroke();
		});
	};
	this.shootLaser = function () {
		if (
			(typeof bulletlist[0] === 'undefined') || 
				(bulletlist[bulletlist.length-1].time > bulletlist[bulletlist.length-1].halfspan)
		) {
			var newbullet = new bullet(
				jrx+((jrf+10)*Math.cos(toRadians(jro))),
				jry+((jrf+10)*Math.sin(toRadians(jro))),
				jro
			);
			bulletlist.push (newbullet);
			newbullet.draw();
			return 1;
		}
	}
	this.showThrust = function (x,y,angle) {
		thrusters.push(new thruster(jrx,jry,1,jro));
	}
}

////////////////////////////////////////////////////////////
/* Thruster object                                        */
////////////////////////////////////////////////////////////


function thruster (x,y,age,angle) {
	this.x = x;
	this.y = y;
	this.age = age;
	this.lifespan = 7;
	this.angle = angle%360;
	this.getcolor = function () {
		if (this.age < 3 ) 
			return "#E1FF89";
		if (this.age < 7)
			return "#FF9900";
		return "#FF0000";

	}
	this.density = 5;
	this.draw = function () {
		for (var i = 0;i < this.density; i++) {
			var dx1,dy1,dx2,dy2;
			var quadrant = this.angle/90;			
			var randomseed = Math.random();
			dx1 = (5*this.age) * randomseed *  Math.sin(toRadians(this.angle+180));
			dy1 = (5*this.age) * randomseed *  Math.cos(toRadians(this.angle+180+90));
			dx2 = (5*this.age) * randomseed *  Math.sin(toRadians(this.angle+180));
			dy2 = (5*this.age) * randomseed *  Math.cos(toRadians(this.angle+180-90));
			console.log(dx1);
			console.log(dy1);
			console.log(dx2);
			console.log(dy2);

			// if (this.angle%360 < 90) {
			// 	dx2 = -(5*this.age) * Math.random() *  Math.sin(toRadians(this.angle));
			// 	dy2 = -(3*this.age) * Math.random() *  Math.cos(toRadians(this.angle));
			// }
			// else if (this.angle%360 < 180) {
			// 	dx2 = (5*this.age) * Math.random() *  Math.sin(toRadians(this.angle));
			// 	dy2 = -(3*this.age) * Math.random() *  Math.cos(toRadians(this.angle));
			// }
			// else if (this.angle%360 < 270) {
			// 	dx2 = -(5*this.age) * Math.random() *  Math.sin(toRadians(this.angle));
			// 	dy2 = (3*this.age) * Math.random() *  Math.cos(toRadians(this.angle));
			// } else {
			// 	dx2 = -(5*this.age) * Math.random() *  Math.sin(toRadians(this.angle));
			// 	dy2 = -(3*this.age) * Math.random() *  Math.cos(toRadians(this.angle));
			// }
			if (this.angle%90 < 10 || this.angle%90 > 80) {
				
			 	dx1 = -(5*this.age)*Math.random();
			 	dy1 = (3*this.age)*Math.random();
			 	dx2 = -(5*this.age)*Math.random();
			 	dy2 = -(3*this.age)*Math.random();
			}
			$("canvas").drawArc({
				strokeStyle: this.getcolor(),
				strokeWidth: 1,
				x: this.x+dx1, y: this.y+dy1,
				radius: 0.2,
				start: 0 , end: 360,
			});
			$("canvas").drawArc({
				strokeStyle: this.getcolor(),
				strokeWidth: 1,
				x: this.x+dx2, y: this.y+dy2,
				radius: 0.2,
				start: 0 , end: 360,
			});

		}
	}
	this.move = function () {
		this.x -= this.age * 2 * Math.cos(toRadians(this.angle));
		this.y -= this.age * 2  * Math.sin(toRadians(this.angle));
		this.age++;
	}
}

function bullet (x,y,angle) {
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.lifespan = 1000;
	this.halfspan = 350;
	this.speed = 8;
	this.move = function () {
		this.x += (this.speed) * Math.cos(toRadians(this.angle));
		this.y += (this.speed) * Math.sin(toRadians(this.angle));
		this.time += 20;
		if (this.x > $("canvas").width()) {
			this.x = 0;
		}
		if (this.x < 0) {
			this.x = $("canvas").width();
		}
		if (this.y > $("canvas").height()) {
			this.y = 0;
		}
		if (this.y < 0) {
			this.y = $("canvas").height();
		}
	};
	this.draw = function () {
		$("canvas").drawLine({
			strokeStyle: "#CD00CD",
			strokeWidth: 2,
			x1: this.x,
			y1: this.y,
			x2: this.x +((9) * Math.cos(toRadians(this.angle))),
			y2: this.y + ((9) * Math.sin(toRadians(this.angle)))
		});
	}

	this.time = 0;
}
///////////////////////////////////////////////////////////////
/* Game Loop												 */
///////////////////////////////////////////////////////////////
function gameLoop() {
	jrx += jrax;
	jry += jray;
	if (jrx > $("canvas").width()) {
		jrx = 0;
	}
	if (jrx < 0) {
		jrx = $("canvas").width();
	}
	if (jry > $("canvas").height()) {
		jry = 0;
	}
	if (jry < 0) {
		jry = $("canvas").height();
	}
	$("canvas").clearCanvas();
	$("canvas").drawRect({
		fillStyle: "#000",
		x: 0, y: 0,
		width: $("canvas").width(),
		height: $("canvas").height(),
		fromCenter: false
	});
	var templist = new Array();
	// BULLETS REDRAW
	while((thisbullet = bulletlist.shift()) != null) {
		if (thisbullet.time + 20 < thisbullet.lifespan) {
			thisbullet.move();
//			thisbullet.time += 20;
			thisbullet.draw();
			templist.push(thisbullet);
		} else {
			delete thisbullet;
		}
	}
	bulletlist = templist;
	templist = [];
	//THRUSTERS REDRAW
	while((thisthruster = thrusters.shift()) != null) {
		if (thisthruster.age++ < thisthruster.lifespan) {
			thisthruster.move();
			thisthruster.draw();
			templist.push(thisthruster);
		} else {
			delete thisthruster;
		}
	}
	thrusters = templist;
	junior.draw();
	//STARS REDRAW
	for (var i = 0; i < numStars; i++) {
		drawStars(stars[i][0],stars[i][1],stars[i][2],stars[i][3],stars[i][4]);
	}
	//ASTEROIDS REDRAW
	for (var i = 0; i < numAsteroids; i++) {
		thisasteroid = asteroids[i];
		thisasteroid.draw();
	}
}

//////////////////////////////////////////////////
/* Random stars									*/
//////////////////////////////////////////////////

var numStars = 15,stars = [];
for (var i = 0; i < numStars; i++) {
	stars.push([
		Math.random() * $("canvas").width(),
		Math.random() * $("canvas").height(),
		Math.random() * 15,
		Math.random()*2,
		Math.random()/2,
	]);
}


function drawStars (x,y,radius,projection,transparency) {
	$("canvas").drawPolygon({
		fillStyle: 'rgba(255,255,225,'+transparency+')',
		x: x,
		y: y,
		radius: radius,
		sides :5,
		projection:projection
	});
}
var numAsteroids = levels[thislevel],asteroids = [];
for (var i = 0; i < numAsteroids; i++) {
	var thisasteroid = new Asteroid();
	thisasteroid.draw();
	asteroids.push(thisasteroid);
}
function Asteroid () {
	// The asteroids will always be in the right hand part of the screen
	// the combined area of all asteroids should never exceed around 40% of display area
	this.sides = Math.floor(Math.random() * 3)+ 4; //greater better?
	this.projection = (Math.random() * 7)/10;
	this.radius = Math.sqrt(($("canvas").width() * $("canvas").height())/20)/ numAsteroids;
	this.x = 0.5 * $("canvas").width();
	this.y = 0.5 * $("canvas").height();
	this.draw = function () {
		return 1;
		$("canvas").drawPolygon({
			strokeStyle: '#CDCD00',
			strokeWidth: 5,
			x: this.x,
			y: this.y,
			radius: this.radius,
			sides :this.sides,
			projection:this.projection
		});
	}
}



//////////////////////////////////////////////////
/* Make Every Thing Work									*/
//////////////////////////////////////////////////
var junior = new Junior();
setInterval(gameLoop, 20);
initializeCanvas();
junior.draw();
//////////////////////////////////////////////////
/* Event Handlers 								*/
//////////////////////////////////////////////////

$(document).keydown(function (e) {
    keys[e.which] = true;
	keyPressed(keys);
});
function keyPressed(keys) {
	for (var key in keys) {
		if (key == 39) {
			jro += 5;
		}
		if (key == 38) {
			if(jrax == 0) {
				jrax = 0.25;
			}
			dx = propellerquotient * Math.cos(toRadians(jro));
			dy = propellerquotient * Math.sin(toRadians(jro));
			var perceivedspeed = Math.sqrt((jrax+dx)*(jrax+dx)+(jray+dy)*(jray+dy));
			if (perceivedspeed < junior.maxperceivedspeed) {
				jrax += dx;
				jray += dy;
			}
			junior.showThrust();
			
		}
		if (key == 37) {
			jro -= 5;
		}
		if (key == 32) {
			var shot = junior.shootLaser();
			if (shot == 1) {
				if(jrax == 0) {
					jrax = -0.30;
				}
				dx = reboundquotient * Math.cos(toRadians(jro));
				dy = reboundquotient * Math.sin(toRadians(jro));
				var perceivedspeed = Math.sqrt((jrax+dx)*(jrax+dx)+(jray+dy)*(jray+dy));
				if (perceivedspeed < junior.maxperceivedspeed) {
					jrax += dx;
					jray += dy;
				}

			}
			/*if (jrax - dx > -speedthreshold) {
				
			}
			if (jray - dy > -speedthreshold) {
				
			}*/				
			
//			propellerquotient += 0.1;
			
		}
	}
}
$(document).keyup(function (e) {
    delete keys[e.which];
})
/*$('#body').keydown(function(event) {
	console.log(event.keyCode);
	console.log(event.which);
	switch(event.keyCode) {
		case 39:
			jro += 5;
			break;
		case 38:
			if(jrax == 0) {
				jrax = 0.25;
			}
			jrax += 0.5 * Math.cos(toRadians(jro));
			jray += 0.5 * Math.sin(toRadians(jro));
			break;
		case 37:
			jro -=5;
			break;
		case 32:
		case 0:
			if(jrax == 0) {
				jrax = 0.25;
			}
			jrax -= 0.5 * Math.cos(toRadians(jro));
			jray -= 0.5 * Math.sin(toRadians(jro));
			break;
		default:
			break;
	}
});*/

//////////////////////////////////////////////////
/* Helper Functions								*/
//////////////////////////////////////////////////

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function randomXToY(minVal,maxVal,floatVal) {
	var randVal = minVal+(Math.random()*(maxVal-minVal));
	return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}