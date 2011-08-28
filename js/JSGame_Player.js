function JSGame_Player(){
	var self = this;
	self.isHero = false;
	self.wantX = 0;
	self.wantY = 0;
	self.curX = 0;
	self.curY = 0;
	self.curDir = JSGame_DIR_NORTH;
	self.pixelOffsetX = 0;
	self.pixelOffsetY = 0;
	self.clothName = null;
	self.helmetName = null;
	self.weaponName = null;
	self.horseName = null;
	self.riding = false;
	self.curMotion = JSGame_MOTION_STAND;
	self.state = JSGame_MOTION_STAND;
	self.curFrame = 0;
	self.startFrame = 0;
	self.endFrame = 3;
	self.moveNextCoordFrame = 5;
	self.dead = false;
	self.frozen = false;
	self.canMove = true;
	self.canCast = true;

	self.isDead = false;

	self.curDelay = 0;

	/* test */
	self.test = 0;
	self.testMotion = JSGame_MOTION_WALK;
	self.testDir = JSGame_DIR_NORTH;
}

JSGame_Player[JSBase_prototype].setHero = function(isHero){
	this.isHero = isHero;
}

JSGame_Player[JSBase_prototype].setCloth = function(index){
	this.clothName = 'cloth' + index;
}

JSGame_Player[JSBase_prototype].setHelmet = function(index){
	this.helmetName = 'helmet' + index;
}

JSGame_Player[JSBase_prototype].setWeapon = function(index){
	this.weaponName = 'weapon' + index;
}

JSGame_Player[JSBase_prototype].setHorse = function(index){
	this.horseName = 'horse' + index;
}

JSGame_Player[JSBase_prototype].setCoord = function(x, y){
	var self = this;
	self.wantX = self.curX = x;
	self.wantY = self.curY = y;
}

JSGame_Player[JSBase_prototype].setMotion = function(motion, dir){
	var self = this;
	if(!self.dead && !self.frozen){
		self.curDir = dir;
		self.curMotion = motion;
		self.curFrame = 0;
		switch(motion){
			case JSGame_MOTION_STAND:
			case JSGame_MOTION_HORSE_STAND:
				self.startFrame = dir * 4;
				self.endFrame = self.startFrame + 3;
				self.canMove = true;
				self.canCast = true;
				break;
			case JSGame_MOTION_FIREBALL:
			case JSGame_MOTION_THUNDER:
				self.startFrame = dir * 5;
				self.endFrame = self.startFrame + 4;
				self.canMove = false;
				self.canCast = false;
				break;
			case JSGame_MOTION_PICK:
				self.startFrame = dir * 2;
				self.endFrame = self.startFrame + 1;
				self.canMove = false;
				self.canCast = false;
				break;
			case JSGame_MOTION_ATTACK:
			case JSGame_MOTION_HALFMOON:
				self.startFrame = dir * 6;
				self.endFrame = self.startFrame + 5;
				self.canMove = false;
				self.canCast = false;
				break;
			case JSGame_MOTION_HIT:
				self.startFrame = dir * 3;
				self.endFrame = self.startFrame + 2;
				self.canMove = false;
				self.canCast = false;
				break;
			case JSGame_MOTION_THUMP:
			case JSGame_MOTION_DOUBLE:
				self.startFrame = dir * 10;
				self.endFrame = self.startFrame + 9;
				self.canMove = false;
				self.canCast = false;
				break;
			case JSGame_MOTION_DIE:
				self.startFrame = dir * 10;
				self.endFrame = self.startFrame + 9;
				self.dead = true;
				self.canMove = false;
				self.canCast = false;
				break;
			case JSGame_MOTION_WALK:
			case JSGame_MOTION_RUN:
			case JSGame_MOTION_HORSE_WALK:
			case JSGame_MOTION_HORSE_RUN:
				self.startFrame = dir * 6;
				self.endFrame = self.startFrame + 5;
				self.canMove = false;
				self.canCast = false;
				break;
			default:
				break;
		}
	}
}

