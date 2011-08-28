function JSGame_Scene(option){
	option = option || {};
	var i, m, n, mapWidth, mapHeight, mapSize,
		self = this,
		map = option.map || JSGame_defaultMap,
		hero = option.hero,
		resManager = option.resManager || new JSGame_ResManager(''),
		canvas = option.canvas || new JSGame_Canvas(),
		canvasNode = canvas.node,
		sceneWidth = option.sceneWidth || 32,
		sceneHeight = option.sceneHeight || 32,
		cloth = [0,7,9,16];

	self.showGrid = option.showGrid || true;
	self.resManager = resManager;
	self.canvas = canvas;
	self.map = map;
	self.hero = hero;
	self.sceneWidth = sceneWidth;
	self.sceneHeight = sceneHeight;
	self.sceneOffsetX = -((sceneWidth * map.tileWidth - canvas.width) / 2);
	self.sceneOffsetY = -((sceneHeight * map.tileHeight - canvas.height) / 2);
	self.pixelOffsetX = 0;
	self.pixelOffsetY = 0;
	self.lastTime = JSBase_now();
	self.moveInterval = 0;

	mapWidth = map.width;
	mapHeight = map.height;

	for(m = 0; m < mapHeight; m++){
		for(n = 0; n < mapWidth; n++){
			map.barrier[n + m * mapWidth] = 0;
			if((m == 0 && n == 0) || (m % 2 == 0 && n % 2 == 0)){
				map.baseTile[n + m * mapWidth] = 1;
			}else{
				map.baseTile[n + m * mapWidth] = 0;
			}
		}
	}

	mapSize = mapWidth * mapHeight;
	self.item = new Array(mapSize);
	self.unit = new Array(mapSize);
	self.magic = new Array(mapSize);

	self.unit[hero.curX + hero.curY * map.width] = hero;

	self.mouseButton = -1;
	self.mouseDir = JSGame_DIR_NORTH;
	JSEvent_addEvent(canvasNode, JSEvent_mousedown, function(e){
		self.onMouseDown(JSEvent_fix(e));
	});
	JSEvent_addEvent(canvasNode, JSEvent_mouseup, function(e){
		self.onMouseUp();
	});
	JSEvent_addEvent(canvasNode, JSEvent_mousemove, function(e){
		self.onMouseMove(JSEvent_fix(e));
	});
	JSEvent_addEvent(canvasNode, JSEvent_mouseout, function(e){
		self.onMouseUp(JSEvent_fix(e));
	});
	JSEvent_addEvent(canvasNode, JSEvent_keydown, function(e){
	});
	JSEvent_addEvent(canvasNode, JSEvent_keyup, function(e){
	});



	resManager.loadImage('data/map/', 'map0');
    for(i = 0; i < 4; i++){	
		resManager.loadCloth(cloth[i]);
	}	
}

JSGame_Scene[JSBase_prototype].onMouseDown = function(e){
	var dir, nextCoord,
		self = this,
		hero = self.hero,
		x = hero.curX,
		y = hero.curY,
		sceneWidth = self.sceneWidth,
		sceneHeight = self.sceneHeight,
		map = self.map,
		tileWidth = map.tileWidth,
		tileHeight = map.tileHeight,
		offsetX = self.pixelOffsetX + self.sceneOffsetX,
		offsetY = self.pixelOffsetY + self.sceneOffsetY,
		sceneWidth2 = sceneWidth / 2,
		sceneHeight2 = sceneHeight / 2,
		startX = x - sceneWidth2 + 1,
		endX = x + sceneWidth2 - 1,
		startY = y - sceneHeight2,
		endY = y + sceneHeight2,
		wantX = Math.floor((e.offsetX - offsetX) / tileWidth) + startX,
		wantY = Math.floor((e.offsetY - offsetY) / tileHeight) + startY;
	self.mouseDir = dir = JSGame_calcDir(hero.curDir, x, y, wantX, wantY);
	if(e.button == 0){
		self.mouseButton = 0;
		if(hero.canMove){
			nextCoord = JSGame_calcNextCoord(x, y, dir, JSGame_SPEED_WALK);
			if(self.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				hero.setMotion(JSGame_MOTION_WALK, dir);
			}else{
				hero.setMotion(JSGame_MOTION_STAND, dir);
			}
		}
	}else if(e.button == 2){
		self.mouseButton = 2;
		if(hero.canMove){
			nextCoord = JSGame_calcNextCoord(x, y, dir, JSGame_SPEED_RUN);
			if(self.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				nextCoord = JSGame_calcNextCoord(x, y, dir, JSGame_SPEED_WALK);
				if(self.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					hero.setMotion(JSGame_MOTION_RUN, dir);
				}else{
					hero.setMotion(JSGame_MOTION_STAND, dir);
				}
			}else{
				nextCoord = JSGame_calcNextCoord(x, y, dir, JSGame_SPEED_WALK);
				if(self.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					hero.setMotion(JSGame_MOTION_WALK, dir);
				}else{
					hero.setMotion(JSGame_MOTION_STAND, dir);
				}
			}
		}
	}
}

JSGame_Scene[JSBase_prototype].onMouseUp = function(){
	this.mouseButton = -1;
}

