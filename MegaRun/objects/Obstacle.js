//OGGETTO OSTACOLI
function Obstacle(sprites, spritePositionX, spritePositionY, height, width, positionX, positionY, isSpecial){
	//dati forma fisica
	this.sprites=sprites;
	this.spritePositionX=spritePositionX;
	this.spritePositionY=spritePositionY;
	this.height=height;
	this.width=width;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;
	this.isSpecial=isSpecial; //valore 0 se è normale, 1 se è speciale, 2 se è speciale ed è stato colpito

	//collisione con colpi
	this.isColliding=function(killerPositionX, killerPositionY, killerWidth, killerHeight){
		if(collideRectCircle(this.positionX,this.positionY,this.width+20,this.height,killerPositionX,killerPositionY,killerWidth,killerHeight))
			return true;
		else
			return false;
	}

	this.becomePowerup=function(){
		this.isSpecial=2;
		this.width=14;
		this.height=14;
		this.spritePositionY=131;
		this.spritePositionX=96;
		this.positionY=263-14-80;
	}
}
