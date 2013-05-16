var extn = chrome.runtime,
	insWinCapture = null;
//for recieving messages
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){

		sendResponse();
	}
);

function setupCapture(){
	var inspectedWindowCapture = new EnCapture(document.body, 
											"Inspected Window Capture", 
											"Capture events for inspected window");
	extn.sendMessage({}, function(response){});
} 
