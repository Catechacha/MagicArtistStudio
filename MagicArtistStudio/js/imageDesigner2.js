function imageDesigner2(w, h,ofl,oft) {//height and width of canvas
	var canvasWidth = w;
	var canvasHeight = h;
	var canvasOffsetLeft = ofl;
	var canvasOffsetTop = oft;

	var originX, originY;
	var offsetX, offsetY;
	var centerX, centerY;
	var width = 0;
	var height = 0;
	var contextPreviousImage;
	var img = new Image();
	var selected = false;
	var drag = false;
	var resize = false;
	var rotate = false;
	var r = Math.PI;

	var resizer = new Image();
	resizer.src = '/images/img/resizer.png';
	var rotater = new Image();
	rotater.src = '/images/img/rotater.png';

	this.newSheetCanvas = function (ctx) {
		originX = originY = offsetX = offsetY = null;
		width = 0;
		height = 0;
		contextPreviousImage = null;
		img = new Image();
		selected = false;
		drag = false;
		rotate = false;
		resize = false;
		r = 0;
	}

	this.cancHandler = function (ctx) {
		if (selected) {
			ctx.putImageData(contextPreviousImage, 0, 0);
			this.newSheetCanvas(ctx);
		}
	}

	function drawImage(ctx) {
		if (width != 0 && height != 0) {
			ctx.putImageData(contextPreviousImage, 0, 0);
			ctx.translate(originX + width / 2, originY + height / 2);
			ctx.rotate(r);
			ctx.translate(-width / 2, -height / 2);
			ctx.drawImage(img, 0, 0, width, height);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	}

	function selectImage(ctx) {
		if (width != 0 && height != 0) {
			ctx.strokeStyle = 'black';
			ctx.translate(originX + width / 2, originY + height / 2);//centro
			ctx.rotate(r);//ruoto
			ctx.translate(-width / 2, -height / 2);//torno nell'origine dell'immagine
			ctx.strokeRect(0, 0, width, height);
			if (r == 0) {
				ctx.translate(width - 8, height - 8);//punto in cui disegno resizer
				ctx.drawImage(resizer, 0, 0, 16, 16);
				ctx.translate(0, -height);//punto in cui disegno il rotater
				ctx.drawImage(rotater, 0, 0, 16, 16);
			} else {
				ctx.translate(width - 8, - 8);
				ctx.drawImage(rotater, 0, 0, 16, 16);
			}
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	}

	function controlCoordinatesDrag(x, y) {
		if (x < 0)
			x = 0;
		if ((x + width) > canvasWidth)
			x = canvasWidth - width;
		if (y < 0)
			y = 0;
		if ((y + height) > canvasHeight)
			y = canvasHeight - height;
		var coordArray = [x, y];
		return coordArray;
	}

	function controlCoordinates(x, y) {
		if (x < 0)
			x = 0;
		if (x > 700)
			x = 700;
		if (y < 0)
			y = 0;
		if (y > 500)
			y = 500;
		var coordArray = [x, y];
		return coordArray;
	}

	function imageContains(x, y, ctx) {
		nx = (Math.cos(r) * (x - (originX + width / 2))) + (Math.sin(r) * (y - (originY + height / 2))) + (originX + width / 2),
		ny = (Math.cos(r) * (y - (originY + height / 2))) - (Math.sin(r) * (x - (originX + width / 2))) + (originY + height / 2);
		if (nx > originX && nx < (originX + width) && ny > originY && ny < (originY + height))
			return true;
		else
			return false;
	}

	function resizerContains(x, y, ctx) {
		nx = (Math.cos(r) * (x - (originX + width / 2))) + (Math.sin(r) * (y - (originY + height / 2))) + (originX + width / 2),
		ny = (Math.cos(r) * (y - (originY + height / 2))) - (Math.sin(r) * (x - (originX + width / 2))) + (originY + height / 2);
		if (nx > (originX + width - 8) && nx < (originX + width + 8) && ny > (originY + height - 8) && ny < (originY + height + 8))
			return true;
		else
			return false;
	}

	function rotaterContains(x, y, ctx) {
		ctx.translate(originX + width / 2, originY + height / 2);//centro
		ctx.rotate(r);//ruoto di r
		ctx.translate(-(originX + width / 2), -(originY + height / 2));//mi rimetto dov'ero prima
		nx = (Math.cos(r) * (x - (originX + width / 2))) + (Math.sin(r) * (y - (originY + height / 2))) + (originX + width / 2),
		ny = (Math.cos(r) * (y - (originY + height / 2))) - (Math.sin(r) * (x - (originX + width / 2))) + (originY + height / 2);
		if (nx > (originX + width - 8) && nx < (originX + width + 8) && ny > (originY - 8) && ny < (originY + 8))
			return true;
		else
			return false;
	}

	this.down = function (x, y, ctx, srcImg) {
		ctx.save();
		if (selected) {
			if (rotaterContains(x, y, ctx)) {
				rotate = true;
			} else {
				if (r==0 && resizerContains(x, y, ctx)) {
					resize = true;
				} else {
					if (imageContains(x, y, ctx)) {
						drag = true;
						offsetX = x - originX;
						offsetY = y - originY;
					} else {
						ctx.restore();
						drawImage(ctx);
						drag = false;
						rotate = false;
						resize = false;
						selected = false;
						r = 0;
						width = 0;
						height = 0;
						contextPreviousImage = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
						img.src = srcImg;
						originX = x;
						originY = y;
					}
				}
			}
		} else {
			ctx.restore();
			drawImage(ctx);
			drag = false;
			rotate = false;
			resize = false;
			selected = false;
			r = 0;
			width = 0;
			height = 0;
			contextPreviousImage = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
			img.src = srcImg;
			originX = x;
			originY = y;
		}
		ctx.restore();
	}

	this.move = function (x, y, ctx) {
		ctx.save();
		if (drag) {
			originX = x - offsetX;
			originY = y - offsetY;
			var coordArray = controlCoordinatesDrag(originX, originY);
			originX = coordArray[0];
			originY = coordArray[1];
		} else {
			if (r==0 && resize) {
				if (r == 0) {
					width = x - originX;
					height = y - originY;
				}
			} else {
				if (rotate) {
					dx = x - (originX + width / 2);
					dy = y - (originY + height / 2);
					r = Math.atan2(dy, dx)+Math.PI/4;
				} else {//'im drawing
					var coordArray = controlCoordinates(x, y);
					x = coordArray[0];
					y = coordArray[1];
					width = x - originX;
					height = y - originY;
				}
			}
		}
		drawImage(ctx);
		ctx.restore();
	}

	this.up = function (x, y, ctx, upInCanvas) {
		if (upInCanvas) {
			if (r==0 && resize) {
				resize = false;
				if (x < originX) {
					width = originX - x;
					originX = x;
				}
				if (y < originY) {
					height = originY - y;
					originY = y;
				}
			} else {
				if (drag)
					drag = false;
				else {
					if (rotate) {
						rotate = false;
					} else {
						//finish draw
						if (x < originX) {
							width = originX - x;
							originX = x;
						}
						if (y < originY) {
							height = originY - y;
							originY = y;
						}
					}
				}
			}
		} else {
			resize = false;
			rotate = false;
			drag = false;
			if (width < 0) {
				width = width * (-1);
				originX = originX - width;
			}
			if (height < 0) {
				height = height * (-1);
				originY = originY - height;
			}
		}
		drawImage(ctx);
		selectImage(ctx);
		selected = true;
		ctx.restore();
	}

	this.changePanel = function (ctx) {
		drawImage(ctx);
		this.newSheetCanvas();
	}
};