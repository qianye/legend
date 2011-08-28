var JSBase_true = true,
	JSBase_false = false,
	JSBase_null = null,
	JSBase_prototype = 'prototype',
	JSBase_window = window,
    JSBase_document = JSBase_window.document,
	JSBase_parseInt = parseInt,
	JSBase_setTimeout = JSBase_window.setTimeout,
	JSBase_clearTimeout = JSBase_window.clearTimeout,
	JSBase_setInterval = JSBase_window.setInterval,
	JSBase_clearInterval = JSBase_window.clearInterval,
	JSBase_userAgent = navigator.userAgent.toLowerCase(),
	JSBase_platform,
	JSBase_browser,
	JSBase_browserCore,
	JSBase_unknown = 0,
	JSBase_windows = 1,
	JSBase_linux = 2,
	JSBase_android = 3,
	JSBase_mac = 4,
	JSBase_ipad = 5,
	JSBase_iphone = 6,
	JSBase_msie = 0,
	JSBase_firefox = 1,
	JSBase_chrome = 2,
	JSBase_opera = 3,
	JSBase_safari = 4,
	JSBase_trident = 1,
	JSBase_gecko = 2,
	JSBase_webkit = 3,
	JSBase_presto = 4;

function JSBase_isDefined(x){
	return typeof x !== 'undefined';
}

function JSBase_isNotDefined(x){
	return typeof x === 'undefined';
}

function JSBase_isString(x){
	return typeof x === 'string';
}

function JSBase_isFunction(x){
	return typeof x === 'function';
}

function JSBase_random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function JSBase_now(){
	return (new Date()).getTime();
}

function JSBase_extend(child, parent){
	var func = function(){};
	func[JSBase_prototype] = parent[JSBase_prototype];
	child[JSBase_prototype] = new func();
	child[JSBase_prototype].constructor = child;
}

function JSBase_getRootNode(){
	return (JSBase_document.compatMode === 'CSS1Compat') ? JSBase_document.documentElement : JSBase_document.body;
}

function JSBase_getClientWidth(node){
	node = node || JSBase_getRootNode();
	return node.clientWidth;
}

function JSBase_getClientHeight(node){
	node = node || JSBase_getRootNode();
	return node.clientHeight;
}

JSBase_platform = (/windows/.test(JSBase_userAgent)) ? JSBase_windows:
(/linux/.test(JSBase_userAgent)) ? JSBase_linux:
(/mac/.test(JSBase_userAgent)) ? JSBase_mac:
(/android/.test(JSBase_userAgent)) ? JSBase_android:
(/iphone/.test(JSBase_userAgent)) ? JSBase_iphone:
(/ipad/.test(JSBase_userAgent)) ? JSBase_ipad : JSBase_unknown;

JSBase_browser = (/msie/.test(JSBase_userAgent)) ? JSBase_msie:
(/firefox/.test(JSBase_userAgent)) ? JSBase_firefox:
(/chrome/.test(JSBase_userAgent)) ? JSBase_chrome:
(/opera/.test(JSBase_userAgent)) ? JSBase_opera:
(/.*safari/.test(JSBase_userAgent)) ? JSBase_safari : JSBase_unknown;

JSBase_browserCore = (/trident/.test(JSBase_userAgent)) ? JSBase_trident:
(/gecko/.test(JSBase_userAgent)) ? JSBase_gecko:
(/webkit/.test(JSBase_userAgent)) ? JSBase_webkit:
(/presto/.test(JSBase_userAgent)) ? JSBase_presto:JSBase_unknown;
