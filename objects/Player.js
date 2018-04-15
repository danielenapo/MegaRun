//OGGETTO DEL PERSONAGGIO
function Player(onGround, velocityY, height, width, color, positionX, positionY, health){
	this.onGround=onGround; //bool che controlla se sta saltando
	this.velocityY=velocityY;//velocità in salto, serve per saltare
	//dati forma fisica
	this.height=height;
	this.width=width;
	this.color=color;
	this.health=health;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;

	this.salta= function(){
		this.velocityY=14;
		this.onGround=false;
		this.positionY-=this.velocityY;
	}

	this.isColliding=function(killerPositionX, killerPositionY, killerWidth, killerHeight){
		if(collideRectRect(this.positionX,this.positionY,this.width,this.height,
							killerPositionX,killerPositionY,killerWidth,killerHeight))
			return true;
		else
			return false;
	}



}
