function Model(data, view){
	this.data = data;
	this.view = view;
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
		this.view.render(data, index);
	}
}

function View(rootElement, initialize){
	this.root = rootElement;
	this.render = null; //overidde in instance 
	this.init = initialize;
	if(this.init){
		this.init();
	}
};
