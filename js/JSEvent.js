var JSEvent_click = 'click',
	JSEvent_dbclick = 'dbclick',
	JSEvent_mousedown = 'mousedown',
	JSEvent_mouseup = 'mouseup',
	JSEvent_mousemove = 'mousemove',
	JSEvent_mouseover = 'mouseover',
	JSEvent_mouseout = 'mouseout',
	JSEvent_keydown = 'keydown',
	JSEvent_keyup = 'keyup',
	JSEvent_blur = 'blur',
	JSEvent_losecapture = 'losecapture';

function JSEvent_addEvent(node, type, fun){
	if(node.addEventListener){
		node.addEventListener(type, fun, JSBase_false);
	}else if(node.attachEvent){
		node['e' + type + fun] = fun;
		node[type + fun] = function(){node['e' + type + fun](JSEvent_event);}
		node.attachEvent('on' + type, node[type + fun]);
	}
}

function JSEvent_removeEvent(node, type, fun){
	if(node.removeEventListener){
		node.removeEventListener(type, fun, JSBase_false);
	}else if(node.detachEvent){
		node.detachEvent('on' + type, node[type + fun]);
		node[type + fun] = JSBase_null;
	}
}

function JSEvent_addLoadEvent(fun){
	if(JSBase_isFunction(JSBase_window.onload)){
		var old = JSBase_window.onload;
		JSBase_window.onload = function(){
			old(); 
			fun();
		}
	}else{
		JSBase_window.onload = fun;
	}
}

function JSEvent_fix(e){
	e = e || JSBase_window.event;
	if(!e) return;
	var target = e.target || e.srcElement || JSBase_document;
	var event = {
		event: e,
	    type: e.type,
		target: (target.nodeType === 3) ? target : target.parentNode,
		clientX: e.clientX,
		clientY: e.clientY,
		screenX: e.screenX,
		screenY: e.screenY,
		offsetX: e.offsetX || e.layerX,
		offsetY: e.offsetY || e.layerY,
		pageX: e.pageX || e.clientX + JSBase_getRootNode().scrollLeft - JSBase_getRootNode().clientLeft,
		pageY: e.pageY || e.clientY + JSBase_getRootNode().scrollTop - JSBase_getRootNode().clientTop,
		altKey: e.altKey || e.metaKey,
		ctrlKey: e.ctrlKey,
		shiftKey: e.shiftKey,
		keyCode: e.keyCode || e.which,
		charCode: e.keyCode || e.which,
		preventDefault: function(){
			var ev = this.event;
			if(ev.preventDefault){
				ev.preventDefault();
			}else{
				ev.returnValue = false;
			}
		},
		stopProtagation: function(){
			var ev = this.event;
			if(ev.stopProtagation){
				ev.stopProtagation();
			}else{
				ev.cancelBubble = true;
			}
		}
	};

	if(e.toString && e.toString().indexOf('MouseEvent') != -1){
		event.button = e.button;
	}else if(e.button){
		switch(e.button){
			case 1: event.button = 0; break;
			case 2: event.button = 2; break;
			case 4: event.button = 1; break;
			default: event.button = -1; break;
		}
	}

	return event;
}

JSBase_document.oncontextmenu = function(){return false;};
