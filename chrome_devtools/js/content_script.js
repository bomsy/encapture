
var protocols = {
	auth: 'authentication',
	data: 'data'
};

var newCapture = new Encptr({ root: document.body, capture: [], url: getHostUrl() })
var id = '100';
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

function sendToPort(payload){
	if(port){
		console.log('sending');
		port.postMessage(payload);
	}
}

 function listenOnPort(){
	if(port){
		port.onMessage.addListener(function(response){
			console.log(response)
			if(response.protocol == protocols.auth){
				state = response.state;
				console.log(states[state]);
			}
			if(response.protocol == protocols.data){
				console.log(response);
			}
		});
	}
}

function listen(){
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse){
			console.log(request);
			sendResponse({message: "got it"});
		}
	)
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
	sendToPort({ protocol: protocols.auth});
	listenOnPort();
	listen();
}

connect();

var encapturer = {
	captureObject: null,
	execute: function(action){
		console.log('execute');
		console.log(this.captureObject);
		if(action == 'record'){
			this.create(document.body, [], utils.getHostUrl);
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

function getHostUrl(constraint){
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