(function () {
	"use strict";	

	var ViewManagement = Windows.UI.ViewManagement;
	var ApplicationViewWindowingMode = ViewManagement.ApplicationViewWindowingMode;
	var ApplicationView = ViewManagement.ApplicationView;
	ApplicationView.preferredLaunchWindowingMode = ApplicationViewWindowingMode.fullScreen;

	function playhandler(eventInfo) {//open draw table
		window.location('drawTable.html');
	}

	function close(eventInfo) {
		window.close();
	}

	var page = WinJS.UI.Pages.define("index.html", {
		ready: function (element, options) {
			var playButton = document.getElementById("play");
			playButton.addEventListener("click", function () { playhandler(); }, false);
			var quitbutton = document.getElementById("quit");
			quitbutton.addEventListener("click", function () { close(); }, false);

			var minnieSymbol = document.getElementById('minnieSymbol');
			minnieSymbol.addEventListener('click', function (e) {
				var bir1 = document.getElementById('birillo1');
				bir1.style.display = 'none';
				bir1.classList.remove('birillo1');
				bir1.classList.remove('birillo1Animation');
				minnieSymbol.style.display='none';
				minnieSymbol.classList.remove('minnieSymbol');
				minnieSymbol.classList.remove('minnieSymbolAnimate');
				setTimeout(function () {
					minnieSymbol.classList.add('minnieSymbolAnimate');
					bir1.classList.add('birillo1Animation');
					bir1.style.display = 'inline';
					minnieSymbol.style.display='inline';
				}, 0);
			},false);
		}
	});

})();