var panels = chrome.devtools.panels;
var encapturePanel = panels.create(
	"Encapture",
	"",
	"html/panel.html",
	function(panel){
		panel.onShown.addListener(function (window){
			chrome.tabs.executeScript (null , {file : "js/contentscript.js"})
		});
		panel.onHidden.addListener(function (window){

		});
	}
);
var contentscript = function(){

}