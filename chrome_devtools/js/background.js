//sending messages to content script
chrome.tabs.sendMessage(tabid, {}, 
	function(response){

});

//sending messgaes to the devtools page
chrome.runtime.sendMessage({},
	function(response){

})


alert("sdsffsd");

//recieve messages
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		var tabId = request.tabId;
		chrome.tabs.sendMessage(tabId, {}, 
			function(response){

		});
		sendResponse(tabId);
		alert("The id of the inspected page gotten from panels is " + tabId );
	}
);