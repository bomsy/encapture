var encaptureDevtoolsContentscript = {};
var iWindowCapture = null;
var protocols = {
	connect: '0',
	data: '1'
};
var actions = {
	PLAY: 'play',
	RECORD: 'record',
	STOP: 'stop',
	REWIND: 'rewind',
	PAUSE: 'pause'
} 
// --------- Connection --------------
var connection = {};
connection.name = 'CS_PORT';
connection.port = null;
connection.states = {
	ERROR: '0',
	CONNECTED : '1',
	DISCONNECTED: '2'
};
connection.state = connection.states.DISCONNECTED;
connection.create = function(){
	var port = chrome.runtime.connect({ name: this.name });
	return port;
};
connection.send = function(payload){
	if(this.port){
		console.log('sending');
		this.port.postMessage(payload);
	}
};
connection.listen = function(){
	var that = this;
	if(this.port){
		this.port.onMessage.addListener(function(response){
			if(response.protocol == protocols.connect){
				console.log(response.state);
				that.state = response.state;
			}
			if(response.protocol == protocols.data){
				utils.delegate(response);
			}
		});
	}
};
connection.disconnect = function(){
	if(this.port){
		chrome.runtime.Port.disconnect(this.port);
		this.port = null;
		this.state = this.states.DISCONNECTED;
	}
};
connection.connect = function(){
	console.log('connect');
	this.port = this.create();
	this.send({ protocol: protocols.connect });
	this.listen();
};

connection.connect();

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


//Attach render functions that simulate on capture playback
EnCapture.attachEventRenderers(
	{
		'mousemove'	: function(e){
			var p = document.querySelector("#pointer");
			p.style.top = 0 + e.pageY + "px";
			p.style.left = 0 + e.pageX + "px";
		},
		'click' : function(e){
			var src = e.target;
			src.style.border = "1px solid #f00";			
		}, 
		'keypress'	: 	function(e){
			var src = e.target;
			src.value = src.value + String.fromCharCode(e.charCode);
		},
		'scroll'	: 	function(e){

		},
	}
);



//inject pointer into document
var p = document.querySelector("#pointer")
if(!p){
	p = document.createElement("DIV");
	p.id = "pointer";
	p.style.height = "15px";
	p.style.width = "15px";
	p.style.borderRadius = "15px";
	p.style.backgroundColor = "#999";
	p.style.zIndex = "100";
	p.style.position = "absolute";
	p.style.top = "0px";
	p.style.left = "0px";
	document.body.appendChild(p);
}