JSGame_Player[JSBase_prototype].updateCoord = function(scene, speed){
	var self = this, pos,
		curX = self.curX,
		curY = self.curY,
		unit = scene.unit,
		mapWidth = scene.map.width;

    switch(self.curDir){
        case JSGame_DIR_NORTH:
            curY -= speed;
            break;
        case JSGame_DIR_NORTH_EAST:
            curX += speed;
            curY -= speed;
            break;
        case JSGame_DIR_EAST:
            curX += speed;
            break;
        case JSGame_DIR_SOUTH_EAST:
            curX += speed;
            curY += speed;
            break;
        case JSGame_DIR_SOUTH:
            curY += speed;
            break;
        case JSGame_DIR_SOUTH_WEST:
            curX -= speed;
            curY += speed;
            break;
        case JSGame_DIR_WEST:
            curX -= speed;
            break;
        case JSGame_DIR_NORTH_WEST:
            curX -= speed;
            curY -= speed;
			break;
        default: 
			break;
    }
 
	pos = curX + curY * mapWidth;
	if(unit[pos] == null){
		unit[pos] = self;
		unit[self.curX + self.curY * mapWidth] = null;
		self.wantX = curX;
		self.wantY = curY;
	}	
}

JSGame_Player[JSBase_prototype].updatePixelOffset = function(scene, speed){
	var x, y,
		self = this,	
		curFrame = self.curFrame,
		isHero = self.isHero,
		map = scene.map,
		tileWidth = map.tileWidth,
		tileHeight = map.tileHeight,
		movePixelX = map.movePixelX,
		movePixelY = map.movePixelY;

	x = movePixelX[curFrame] * speed;
	y = movePixelY[curFrame] * speed;

	//if(curFrame < 4){
	//	x = (tileWidth / 6) * curFrame * speed;
	//	y = (tileHeight / 6) * curFrame * speed;
//	}else{
		//x = -(tileWidth / 6) * (6 - curFrame) * speed;
		//y = -(tileHeight / 6) * (6 - curFrame) * speed;
//	}

    switch(self.curDir){
        case JSGame_DIR_NORTH:
			self.pixelOffsetX = 0;
            self.pixelOffsetY = -y;
			if(isHero){
				scene.pixelOffsetX = 0;
				scene.pixelOffsetY = y;
			}
            break;
        case JSGame_DIR_NORTH_EAST:
            self.pixelOffsetX = x;
            self.pixelOffsetY = -y;
			if(isHero){
				scene.pixelOffsetX = -x;
				scene.pixelOffsetY = y;
			}
            break;
        case JSGame_DIR_EAST:
            self.pixelOffsetX = x;
            self.pixelOffsetY = 0;
			if(isHero){
				scene.pixelOffsetX = -x;
				scene.pixelOffsetY = 0;
			}
            break;
        case JSGame_DIR_SOUTH_EAST:
            self.pixelOffsetX = x;
            self.pixelOffsetY = y;
			if(isHero){
				scene.pixelOffsetX = -x;
				scene.pixelOffsetY = -y;
			}
            break;
        case JSGame_DIR_SOUTH:
            self.pixelOffsetX = 0;
            self.pixelOffsetY = y;
			if(isHero){
				scene.pixelOffsetX = 0;
				scene.pixelOffsetY = -y;
			}
            break;
        case JSGame_DIR_SOUTH_WEST:
            self.pixelOffsetX = -x;
            self.pixelOffsetY = y;
			if(isHero){
				scene.pixelOffsetX = x;
				scene.pixelOffsetY = -y;
			}
            break;
        case JSGame_DIR_WEST:
            self.pixelOffsetX = -x;
            self.pixelOffsetY = 0;
			if(isHero){
				scene.pixelOffsetX = x;
				scene.pixelOffsetY = 0;
			}
            break;
        case JSGame_DIR_NORTH_WEST:
            self.pixelOffsetX = -x;
            self.pixelOffsetY = -y;
			if(isHero){
				scene.pixelOffsetX = x;
				scene.pixelOffsetY = y;
			}
			break;
        default: 
			break;
    }
}

JSGame_Player[JSBase_prototype].render = function(canvas, resManager, offsetX, startX, tileWidth, offsetY, startY, tileHeight){
	var self = this, name, image, imageInfo, pixelX, pixelY;

	pixelX = offsetX + (self.curX - startX) * tileWidth;
	pixelY = offsetY + (self.curY - startY) * tileHeight;
	name = this.clothName + '_' + this.curMotion;
	if(resManager.images[name] && JSBase_window[name]){
		image = resManager.images[name];
		imageInfo = JSBase_window[name][this.startFrame];
		canvas.drawImage(image, imageInfo[0], imageInfo[1], imageInfo[2], imageInfo[3], imageInfo[4] + pixelX + this.pixelOffsetX, imageInfo[5] + pixelY + this.pixelOffsetY);
	}
}

