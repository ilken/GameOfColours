$(document).ready(function(){
	var width = $(window).width();
	var height = $(window).height();
	var renderer = PIXI.autoDetectRenderer(width, height, {transparent: true});
	var interactive = true;
	var stage = new PIXI.Stage(0x66FF99, interactive);
	var container = new PIXI.Container();
	var gameManager = new GameManager(renderer, stage, container);

	$("body").append(renderer.view);
	stage.addChild(container);

	gameManager.init();
	animate();

	function animate(){
		requestAnimationFrame(animate);
		renderer.render(stage);
	}
});

/*********************
 *******GAME*MANAGER**/
function GameManager(renderer, stage, container){
	this.renderer = renderer;
	this.stage = stage;
	this.container = container;
	this.initContainer = container;
	this.boxes = [];
}

GameManager.prototype.init = function(){
	this.createBoxes();
	this.setWinner();
	this.drawBoxes();
	this.setScale();
	this.scaleContainer();
};

GameManager.prototype.createBoxes = function(){
	for(var i = 0; i < 25; i++ ){
		var box = new Box("green");
		this.boxes.push(box);
	}
};

GameManager.prototype.setWinner = function(){
	var winnerIndex = Math.floor(Math.random() * this.boxes.length);
	this.boxes[winnerIndex].setWinner();

	this.boxes[winnerIndex].box.click = function(data){
		this.changeLevel();
	}.bind(this);

	this.boxes[winnerIndex].box.tap = function(data){
		console.log("Tap Winner");
		this.changeLevel();
	}.bind(this);
};

GameManager.prototype.drawBoxes = function(){
	var positionX = 0;
	var positionY = 0;
	var boxCount = 0;

	for(var i = 0; i < 5; i++ ){
		for(var j = 0; j < 5; j++ ){
			this.boxes[boxCount].draw(this.container, positionX, positionY);
			positionX += 105;
			boxCount++;
		}
		positionX = 0;
		positionY += 105;
	}
};

GameManager.prototype.setScale = function(){
	this.scaleX = (this.renderer.width/this.container.width) * 0.95;
	this.scaleY = (this.renderer.height/this.container.height) * 0.95;
};

GameManager.prototype.scaleContainer = function(){
	this.container.scale.x = this.scaleX;
	this.container.scale.y = this.scaleY;
};

GameManager.prototype.changeLevel = function(){
	this.container.removeChildren();
	this.destroyBoxes();

	this.createBoxes();
	this.setWinner();
	this.drawBoxes();
	this.scaleContainer();
};

GameManager.prototype.destroyBoxes = function(){
	for(var i = 0; i < this.boxes.length; i++ ){
		this.boxes[i].destroy();
	}
	this.boxes = [];
	this.container = this.initContainer;
};

/*********************
 *******BOX***********/
function Box(colour){
	this.box = new PIXI.Graphics();
	this.colour = colour;
	this.width = 100;
	this.height = 100;
	this.isWinner = false;
	this.opacity = 1;
}

Box.prototype.destroy = function(){
	this.box.destroy();
};

Box.prototype.draw = function(container, positionX, positionY){
	this.box.beginFill(0x000000, this.opacity);
	this.box.drawRoundedRect(positionX, positionY, this.width, this.height, 10);

	container.addChild(this.box);
};

Box.prototype.setWinner = function(){
	this.isWinner = true;
	this.opacity = 0.9;

	this.box.interactive = true;
	this.box.hitArea = this.box.getBounds();
};
