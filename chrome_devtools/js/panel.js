
var protocols = {
	auth: 'authentication',
	data: 'data'
};

// ----- Connection -----------
var id = '102';
var port = null;
var states = {
	error : "An error occured.",
	connected : "The local port (panel) is connected to the remote port (background page).",
	disconnected: "The local port (panel) is disconnected from the remote port (background page)."
};

state = states.disconnected;

function create(id){
	var port = chrome.runtime.connect({ name: id });
	return port;
}

function send(payload){
	if(this.port){
		this.port.postMessage(payload);
	}
}

function listen(){
	if(this.port){
		this.port.onMessage.addListener(function(response){
			if(response.protocol == protocols.auth){
				state = response.state;
				console.log(states[state]);
			}
			if(response.protocol == protocols.data){
				console.log("panel -  data");
				console.log(response);
			}
		});
	}	
}

function disconnect(){
	if(this.port){
		chrome.runtime.Port.disconnect(port);
		port = null;
		state = states.disconnected;
	}
}


 function connect(){
	port = create(id); //create a port 
	send({ protocol: protocols.auth }); //send a desire to connect message to the background page
	listen(); //listen for response from backgroundpage
};

// ---------- Actions --------------------------
function sendData(to, data){
	send({ to: to, from: id, data: data, protocol: protocols.data })
}

function setPanelEventListeners(){
	var onButtonClick = function(e){
		e = e || window.event;
		
		var src = e.srcElement;

		if(src.id === 'b-record'){
			sendData("100", "record");
		}
		if(src.id === 'b-play'){
			sendData("100", "stop");
			sendData("100", "rewind");
			sendData("100", "play");
		}
		
	}
	document.addEventListener('click', onButtonClick, false);
};

setPanelEventListeners();
connect();



