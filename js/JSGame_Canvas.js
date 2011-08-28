function JSGame_Canvas(option){
	option = option || {};
	var self = this, node,
		parent = option.parent || JSBase_document.body,
		o = {
			top: option.top || 0,
			left: option.left || 0,
			width: option.width || 800,
			height: option.height || 480,
			postion: 'relative'
		};
	self.node = node = JSNode_createNode('canvas', o);
	JSNode_addNode(parent, node);
	self.width = o.width;
	self.height = o.height;
	self.context = node.getContext('2d');
}

/* color: '#FF00FF'
 *        'rgb(255, 0, 255)'
 *        'rgba(255, 0, 255, 1)'
 */
JSGame_Canvas[JSBase_prototype].drawRect = function(x, y, width, height, color){
	var context = this.context;
	context.save();
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
	context.restore();
}

JSGame_Canvas[JSBase_prototype].clear = function(color){
	this.drawRect(0, 0, this.width, this.height, color);
}

JSGame_Canvas[JSBase_prototype].drawText = function(text, x, y, color){
	var context = this.context;
	context.save();
	context.fillStyle = color;
	context.fillText(text, x, y);
	context.restore();
}

JSGame_Canvas[JSBase_prototype].drawLine = function(x1, y1, x2, y2, color){
	var context = this.context;
	context.save();
	context.strokeStyle = color;	
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
	context.restore();
}

JSGame_Canvas[JSBase_prototype].drawImage = function(image, sx, sy, sw, sh, dx, dy){
	this.context.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
}
