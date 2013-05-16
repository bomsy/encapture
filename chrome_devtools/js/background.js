// Message protocol
/*{
	"title" : "",
	"sender" : "",
	"reciever" : "",
	"type" : "",
	"body" : []
}*/
//sending messages to content script
/*chrome.tabs.sendMessage(tabid, {}, 
	function(response){

});

//sending messgaes to the devtools page
chrome.runtime.sendMessage({},
	function(response){

});*/

//recieve messages
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		var tabId = request.tabId;
		sendResponse(tabId);
		alert("The id of the inspected page gotten from panels is " + tabId );
	}
);