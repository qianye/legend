function _JSNet_isSuccess(xhr){
	var status = xhr.status;
	try{
		return (!status && location.protocol == 'file:')
			|| (status >= 200 && status < 300)
			|| (status == 304);
	}catch(e){}

	return JSBase_false;
}

function JSNet_httpRequest(option){
	option = option || {};
	var xhr = JSBase_null,
		timer,
		url = option.url || '',
		method = option.method || 'GET',
		data =  option.data || JSBase_null,
		onSuccess = option.onSuccess || function(){},
		onError = option.onError || function(){},
		async = option.async || JSBase_true,
		contentType = option.contentType ? option.contentType : 'utf-8';

	if(JSBase_isDefined(JSBase_window.XMLHttpRequest)){
		xhr = new XMLHttpRequest();
	}else if(JSBase_isDefined(JSBase_window.ActiveXObject)){
		try{
			xhr = new ActiveXObject('Msxml2.XMLHTTP');
		}catch(e){
			try{
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}catch(e){}
		}
	}
	
	if(xhr){
		xhr.open(method, url, async);
		xhr.setRequestHeader('Content-Type', contentType);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				JSBase_clearTimeout(timer);
				timer = JSBase_null;
				var o = {
					responseText: xhr.responseText,
					responseXML: xhr.responseXML,
					url: option.url,
					status: xhr.status
				};
				if(_JSNet_isSuccess(xhr)){
					try{
						onSuccess(o);
					}catch(e){}
				}else{
					try{
						onError(o);
					}catch(e){}
				}
				xhr = JSBase_null;
			}
		}

		xhr.send(data);
		timer = JSBase_setTimeout(function(){
			xhr.abort();
			xhr = JSBase_null;
		}, 10000);
	}
}

function _JSNet_load(type, option){
	option = option || {};
	var node, timer,
		head = JSNode_getElementByTagName('head')[0],
		url = option.url || '',
		defer = option.defer || false,
		query = option.query || JSBase_null,
		onSuccess = option.onSuccess || function(){},
		onError = option.onError || function(){},
		contentType = option.contentType ? option.contentType : 'utf-8';

	if(query !== null){
		url = url + '?' + query;
	}

	if(type === 'js'){
		node = JSNode_createNode('script', {type:'text/javascript', src: url, charset: contentType});
		if(defer){
			node.setAttribute('defer', 'defer');
		}
	}else if(type === 'css'){
		node = JSNode_createNode('link', {type:'text/css', rel: 'stylesheet', href: url, charset: contentType});
	}

	JSNode_addNode(head, node);

	if(JSBase_browserCore == JSBase_trident){
		node.onreadystatechange = function(){
			if(/^loaded|complete$/.test(this.readyState)){
				this.onreadystatechange = null;
				JSBase_clearTimeout(timer);
				timer = JSBase_null;
				onSuccess();
			}
		}
	}else if(JSBase_browserCore == JSBase_webkit){
		JSEvent_addEvent(node, 'load', function(){
			JSBase_clearTimeout(timer);
			timer = JSBase_null;
			onSuccess();
		});
	}else{
		node.onload = function(){
			JSBase_clearTimeout(timer);
			timer = JSBase_null;
			onSuccess();
		};
		node.onerror = function(){
			JSBase_clearTimeout(timer);
			timer = JSBase_null;
			onError();
		};
	}

	timer = JSBase_setTimeout(function(){
		JSNode_removeNode(node);
	}, 10000);	
}

function JSNet_loadJS(option){
	_JSNet_load('js', option);
}

function JSNet_loadCSS(option){
	_JSNet_load('css', option);
}
