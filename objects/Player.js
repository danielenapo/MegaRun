//OGGETTO DEL PERSONAGGIO
function Player(onGround, velocityY, sprites, height, width, color, positionX, positionY, health){
	this.onGround=onGround; //bool che controlla se sta saltando
	this.velocityY=velocityY;//velocità in salto, serve per saltare
	//dati forma fisica
	this.sprites=sprites;
	this.height=height;
	this.width=width;
	this.color=color;
	this.health=health;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;

	this.salta= function(){
		this.velocityY=13;
		this.onGround=false;
		this.positionY-=this.velocityY;
	}

	this.isColliding=function(killerPositionX, killerPositionY, killerWidth, killerHeight){
		if(collideRectRect(this.positionX,this.positionY,this.width-10,this.height,
							killerPositionX,killerPositionY,killerWidth,killerHeight))
			return true;
		else
			return false;
	}



}
