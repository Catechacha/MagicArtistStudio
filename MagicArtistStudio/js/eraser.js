function eraser(){
	var lastX, lastY;
	var eraserWidth;

	this.setLastXY = function (x, y) {
		lastX = x;
		lastY = y;
	};

	this.erase = function (x, y, down, ctx) {
		ctx.save();
		ctx.lineWidth = eraserWidth*5;
		ctx.strokeStyle = "white";
		ctx.beginPath();
		if (down) {//mouse down
			ctx.moveTo(x - 0.1, y);
			ctx.lineTo(x, y);
		} else {//mouse move
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.stroke();
		lastX = x;
		lastY = y;
		ctx.restore();
	};

	this.changeWidth = function (width) {
		eraserWidth = width;
	}
};