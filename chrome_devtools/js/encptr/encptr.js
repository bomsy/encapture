var Encptr = (function(global, doc, undefined){
	var _encptr = {};
	var speedDifference = 100; //ms
	var pointer = null;
	/* Visual objects */
	var _events = {
		//actions occur during play back state
		/*Form Events - HTMLEvents - event.initEvent*/
		'focus'		: 	{
			action: function(e){
				/*console.log(e);
				var src = e.target || o.elem;
                src.focus();*/
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		}, 
		'blur'		: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},

		/*Key Events - KeyboardEvent - event.initKeyboardEvent*/
		'keydown'	: 	{
			action : function(e){
                var elem = e.target ;             
                if(e.keyCode === 8){ //backspace
                    elem.value = elem.value.substring(0 , elem.value.length - 1);
                }
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		}, 
		'keyup'		: 	{
			action: function(e){
				 console.log(e);
                //console.log("keyup");
               
                var elem = e.target;
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'keypress'	: 	{
			action : function(e){
				var elem = e.target ;
                elem.value = elem.value + String.fromCharCode(e.keyCode);
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},

		/*Mouse Events - MouseEvents - event.initMouseEvent*/
		'click'		: 	{
			action: function(e){
                e.target.focus();
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		}, 
		'dblclick'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'mousedown'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'mouseup'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		}, 
		'mousemove' : 	{
			action: function(e, o, pointer){
				o.elem.focus();
				pointer.move(e.pageX, e.pageY);
				console.log(e.target.tagName);
				if(o.elem.tagName == "A"){
					pointer.set("hand");
				}else{
					pointer.set("default");
				}
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'mouseout' 	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		}, 
		'mouseover' : 	{
			action: function(e){
				if(e.target.tagName === "a"){
					alert(e.target);
				}
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'mouseup' 	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'drag'		: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'dragend'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'dragenter'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'dragleave'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'dragover'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'dragstart'	: 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'mousewheel': 	{
			action: function(e){

			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return null;
			},
			active: false
		},
		'scroll'	: 	{
			action: function(e, o){
				console.log(o.custom.scrollTop, o.custom.scrollLeft);

				e.target.body.scrollTop = o.custom.scrollTop;
				e.target.body.scrollLeft = o.custom.scrollLeft;
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				var elem = e.srcElement || e.target;
				console.log(e);
				return {
					scrollTop: elem.body.scrollTop,
					scrollLeft: elem.body.scrollLeft
				}
			},
			active: false
		},

		/*Mutation Events - MutationEvents - event.initMutationEvent */

		/* SVG Events - SVGEvents/SVGZoomEvents - event.initEvent/event.initUIEvent */

		/*Window Events - UIEvents - event.initUIEvent*/
		'load' 		: 	{
			action: function(e){

			},
			active: false
		}
	};


	/* Mutation Observers */
	var _mutations = [];

	var _MutationObserver = global.MutationObserver || global.WebkitMutationObserver || global.MozMutationObserver;

	var _observerConfig = {
		attributes: true,
		childList: true,
		characterData: true,
		subtree: true,
		attributeOldValue: true,
		characterDataOldValue: true
	};

	var _observer = new _MutationObserver( function(mutations){
		mutations.forEach(function(mutation){
			_mutations.push(mutation);
		});
		console.log(_mutations);
	});
	var parseStringToPropertyObject = function(str){
		var props = str.split(";");
		var o = [];
		props.forEach(function(prop){
			if(prop.length > 0){
				if(prop.match(/\w+:/i) !== null){
					o[prop.match(/\w+:/i)[0].replace(":","")] = prop.match(/:\s*\w+/i)[0].replace(":","").replace(" ","");
				}else{;
					return prop;
				}
			}
		});
		return o;
	}
	var _revert = function(mutation){
		console.log(mutation);
		if(mutation.type === "characterData"){
			mutation.target.textContent = mutation.oldValue;
		}
		if(mutation.type === "attributes"){
			var oldValue = parseStringToPropertyObject(mutation.oldValue);
			console.log(mutation.oldValue);
			if(typeof oldValue === "object"){
				for(prop in oldValue){
					mutation.target[mutation.attributeName][prop] = oldValue[prop];
				}
			}else{
				console.log("bla")
				mutation.target[mutation.attributeName] = oldValue;
			}
		}
		if(mutation.type === "childList"){
			if(mutation.addedNodes !== null){
				_removeNodes(mutation.target, mutation.addedNodes);
			}
			if(mutation.removedNodes !== null){
				_addNodes(mutation.target, mutation.removedNodes);
			}
		}
	};

	var _removeNodes = function(target, nodes){
		nodes.forEach(function(node){
			target.removeChild(node);
		});
	};
	var _addNodes = function(target, nodes){
		nodes.forEach(function(node){
			target.appendChild(node);
		});
	}

	/*
		Event for operations on events
	*/
	var dom = {
		/* find twin Node */
		findTwinNode: function(node, root){
			//recursive loop through the node hierachy
			var twin = null;
			root = root || doc.body || doc.documentElement;
			walk(root);
			function walk(currentNode){
				var found;
				do {
					if(node.isEqualNode(currentNode)){
						twin = currentNode;
						break;
					}
					if(currentNode.hasChildNodes()){
						walk(currentNode.firstChild);
					}
				} while (currentNode = currentNode.nextSibling)
			}
			return twin;
		},
		createEvent: function(e){
			/*var evtType = e.constructor.name;
			var evt = doc.createEvent(evtType);
			if(eventInit[evtType]){
                evt = eventInit[evtType].init(evt, e);
				return evt; 
			}
			return undefined;*/
		},
		dispatchEvent: function(elem, event){
			var cancelled;
			if(elem){
				cancelled = !elem.dispatchEvent(event);
				if(cancelled){
					console.log('handler called prevent default');
				}
			}
		},
		simulateEvent: function(event, target){
            var simEvent = event;
            if(simEvent.type === "scroll" && (target === document.body || target === document.documentElement || target === window  || elem === document)){
            	target = document;
            }
            simEvent.target = target;
            simEvent.srcElement = target;
			this.dispatchEvent(target, simEvent);
			return simEvent;
		},
		addListeners: function(elem, listener){
			var i, len;
			elem = elem || doc;
			for(key in _events){
				if(_events[key].active){
					if(key == "scroll" && (elem === document.body || elem === document.documentElement || elem === window || elem === document)){
						elem = document;
					}
					elem.addEventListener(key, listener, false);
					console.log(elem);
					console.log(key + " listening");
				}
			}	
		},
		removeListeners: function(elem, listener){
			elem = elem || doc;
			for(key in _events){
				if(key == "scroll" && (elem === document.body || elem === document.documentElement || elem === window || elem === document)){
					elem = document;
				}
				if(_events[key]){
					elem.removeEventListener(key, listener, false);
				}
			}
		},
		executeEvent: function(evtObject, callback, delay, capture, pointer){
			var acutalElement = null;
			if(evtObject){
				global.setTimeout(function(){
					actualElement = capture.elem
					var sim = dom.simulateEvent(evtObject.event, actualElement);
                    if(_events[sim.type].active){
					   _events[sim.type].action(sim, evtObject, pointer);
                    }
					callback();
				}, evtObject.timeout + delay );
			}
		}
	};
//------------------iterator-------------------------------------------------------
	function Collection(arr){
		this.collection = arr || [];
		this.currentIndex = 0;
	};
	Collection.prototype.current = function(){
		return this.collection[this.currentIndex];
	};
	Collection.prototype.moveTo = function(index){
		if(index >= 0 && index < this.collection.length){
			this.currentIndex = index;
		}
	};

	Collection.prototype.next = function(){
		this.currentIndex++;
		return this.collection[this.currentIndex];
	};
	Collection.prototype.previous = function(){
		this.currentIndex--;
		return this.collection[this.currentIndex];	
	};
	Collection.prototype.first = function(){
		this.currentIndex = 0;
		return this.collection[this.currentIndex];
	};
	Collection.prototype.last = function(){
		this.currentIndex = this.collection.length - 1;
		return this.collection[this.currentIndex];
	};
	Collection.prototype.add = function(o){
		this.collection.push(o);
	};
	Collection.prototype.remove = function(i){
		this.collection.slice(i);	
	};
	Collection.prototype.get = function(){
		return this.collection;
	};
	Collection.prototype.size = function(){
		return this.collection.length;
	}
	Collection.prototype.empty = function(){
		this.collection = [];
	}
//----------------------timer------------------------------- 
	var timer = {
		startTime: null,
		endTime: null,
		elapsed: 0,
		start: function(){
			this.startTime = new Date().getTime();
		},
		stop: function(){
			this.endTime = new Date().getTime();
			this.elapsed = this.endTime - this.startTime;
		}
	};  
//------------------ emulator --------------------------------------------
	var simulator = {
		createPointer: function(simulateArea, images){
			var p = document.createElement("IMG");
			var style = p.style;
			var imgList = images;
			function showPointer(){
				p.style.display = "block";
			}
			function hidePointer(){
				p.style.display = "none";
			}
			function movePointer(x, y){
				p.style.top = 0 + y + "px";
				p.style.left = 0 + x + "px";
			}
			function setPointer(type){
				p.src = imgList[type];
			}
			p.id = "encptr-pointer";
			style.height = "24px";
			style.width = "19px";
			style.zIndex = "10000000";
			style.position = "absolute";
			style.top = "0px";
			style.left = "0px";

			setPointer("default");
			simulateArea.appendChild(p);
			hidePointer();
			return {
				set: setPointer,
				move: movePointer,
				show: showPointer,
				hide: hidePointer
			};
		}
	}
//-----------------player----------------------------------------------
function _player(event){
	setTimeout()
}
//-------------- encapture -----------------------------------------
    
	_encptr = function(args){
		_encptr.instances++;
		this.name = args.name || 'Capture ' + _encptr.instances + ' name';
		this.description = args.description || 'Capture ' + _encptr.instances + ' description'
        
		this.elem = args.root || doc;
        this.cachedStateBeforeRecord = null;
        
		this.events = new Collection(args.capture);
		this.playSpeed = 1;    //normal speed
		this.currentMode = _encptr.modes.stop;
		this.url = args.url;
		this.tab = args.tab;

		this.delay = args.delay || 0;
		
        this.emulator = args.emulator || null;
        
        this.pointer = simulator.createPointer(this.elem, args.pointers);
        pointer = this.pointer;
		console.log(this.name + ' is initialized.');
		//activate the events to be tracked
		this._activateEvents(['mousemove', 'mouseup', 'mousedown', 'click', 'keydown', 'keyup', 'keypress', 'scroll']);
		this.handler = null;
	};
	_encptr.instances = 0;
	_encptr.modes = {
		record: "record",
		play: "play",
		rewind: "rewind",
		pause: "pause",
		stop: "stop"
	}

	_encptr.prototype._startListener = function(elem, handler){
		var that = this;
		elem = elem || this.elem;
		handler = handler || 
		function(e){
			timer.stop();
			that.events.add({
				id: 		that.events.size(), 
				event: 		e || global.event, 
				context: 	global,
                elem: 		e.target || e.srcElement,
				timeout: 	timer.elapsed,
				custom: _events[e.type].getCustomProperties(e)
			});
			timer.start();
			that.events.moveTo(that.events.size() - 1);
			console.log(that.events.current());
		};
		timer.start();
		dom.addListeners(elem, handler);
		console.log("Event listener started...");
		return handler;
	};

	_encptr.prototype._stopListener = function(elem, handler){
		elem = elem || this.elem;
		handler = handler || this.handler;
		if(handler !== null){
			dom.removeListeners(elem, handler);

		}
	};

	_encptr.prototype._activateEvents = function(events){
		for(var i = 0, len = events.length; i< len; i++){
				_events[events[i]].active = true;
				console.log(events[i] + " event activated.");
		}
	};

	//------------control functions-----------
	_encptr.prototype.play = function(){
		this.pointer.show();
		this.currentMode = _encptr.modes.play;
		this._executeEvent(this.events.current(), this.delay);
		console.log(this.currentMode);
	};
	_encptr.prototype.stop = function(){
		this.currentMode = _encptr.modes.stop;
		this._stopListener();
		console.log(this.currentMode);
	};
	_encptr.prototype.rewind = function(){
		this.currentMode = _encptr.modes.rewind;
		this.events.first();
		console.log(this.currentMode);
	};
	_encptr.prototype.pause = function(){
		this.currentMode = _encptr.modes.pause;
		console.log(this.currentMode);
	};
	_encptr.prototype.record = function(){
		this.currentMode = _encptr.modes.record;
		this.events.empty();
		this.handler = this._startListener();
		console.log(this.currentMode);
	};
	
	_encptr.prototype._getNextEvent = function(){
		var modes = _encptr.modes;
		if(this.currentMode === modes.play){
			return this.events.next();
		}
		if(this.currentMode === modes.rewind){
			return this.events.previous()
		}
		if(this.currentMode === modes.stop){
			this.events.last();
			return undefined;
		}
		if(this.currentMode === modes.pause){
			//set to the next event but send no event for running
			this.events.next();
			return undefined;
		}
	}
	//----------------------------------------
	_encptr.prototype._executeEvent = function(evt, delay){
		var that = this;
		if(evt){
			dom.executeEvent(evt, function(){
				var n = that._getNextEvent();
				console.log(n);
				that._executeEvent(n, delay);
			}, delay, evt.elem, this.pointer);
		}
	};

	_encptr.prototype.increaseSpeed = function(){
		if(this.delay > 0){
			this.delay--; 
		}
	};

	_encptr.prototype.decreaseSpeed = function(){
		this.delay++;
	};

	_encptr.prototype.viewCapture = function(){
		return {
			name : this.name,
			description : this.description,
			capture : this.events.get()
		}
	};

	return _encptr;
}(window, document, undefined));