JSGame_Player[JSBase_prototype].updateMotion = function(scene, interval, isMoveTime){
	var self = this,
		curMotion = self.curMotion;
	
	if(curMotion == JSGame_MOTION_DIE && self.startFrame >= self.endFrame - 1){
		self.isDead = true;
	}

	if(self.isDead){
		self.setMotion(JSGame_MOTION_DIE, self.curDir);
		self.startFrame = self.endFrame - 1;
		return;
	}
	
	if(curMotion == JSGame_MOTION_WALK ||
	   curMotion == JSGame_MOTION_RUN ||
	   curMotion == JSGame_MOTION_HORSE_WALK ||
	   curMotion == JSGame_MOTION_HORSE_RUN){
		if(isMoveTime){
		self.curDelay = 0;
		self.startFrame++;
		self.curFrame++;

		if(self.startFrame >= self.endFrame - 5){
			switch(self.curMotion){
				case JSGame_MOTION_WALK:
				case JSGame_MOTION_HORSE_WALK:
					self.updateCoord(scene, JSGame_SPEED_WALK);
					break;
				case JSGame_MOTION_RUN: 
					self.updateCoord(scene, JSGame_SPEED_RUN);
					break;
				case JSGame_MOTION_HORSE_RUN:
					self.updateCoord(scene, JSGame_SPEED_HORSE_RUN);
					break;
				default: 
					break;
			}
		}

		if(self.startFrame >= self.endFrame){
			self.curX = self.wantX;
			self.curY = self.wantY;

			self.pixelOffsetX = 0;
			self.pixelOffsetY = 0;	
			if(self.isHero){
				scene.pixelOffsetX = 0;
				scene.pixelOffsetY = 0;
			}
			
			self.setMotion(JSGame_MOTION_STAND, self.curDir);

			if(self.isHero){
				self.updateHero(scene);
			}else{
				self.updatePlayer(scene);
			}
		}
		
		if(self.startFrame < self.endFrame){
			switch(self.curMotion){
				case JSGame_MOTION_WALK:
				case JSGame_MOTION_HORSE_WALK:
					self.updatePixelOffset(scene, JSGame_SPEED_WALK);
					break;
				case JSGame_MOTION_RUN:
					self.updatePixelOffset(scene, JSGame_SPEED_RUN);
					break;
				case JSGame_MOTION_HORSE_RUN:
					slef.updatePixelOffset(scene, JSGame_SPEED_HORSE_RUN);
					break;
				default: 
					break;
			}
		}
		}
	}else{
		self.curDelay += interval;
		if(self.curDelay > JSGame_MOTION_INTERVAL){
			self.curDelay = 0;
			
			if(self.startFrame < self.endFrame){
				self.startFrame++;
				self.curFrame++;
				}
		}

				if(self.startFrame >= self.endFrame){

			self.pixelOffsetX = 0;
			self.pixelOffsetY = 0;	
			if(self.isHero){
				scene.pixelOffsetX = 0;
				scene.pixelOffsetY = 0;
			}
			
			self.setMotion(JSGame_MOTION_STAND, self.curDir);

			if(self.isHero){
				self.updateHero(scene);
			}else{
				self.updatePlayer(scene);
			}
		}

	}
}

