function sprinkler() {
	var positionX;
	var positionY;
	var density;
	var bubbleColor = ['blue', 'rgb(121,182,243)', 'rgb(48,134,221)', 'rgb(22,103,184)'];
	var leafArray = ['leaf1.png', 'leaf2.png', 'leaf3.png', 'leaf4.png', 'leaf5.png'];
	var flowerArray = ['flower1.png', 'flower2.png', 'flower3.png', 'flower4.png', 'flower5.png', 'flower6.png'];
	var chArray = ['ch1.png', 'ch2.png', 'ch3.png', 'ch4.png', 'ch5.png', 'ch6.png'];
	var mArray = ['m1.png', 'm2.png', 'm3.png', 'm4.png', 'm5.png','m6.png','m7.png','m8.png','m9.png'];

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function drawStar(ctx,angle, width, opacity, scale, color) {
		var length = 15;
		ctx.save();
		ctx.translate(positionX,positionY);
		ctx.beginPath();
		ctx.globalAlpha = opacity;
		ctx.rotate(Math.PI / 180 * angle);// degrees * Math.PI / 180.
		ctx.scale(scale, scale);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		for (var i = 5; i--;) {
			ctx.lineTo(0, length);
			ctx.translate(0, length);
			ctx.rotate((Math.PI * 2 / 10));
			ctx.lineTo(0, -length);
			ctx.translate(0, -length);
			ctx.rotate(-(Math.PI * 6 / 10));
		}
		ctx.lineTo(0, length);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	function stars(ctx) {
		angle = getRandomInt(0, 180);
		width = getRandomInt(1, 10);
		opacity = Math.random();
		scale = getRandomInt(1, 20) / 10;
		color = ('rgb(' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ')');
		drawStar(ctx,angle,width,opacity,scale,color);
	}

	function bubble(ctx) {
		radius = getRandomInt(10, 30);
		ctx.fillStyle = bubbleColor[radius % bubbleColor.length];
		ctx.beginPath();
		ctx.globalAlpha = Math.random();//opacity
		ctx.arc(positionX, positionY, radius, false, Math.PI * 2, false);
		ctx.fill();
	}

	function drawImage(ctx, imgSrc) {
		var img = new Image();
		switch (imgSrc) {
			case ('ladybug.png'):
				img.src = '/images/sprinkler/' + imgSrc;
				break;
			case ('leaf.png'):
				i = getRandomInt(0, leafArray.length - 1);
				img.src = '/images/sprinkler/' + leafArray[i];
				break;
			case ('flower.png'):
				i = getRandomInt(0, flowerArray.length - 1);
				img.src = '/images/sprinkler/' + flowerArray[i];
				break;
			case ('ch.png'):
				i = getRandomInt(0, chArray.length - 1);
				img.src = '/images/sprinkler/' + chArray[i];
				break;
			case ('minions.png'):
				i = getRandomInt(0, mArray.length - 1);
				img.src = '/images/sprinkler/' + mArray[i];
				break;
		}
		angle = getRandomInt(0, 180);
		radius = getRandomInt(-8, 8);
		/*radius = getRandomInt(5, 20);*/
		ctx.translate(positionX-radius, positionY-radius);
		ctx.rotate(Math.PI * angle / 180);//degrees*Math.PI/180
		ctx.drawImage(img, 0, 0, radius * 4, radius *4);		
	}

	this.draw = function (x, y, ctx, selectedPattern) {
		ctx.save();
		positionX = x;
		positionY = y;
		switch (selectedPattern) {
			case ('stars.png'):
				stars(ctx);
				break;
			case ('bubble.png'):
				bubble(ctx);
				break;
			case ('ladybugs.png'):
				drawImage(ctx, 'ladybug.png');
				break;
			case ('leaves.png'):
				drawImage(ctx, 'leaf.png');
				break;
			case ('flowers.png'):
				drawImage(ctx, 'flower.png');
				break;
			case ('minions.png'):
				drawImage(ctx, 'minions.png');
				break;
			case ('christmas.png'):
				drawImage(ctx, 'ch.png');
				break;
			default:
				break;
		}
		ctx.restore();
	}
};