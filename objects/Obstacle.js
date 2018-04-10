//OGGETTO OSTACOLI
function Obstacle(height, width, color, positionX, positionY){
	//dati forma fisica
	this.height=height;
	this.width=width;
	this.color=color;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;
	
	this.isColliding=function(killerPositionX, killerPositionY, killerWidth, killerHeight){
		if(collideRectCircle(this.positionX,this.positionY,this.width,this.height,
							killerPositionX,killerPositionY,killerWidth,killerHeight))
			return true;
		else 
			return false;
	}
}
