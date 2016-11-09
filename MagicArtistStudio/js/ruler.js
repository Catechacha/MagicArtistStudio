function ruler() {
	var originX;
	var originY;
	var contextPreviousLine;

	this.draw = function (x, y, down, ctx,width,height) {
		if (down) {//on mouse down
			originX = x;
			originY = y;
			contextPreviousLine=ctx.getImageData(0, 0, width, height);
		} else {//on mouse move
			ctx.putImageData(contextPreviousLine,0,0);
			ctx.beginPath();
			ctx.moveTo(originX, originY);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
		}
	};
};