/*Color of colorPanel (first line and second line)*/
var colorFirstLine = ["black", "gray", "brown", "red", "darkorange", "yellow", "green", "dodgerblue", "blue", "darkviolet"];
var colorSecondLine = ["white", "lightgrey", "rosybrown", "pink", "gold", "lemonchiffon", "greenyellow", "cyan", "deepskyblue", "violet"];
/*width of buttons on widthPenPanel*/
var penWidthButtonArray = [15,20, 25, 30, 35, 40];
/*height of buttons on widthEraserPanel*/
var eraserWidthButtonArray = [20, 25, 30, 35, 40,45,50,55];
/*array of fonts*/
var fontArray = ['Minnie', 'Arial', 'Minion Pro', 'Snap ITC', 'Comic Sans MS'];
var selectedFontIndex = 0; //initial font = minnie (index = 0)
/*array of sprinkler pattern*/
var sprinklerPattern = ['stars.png', 'bubble.png', 'ladybugs.png', 'leaves.png', 'flowers.png', 'minions.png', 'christmas.png'];
var selectedPattern = 0;//initial pattern = stars
var boldBool = false, italicBool = false;//boolean for bold, italic
var formChoosed = 'rectangle';//default initial form
var borderColor = 'black';//default initial border color form
var fillColor = 'black'; //default initial fill color form
var pressed;//may be: null (no button pressed), 'border' --> border button pressed, 'fill' --> fill button pressed

/*map for exactly image click*/
var lapisMap = [[1, 246], [24, 248], [24, 41], [11, 2], [1, 40]];
var brushMap = [[9, 147], [15, 147], [17, 125], [18, 99], [18, 74], [16, 55], [14, 33], [19, 23], [15, 11], [4, 1], [4, 9], [3, 22], [8, 33], [7, 55], [5, 93]];
var sprinklerMap = [[21, 246], [39, 249], [53, 249], [74, 246], [73, 104], [69, 78],
	[60, 65], [60, 53], [59, 42], [57, 31], [60, 23], [69, 18], [63, 10], [50, 2],
	[33, -1], [23, 2], [7, 7], [1, 9], [1, 21], [10, 21], [11, 26], [12, 34], [7, 47],
	[1, 60], [2, 66], [16, 44], [21, 42], [19, 35], [27, 39], [33, 42], [34, 57], [31, 65], [23, 85]];
var sprayMap = [[11,-1],[17,0],[17,7],[27,14],[28,95],[19,97],[11,97],[1,96],[0,17],[12,8]];
var rainbowPenMap = [[2, 3], [14, 1], [27, 4], [29, 9], [29, 48], [25, 53], [27, 198], [3, 198], [4, 61], [1, 54]];
var formsMap = [[0, 46], [11, 35], [9, 29], [51, 0], [55, 8], [61, 6], [99, 32], [98, 38], [48, 72], [36, 74]];
var eraserMap = [[7, 41], [12, 24], [61, 6], [79, 25], [87, 42], [28, 65]];
var daisyFrameMap = [[4, 122], [86, 149], [91, 145], [94, 106], [111, 133], [120, 121], [95, 86],[101, 12], [9, 1]];

