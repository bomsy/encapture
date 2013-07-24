var protocols = {
	auth: "authentication",
	data: "data"
};
var inbox = [];
var ports = {};

function portListen(){
	chrome.runtime.onConnect.addListener(function(port){
		register(port.name, port);
		port = ports[port.name];
		port.onMessage.addListener(function(payload){
			if(payload.protocol == protocols.auth){	
				port.postMessage({ protocol: protocols.auth, state: "connected" });
			}
			if(payload.protocol == protocols.data){
				if(payload.to === "100"){
					send(payload, true);
				}
				if(payload.to === "102"){
					send(payload, false);
				}
			}
		});
	});
	alert("background port listener started...");
}

function send(payload, tabs){
	if(tabs){ //sending message to the contentscript
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			chrome.tabs.sendMessage(tabs[0].id, payload, function(response){
				console.log(response);
			});
		});
	} else { //sending message to the panel
		chrome.runtime.sendMessage(payload, function(response){
			console.log(response)
		});
	}
}

function register(id, port){
	if(!ports[id]){
		ports[id] = port;
	}
}

function unregister(id){
	ports[id] = null;
}
portListen();


