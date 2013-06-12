var encaptureDevtoolsBackground = {};
var protocols = {
	connect: '0',
	data: '1'
};


encaptureDevtoolsBackground.connection = {};
encaptureDevtoolsBackground.connection.ports = {};
encaptureDevtoolsBackground.connection.states = {
	ERROR: '0',
	CONNECTED : '1',
	DISCONNECTED: '2'
};

encaptureDevtoolsBackground.connection.listen = function(){
	var that = this;
	chrome.runtime.onConnect.addListener(function(port){
		port.onMessage.addListener(function(payload){
			if(payload.protocol === protocols.connect){
				that.register(port.name, port);
				port.postMessage({ protocol: protocols.connect, state: that.states.CONNECTED });
			}
			if(payload.protocol === protocols.data){
				if(that.ports[payload.to]){
					that.ports[payload.to].postMessage(payload);
				}
			}
			
		});
	});
	alert("background port listener started...");
};
encaptureDevtoolsBackground.connection.register = function(id, port){
	if(!this.ports[id]){
		this.ports[id] = port;
	}
};

encaptureDevtoolsBackground.connection.unregister = function(id){
	this.ports[id] = null;
};

encaptureDevtoolsBackground.connection.listen();
