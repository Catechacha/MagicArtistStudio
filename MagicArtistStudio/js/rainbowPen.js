function rainbowPen() {
	var lastX, lastY;

	this.setLastXY = function (x, y) {
		lastX = x;
		lastY = y;
	};

	function getColor(i, lineWidth) {
		var color;
		switch (i) {
			case (0):
				color = 'red'
				break;
			case(lineWidth/5):
				color = 'orange';
				break;
			case(lineWidth*2/5):
				color = 'yellow';
				break;
			case(lineWidth*3/5):
				color = 'lawngreen';
				break;
			case (lineWidth*4/5):
				color = 'deepskyblue';
				break;
			case(lineWidth):
				color='blue';
				break;
			default:break;	
		}
		return color;
	}


	this.draw = function (x, y, down, ctx, width, height) {
		ctx.save();
		ctx.lineJoin = ctx.lineCap = 'round';
		ctx.lineWidth = ctx.lineWidth * 5;	
		if (down) {//mouse down
			/*ctx.moveTo(x, y);
			ctx.lineTo(x + 0.1, y + 0.1);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();*/
		} else {//mouse move
			lineWidth = ctx.lineWidth;
			increase = lineWidth / 5;
			ctx.lineWidth = increase;
			i=0;
			while(i<=lineWidth){
				ctx.beginPath();
				ctx.strokeStyle = getColor(i,lineWidth);
				ctx.moveTo(lastX-i,lastY-i);
				ctx.lineTo(x-i, y - i);
				ctx.closePath();
				ctx.stroke();
				i = i + increase;
			};
		}
		lastX = x;
		lastY = y;
		ctx.restore();
	};
};