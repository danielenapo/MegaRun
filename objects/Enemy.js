//OGGETTO DEL NEMICO
function Enemy(isAlive, height, width, color, positionX, positionY, health){
	//dati forma fisica
	this.isAlive;
	this.height=height;
	this.width=width;
	this.color=color;
	this.health=health;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;
	
	this.die=function(){
		this.isAlive=false;
		positionX=600;
	}

	this.alive=function(){
		this.isAlive=true;
	}
	
	this.isColliding=function(killerPositionX, killerPositionY, killerWidth, killerHeight){
		if(collideRectCircle(this.positionX,this.positionY,this.width,this.height,
							killerPositionX,killerPositionY,killerWidth,killerHeight))
			return true;
		else 
			return false;
	}
	
	
}
