//OGGETTO DEL PERSONAGGIO
function Player(onGround, velocityY, height, width, color, positionX, positionY){
	this.onGround=onGround; //bool che controlla se sta saltando
	this.velocityY=velocityY;//velocità in salto, serve per saltare
	//dati forma fisica
	this.height=height;
	this.width=width;
	this.color=color;
	//dati posizione iniziale
	this.positionX=positionX;
	this.positionY=positionY;

	this.salta= function(){
		this.velocityY=13;
		this.onGround=false;
		this.positionY-=this.velocityY;
	}
	
}
