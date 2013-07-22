var protocols = {
	auth: "authentication",
	data: "data"
};
var inbox = [];
var ports = {};
function listen(){
	chrome.runtime.onConnect.addListener(function(port){
		register(port.name, port);
		port = ports[port.name];
		port.onMessage.addListener(function(payload){
			if(payload.protocol == protocols.auth){	
				port.postMessage({ protocol: protocols.auth, state: "connected" });
			}
			if(payload.protocol == protocols.data){
				if(ports[payload.to]){
					ports[payload.to].postMessage(payload);
				}
			}
		});
	});
	alert("background port listener started...");
}

function register(id, port){
	if(!ports[id]){
		ports[id] = port;
	}
}

function unregister(id){
	ports[id] = null;
}
listen();


