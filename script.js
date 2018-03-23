function setup(){
	createCanvas(500, 300);//crea il canvas con id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");//rinomina l'id di default del canvas
	background(52);//imposta il colore di background del canvas
	loop();
}

function draw(){
	dinosauro= new Player();
	fill(color(dinosauro.color)); // riempie il quadrato del colore selezionato
	rect(dinosauro.positionX, dinosauro.positionY, dinosauro.height, dinosauro.width);//personaggio
}

//OGGETTO DEL PERSONAGGIO
function Player(){
	this.isJumping=false; //bool che controlla se sta saltando
	this.velocity=3;//velocità iniziale, si incrementa con la distanza
	//dati forma fisica
	this.height=55;
	this.width=55;
	this.color="#FF0000";
	//dati posizione iniziale
	this.positionX=100; 
	this.positionY=300-this.height-1;//grandezza canvas-altezza-1(per non essere attaccato al fondo)
}

