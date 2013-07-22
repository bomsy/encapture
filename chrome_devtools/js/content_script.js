
var protocols = {
	auth: 'authentication',
	data: 'data'
};

// --------- Connection --------------
var id = 'cs';
var port = null;
var states = {
	error : "An error occured.",
	connected : "The local port (content script) is connected to the remote port (background page).",
	disconnected: "The local port (content script) is disconnected from the remote port (background page)."
};

state = states.disconnected;

function create(){
	var port = chrome.runtime.connect({ name: id });
	return port;
}

function send(payload){
	if(port){
		console.log('sending');
		port.postMessage(payload);
	}
}

 function listen(){
	if(port){
		port.onMessage.addListener(function(response){
			console.log(response)
			if(response.protocol == protocols.auth){
				state = response.state;
				console.log(states[state]);
			}
			if(response.protocol == protocols.data){
				console.log("cs -  data");
				console.log(response);
			}
		});
	}
}

function disconnect(){
	if(port){
		chrome.runtime.Port.disconnect(port);
		port = null;
		state = states.disconnected;
	}
}

 function connect(){
	console.log('connect');
	port = create();
	send({ protocol: protocols.auth});
	listen();
}

connect();

var encapturer = {
	captureObject: null,
	execute: function(action){
		console.log('execute');
		console.log(this.captureObject);
		if(action == 'record'){
			this.create(document.body, [], utils.getHostWindowUrl);
		}
		if(this.captureObject){
			this.captureObject[action]();
		}
	},
	create: function(rootElement, capture, url){
		var o = {
			url: url,
			root: rootElement,
			capture: capture
		};
		console.log('create');
		console.log(capture);
		this.captureObject = new Encptr(o);
	}
};



var utils = {
	delegate: function(payload){
		var respVal, o = {};
		switch(typeof payload.value){
			case 'string':
				encapturer.execute(payload.value);
				break;
			case 'object':
				encapturer.create(document.body, payload.value, this.getHostWindowUrl());
				break;
			default:
		}
	},
	getHostWindowUrl: function(constraint){
		if(constraint === 'protocol'){
			return window.location.protocol;
		}else if(constraint === 'host'){
			return window.location.host;
		}else if(constraint === 'path'){
			return window.location.pathname;
		} else {
			return window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
		}
		
	}
};