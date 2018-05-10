//Copyright (C) 2018  Napolitano Daniele

//OGGETTO DEL NEMICO
function Enemy(isAlive, sprites, height, width, color, positionX, positionY, health){
	//dati forma fisica
	this.isAlive;
	this.sprites=sprites;
	this.height=height;
	this.width=width;
	this.color=color;
	this.health=health;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;

	this.die=function(){
		//resetta i valori delle proprietà
		this.positionX=700;
		this.health=2;
		this.isAlive=false;
	}

	this.alive=function(){
		this.isAlive=true;
	}

	this.isColliding=function(killerPositionX, killerPositionY, killerWidth, killerHeight){
		if(collideRectCircle(this.positionX,this.positionY,this.width,this.height,killerPositionX,killerPositionY,killerWidth,killerHeight))
			return true;
		else
			return false;
	}

}
