function forms() {
	var originX, originY;
	var width, height;
	var contextPreviousForm;

	/*function drawCircle(x, y, ctx) {
		ctx.putImageData(contextPreviousForm, 0, 0);
		ctx.beginPath();
		centerX = (originX + x) / 2;
		centerY = (originY + y) / 2;
		radiusX = x - originX;
		radiusY = y - originY;
		if(centerX>0 && centerY>0 && radiusX>0 && radiusY>0)
			ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}*/

	function drawCircle(x, y, ctx) {
		ctx.putImageData(contextPreviousForm, 0, 0);
		ctx.beginPath();
		centerX = (originX + x) / 2;
		centerY = (originY + y) / 2;
		radius = centerX - originX;
		if (radius < 0)
			radius = radius * (-1);
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}

	function drawRectangle(x, y, ctx) {
		ctx.putImageData(contextPreviousForm, 0, 0);
		ctx.lineWidth = 3;
		ctx.strokeRect(originX, originY, x - originX, y - originY);
		ctx.fillRect(originX, originY, x - originX, y - originY);
	}

	this.draw = function (x, y, ctx, down, form, borderColor, fillColor,width,height) {
		ctx.save();
		if (down){
			originX = x;
			originY = y;
			contextPreviousForm = ctx.getImageData(0, 0, width, height);
		} else {
			ctx.strokeStyle = borderColor;
			ctx.fillStyle = fillColor;
			if (form == 'rectangle')
				drawRectangle(x, y, ctx);
			if (form == 'circle')
				drawCircle(x, y, ctx);
		}		
		ctx.restore;
	}
}