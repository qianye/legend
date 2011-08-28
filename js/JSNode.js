function JSNode_getElementById(id){
	return JSBase_document.getElementById(id);
}

function JSNode_getElementByTagName(tagName){
   return JSBase_document.getElementsByTagName(tagName);
}

function JSNode_setClass(node, className){
	node.className = className;
}

function JSNode_getClass(node){
	return node.className;
}

function JSNode_setCssText(node, cssText){
	node.style.cssText = cssText;
}

function JSNode_addCssText(node, cssText){
	node.style.cssText += ';' + cssText;
}

function JSNode_createNode(tagName, attributes){
	var node = JSBase_document.createElement(tagName);
	var	s = {
		'class': function(){
			JSNode_setClass(node, attributes['class']);
		},
		style: function(){
			JSNode_setCssText(node, attributes.style);
		}
	};	
	for(a in attributes){
		if(s[a]){
			s[a]();
		}else{
			node.setAttribute(a, attributes[a]);
		}
	}
	return node;
}

function JSNode_addNode(parent, node){
	if(!parent || !node) return;
	parent.appendChild(node);
}

function JSNode_removeNode(node){
	node.parentNode.removeChild(node);
}

/* camelize(word-word) -> wordWord */
function _JSNode_camelize(s){
	return s.replace(/-(\w)/g, function(a, b){return b.toUpperCase();});
}

function _JSNode_fixFloat(property){
	if(property === 'float'){
		return node.style.cssFloat ? 'cssFloat' : 'styleFloat';
	}else{
		return property;
	}
}

function JSNode_setStyle(node, property, value){
	if(property === 'opacity'){
		if(node.style.filter){
			node.style.filter = 'alpha(opacity="' + value * 100 + '")';
			return;
		}
	}

	property = _JSNode_fixFloat(_JSNode_camelize(property));
	node.style[property] = value;
}

function JSNode_getStyle(node, property){
	if(property === 'opacity'){
		if(node.style.filter){
			var alpha = 1.0, i;
			i = node.style.filter.match(/opacity=(\d+)/);
			if(i && i[1]){
				alpha = i[1] / 100;
			}
			return alpha;
		}
	}
	property = _JSNode_fixFloat(_JSNode_camelize(property));
	var value = node.style[property];
	if(!value || value == 'auto'){
		if(node.currentStyle){
			value = node.currentStyle[property];
		}else if(JSBase_window.getComputedStyle){
			value = JSBase_window.getComputedStyle(node, null)[property];
		}else if(JSBase_document.defaultView && JSBase_document.defaultView.getComputedStyle){
			var css = JSBase_document.defaultView.getComputedStyle(node, null);
			value = css && css.getPropertyValue(property);
		}
	}

	return value;
}

function _JSNode_parseInt(value){
	if(!value || value == 'auto'){
		return 0;
	}else{
		return parseInt(value);
	}
}
function JSNode_setTop(node, top){
	JSNode_setStyle(node, 'top', top + 'px');
}

function JSNode_getTop(node){
	return _JSNode_parseInt(JSNode_getStyle(node, 'top'));
}

function JSNode_setLeft(node, left){
	JSNode_setStyle(node, 'left', left + 'px');
}

function JSNode_getLeft(node){
	return _JSNode_parseInt(JSNode_getStyle(node, 'left'));
}

function JSNode_setWidth(node, width){
	JSNode_setStyle(node, 'width', width + 'px');
}

function JSNode_getWidth(node){
	return _JSNode_parseInt(JSNode_getStyle(node, 'width'));
}

function JSNode_setHeight(node, height){
	JSNode_setStyle(node, 'height', height + 'px');
}

function JSNode_getHeight(node){
	return _JSNode_parseInt(JSNode_getStyle(node, 'height'));
}

function JSNode_setZIndex(node, zIndex){
	JSNode_setStyle(node, 'zIndex', zIndex);
}

function JSNode_getZIndex(node){
	return _JSNode_parseInt(JSNode_getStyle(node, 'zIndex'));
}

function JSNode_show(node){
	JSNode_setStyle(node, 'display', 'block');
}

function JSNode_hide(node){
	JSNode_setStyle(node, 'display', 'none');
}

function JSNode_setCursor(node, cursor){
	JSNode_setStyle(node, 'cursor', cursor);
}
