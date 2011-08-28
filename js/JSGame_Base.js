var JSGame_DIR_NORTH = 0,
	JSGame_DIR_NORTH_EAST = 1,
	JSGame_DIR_EAST = 2,
	JSGame_DIR_SOUTH_EAST = 3,
	JSGame_DIR_SOUTH = 4,
	JSGame_DIR_SOUTH_WEST = 5,
	JSGame_DIR_WEST = 6,
	JSGame_DIR_NORTH_WEST = 7,
	JSGame_MOTION_STAND = 0, //站立
	JSGame_MOTION_FIREBALL = 1, //火球
	JSGame_MOTION_THUNDER = 2, //闪电
	JSGame_MOTION_PICK = 3, //挖肉
	JSGame_MOTION_ATTACK = 4, //普通攻击
	JSGame_MOTION_HALFMOON = 5, //半月
	JSGame_MOTION_HIT = 6, //被攻击
	JSGame_MOTION_THUMP = 7, //翔空
	JSGame_MOTION_DOUBLE = 8, //莲月
	JSGame_MOTION_DIE = 9, //死亡
	JSGame_MOTION_WALK = 10, //走
	JSGame_MOTION_RUN = 11, //跑
	JSGame_MOTION_HORSE_STAND = 12, //骑马站
	JSGame_MOTION_HORSE_WALK = 13, //骑马走
	JSGame_MOTION_HORSE_RUN = 14, //骑马跑
	JSGame_SPEED_STAND = 0,
	JSGame_SPEED_WALK = 1,
	JSGame_SPEED_RUN = 2,
	JSGame_SPEED_HORSE_RUN = 3,
	JSGame_MOTION_INTERVAL = 180;

var JSGame_defaultMap = {
	width: 64,
	height: 64,
	tileWidth: 48, 
	tileHeight: 32,
	movePixelX: [8, 16, 24, 32, 40, 48],
	movePixelY: [5, 11, 16, 21, 27, 32],
	barrier: [],
	baseTile: [],
	smallObject: [],
	largeObject: [],
	teleporter: []
};

function JSGame_calcDir(curDir, curX, curY, wantX, wantY){
    var tan,
		dx = wantX - curX,
		dy = wantY - curY;

	if(dx == 0 && dy == 0 ){
		return curDir;
	}

    if(dx == 0){
        if(dy < 0){
            return JSGame_DIR_NORTH;
        }else if(dy > 0){
            return JSGame_DIR_SOUTH;
        }
    }
        
	if(dy == 0){
        if(dx < 0){
            return JSGame_DIR_WEST;
        }else if(dx > 0){
            return JSGame_DIR_EAST;
        }
    }
    
	tan = Math.abs(dy) / Math.abs(dx);

	if(dx > 0 && dy > 0){
		if(tan < 0.34){
			return JSGame_DIR_EAST;
		}else if(tan > 2){
			return JSGame_DIR_SOUTH;
		}else{
			return JSGame_DIR_SOUTH_EAST;
		}
    }
    
	if(dx < 0 && dy > 0){
		if(tan < 0.34){
			return JSGame_DIR_WEST;
		}else if(tan > 2){
			return JSGame_DIR_SOUTH;
		}else{
			return JSGame_DIR_SOUTH_WEST;
		}
    }

	if(dx < 0 && dy < 0){
		if(tan < 0.34){
			return JSGame_DIR_WEST;
		}else if(tan > 2){
			return JSGame_DIR_NORTH;
		}else{
			return JSGame_DIR_NORTH_WEST;
		}
    }

	if(dx > 0 && dy <0){
		if(tan < 0.34){
			return JSGame_DIR_EAST;
		}else if(tan > 2){
			return JSGame_DIR_NORTH;
		}else{
			return JSGame_DIR_NORTH_EAST;
		}
    }

	return curDir;
}

function JSGame_calcNextCoord(curX, curY, dir, speed){
    switch(dir){
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
	return {x:curX, y:curY};	
}

function JSGame_calcNearDir(dir){
	var dir1, dir2;
    switch(dir){
        case JSGame_DIR_NORTH:
            dir1 = JSGame_DIR_NORTH_WEST;
			dir2 = JSGame_DIR_NORTH_EAST;
            break;
        case JSGame_DIR_NORTH_EAST:
            dir1 = JSGame_DIR_EAST;
            dir2 = JSGame_DIR_NORTH;
            break;
        case JSGame_DIR_EAST:
            dir1 = JSGame_DIR_NORTH_EAST;
            dir2 = JSGame_DIR_SOUTH_EAST;
            break;
        case JSGame_DIR_SOUTH_EAST:
            dir1 = JSGame_DIR_SOUTH;
            dir2 = JSGame_DIR_EAST;
            break;
        case JSGame_DIR_SOUTH:
            dir1 = JSGame_DIR_SOUTH_WEST;
            dir2 = JSGame_DIR_SOUTH_EAST;
            break;
        case JSGame_DIR_SOUTH_WEST:
            dir1 = JSGame_DIR_SOUTH;
            dir2 = JSGame_DIR_WEST;
            break;
        case JSGame_DIR_WEST:
            dir1 = JSGame_DIR_SOUTH_WEST;
            dir2 = JSGame_DIR_NORTH_WEST;
            break;
        case JSGame_DIR_NORTH_WEST:
            dir1 = JSGame_DIR_NORTH;
            dir2 = JSGame_DIR_WEST;
			break;
        default: 
			break;
    }
	return [dir1, dir2];	
}