JSGame_Scene[JSBase_prototype].onMouseMove = function(e){
	if(this.mouseButton == -1) return;
	var self = this,
		hero = self.hero,
		x = hero.curX,
		y = hero.curY,
		sceneWidth = self.sceneWidth,
		sceneHeight = self.sceneHeight,
		map = self.map,
		tileWidth = map.tileWidth,
		tileHeight = map.tileHeight,
		offsetX = self.pixelOffsetX + self.sceneOffsetX,
		offsetY = self.pixelOffsetY + self.sceneOffsetY,
		sceneWidth2 = sceneWidth / 2,
		sceneHeight2 = sceneHeight / 2,
		startX = x - sceneWidth2 + 1,
		endX = x + sceneWidth2 - 1,
		startY = y - sceneHeight2,
		endY = y + sceneHeight2,
		wantX = Math.floor((e.offsetX - offsetX) / tileWidth) + startX,
		wantY = Math.floor((e.offsetY - offsetY) / tileHeight) + startY;

	self.mouseDir = JSGame_calcDir(hero.curDir, x, y, wantX, wantY);
}

JSGame_Scene[JSBase_prototype].calcCoordCanMove = function(x, y){
	var self = this,
		unit = self.unit,
		map = self.map,
		barrier = map.barrier,
		mapWidth = map.width,
		mapHeight = map.height,
		pos = x + y * mapWidth;
	
	if(x < 0 || y < 0 || 
	   x > mapWidth - 1 || y > mapHeight - 1 ||
	   barrier[pos] == 1 || unit[pos] != null){
		return false;
	}else{
		return true;
	}
}

JSGame_Scene[JSBase_prototype].addUnit = function(u){
	var self = this,
		map = self.map,
		mapWidth = map.width,
		mapHeight = map.height,
		unit = self.unit,
		x = u.curX,
		y = u.curY,
		pos = x + y * mapWidth;

	if(x < 0 || y < 0 || x > mapWidth -1 || y > mapHeight -1) return;

	if(unit[pos] == null){
		unit[pos] = u;
	}
}

JSGame_Scene[JSBase_prototype].loop = function(){
	var i, x1, y1, m, n, curTime, interval,
		isMoveTime = false,
		self = this,
		hero = self.hero,
		x = hero.curX,
		y = hero.curY,
		unit = self.unit,
		canvas = self.canvas,
		sceneWidth = self.sceneWidth,
		sceneHeight = self.sceneHeight,
		resManager = self.resManager,
		map = self.map,
		mapWidth = map.width,
		mapHeight = map.height,
		tileWidth = map.tileWidth,
		tileHeight = map.tileHeight,
		offsetX = self.pixelOffsetX + self.sceneOffsetX,
		offsetY = self.pixelOffsetY + self.sceneOffsetY,
		x2 = offsetX + sceneWidth * tileWidth,
		y2 = offsetY + sceneHeight * tileHeight,
		sceneWidth2 = sceneWidth / 2,
		sceneHeight2 = sceneHeight / 2,
		startX = x - sceneWidth2 + 1,
		endX = x + sceneWidth2 - 1,
		startY = y - sceneHeight2,
		endY = y + sceneHeight2,
		unitTemp, baseTile, img;
	
	/* render */
	canvas.clear('#056289');

	for(m = startY; m < endY; m++){
		for(n = startX; n < endX; n++){
			if(n < 0 || m < 0 || n > mapWidth - 1 || m > mapHeight){
				continue;
			}
			baseTile = map.baseTile[n + m * mapWidth];
			if(baseTile == 1){
				img = resManager.images['map0'];
				canvas.drawImage(img, 0, 0, 96, 64, offsetX + (n - startX) * tileWidth, offsetY + (m - startY) * tileHeight);
			}
		}
	}

	if(self.showGrid){
		for(i = 0; i < sceneWidth; i++){
			x1 = offsetX + i * tileWidth;
			canvas.drawLine(x1, offsetY, x1, y2, '#88FF00');
		}

		for(i = 0; i < sceneHeight; i++){
			y1 = offsetY + i * tileHeight;
			canvas.drawLine(offsetX, y1, x2, y1, '#88FF00');
		}
	}

	
	for(m = startY; m < endY; m++){
		for(n = startX; n < endX; n++){
			if(n < 0 || m < 0 || n > mapWidth - 1 || m > mapHeight){
				continue;
			}
			unitTemp = unit[n + m * mapWidth];
			if(unitTemp){
				unitTemp.render(canvas, resManager, offsetX, startX, tileWidth, offsetY, startY, tileHeight);
			}
		}
	}
	

	/* update */
	curTime = JSBase_now();
	interval = curTime - self.lastTime;
	self.lastTime = curTime;
	self.moveInterval += interval;

	if(self.moveInterval > 160){
		isMoveTime = true;
		self.moveInterval = 0;
	}

	for(m = startY; m < endY; m++){
		for(n = startX; n < endX; n++){
			if(n < 0 || m < 0 || n > mapWidth - 1 || m > mapHeight){
				continue;
			}

			unitTemp = unit[n + m * mapWidth];
			if(unitTemp){
				unitTemp.updateMotion(self, interval, isMoveTime);
			}
		}
	}
}
