function setup(){
	createCanvas(500, 300);			//crea il canvas con id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");//rinomina l'id di default del canvas
	background(72);					//imposta il colore di background del canvas
	gravity=0.5;
	
	//INIZIALIZZAZIONI OGGETTO PERSONAGGIO
	var velocityX=3, velocityY=0, height=55, width=55, positionX=100; 
	positionYMin=300-height-1;			// = grandezza canvas-altezza-1(per non attaccarsi al fondo)
	player= new Player(false, velocityX,velocityY, height, width, "#FF0000", positionX, positionYMin);
	frameRate(30);
}

function draw(){
	print(player.positionY);
	if(player.positionY>=positionYMin){ //se la posizione Y è minima, è per terra
		player.onGround=true;
		player.positionY=positionYMin}
	else 
	{
		player.onGround=false;
		player.positionY-=player.velocityY;
		player.velocityY-=gravity;
	}
	background(72);
	fill(color(player.color)); // riempie il quadrato del colore selezionato
	rect(player.positionX, player.positionY, player.height, player.width);//disegna il personaggio
	controlloComandi();
}

function controlloComandi(){
	if((mouseIsPressed || keyIsDown(UP_ARROW) ||keyIsDown(32))&& player.onGround==true)
		player.salta();
}


