function Model(data, view){
	this.data = data;
	this.view = view;
	this.initialize();
};
Model.prototype.initialize = function(){
	var i, len;
	for(i = 0, len = this.data.length; i < len; i++ ){
		this._render(this.data[i], i);
	}
};

Model.prototype.add = function(o){
	this.data.push(o);
	this._render(o, this.data.length - 1);
};

Model.prototype.remove = function(index){
	this.data.slice(index, 1);
	this._render(null, index);
};
Model.prototype._render = function(data, index){
	if(this.view && this.view.render){
		this.view.render(this.view.root, data, index);
	}
}

function View(rootElement){
	this.root = rootElement;
	this.render = null; //overidde in instance 
	this.click = null;
	this.hover = null;
	this._addListeners();
};

View.prototype._onClick = function(e){
	e = e || window.event;
};
View.prototype._onHover = function(e){
	e = e || window.event;
};
View.prototype._addListeners = function(e){
	this.root.addEventListener('click', this._onClick, false);
	this.root.addEventListener('mouseover', this._onHover, false);
};