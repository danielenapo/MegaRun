//OGGETTO DEL PERSONAGGIO
function Player(onGround, velocityX, velocityY, height, width, color, positionX, positionY){
	this.onGround=onGround; //bool che controlla se sta saltando
	this.velocityX=velocityX;//velocità iniziale, si incrementa con la distanza
	this.velocityY=velocityY;//velocità in salto, serve per saltare
	//dati forma fisica
	this.height=height;
	this.width=width;
	this.color=color;
	//dati posizione iniziale
	this.positionX=positionX; 
	this.positionY=positionY;
	
	this.salta= function(){
		this.velocityY=7;
		this.onGround=false;	
		this.positionY-=this.velocityY;
	}
}