(function () {
    "use strict";
    var canvas;
    var ctx;
    var undoImage = null;
    var paint = false;
    var panel = "tool";//tool or image? Is tool if i'm on the first panel and i want to paint on canvas; it's image if i want to draw an image on canvas
    var srcImg = null;//at the begin this is null, when i click on a image it contains src of the image selected
    var nameTool;//name of current tool
    var lapisTool = new lapis();
    var eraserTool = new eraser();
    var brushTool = new brush();
    var sprayTool = new spray();
    var rainbowPenTool = new rainbowPen();
    var rulerTool = new ruler();
    var sprinklerTool = new sprinkler();
    var formsTool = new forms();
	var textTool = new text();
	var imgTool;

    var page =WinJS.UI.Pages.define("drawTable.html", {
    	ready: function (element, options) {
    		canvas = document.getElementById("drawContainer");
    		ctx = canvas.getContext("2d");

    		/*console.log(canvasImage);
    		if (canvasImage != null)
    			ctx.putImageData(canvasImage, 0, 0, canvas.width, canvas.height);*/

    		window.addEventListener('mouseup', function (e) {
    			if (panel !='tool' && paint){
    				imgTool.up(e.pageX-canvas.offsetLeft,e.pageY-canvas.offsetTop,ctx,false);
    				paint = false;
    			}
    			else {
    				if (paint)
    					paint = false;
    			}
    		}, false);

    		window.addEventListener('mousemove', function (e) {
    			if (panel == 'tool' && paint) {
    				switch (nameTool) {
    					case 'lapis':
    						lapisTool.setLastXY(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    						break;
    					case ('eraser'):
    						eraserTool.setLastXY(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    						break;
    					case ('brush'):
    						brushTool.setLastXY(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    						break;
    					case ('rainbowPen'):
    						rainbowPenTool.setLastXY(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    						break;
    					default:
    						break;
    				}
    			}
    		}, false);

    		window.addEventListener('keydown', function (e) {
    			if (e.keyCode == 46 && panel != 'tool') {//46=canc
    				imgTool.cancHandler(ctx);
    			}
    		}, false);

    		//register canvas handler
    		canvas.addEventListener("mousedown",canvasMouseDownHandler, false);
            canvas.addEventListener("mousemove", canvasMouseMoveHandler, false);
            canvas.addEventListener("mouseup", canvasMouseUpHandler, false);

    		//register button handler
            var newButton = document.getElementById("newButton");
            newButton.addEventListener("click", function () { newButtonClickHandler(); }, false);
            var menuButton = document.getElementById("menuButton");
            menuButton.addEventListener("click", function () { menuButtonClickHandler(); }, false);
            var otherButton = document.getElementById("otherButton");
            otherButton.addEventListener("click", function () { otherButtonClickHandler(); }, false);

            var undoButton = document.getElementById('undoButton');
            undoButton.addEventListener('click', function () { undoButtonHandler(); }, false);


    		//handler tools
            imgTool = new imageDesigner2(canvas.width, canvas.height, canvas.offsetLeft, canvas.offsetTop);
    		
            var lapis = document.getElementById("lapis");
            lapis.addEventListener('click', function (e) {
            	if (inside(e.pageX - lapis.offsetLeft, e.pageY - lapis.offsetTop, lapisMap)) {
            		toolClickHandler('lapis', 20, 90);
            		lapis.style.display = 'none';
            		lapis.classList.remove('lapis');
            		lapis.classList.remove('lapisAnimate');
            		setTimeout(function () {
            			lapis.classList.add('lapisAnimate');
            			lapis.style.display = 'inline';
            		}, 0);
            	}
            }, false);

            var rainbowPen = document.getElementById("rainbowPen");
            rainbowPen.addEventListener("click", function (e) {
            	if (inside(e.pageX - rainbowPen.offsetLeft, e.pageY - rainbowPen.offsetTop, rainbowPenMap)) {
            		toolClickHandler("rainbowPen", 20, 90);
            		rainbowPen.style.display = 'none';
            		rainbowPen.classList.remove('rainbowPen');
            		rainbowPen.classList.remove('rainbowPenAnimate');
            		setTimeout(function () {
            			rainbowPen.src = '/images/rainbowPen2.png';
            			rainbowPen.classList.add('rainbowPenAnimate');
            			rainbowPen.style.display = 'inline';
            		}, 0);
            	}
            }, false);

            var brush = document.getElementById("brush");
            brush.addEventListener("click", function (e) {
            	if (inside(e.pageX - brush.offsetLeft, e.pageY - brush.offsetTop, brushMap)) {
            		toolClickHandler("brush", 20, 90);
            		brush.style.display = 'none';
            		brush.classList.remove('brush');
            		brush.classList.remove('brushAnimate');
            		setTimeout(function () {
            			brush.classList.add('brushAnimate');
            			brush.style.display = 'inline';
            		}, 0);
            	}
            }, false);

            var spray = document.getElementById("spray");
            spray.addEventListener("click", function (e) {
            	if (inside(e.pageX - spray.offsetLeft, e.pageY - spray.offsetTop, sprayMap)){
            		toolClickHandler("spray", 25, 90);
            		spray.style.display = 'none';
            		spray.classList.remove('spray');
            		spray.classList.remove('sprayAnimate');
            		setTimeout(function () {
            			spray.classList.add('sprayAnimate');
            			spray.style.display = 'inline';
            		}, 0);
				}
            }, false);

            var sprinkler = document.getElementById("sprinkler");
            sprinkler.addEventListener("click", function (e) {
            	if (inside(e.pageX - sprinkler.offsetLeft, e.pageY - sprinkler.offsetTop,sprinklerMap)){
            		toolClickHandler("sprinkler", 40, 90);
            		sprinkler.style.display = 'none';
            		sprinkler.classList.remove('sprinkler');
            		sprinkler.classList.remove('sprinklerAnimate');
            		setTimeout(function () {
            			sprinkler.classList.add('sprinklerAnimate');
            			sprinkler.style.display = 'inline';
            		}, 0);
				}
            }, false);
            var ruler = document.getElementById("ruler");
            ruler.addEventListener("click", function () {
            	toolClickHandler("ruler", 20, 90);
            	ruler.style.display = 'none';
            	ruler.classList.remove('ruler');
            	ruler.classList.remove('rulerAnimate');
            	setTimeout(function () {
            		ruler.classList.add('rulerAnimate');
            		ruler.style.display = 'inline';
            	}, 0);
            }, false);
            var text = document.getElementById("text");
            text.addEventListener("click", function () {
            	toolClickHandler("text", 65, 80);
            	text.style.display = 'none';
            	text.classList.remove('text');
            	text.classList.remove('textAnimate');
            	setTimeout(function () {
            		text.classList.add('textAnimate');
            		text.style.display = 'inline';
            	}, 0);
            }, false);
            var forms = document.getElementById("forms");
            forms.addEventListener("click", function (e) {
            	if (inside(e.pageX - forms.offsetLeft, e.pageY - forms.offsetTop, formsMap)){
            		toolClickHandler("forms", 60, 80);
            		forms.style.display = 'none';
            		forms.classList.remove('forms');
            		forms.classList.remove('formsAnimate');
            		setTimeout(function () {
            			forms.classList.add('formsAnimate');
            			forms.style.display = 'inline';
            		}, 0);
				}
            }, false);
            var eraser = document.getElementById("eraser");
            eraser.addEventListener("click", function (e) {
            	if (inside(e.pageX - eraser.offsetLeft, e.pageY - eraser.offsetTop, eraserMap)){
            		toolClickHandler("eraser", 90, 70);
            		eraser.style.display = 'none';
            		eraser.classList.remove('eraser');
            		eraser.classList.remove('eraserAnimate');
            		setTimeout(function () {
            			eraser.classList.add('eraserAnimate');
            			eraser.style.display = 'inline';
            		}, 0);
				}
            }, false);

    		//default: lapis, black, 2
            selectTool("lapis", true);
            changeContextColor("black");
            changeContextWidth(2);
            ctx.lineJoin = "round";
            eraserTool.changeWidth(3);
        }
    });

	//function which test if a point is in a polygon
    function inside(x,y, mapTool) {
    	var inside = false;
    	for (var i = 0, j = mapTool.length - 1; i < mapTool.length; j = i++) {
    		var xi = mapTool[i][0], yi = mapTool[i][1];
    		var xj = mapTool[j][0], yj = mapTool[j][1];
    		var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    		if (intersect) inside = !inside;
    	}
    	return inside;
    };

	//from "url(...)" to ...
    function cutSrcImg() {
    	return srcImg.substring(5, srcImg.length - 2);
    }

	//CANVAS MOUSE HANDLER
    function canvasMouseDownHandler(e) {
    	if (panel == 'tool') {
    		undoImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    		var undoButton = document.getElementById('undoButton');
    		undoButton.style.opacity = 1;
    		paint = true;
    		draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
    	} else {
    		if (srcImg != null) {
    			var src = cutSrcImg();
    			imgTool.down(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, ctx, src);
    			paint = true;
    		}	
    	}
    }

    function canvasMouseMoveHandler(e) {
    	if (panel == 'tool') {
    		if (paint) {
    			draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
    		}
    	} else {
    		if (srcImg != null && paint) {
    			var x = e.pageX - canvas.offsetLeft;
    			var y = e.pageY - canvas.offsetTop;
    			imgTool.move(x, y, ctx);
    		}
    	}
    }

    function canvasMouseUpHandler(e) {
    	if (panel == 'tool') {
    		paint = false;
    	} else {
    		imgTool.up(e.pageX-canvas.offsetLeft,e.pageY-canvas.offsetTop,ctx,true);
    		paint = false;
    	}
    }

    function draw(x, y, down){
    	switch(nameTool) {
    		case ("lapis"):
    			lapisTool.draw(x, y, down, ctx);
    			break;
    		case ("eraser"):
    			eraserTool.erase(x, y, down, ctx);
    			break;
    		case ("brush"):
    			brushTool.draw(x, y, down, ctx);
    			break;
    		case ("spray"):
    			sprayTool.draw(x, y, down, ctx);
    			break;
    		case ("ruler"):
    			rulerTool.draw(x, y, down, ctx, canvas.width, canvas.height);
    			break;
    		case ("rainbowPen"):
    			rainbowPenTool.draw(x, y, down, ctx);
				break;
			case ("sprinkler"):
				sprinklerTool.draw(x, y, ctx, sprinklerPattern[selectedPattern]);
				break;
			case ("forms"):
				formsTool.draw(x, y, ctx, down, formChoosed, borderColor, fillColor, canvas.width, canvas.height);
				break;
    		case ("text"):
    			if (down) {
    				var textBox = document.getElementById('textBox');
    				textTool.draw(textBox.value, x, y, ctx, fontArray[selectedFontIndex], boldBool, italicBool);
    			}
    	};
    }

	//HANDLER TOOLS IMMAGINI
    function toolClickHandler(name, width, height) {
    	var rainbowPen = document.getElementById('rainbowPen');
    	rainbowPen.src = '/images/rainbowPen.png';
    	var toolImage = document.getElementById("toolImage");
    	if (name != 'rainbowPen')
    		toolImage.src = "/images/" + name + ".png";
    	else
    		toolImage.src = 'images/rainbowPen2.png';
    	toolImage.style.width = width+"px";
    	toolImage.style.height = height + "px";
    	selectTool(name,false);
    }

	//selection of the tool and create options elements
    function selectTool(name, firstTime) {
    	nameTool = name;
    	switch (nameTool) {
    		case ("lapis"):
    		case ("spray"):
    		case ("brush"):
    		case ("ruler"):
    			resetPanel(firstTime);
    			insertColorPanel();
    			insertWidthPenPanel(name);
    			break;
    		case ("rainbowPen"):
    			resetPanel(firstTime);
    			insertWidthPenPanel(name);
    			break;
    		case ("eraser"):
    			resetPanel(firstTime);
    			insertWidthEraserPanel();
    			break;
    		case ("sprinkler"):
    			resetPanel(firstTime);
    			insertSprinklerPanel();
    			break;
    		case ("forms"):
    			resetPanel(firstTime);
    			insertColorPanel();
    			insertOtherFormsPanel();
    			break;
    		case ("text"):
    			resetPanel(firstTime);
    			insertColorPanel();
    			insertFontPanel();
    			break;
    	};
    }

    function changeRelatedPanel(color) {
    	switch (nameTool) {
    		case ("lapis"):
    		case ("spray"):
    		case ("brush"):
    		case ("rainbowPen"):
    		case ("ruler"):
    			for (var i = 0; i < penWidthButtonArray.length; i++) {
    				var button = document.getElementById(penWidthButtonArray[i]);
    				button.style.backgroundColor = ctx.strokeStyle;
    			}
    			break;
    		case ("forms"):
    			if (nameTool == 'forms' && pressed == 'border') {
    				var borderColorButton = document.getElementById("borderColorButton");
    				borderColorButton.style.color = borderColor;
    				var rectButton = document.getElementById("rectButton");
    				rectButton.style.borderColor = borderColor;
    				var circleButton = document.getElementById("circleButton");
    				circleButton.style.borderColor = borderColor;
    			}
    			if (nameTool == 'forms' && pressed == 'fill') {
    				var fillColorButton = document.getElementById("fillColorButton");
    				fillColorButton.style.color =fillColor;
    				var rectButton = document.getElementById("rectButton");
    				rectButton.style.backgroundColor = fillColor;
    				var circleButton = document.getElementById("circleButton");
    				circleButton.style.backgroundColor = fillColor;
    			}
    			break;
    		case ("text"):
    			var fontChange = document.getElementById("selectFontPanel");
    			fontChange.style.color = color;
    			var boldFontButton = document.getElementById("boldFontButton");
    			var italicFontButton = document.getElementById("italicFontButton");
    			boldFontButton.style.color = color;
    			italicFontButton.style.color = color;
    			break;
    	};
    }

    function changeContextColor(color) {//change context color
    	if (nameTool == 'forms') {
    		if (pressed == 'border') {
    			borderColor = color;
    		} else {
				if(pressed == 'fill')
	    			fillColor = color;
    		}
    	} else {
    		ctx.strokeStyle = color;
    		ctx.fillStyle = color;
    	}
    }

    function changePressed(button) {
    	if (pressed == null) {
    		pressed = button;
    		if (pressed == 'border') {
    			var borderColorButton = document.getElementById("borderColorButton");
    			borderColorButton.setAttribute('class', 'borderColorButtonPressed');
    		} else {
    			var fillColorButton = document.getElementById("fillColorButton");
    			fillColorButton.setAttribute('class', 'fillColorButtonPressed');
    		}
    	} else {
    		if(pressed==button){
    			if (pressed == 'border' && button =='border') {
    				var borderColorButton = document.getElementById("borderColorButton");
    				borderColorButton.setAttribute('class', 'borderColorButton');
    			} else {
    				var fillColorButton = document.getElementById("fillColorButton");
    				fillColorButton.setAttribute('class', 'fillColorButton');
    			}
    			pressed = null;
    		}else{
    			if(pressed=='border' && button=='fill'){
    				var borderColorButton = document.getElementById("borderColorButton");
    				borderColorButton.setAttribute('class', 'borderColorButton');
    				var fillColorButton = document.getElementById("fillColorButton");
    				fillColorButton.setAttribute('class', 'fillColorButtonPressed');
    			}else{
    				var fillColorButton = document.getElementById("fillColorButton");
    				fillColorButton.setAttribute('class', 'fillColorButton');
    				var borderColorButton = document.getElementById("borderColorButton");
    				borderColorButton.setAttribute('class', 'borderColorButtonPressed');
    			}
    			pressed=button;
    		}
    	} 		
   }

    function changeForm(form) {
    	formChoosed = form;
    }

    function changeContextWidth(width) {//change context line width
    	ctx.lineWidth = width;
    }

    function changeFontPanel() {//change font
		var fontChange = document.getElementById("selectFontPanel");
		fontChange.style.fontFamily = fontArray[selectedFontIndex];
		var boldFontButton = document.getElementById("boldFontButton");
		var italicFontButton = document.getElementById("italicFontButton");
		boldFontButton.style.fontFamily = fontArray[selectedFontIndex];
		italicFontButton.style.fontFamily = fontArray[selectedFontIndex];
    }

    function changeSprinklerPanel() {
    	var sprinkleImg = document.getElementById("sprinkleImg");
    	sprinkleImg.src = '/images/sprinkler/' + sprinklerPattern[selectedPattern];
    }

    function leftKeyFontHandler() {//change font
    	selectedFontIndex--;
    	if (selectedFontIndex == -1)
    		selectedFontIndex = fontArray.length - 1;
    	changeFontPanel();
    }

    function rightKeyFontHandler() {//change font
    	selectedFontIndex++;
    	if (selectedFontIndex == fontArray.length)
    		selectedFontIndex = 0;
    	changeFontPanel();
    }

    function leftKeySprinklerHandler() {
    	selectedPattern--;
    	if (selectedPattern == -1)
    		selectedPattern = sprinklerPattern.length - 1;
    	changeSprinklerPanel();
    }

    function rightKeySprinklerHandler() {
    	selectedPattern++;
    	if (selectedPattern == sprinklerPattern.length)
    		selectedPattern = 0;
    	changeSprinklerPanel();
    }

    function resetPanel(firstTime) {
    	var panel = document.getElementById('myPanel');
    	if (!firstTime) {
    		while (panel.children.length != 1)
    			panel.removeChild(panel.lastElementChild);
    	}
    }

    function insertColorPanel() {
    	var panel = document.getElementById('myPanel');
    	var colorPanel = document.createElement('div');
    	colorPanel.setAttribute("class", 'colorPanel');
    	colorPanel.setAttribute("id", 'colorPanel');
    	for (var j = 0; j < 2; j++) {
    		for (var i = 0; i < colorFirstLine.length ; i++) {
    			var button = document.createElement('button');
    			if (j == 0) {
    				button.setAttribute("class", 'colorFirstLineStyle');
    				button.setAttribute("id", colorFirstLine[i] + "Button");
    				button.style.backgroundColor = colorFirstLine[i].toString();
    			} else {
    				button.setAttribute("class", 'colorSecondLineStyle');
    				button.setAttribute("id", colorSecondLine[i] + "Button");
    				button.style.backgroundColor = colorSecondLine[i].toString();
    			}
    			button.addEventListener("click", function () {
    				changeContextColor(this.style.backgroundColor);
    				changeRelatedPanel(this.style.backgroundColor);
    			}, false);
    			colorPanel.appendChild(button);
    			if (i == 9 && j == 0) {
    				var x = document.createElement("br");
    				colorPanel.appendChild(x);
    			}
    		}
    	}
    	panel.appendChild(colorPanel);
    }

    function insertWidthPenPanel(name) {
    	var panel = document.getElementById('myPanel');
    	var penWidthPanel = document.createElement('div');
    	penWidthPanel.setAttribute("class", 'penWidthPanel');
    	if (name == 'rainbowPen') {
    		penWidthPanel.style.marginLeft = '250px';
    		penWidthPanel.style.marginTop = '23.5px';
    	}
    	for (var i = 0; i < penWidthButtonArray.length; i++) {
    		var buttonWidth = document.createElement('button');
    		if (i != 0)
    			buttonWidth.style.marginLeft = "10px";
    		buttonWidth.setAttribute("class", 'penWidthButton');
    		buttonWidth.setAttribute("id", penWidthButtonArray[i]);
    		buttonWidth.style.width = penWidthButtonArray[i] + "px";
    		buttonWidth.style.height = penWidthButtonArray[i] + "px";
			if(name=='spray')
				buttonWidth.style.backgroundColor = ctx.fillStyle;
    		else
				if (name != 'rainbowPen')
					buttonWidth.style.backgroundColor = ctx.strokeStyle;
				else {
					buttonWidth.style.backgroundImage = 'url(/images/rainbow.jpg)';
					buttonWidth.style.backgroundSize='100%';
				}
    		buttonWidth.addEventListener("click", function () { changeContextWidth((this.id) / 10); }, false);
    		penWidthPanel.appendChild(buttonWidth);
    	}
    	panel.appendChild(penWidthPanel);
    }

    function insertWidthEraserPanel() {
    	var panel = document.getElementById('myPanel');
    	var eraserWidthPanel = document.createElement('div');
    	eraserWidthPanel.setAttribute("class", 'eraserWidthPanel');
    	for (var i = 0; i < eraserWidthButtonArray.length; i++) {
    		var button = document.createElement('button');
    		if (i != 0)
    			button.style.marginLeft = "10px";
    		button.setAttribute("class", 'eraserWidthButton');
    		button.setAttribute("id", eraserWidthButtonArray[i]);
    		button.style.height = eraserWidthButtonArray[i] + "px";
    		button.style.width = eraserWidthButtonArray[i] + "px";
    		button.addEventListener("click", function () {
    			eraserTool.changeWidth((this.id) / 5);
    		}, false);
    		eraserWidthPanel.appendChild(button);
    	}
    	panel.appendChild(eraserWidthPanel);
    }

    function insertFontPanel() {
    	var panel = document.getElementById('myPanel');

    	var colorPanel = document.getElementById('colorPanel');
    	colorPanel.style.position = 'absolute';
    	colorPanel.style.marginTop = '6px';

    	var textBox = document.createElement('input');
    	textBox.type = "text";
    	textBox.setAttribute('class', 'textBox');
    	textBox.setAttribute('id', 'textBox');
    	panel.appendChild(textBox);

    	var leftKey = document.createElement('div');
    	leftKey.setAttribute('class', 'leftKey');
    	leftKey.addEventListener("click",leftKeyFontHandler, false);
    	panel.appendChild(leftKey);
    	var selectFontPanel = document.createElement('div');
    	selectFontPanel.style.color = ctx.fillStyle;
    	selectFontPanel.setAttribute("class", 'selectFontPanel');
    	selectFontPanel.setAttribute("id", 'selectFontPanel');
    	selectFontPanel.style.fontFamily = fontArray[selectedFontIndex];
    	selectFontPanel.innerText = 'My font';
    	panel.appendChild(selectFontPanel);
    	var rightKey = document.createElement('button');
    	rightKey.setAttribute('class', 'rightKey');
    	rightKey.addEventListener("click", function () { rightKeyFontHandler() }, false);
    	panel.appendChild(rightKey);

    	var styleFontPanel = document.createElement('div');
    	styleFontPanel.setAttribute('class', 'styleFontPanel');
    	var bold = document.createElement('button');
    	bold.setAttribute('class', 'styleFontButton');
    	bold.setAttribute('id', 'boldFontButton');
    	bold.style.fontFamily = fontArray[selectedFontIndex];
    	bold.style.color = ctx.fillStyle;
    	bold.style.fontStyle = 'bold';
    	bold.innerText = "G";
    	bold.addEventListener('click', function () {
    		if (boldBool) {
    			boldBool = false;
    			bold.style.backgroundColor = 'lavender';
    		} else {
    			boldBool = true;
    			bold.style.backgroundColor = 'darksalmon';
    		}
    	}, false);
    	styleFontPanel.appendChild(bold);

    	var italic = document.createElement('button');
    	italic.setAttribute('class', 'styleFontButton');
    	italic.setAttribute('id', 'italicFontButton');
    	italic.style.fontFamily = fontArray[selectedFontIndex];
    	italic.style.fontStyle = 'italic';
    	italic.style.color = ctx.fillStyle;
    	italic.innerText = "c";
    	italic.addEventListener('click', function () {
    		if (italicBool) {
    			italicBool = false;
    			italic.style.backgroundColor = 'lavender';
    		} else {
    			italicBool = true;
    			italic.style.backgroundColor = 'darksalmon';
    		}
    	}, false);
    	styleFontPanel.appendChild(italic);
    	panel.appendChild(styleFontPanel);
    }

    function insertSprinklerPanel() {
    	var panel = document.getElementById('myPanel');
    	var leftKey = document.createElement('div');
    	leftKey.setAttribute('class', 'leftKeySprinkler');
    	leftKey.addEventListener("click", leftKeySprinklerHandler, false);
    	panel.appendChild(leftKey);
    	var sprinklerPanel = document.createElement('div');
    	sprinklerPanel.setAttribute("class", 'sprinklerPanel');
    	var imgSprinkler = document.createElement('img');
    	imgSprinkler.setAttribute("class", 'sprinkleImg');
    	imgSprinkler.setAttribute("id", 'sprinkleImg');
    	imgSprinkler.src = '/images/sprinkler/'+sprinklerPattern[selectedPattern];
    	sprinklerPanel.appendChild(imgSprinkler);
    	panel.appendChild(sprinklerPanel);
    	var rightKey = document.createElement('div');
    	rightKey.setAttribute('class', 'rightKeySprinkler');
    	rightKey.addEventListener("click", rightKeySprinklerHandler, false);
    	panel.appendChild(rightKey);
    }


    function insertOtherFormsPanel() {
    	pressed = null;
    	var panel = document.getElementById('myPanel');
    	var div = document.createElement('div');
    	div.setAttribute('class', 'formsPanel');

    	var borderColorButton = document.createElement('button');
    	borderColorButton.setAttribute('id', 'borderColorButton');
    	borderColorButton.setAttribute('class', 'borderColorButton');
    	borderColorButton.innerText = "border";
    	borderColorButton.style.color = borderColor;
    	borderColorButton.addEventListener("click", function () { changePressed('border'); }, false);
    	div.appendChild(borderColorButton);

    	var fillColorButton = document.createElement('button');
    	fillColorButton.setAttribute('id', 'fillColorButton');
    	fillColorButton.setAttribute('class', 'fillColorButton');
    	fillColorButton.innerText = "fill";
    	fillColorButton.style.color = fillColor;
    	fillColorButton.addEventListener("click", function () { changePressed('fill'); }, false);
    	div.appendChild(fillColorButton);

    	var rectButton = document.createElement('button');
    	rectButton.setAttribute('id', 'rectButton');
    	rectButton.setAttribute('class', 'rectButton');
    	rectButton.style.backgroundColor = fillColor;
    	rectButton.style.borderColor = borderColor;
    	rectButton.addEventListener('click', function () { changeForm('rectangle'); }, false);
    	div.appendChild(rectButton);

    	var circleButton = document.createElement('button');
    	circleButton.setAttribute('id', 'circleButton');
    	circleButton.setAttribute('class', 'circleButton');
    	circleButton.style.backgroundColor = fillColor;
    	circleButton.style.borderColor = borderColor;
    	circleButton.addEventListener('click', function(){changeForm('circle');}, false);
    	div.appendChild(circleButton);

    	panel.appendChild(div);
    }

    function changeDownPanel(character, myPanel) {
    	srcImg = null;
    	var myPanelImage = document.getElementById('myPanelImage');
    	var button1 = document.createElement('button');
    	var button2 = document.createElement('button');
    	var button3 = document.createElement('button');
    	button1.setAttribute('class', 'buttonImage buttonImage1');
    	button2.setAttribute('class', 'buttonImage buttonImage2');
    	button3.setAttribute('class', 'buttonImage buttonImage3');
    	button1.style.backgroundImage = 'url(/images/img/' + character + '.png)';
    	button2.style.backgroundImage = 'url(/images/img/' + character + 'White.png)';
    	button3.style.backgroundImage = 'url(/images/img/' + character + '2.png)';
    	myPanelImage.appendChild(button1);
    	myPanelImage.appendChild(button2);
    	myPanelImage.appendChild(button3);
    	switch (character) {
    		case ('mickey'):
    			button1.style.backgroundColor = button2.style.backgroundColor = button3.style.backgroundColor = 'rgb(246, 171, 165)';
    			break;
    		case ('minnie'):
    			button1.style.backgroundColor = button2.style.backgroundColor = button3.style.backgroundColor = 'rgb(185, 224, 246)';
    			break;
    		case ('donald'):
    			button1.style.backgroundColor = button2.style.backgroundColor = button3.style.backgroundColor = 'rgb(171, 246, 165)';
    			break;
    		case ('daisy'):
    			button1.style.backgroundColor = button2.style.backgroundColor = button3.style.backgroundColor = 'rgb(246, 165, 246)';
    			break;
    	}
    	button1.addEventListener('click', function () {
    		srcImg = button1.style.backgroundImage;
    	}, false);
    	button2.addEventListener('click', function () {
    		srcImg = button2.style.backgroundImage;
    	}, false);
    	button3.addEventListener('click', function () {
    		srcImg = button3.style.backgroundImage;
    	}, false);
    	srcImg = button1.style.backgroundImage;
    }

    function loadImgPanel(imgPanel) {
    	var shelf = document.createElement('img');
    	shelf.src = 'images/shelf.JPG';
    	shelf.setAttribute('class', 'shelf');
    	shelf.draggable = false;
    	imgPanel.appendChild(shelf);

    	var fishBowl = document.createElement('img');
    	fishBowl.src = 'images/img/fishbowl.png';
    	fishBowl.setAttribute('class', 'fishBowl');
    	fishBowl.draggable = false;
    	imgPanel.appendChild(fishBowl);

    	var fish = document.createElement('img');
    	fish.src = 'images/img/nemo.png';
    	fish.setAttribute('class', 'fish');
    	fish.draggable = false;
    	imgPanel.appendChild(fish);

    	var mickeyImage = document.createElement('img');
    	mickeyImage.setAttribute('class', 'mickeyImage');
    	mickeyImage.src = '/images/img/mickeyFrame.png';
    	mickeyImage.addEventListener('click', function () {
    		changeDownPanel('mickey');
    	}, false);
    	mickeyImage.draggable = false;
    	imgPanel.appendChild(mickeyImage);

    	var minnieImage = document.createElement('img');
    	minnieImage.setAttribute('class', 'minnieImage');
    	minnieImage.src = '/images/img/minnieFrame.png';
    	minnieImage.addEventListener('click', function () {
    		changeDownPanel('minnie');
    	}, false);
    	minnieImage.draggable = false;
    	imgPanel.appendChild(minnieImage);

    	var donaldImage = document.createElement('img');
    	donaldImage.setAttribute('class', 'donaldImage');
    	donaldImage.src = '/images/img/donaldFrame.png';
    	donaldImage.addEventListener('click', function (e) {
    		changeDownPanel('donald');
    	}, false);
    	donaldImage.draggable = false;
    	imgPanel.appendChild(donaldImage);

    	var daisyImage = document.createElement('img');
    	daisyImage.setAttribute('class', 'daisyImage');
    	daisyImage.src = '/images/img/daisyFrame.png';
    	daisyImage.addEventListener('click', function (e) {
			if(inside(e.pageX-daisyImage.offsetLeft-imgPanel.offsetLeft,e.pageY-imgPanel.offsetTop-daisyImage.offsetTop,daisyFrameMap))
	    		changeDownPanel('daisy');
    	}, false);
    	daisyImage.draggable = false;
    	imgPanel.appendChild(daisyImage);

    	var windowImg= document.createElement('img');
    	windowImg.setAttribute('class', 'windowImg');
    	windowImg.src = '/images/img/window.png';
    	windowImg.draggable = false;
    	imgPanel.appendChild(windowImg);

		var landscapeImg= document.createElement('img');
		landscapeImg.setAttribute('class', 'windowImg');
		landscapeImg.src = '/images/img/landscape.png';
		landscapeImg.style.zIndex = 2;
		imgPanel.appendChild(landscapeImg);

		var sky = document.createElement('div');
		sky.setAttribute('class', 'sky');
		imgPanel.appendChild(sky);

		var sunDiv = document.createElement('div');
		sunDiv.setAttribute('class', 'sunDiv');
		imgPanel.appendChild(sunDiv);

		changeDownPanel('mickey');
    }

    function changeToolPanel() {
    	var panelTool = document.getElementById('toolPanel');
    	if (panel == 'tool') {
    		var imgPanel = document.createElement('div');
    		imgPanel.setAttribute('class','imgPanel');
    		imgPanel.setAttribute('id', 'imgPanel');
    		panelTool.appendChild(imgPanel);
    		var imgPanelCharacter = document.createElement('div');
    		imgPanelCharacter.setAttribute('class', 'myPanelImage');
    		imgPanelCharacter.setAttribute('id', 'myPanelImage');
    		panelTool.appendChild(imgPanelCharacter);
    		loadImgPanel(imgPanel);
    		panel = 'img';
    		var undoButton = document.getElementById('undoButton');
    		undoButton.style.display = 'none';
    	} else {
    		imgTool.changePanel(ctx);
    		var undoButton = document.getElementById('undoButton');
    		undoButton.style.display = "inline";
    		var imgPanel = document.getElementById('imgPanel');
    		panelTool.removeChild(imgPanel);
    		var imgPanelCharacter = document.getElementById('myPanelImage');
    		panelTool.removeChild(imgPanelCharacter);
    		panel = 'tool';
    	}
    }

	//HANDLER BUTTONS
    function menuButtonClickHandler() {
    	window.location("index.html");
    }

    function otherButtonClickHandler() {
    	changeToolPanel();
    }
    function newButtonClickHandler() {
    	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    	imgTool.newSheetCanvas(ctx);
    	undoImage = null;
    	var undoButton = document.getElementById('undoButton');
    	undoButton.style.opacity = 0.6;
    }

    function undoButtonHandler() {
    	if (undoImage != null) {
    		ctx.putImageData(undoImage, 0, 0);
    		var undoButton = document.getElementById('undoButton');
    		undoButton.style.opacity = 0.6;
    	}
    }
})();