JSGame_Player[JSBase_prototype].updateHero = function(scene){
	var self = this, nextCoord, nearDir,
		curX = self.curX,
		curY = self.curY,
		curDir = self.curDir,
		mouseDir = scene.mouseDir;

	if(scene.mouseButton == 0){
		nextCoord = JSGame_calcNextCoord(curX, curY, mouseDir, JSGame_SPEED_WALK);
		if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
			self.setMotion(JSGame_MOTION_WALK, mouseDir);
		}else{
			nearDir = JSGame_calcNearDir(mouseDir);
			nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[0], JSGame_SPEED_WALK);
			if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				self.setMotion(JSGame_MOTION_WALK, nearDir[0]);
			}else{
				nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[1], JSGame_SPEED_WALK);
				if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					self.setMotion(JSGame_MOTION_WALK, nearDir[1]);
				}else{
					self.setMotion(JSGame_MOTION_STAND, mouseDir);
				}
			}
		}
	}else if(scene.mouseButton == 2){
		nextCoord = JSGame_calcNextCoord(curX, curY, mouseDir, JSGame_SPEED_RUN);
		if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
			nextCoord = JSGame_calcNextCoord(curX, curY, mouseDir, JSGame_SPEED_WALK);
			if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				self.setMotion(JSGame_MOTION_RUN, mouseDir);
			}else{
				nearDir = JSGame_calcNearDir(mouseDir);
				nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[1], JSGame_SPEED_WALK);
				if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					self.setMotion(JSGame_MOTION_WALK, nearDir[1]);
				}else{
					nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[0], JSGame_SPEED_WALK);
					if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
						self.setMotion(JSGame_MOTION_WALK, nearDir[0]);
					}else{
						self.setMotion(JSGame_MOTION_STAND, mouseDir);
					}
				}
			}
		}else{
			nextCoord = JSGame_calcNextCoord(curX, curY, mouseDir, JSGame_SPEED_WALK);
			if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				self.setMotion(JSGame_MOTION_WALK, mouseDir);
			}else{
				nearDir = JSGame_calcNearDir(mouseDir);
				nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[0], JSGame_SPEED_WALK);
				if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					self.setMotion(JSGame_MOTION_WALK, nearDir[0]);
				}else{
					nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[1], JSGame_SPEED_WALK);
					if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
						self.setMotion(JSGame_MOTION_WALK, nearDir[1]);
					}else{
						self.setMotion(JSGame_MOTION_STAND, mouseDir);
					}
				}
			}
		}
	}else{
		self.setMotion(JSGame_MOTION_STAND, curDir);
	}

}

JSGame_Player[JSBase_prototype].updatePlayer = function(scene){
	var self = this, nextCoord, nearDir,
		curX = self.curX,
		curY = self.curY,
		motion = self.testMotion,
		dir = self.testDir;

	if(self.test > 10){
		self.test = 0;
		if(motion == JSGame_MOTION_WALK){
			self.testMotion = JSGame_MOTION_RUN;
		}else{
			self.testMotion = JSGame_MOTION_WALK;
		}

		self.testDir = JSBase_random(0, 7);
	}else{
		self.test++;
	if(motion == JSGame_MOTION_WALK){
		nextCoord = JSGame_calcNextCoord(curX, curY, dir, JSGame_SPEED_WALK);
		if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
			self.setMotion(JSGame_MOTION_WALK, dir);
		}else{
			nearDir = JSGame_calcNearDir(dir);
			nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[1], JSGame_SPEED_WALK);
			if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				self.setMotion(JSGame_MOTION_WALK, nearDir[1]);
			}else{
				nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[0], JSGame_SPEED_WALK);
				if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					self.setMotion(JSGame_MOTION_WALK, nearDir[0]);
				}else{
					self.setMotion(JSGame_MOTION_STAND, dir);
				}
			}
		}
	}else if(motion == JSGame_MOTION_RUN){
		nextCoord = JSGame_calcNextCoord(curX, curY, dir, JSGame_SPEED_RUN);
		if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
			nextCoord = JSGame_calcNextCoord(curX, curY, dir, JSGame_SPEED_WALK);
			if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				self.setMotion(JSGame_MOTION_RUN, dir);
			}else{
				nearDir = JSGame_calcNearDir(dir);
				nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[0], JSGame_SPEED_WALK);
				if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					self.setMotion(JSGame_MOTION_WALK, nearDir[0]);
				}else{
					nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[1], JSGame_SPEED_WALK);
					if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
						self.setMotion(JSGame_MOTION_WALK, nearDir[1]);
					}else{
						self.setMotion(JSGame_MOTION_STAND, dir);
					}
				}
			}
		}else{
			nextCoord = JSGame_calcNextCoord(curX, curY, dir, JSGame_SPEED_WALK);
			if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
				self.setMotion(JSGame_MOTION_WALK, dir);
			}else{
				nearDir = JSGame_calcNearDir(dir);
				nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[1], JSGame_SPEED_WALK);
				if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
					self.setMotion(JSGame_MOTION_WALK, nearDir[1]);
				}else{
					nextCoord = JSGame_calcNextCoord(curX, curY, nearDir[0], JSGame_SPEED_WALK);
					if(scene.calcCoordCanMove(nextCoord.x, nextCoord.y)){
						self.setMotion(JSGame_MOTION_WALK, nearDir[0]);
					}else{
						self.setMotion(JSGame_MOTION_STAND, dir);
					}
				}
			}
		}
	}

		
	}
}

