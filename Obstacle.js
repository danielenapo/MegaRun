//OGGETTO OSTACOLI
function Obstacle(velocityX, height, width, color, positionX, positionY){
	this.velocityX=velocityX;//velocità iniziale, si incrementa con la distanza
	//dati forma fisica
	this.height=height;
	this.width=width;
	this.color=color;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;
}
