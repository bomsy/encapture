chrome.runtime.sendMessage(chrome.runtime.id, {
		tabId: chrome.devtools.inspectedWindow.tabId
	}, 
	function(result){
		console.log(result)
	});
alert("id sent");