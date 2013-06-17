var encaptureDevtoolsPanel = {};
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
}; 
var getChildElement = function(node, index){
	var nodeChildren = node.children,
		i, len;

	for(i = 0, len = nodeChildren.length; i < len; i++){
		if(i === index){
			return nodeChildren[i];
		}
	}
	return null;
};
// --------- PanelView object --------------

var captureListView = new View(document.querySelector('#ui-left-panel'));
captureListView.render = function(rootElement, renderObject, index){
	var captureList,
		listELement;

	if(rootElement.children.length > 0){
		captureList = rootElement.querySelector("#ui-capture-list");
		console.log(captureList);
		if(renderObject){
			//render the object
			listElement = document.createElement('li');
			listElement.innerHTML = renderObject.name;
			captureList.appendChild(listElement);
		} else {
			//remove the already rendered object
			var elm = captureList.children[index];
			captureList.removeChild(elm);
		}

	} else {
		//render the containing object
		rootElement.innerHTML = "<p>current captures</p><ul id='ui-capture-list'></ul>";
		//call the the render object for the element
		this.render(rootElement, renderObject, index);
	}
};

var captureListModel = new Model([{name: 'capture1'},{ name: 'capture2'},{ name:'capture3'}], captureListView);
// ----- Connection -----------
encaptureDevtoolsPanel.connection = {};
encaptureDevtoolsPanel.connection.name = 'PANEL_PORT';
encaptureDevtoolsPanel.connection.port = null;
encaptureDevtoolsPanel.connection.states = {
	ERROR: '0',
	CONNECTED : '1',
	DISCONNECTED: '2'
};
encaptureDevtoolsPanel.connection.state = encaptureDevtoolsPanel.connection.states.DISCONNECTED;
encaptureDevtoolsPanel.connection.create = function(){
	var port = chrome.runtime.connect({ name: this.name });
	return port;
};
encaptureDevtoolsPanel.connection.send = function(payload){
	if(this.port){
		this.port.postMessage(payload);
	}
};
encaptureDevtoolsPanel.connection.listen = function(){
	var that = this;
	var parent = encaptureDevtoolsPanel;
	if(this.port){
		this.port.onMessage.addListener(function(response){
			if(response.protocol == protocols.connect){
				that.state = response.state;
			}
			if(response.protocol == protocols.data){
				parent.delegate(response.value);
			}
		});
	}	
};
encaptureDevtoolsPanel.connection.disconnect = function(){
	if(this.port){
		chrome.runtime.Port.disconnect(this.port);
		this.port = null;
		this.state = this.states.DISCONNECTED;
	}
};
encaptureDevtoolsPanel.connection.connect = function(){
	this.port = this.create();
	this.send({ protocol: protocols.connect });
	this.listen();
};

// ---------- Actions --------------------------
encaptureDevtoolsPanel.actions = {};
encaptureDevtoolsPanel.actions.play = function(){
	var that = encaptureDevtoolsPanel;
	that.connection.send(_createPayload('CS_PORT', protocols.data, actions.PLAY));
};
encaptureDevtoolsPanel.actions.record = function(){
	var that = encaptureDevtoolsPanel;
	that.connection.send(_createPayload('CS_PORT', protocols.data, actions.RECORD));
};

encaptureDevtoolsPanel.actions.rewind = function(){
	var that = encaptureDevtoolsPanel;
	that.connection.send(_createPayload('CS_PORT', protocols.data, actions.REWIND));
};

encaptureDevtoolsPanel.actions.stop = function(){
	var that = encaptureDevtoolsPanel;
	that.connection.send(_createPayload('CS_PORT', protocols.data, actions.STOP));
};
encaptureDevtoolsPanel.actions.pause = function(){
	var that = encaptureDevtoolsPanel;
	that.connection.send(_createPayload('CS_PORT', protocols.data, actions.PAUSE));
};
// -------- Utils -------------------------------
encaptureDevtoolsPanel.utils = {};
var _createPayload = function(to, protocol, value){

	var payload = {
		to: to,
		from: encaptureDevtoolsPanel.connection.port.name,
		value: value,
		protocol: protocol
	}
	return payload;
};
encaptureDevtoolsPanel.actions.setCapture = function(capture){
	var that = encaptureDevtoolsPanel;
	that.connection.send(_createPayload('CS_PORT', protocols.data, capture ));
};


encaptureDevtoolsPanel.delegate = function(value){
	
};


encaptureDevtoolsPanel.actions.setEventListeners = function(){
	var that = this;
	var onEncapturePanelClick = function(e){
		e = e || window.event;
		
		var src = e.srcElement;

		if(src.id === 'rec'){
			that.record();
		}
		if(src.id === 'ply'){
			that.play();
		}
		if(src.id === "stp"){
			that.stop();
		}
		if(src.id === "rwd"){
			that.rewind();
		}
	}
	document.addEventListener('click', onEncapturePanelClick, false);
};


encaptureDevtoolsPanel.actions.setEventListeners();
encaptureDevtoolsPanel.connection.connect();



