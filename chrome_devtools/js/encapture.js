var EnCapture = (function(win, doc, undefined){
	var ec = {},
		speedDifference = 100; //ms
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

	var eventInit = {
		MouseEvent: 'initMouseEvent',
		MouseEvents: 'initMouseEvent',
		KeyboardEvent: 'initKeyboardEvent',
		KeyEvents: 'initKeyEvent',
		UIEvent: 'initUIEvent',
		UIEvents: 'initUIEvent'
	};

	/*
		Event for operations on events
	*/
	var dom = {
		createEvent: function(e){
			var evtType = e.constructor.name;
			var evt = doc.createEvent(evtType);
			if(eventInit[evtType]){
				evt[eventInit[evtType]](e.type, e.bubbles, e.cancelable, win, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
				return evt; 
			}
			return undefined;
		},
		dispatchEvent: function(elem, createdEvent){
			var cancelled;
			if(elem){
				cancelled = !elem.dispatchEvent(createdEvent);
				if(cancelled){
					console.log('handler called prevent default');
				}
			}
		},
		simulateEvent: function(event){
			var newEvent = this.createEvent(event);
			this.dispatchEvent(event.target, newEvent);
			return newEvent;
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
		executeEvent: function(evt, callback, speed){
			if(evt){
				win.setTimeout(function(){
					var sim = dom.simulateEvent(evt.event);
					_events[sim.type](sim);
					callback();
				}, evt.timeout * (speed || 1) );
			}
		}
	};
//------------------iterator-------------------------------------------------------
	function Iterator(arr){
		this.collection = arr || [];
		this.currentIndex = 0;
	};
	Iterator.prototype.current = function(){
		return this.collection[this.currentIndex];
	};
	Iterator.prototype.next = function(){
		this.currentIndex++;
		return this.collection[this.currentIndex];
	};
	Iterator.prototype.previous = function(){
		this.currentIndex--;
		return this.collection[this.currentIndex];
	};
	Iterator.prototype.first = function(){
		this.currentIndex = 0;
		return this.collection[this.currentIndex];
	};
	Iterator.prototype.last = function(){
		this.currentIndex = this.collection.length - 1;
		return this.collection[this.currentIndex];
	};
	Iterator.prototype.add = function(o){
		this.collection.push(o);
	};
	Iterator.prototype.remove = function(i){
		this.collection.slice(i);	
	};
	Iterator.prototype.get = function(){
		return this.collection;
	};
	Iterator.prototype.size = function(){
		return this.collection.length;
	}
//----------------------timer-------------------------------} 

	var timer = {
		time: 0,
		interval : null,
		start: function(func, delay){
			var that = this;
			this.interval = win.setInterval(function(){
				that.time += 1;
			}, 1);
		},
		reset: function(){
			this.time = 0;
		},
		stop: function(){
			win.clearInterval(this.interval);
		},
		get: function(){
			return this.time;
		},
		set: function(ms){
			this.time = ms;
		}
	};

	ec = function(args){
		ec.instances++;
		this.name = args.name || 'Capture ' + ec.instances + ' name';
		this.description = args.description || 'Capture ' + ec.instances + ' description';
		this.elem = args.root || doc;
		this.events = new Iterator(args.capture);
		this.playSpeed = 1;    //normal speed
		this.mode = ec.mode.STOP;
		this.url = args.url;
		this.tab = args.tab;
		this.playDelay = args.playDelay || 0;
		this.captureListener = null;
		console.log(this.name + ' is initialized.');
	};
	ec.instances = 0;
	ec.mode = {
		PLAY : 0,
		RECORD : 1,
		PAUSE : 2,
		STOP: 3,
		REWIND : 4
	};

	ec.attachEventRenderers = function(renderers){
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
		this.mode = ec.mode.PLAY;
		console.log('playing');
		win.setTimeout(function(){
			that.execute(that.events.current(), ec.mode.PLAY);
		}, this.playDelay);
		
		
	};
	ec.prototype.stop = function(){
		this.mode = ec.mode.STOP;
		this.events.last();
		if(this.captureListener){
			dom.removeListeners(this.elem, this.captureListener);
		}
		console.log('stopped');
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
		var listener = function(e){
			that.events.add({
				id: 		that.events.size(), 
				event: 		e || window.event, 
				context: 	window, 
				timeout: 	timer.get() 
			});
			console.log(that.events.size());
			timer.stop();
			timer.reset();
			timer.start();
		};
		this.mode = ec.mode.RECORD;
		dom.addListeners(this.elem, listener);
		timer.start();
		this.captureListener = listener;

	};
	//----------------------------------------
	ec.prototype.execute = function(evt, currentExecutionMode){
		var that = this;
		console.log("Capture Size: " +this.events.size() + " Current Execution Mode: " + currentExecutionMode + " Current Mode: " + this.mode)
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
			});
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
