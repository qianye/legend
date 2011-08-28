JSEvent_addLoadEvent(function(){
	var canvas,scene,hero,players = [], i,
		cloth = [0, 7, 9, 16];
	hero = new JSGame_Player();
	hero.setCoord(32, 32);
	hero.setCloth(16);
	hero.setHero(true);
	canvas = new JSGame_Canvas({parent: JSNode_getElementById('main')});
	scene = new JSGame_Scene({canvas: canvas, hero: hero});

	for(i = 0; i < 2000; i++){
		players[i] = new JSGame_Player();
		players[i].setCoord(JSBase_random(0, 63), JSBase_random(0, 63));
		players[i].setCloth(cloth[i % 4]);
		scene.addUnit(players[i]);
	}
	setInterval(function(){scene.loop();}, 40);
});
