var EnCapture = (function(global, doc, undefined){
	var ec = {};
	var speedDifference = 100; //ms
	var _events = {
		/*Form Events - HTMLEvents - event.initEvent*/
		'focus'		: 	false, 
		'blur'		: 	false,

		/*Key Events - KeyboardEvent - event.initKeyboardEvent*/
		'keydown'	: 	false, 
		'keyup'		: 	false,
		'keypress'	: 	false,

		/*Mouse Events - MouseEvents - event.initMouseEvent*/
		'click'		: 	false, 
		'dblclick'	: 	false,
		'mousedown'	: 	false,
		'mouseup'	: 	false, 
		'mousemove' : 	false,
		'mouseout' 	: 	false, 
		'mouseover' : 	false,
		'mouseup' 	: 	false,
		'drag'		: 	false,
		'dragend'	: 	false,
		'dragenter'	: 	false,
		'dragleave'	: 	false,
		'dragover'	: 	false,
		'dragstart'	: 	false,
		'mousewheel': 	false,
		'scroll'	: 	false,

		/*Mutation Events - MutationEvents - event.initMutationEvent */

		/* SVG Events - SVGEvents/SVGZoomEvents - event.initEvent/event.initUIEvent */

		/*Window Events - UIEvents - event.initUIEvent*/
		'load' 		: 	false
	};
	/* Mutation Observers */
	var _mutations = null;

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
		_mutations = mutations;
	});

	var _revertMutation = function(mutation){
		if(mutation.type === "CharacterData"){

		}
		if(mutation.type === "attributes"){
			mutation.target[mutation.attributeName] = mutation.oldValue;
		}
		if(mutation.type === "childList"){
			if(mutation.addedNodes !== null){

			}
			if(mutation.removedNodes !== null{
				
			}
		}
	};


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
				if(_events[key]){
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
		executeEvent: function(evtObject, callback, speed, capture){
			var acutalElement = null;
			if(evtObject){
				global.setTimeout(function(){
					actualElement = dom.findTwinNode(evtObject.elem, capture.elem);
					if(actualElement){
						//console.log("actual element");
						//console.log(actualElement);
					}
					var sim = dom.simulateEvent(evtObject.event, actualElement);
                    if(typeof _events[sim.type] === "function"){
					   _events[sim.type](sim, evtObject);
                    }
					callback();
				}, evtObject.timeout * (speed || 1) );
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
		time: 0,
		interval : null,
		start: function(func, delay){
			var that = this;
			this.interval = global.setInterval(function(){
				that.time += 1;
			}, 1);
		},
		reset: function(){
			this.time = 0;
		},
		stop: function(){
			global.clearInterval(this.interval);
		},
		get: function(){
			return this.time;
		},
		set: function(ms){
			this.time = ms;
		}
	};  
//------------------ emulator --------------------------------------------
    function Emulator(root){
        this.root = root;
        this.pointer = null;
    };
    
    Emulator.prototype.createPointer = function(){
        if(this.pointer){
        
        }
    };
    Emulator.prototype.createHandler = function(eventListener, handler){
    
    };
//-------------- encapture -----------------------------------------
    
	ec = function(args){
		ec.instances++;
		this.name = args.name || 'Capture ' + ec.instances + ' name';
		this.description = args.description || 'Capture ' + ec.instances + ' description'
        
		this.elem = args.root || doc;
        this.cachedStateBeforeRecord = null;
        
		this.events = new Collection(args.capture);
		this.playSpeed = 1;    //normal speed
		this.mode = ec.mode.STOP;
		this.url = args.url;
		this.tab = args.tab;
		this.playDelay = args.playDelay || 0;
		
        this.emulator = args.emulator || null; //new Emulator(this.elem);
        
		console.log(this.name + ' is initialized.');
		this.attachEventEmulators({
			'mousemove': function(e){
				var p = document.querySelector("#pointer");
				p.style.top = 0 + e.pageY + "px";
				p.style.left = 0 + e.pageX + "px";
                //console.log(e);
			},
			'mouseup': function(e){

			},
			'mousedown': function(e){

			},
			'click': function(e){
				console.log(e);
				var src = e.target || o.elem;
                src.focus();
                
			},
            'keydown': function(e){
            	console.log(e)
                var elem = e.target ;             
                if(e.keyCode === 8){
                    elem.value = elem.value.substring(0 , elem.value.length - 1);
                }
            },
            'keyup': function(e){
            	 console.log(e);
                //console.log("keyup");
               
                var elem = e.target;
                 
            },
			'keypress': function(e){
				var elem = e.target ;
                elem.value = elem.value + String.fromCharCode(e.keyCode);

			},
			'scroll': function(e){
            
            }
		});
		this.captureHandler = this.startListener(ec.mode.RECORD);
	};
	ec.instances = 0;
	ec.mode = {
		PLAY: 	0,
		RECORD: 1,
		PAUSE: 	2,
		STOP: 	3,
		REWIND: 4
	};

	ec.prototype.startListener = function(modeSwitch, elem, handler){
		var that = this;
		elem = elem || this.elem;
		handler = handler || function(e){
			if(that.mode === modeSwitch){
				that.events.add({
					id: 		that.events.size(), 
					event: 		e || global.event, 
					context: 	global,
	                elem: 		e.target || e.srcElement,
					timeout: 	timer.get() 
				});
				timer.stop();
				timer.reset();
				timer.start();
				that.events.moveTo(that.events.size() - 1);
				console.log(that.events.current());
			}
		};
		dom.addListeners(elem, handler);
		console.log("Event listener started...");
		return handler;
	};

	ec.prototype.stopListener = function(elem, handler){
		elem = elem || this.elem;
		handler = handler || this.captureHandler;
		dom.removeListeners(elem, handler);
	};

	ec.prototype.attachEventEmulators = function(renderers){
		if(renderers){
			for(eventType in renderers){
				if(typeof renderers[eventType] === "function" || renderers[eventType]){
					_events[eventType] = renderers[eventType];
					console.log("Attached " + eventType + " event renderer");
				}
			}
		}
	};

	//------------control functions-----------
	ec.prototype.play = function(){
		var that = this;
        //reset to the state before record
        this.elem.innerHTML = this.cachedStateBeforeRecord;
        //start play
        //stop observing DOM mutations
        _observer.disconnect();
		this.mode = ec.mode.PLAY;
		console.log('playing');
		global.setTimeout(function(){
			that.execute(that.events.current(), ec.mode.PLAY);
		}, this.playDelay);	
	};
	ec.prototype.stop = function(){
		this.mode = ec.mode.STOP;
		this.events.last();
		//if(this.captureListener){
			//dom.removeListeners(this.elem, this.captureListener);
			//this.stopListener(this.captureHandler);
			console.log('stopped');
		//}
		
	};
	ec.prototype.rewind = function(){
		this.mode = ec.mode.REWIND;
		this.events.first();
		console.log('rewind');
		//this.execute(this.events.current(), ec.mode.REWIND);
	};
	ec.prototype.pause = function(){
		this.mode = ec.mode.PAUSE;
	};
	ec.prototype.record = function(){
		var that = this;
		//start observing DOM mutations
		_observer.observe(this.elem, _observerConfig);
        //cache the current state of the watched element before record
        this.cachedStateBeforeRecord = this.elem.innerHTML;
        timer.start();
		this.mode = ec.mode.RECORD;
		//dom.addListeners(this.elem, listener);
		//this.captureHandler = this.startListener(ec.mode.RECORD);

	};
	//----------------------------------------
	ec.prototype.execute = function(evt, currentExecutionMode){
		var that = this;
		if(currentExecutionMode === this.mode){
			dom.executeEvent(evt, function(){
				var nxtEvt = undefined;
				if(currentExecutionMode === ec.mode.PLAY){
					nxtEvt = that.events.next();
				}
				if(currentExecutionMode === ec.mode.REWIND){
					nxtEvt = that.events.previous();
				}
				that.execute(nxtEvt, currentExecutionMode);
			}, undefined, this);
		}
	};

	ec.prototype.increasePlaySpeed = function(){
		this.playSpeed = this.playSpeed / 2; 
	};

	ec.prototype.decreasePlaySpeed = function(){
		this.playSpeed = this.playSpeed * 2;
	};

	ec.prototype.viewCapture = function(){
		return {
			name : this.name,
			description : this.description,
			capture : this.events.get()
		}
	};

	return ec;
}(window, document, undefined));
