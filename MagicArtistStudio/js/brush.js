function brush() {
	var lastX;
	var lastY;

	this.setLastXY = function (x, y) {
		lastX = x;
		lastY = y;
	};

	this.draw = function (x, y, down, ctx) {
		ctx.save();
		ctx.lineWidth = ctx.lineWidth * 5;
		ctx.shadowBlur = 10;
		ctx.shadowColor = ctx.strokeStyle;
		ctx.lineJoin = ctx.lineCap = "round";
		ctx.beginPath();
		if (down) {//mouse down
			ctx.moveTo(x-0.1, y);
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
};