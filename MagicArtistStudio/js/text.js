function text() {
	var positionX;
	var positionY;
	
	this.draw = function (text, x, y, ctx, font, bold, italic, underline) {
		ctx.save();
		ctx.font = "30px " + font;
		if (bold && italic)
			ctx.font = "italic bold 30px " + font;
		else {
			if(bold)
				ctx.font = "bold 30px " + font;
			else
				if(italic)
					ctx.font = "italic 30px " + font;
		}
		ctx.fillText(text, x, y);
		ctx.restore();
	}
}