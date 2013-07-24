var Encptr = (function(global, doc, undefined){
	var _encptr = {};
	var speedDifference = 100; //ms

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
				e.target.focus();
				pointer.move(e.pageX, e.pageY);
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
				e.target.scrollTop = o.custom.scrollTop;
				e.target.scrollLeft = o.custom.scrollLeft;
			},
			getCustomProperties: function(e){
				//gets specific properties for the event
				return {
					scrollTop: e.target.scrollTop,
					scrollLeft: e.target.scrollLeft
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
			//var newEvent = this.createEvent(event);
            var simEvent = event;
            event.target = target;
            event.srcElement = target;
			this.dispatchEvent(target, simEvent);
			return simEvent;
		},
		addListeners: function(elem, listener){
			var i, len;
			elem = elem || doc;
			for(key in _events){
				if(_events[key].active){
					elem.addEventListener(key, listener, false);
				}
			}	
		},
		removeListeners: function(elem, listener){
			elem = elem || doc;
			for(key in _events){
				if(_events[key]){
					elem.removeEventListener(key, listener, false);
				}
			}
		},
		executeEvent: function(evtObject, callback, delay, capture, pointer){
			var acutalElement = null;
			if(evtObject){
				global.setTimeout(function(){
					actualElement = dom.findTwinNode(evtObject.elem, capture.elem);
					if(actualElement){
						//console.log("actual element");
						//console.log(actualElement);
					}
					var sim = dom.simulateEvent(evtObject.event, actualElement);
                    if(typeof _events[sim.type].active){
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
		createPointer: function(simulateArea, img){
			var p = document.createElement("IMG");
			var style = p.style;
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
			p.id = "encptr-pointer";
			p.src = img; //to come: load pointer based on os
			style.height = "20px";
			style.width = "20px";
			style.zIndex = "10000000";
			style.position = "absolute";
			style.top = "0px";
			style.left = "0px";
			simulateArea.appendChild(p);
			hidePointer();
			return {
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
		this.currentMode = _encptr.mode.stop;
		this.url = args.url;
		this.tab = args.tab;

		this.delay = args.delay || 0;
		
        this.emulator = args.emulator || null;
        
        this.pointer = simulator.createPointer(this.elem, args.pointer);

		console.log(this.name + ' is initialized.');
		//activate the events to be tracked
		this._activateEvents(['mousemove', 'mouseup', 'mousedown', 'click', 'keydown', 'keyup', 'keypress', 'scroll']);
		//this.handler = this._startListener();
	};
	_encptr.instances = 0;

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
		dom.removeListeners(elem, handler);
	};

	_encptr.prototype._activateEvents = function(events){
		for(var i = 0, len = events.length; i< len; i++){
				_events[events[i]].active = true;
				console.log(events[i] + " event activated.");
		}
	};

	//------------control functions-----------
	_encptr.prototype.play = function(){
		var nextEvent;
        //reset to the state before record
        this.pointer.show();
        //start play
        //stop observing DOM mutations
        _observer.disconnect();
		console.log('playing');
		nextEvent = this.events.next();
		that._runEvent(that.events.current(), _encptr.mode.PLAY, this.delay);
			//that.pointer.hide();
	};
	_encptr.prototype.stop = function(){
		this.mode = _encptr.mode.STOP;
		this.events.last();
		this._stopListener();
		console.log('stopped');
	};
	_encptr.prototype.rewind = function(){
		this.mode = _encptr.mode.REWIND;
		this.events.first();
		
		console.log('rewind');
		for(var i = _mutations.length - 1; i >= 0 ; i--){
			_revert(_mutations[i]);
			console.log("revert: " + i);	
		}
		//this.execute(this.events.current(), _encptr.mode.REWIND);
	};
	_encptr.prototype.pause = function(){
		this.mode = _encptr.mode.PAUSE;
	};
	_encptr.prototype.record = function(){
		var that = this;
		//start observing DOM mutation
		//observer summaries
		_mutations = [];
		_observer.observe(this.elem, _observerConfig);
        //cache the current state of the watched element before record
        this.cachedStateBeforeRecord = this.elem.innerHTML;
		this.mode = _encptr.mode.RECORD;
		this.handler = this._startListener();

	};
	//----------------------------------------
	_encptr.prototype._runEvent = function(evt, execMode, delay){
		var that = this;
		if(execMode === this.mode){
			dom.executeEvent(evt, function(){
				var nxtEvt = undefined;
				if(execMode === _encptr.mode.play){
					nxtEvt = that.events.next();
				}
				if(execMode === _encptr.mode.rewind){
					nxtEvt = that.events.previous();
				}
				that._runEvent(nxtEvt, execMode, delay);
			}, delay, this, this.pointer);
		}
	};

	_encptr.prototype.increasePlaySpeed = function(){
		this.playSpeed = this.playSpeed / 2; 
	};

	_encptr.prototype.decreasePlaySpeed = function(){
		this.playSpeed = this.playSpeed * 2;
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
