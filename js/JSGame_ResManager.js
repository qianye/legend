function JSGame_ResManager(url){
	this.url = url;
	this.images = {};
}

JSGame_ResManager[JSBase_prototype].loadImage = function(folder, name){
	var images = this.images;
	if(!images[name]){
		var img = new Image();
		img.src = this.url + folder + name + '.png';
		if(img.complete){
			images[name] = img;
			return;
		}
		img.onload = function(){
			images[name] = img;
		}
	}
}

JSGame_ResManager[JSBase_prototype].loadImageInfo = function(folder, name){
	JSNet_loadJS({url: this.url + folder + name});
}

JSGame_ResManager[JSBase_prototype].loadCloth = function(index){
	var i, imageName, jsName;
	jsName = 'cloth' + index + '.js';
	this.loadImageInfo('data/cloth/', jsName);
	for(i = 0; i < 15; i++){
		imageName = 'cloth' + index + '_' + i;
		this.loadImage('data/cloth/', imageName);		
	}
}
