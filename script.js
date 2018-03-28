function setup(){
	createCanvas(500, 300);			//crea il canvas con id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");//rinomina l'id di default del canvas
	frameRate(30);					//velocità di gioco (numero di ripetizioni di ciclo al secondo, frame stampati per ogi secondo)
	gravity=1;
	velocityX=10;
	obstacleCounter=0;
	difficultyLevel=[false,false];
	velocitaProiettili=30;
	contaSpara=0;
	
	//INIZIALIZZAZIONI OGGETTO PERSONAGGIO
	var velocityY=0, height=55, width=55, positionX=0;
	positionYMin=300-height-1;			// = grandezza canvas-altezza-1(per non attaccarsi al fondo)
	player= new Player(true,velocityY, height, width, "#FF0000", positionX, positionYMin, 100);
	
	//INIZIALIZZAZIONE ARRAY DI OSTACOLI
	obstacles=[];
	colpi=[];
	var possibleHeight=[50, 30];//due possibili altezze(alto e basso)
	var possibleWidth=[30, 50];//due possibili larghezze(stretto e alto)
	var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
	var positionYO=300-possibleHeight[type]-1; //laposizione y si calcola come quella del giocatore
	var obstacle= new Obstacle(possibleHeight[type], possibleWidth[type], "#00FF00", 900, positionYO); //istanzia un nuovo ostacolo
	obstacles.push(obstacle);
	var obstacle= new Obstacle(possibleHeight[type], possibleWidth[type], "#00FF00", 1500, positionYO); //istanzia un nuovo ostacolo
	obstacles.push(obstacle);
}



function draw(){
	background(72);	//cancella il canvas
	controlli();	//esegue controlli di routine
	
//######## AGGIORNAMENTO IMMAGINE CANVAS (draw) ##############
	
	//STAMPA GIOCATORE
	noStroke();
	fill(color(player.color));	// riempie il quadrato del colore selezionato
	rect(player.positionX, player.positionY, player.width, player.height);	//disegna il personaggio
	
	//STAMPA OSTACOLI
	for(var i=0; i<obstacles.length; i++){
		obstacles[i].positionX-=velocityX;	//aggiorna la posizione degli ostacoli
		fill(color(obstacles[i].color));
		rect(obstacles[i].positionX, obstacles[i].positionY, obstacles[i].width, obstacles[i].height);//disegna il personaggio
	}
	
	//STAMPA PROIETTILI
	for(var i=0; i<colpi.length; i++){
		colpi[i].positionX+=velocitaProiettili;	//aggiorna la posizione dei proiettili
		fill(color(colpi[i].color));
		ellipse(colpi[i].positionX, colpi[i].positionY, colpi[i].width, colpi[i].height);//disegna il personaggio
	}
}

function controlli(){
	contaSpara++;
	//CONTROLLO COMANDI PREMUTI
	if(mouseIsPressed || keyIsDown(UP_ARROW) ||keyIsDown(32)){
		if(player.onGround==true)
			player.salta();
	}
	if(keyIsDown(RIGHT_ARROW)&& contaSpara>5){
		spara();
		contaSpara=0;
	}
	
	//CONTROLLO DIFFICOLTA' DI GIOCO
	if(obstacleCounter==10 && difficultyLevel[0]==false){
		velocityX+=0.5;
		difficultyLevel[0]=true;
	}
	if(obstacleCounter==30 && difficultyLevel[1]==false){
		velocityX+=0.5;
		difficultyLevel[1]=true;
	}
	
	//AGGIUNTA OSTACOLI
	if(obstacles[0].positionX<-100)
		addObstacle();
	
	//AGGIORNA POSIZIONE Y GIOCATORE (SALTO)
	if(player.positionY>=positionYMin){ 
		player.onGround=true;
		player.positionY=positionYMin}
	else
	{
		player.onGround=false;
		player.positionY-=player.velocityY;
		player.velocityY-=gravity;
	}
	
	//CONTROLLO PROIETTILI	
	if(colpi[0]!= undefined){
		if(colpi[0].positionX>500)
			colpi.splice(0,1);
	}
}

function addObstacle(){
	//gli ostacoli possono essere di due tipi: uno alto e stretto e l'altro basso e largo
	var possibleHeight=[50, 30];
	var possibleWidth=[30, 50];
	
	do{
		var positionX=Math.round(Math.random()*500); //genera la distanza del nuovo ostacolo rispetto a quello vecchio
	}while(positionX<250);
	positionX+=obstacles[obstacles.length-1].positionX;
	
	var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
	var positionY=300-possibleHeight[type]-1; //laposizione y si calcola come quella del giocatore
	var obstacle= new Obstacle(possibleHeight[type], possibleWidth[type],"#00FF00", positionX, positionY); //istanzia un nuovo ostacolo
	
	obstacles.push(obstacle);
	
	if(obstacles.length>6){ //se viene raggiunto il numero massimo di ostacoli
		obstacles.splice(0,1); //elimina il primo ostacolo (obstacles è un array FILO)	
		obstacleCounter++;
		$("#counter").text(obstacleCounter+"---"+velocityX);
	}
}

function spara(){
	colpo= new Proiettile(10, 10, "#F0F0F0", player.positionX+(player.width/2), player.positionY+(player.height/2));
	colpi.push(colpo);
	
}
