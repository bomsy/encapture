var panels = chrome.devtools.panels;
var encapturePanel = panels.create("Encapture", "", "html/panel.html", function(panel){
	var play = panel.createStatusBarButton('assets/play.png', 'play capture.', false);
	var record = panel.createStatusBarButton('assets/record.png', 'record a new capture.', false);
	var pause = panel.createStatusBarButton('assets/pause.png', 'pause the capture.', false);
	var stop = panel.createStatusBarButton('assets/stop.png', 'stop the capture.', false);
	var rewind = panel.createStatusBarButton('assets/rewind.png', 'rewind the capture.', false);
	play.onClicked.addListener(function(){
		play.update('assets/play_live.png', 'play capture.', false);
		
	});
	record.onClicked.addListener(function(){
		record.update('assets/record_live.png', 'play capture.', false);
		
	});
	pause.onClicked.addListener(function(){
		pause.update('assets/pause_live.png', 'play capture.', false);
		
	});
	stop.onClicked.addListener(function(){
		stop.update('assets/stop_live.png', 'play capture.', false);
		
	});
	rewind.onClicked.addListener(function(){
		rewind.update('assets/rewind_live.png', 'play capture.', false);
	});
});
