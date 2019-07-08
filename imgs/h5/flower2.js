(function(){
    var s3 = document.getElementById('s3');
		var canvas = document.getElementById('canvas2-1'),
		  ctx = canvas.getContext('2d'),
		  w = canvas.width = window.innerWidth * 1.5,
		  h = canvas.height = window.innerHeight * 0.7,
		    
		  hue = 217,
		  stars = [],
		  count = 0,
		  maxStars = 1000;

		function random(min, max) {
		  if (arguments.length < 2) {
		    max = min;
		    min = 0;
		  }
		  
		  if (min > max) {
		    var hold = max;
		    max = min;
		    min = hold;
		  }

		  return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		var Star = function() {

		  this.orbitRadius = random(w / 2 - 50);
		  this.radius = random(100, this.orbitRadius) / 10;
		  this.orbitX = w / 2;
		  this.orbitY = h / 2;
		  this.timePassed = random(0, maxStars);
		  this.speed = random(this.orbitRadius) / 100000;
		  this.alpha = random(1, 3) / 10;

		  count++;
		  stars[count] = this;
		}

		Star.prototype.draw = function() {
		  var x = Math.sin(this.timePassed + 1) * this.orbitRadius + this.orbitX,
		      y = Math.cos(this.timePassed) * this.orbitRadius/2 + this.orbitY,
		      twinkle = random(10);

		  if (twinkle === 1 && this.alpha > 0) {
		    this.alpha -= 0.05;
		  } else if (twinkle === 2 && this.alpha < 0.3) {
		    this.alpha += 0.05;
		  }

		  ctx.globalAlpha = this.alpha;
		    ctx.drawImage(s2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
		  this.timePassed += this.speed;
		}

		for (var i = 0; i < maxStars; i++) {
		  new Star();
		}

		function animation() {
		    ctx.clearRect(0, 0, w, h);
		  
		  for (var i = 1, l = stars.length; i < l; i++) {
		    stars[i].draw();
		  };  
		  
		  window.requestAnimationFrame(animation);
		}

		animation();
		})();