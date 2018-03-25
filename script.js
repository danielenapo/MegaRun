function setup(){
	createCanvas(500, 300);			//crea il canvas con id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");//rinomina l'id di default del canvas
	background(72);					//imposta il colore di background del canvas
	frameRate(30);					//velocità di gioco (numero di ripetizioni di ciclo al secondo, frame stampati per ogi secondo)
	gravity=0.5;

	//INIZIALIZZAZIONI OGGETTO PERSONAGGIO
	velocityX=3;
	positionYMin=300-height-1;			// = grandezza canvas-altezza-1(per non attaccarsi al fondo)
	var velocityY=0, height=55, width=55, positionX=100;
	player= new Player(false, velocityX,velocityY, height, width, "#FF0000", positionX, positionYMin);
	//INIZIALIZZAZIONE ARRAY DI OSTACOLI
	obstacles=[];
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

//controlla che comandi sono remuti ad ogni frame
function controlloComandi(){
	if((mouseIsPressed || keyIsDown(UP_ARROW) ||keyIsDown(32))&& player.onGround==true)
		player.salta();//se viene premuto uno dei comandi per saltare, il giocatore salta
}

//funzione che genera un nuovo ostacolo
function addObstacle(){
	if(obstacles.length<4){ //se ci sono meno di 4 ostacoli ne genera uno nuovo e distrugge il primo
		//gli ostacoli possono essere di due tipi: uno alto e stretto e l'altro basso e largo
		var possibleHeight=[100, 55];//due possibili altezze(alto e basso)
		var possibleWidth=[55, 100];//due possibili larghezze(stretto e alto)
		do{
			var positionX=Math.floor(Math.random()*500); //genera la distanza del nuovo ostacolo rispetto a quello vecchio
			var type=Math.floor(Math.random());	//sceglie che tipo di ostacolo generare
			var positionY=300-possibleHeight[type]-1; //laposizione y si calcola come quella del giocatore
			var Obstacle obstacle= new Obstacle(velocityX, possibleHeight[type], possibleWidth[type], positionX, positionY); //istanzia un nuovo ostacolo
			obstacles.push(obstacle);
			if(obstacle.length==4) //se viene raggiunto il numero massimo di ostacoli
				obstacles.splice(0,1); //elimina il primo ostacolo (è un array FILO)
		}
	}
}
