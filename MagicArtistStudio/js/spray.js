function spray() {
	var positionX;
	var positionY;
	var density=100;

	function getRandomFloat(min, max) {
		return Math.random() * (max - min) + min;
	};

	function drawAPoint(ctx){
		for (var i =0;i< density; i++){
			var angle = getRandomFloat(0, Math.PI*2);
			var radius = getRandomFloat(0, ctx.lineWidth*8);
			ctx.fillRect(positionX + radius * Math.cos(angle),positionY + radius * Math.sin(angle), 1, 1);
		}
	}

	this.draw = function (x, y, down, ctx) {
		positionX = x;
		positionY = y;
		drawAPoint(ctx);
	};
};