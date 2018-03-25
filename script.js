function setup(){
	createCanvas(500, 300);			//crea il canvas con id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");//rinomina l'id di default del canvas
	background(72);					//imposta il colore di background del canvas
	frameRate(30);					//velocità di gioco (numero di ripetizioni di ciclo al secondo, frame stampati per ogi secondo)
	gravity=0.5;

	//INIZIALIZZAZIONI OGGETTO PERSONAGGIO
	velocityX=10;
	positionYMin=300-height-1;			// = grandezza canvas-altezza-1(per non attaccarsi al fondo)
	var velocityY=0, height=55, width=55, positionX=100;
	player= new Player(false,velocityY, height, width, "#FF0000", positionX, positionYMin);
	//INIZIALIZZAZIONE ARRAY DI OSTACOLI
	obstacles=[];
	var possibleHeight=[100, 55];//due possibili altezze(alto e basso)
	var possibleWidth=[55, 100];//due possibili larghezze(stretto e alto)
	do{
		var positionX=Math.round(Math.random()*700); //genera la distanza del nuovo ostacolo rispetto a quello vecchio
	}while(positionX<500);
	var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
	var positionY=300-possibleHeight[type]-1; //laposizione y si calcola come quella del giocatore
	var obstacle= new Obstacle(velocityX, possibleHeight[type], possibleWidth[type], "#00FF00", positionX, positionY); //istanzia un nuovo ostacolo
	obstacles.push(obstacle);
}

function draw(){
	//CONTROLLI

	addObstacle();//Aggiunge un nuovo ostacolo e rimuove i vecchi
	updSalto(); //aggiorna la posizione y del giocatore e la booleana onGround
	//AGGIORNAMENTO IMMAGINE CANVAS (draw)
	background(72); //cancella tutto
	fill(color(player.color)); // riempie il quadrato del colore selezionato
	rect(player.positionX, player.positionY, player.height, player.width);//disegna il personaggio
	for(var i=0; i<obstacles.length; i++){
		obstacles[i]=updObstacle(obstacles[i]);//aggiorna la posizione degli ostacoli
		fill(color(obstacles[i].color));
		rect(obstacles[i].positionX, obstacles[i].positionY, obstacles[i].height, obstacles[i].width);//disegna il personaggio
	}
	//controlloComandi();
}

//controlla che comandi sono remuti ad ogni frame
function controlloComandi(){
	if((mouseIsPressed || keyIsDown(UP_ARROW) ||keyIsDown(32))&& player.onGround==true)
		player.salta();//se viene premuto uno dei comandi per saltare, il giocatore salta
}

function updSalto(){
	if(player.positionY>=positionYMin){ //se la posizione Y è minima, è per terra
		player.onGround=true;
		player.positionY=positionYMin}
	else
	{
		player.onGround=false;
		player.positionY-=player.velocityY;
		player.velocityY-=gravity;
	}
}

function updObstacle(modifica){
	modifica.positionX-=modifica.velocityX;
	return modifica;
}
//funzione che genera un nuovo ostacolo
function addObstacle(){
	if(obstacles.length<5){
		//gli ostacoli possono essere di due tipi: uno alto e stretto e l'altro basso e largo
		var possibleHeight=[100, 55];//due possibili altezze(alto e basso)
		var possibleWidth=[55, 100];//due possibili larghezze(stretto e alto)
		do{
			var positionX=Math.round(Math.random()*500); //genera la distanza del nuovo ostacolo rispetto a quello vecchio
		}while(positionX<250);
		positionX+=obstacles[obstacles.length-1].positionX;
		var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
		var positionY=300-possibleHeight[type]-1; //laposizione y si calcola come quella del giocatore
		var obstacle= new Obstacle(velocityX, possibleHeight[type], possibleWidth[type],"#00FF00", positionX, positionY); //istanzia un nuovo ostacolo
		obstacles.push(obstacle);
		if(obstacles.length==5) //se viene raggiunto il numero massimo di ostacoli
			obstacles.splice(0,1); //elimina il primo ostacolo (obstacles è un array FILO)

	}
}
