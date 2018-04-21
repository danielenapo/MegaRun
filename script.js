//##################INIZIALIZZAZIONI#####################
function setup(){
	//INIZIALIZZAZIONI VARIABILI
	currentPowerup="pistola";
	dimensioneProiettile=10;
	gravity=1;
	velocityX=10;
	obstacleCounter=0;
	difficultyLevel=0;
	danno=1;
	rateoDiFuoco=15;
	velocitaProiettili=30;
	contaSpara=0;
	fluttua=0;
	larghezzaCanvas=650;
	lunghezzaCanvas=263;
	enemy=new Enemy(false,40, 40, "#0000FF", larghezzaCanvas, (lunghezzaCanvas-(lunghezzaCanvas/3)), 2 );

	//INIZIALIZZAZIONE BACKGROUND
	backgrounds=[];
	for(var i=0; i<4; i++){
		var bg=new Background(263, 480, "img/background.png", i*480, 0);
		bg.src=loadImage("img/background.png");
		backgrounds.push(bg);
	}

	//INIZIALIZZAZIONE CANVAS
	createCanvas(larghezzaCanvas, lunghezzaCanvas);		//id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");	//rinomina l'id di default
	frameRate(35);

	//INIZIALIZZAZIONI OGGETTO PERSONAGGIO
	var velocityY=0, height=55, width=55, positionX=30;
	positionYMin=lunghezzaCanvas-height-80;			// = grandezza canvas-altezza-80(per non attaccarsi al fondo)
	player= new Player(true,velocityY, "img/player.png", height, width, "#FF0000", positionX, positionYMin, 100);
	player.sprites=loadImage("img/player.png");

	//INIZIALIZZAZIONE ARRAY DI OSTACOLI
	obstacles=[];
	colpi=[];
	var possibleHeight=[50, 30];//due possibili altezze(alto e basso)
	var possibleWidth=[30, 50];//due possibili larghezze(stretto e alto)
	var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
	var positionYO=lunghezzaCanvas-possibleHeight[type]-80; //la posizione y si calcola come quella del giocatore
	var obstacle= new Obstacle(possibleHeight[type], possibleWidth[type], "#00FFF0", 900, positionYO, 0); //istanzia un nuovo ostacolo
	obstacles.push(obstacle);
	var obstacle= new Obstacle(possibleHeight[type], possibleWidth[type], "#00FFF0", larghezzaCanvas+1000, positionYO, 0); //istanzia un nuovo ostacolo
	obstacles.push(obstacle);
}

function draw(){

//######## AGGIORNAMENTO IMMAGINE CANVAS (draw) ##############

	//STAMPA BACKGROUND
	for(var i=0; i<backgrounds.length; i++){
		backgrounds[i].positionX-=velocityX;
		image(backgrounds[i].src, backgrounds[i].positionX, backgrounds[i].positionY);
	}


	//STAMPA GIOCATORE
	noStroke();
	//fill(color(player.color));	// riempie il quadrato del colore selezionato
	//rect(player.positionX, player.positionY, player.width, player.height);	//disegna il personaggio
	image(player.sprites,player.positionX,player.positionY,player.width,player.height,0,0,100, 100 );
	//STAMPA OSTACOLI
	for(var i=0; i<obstacles.length; i++){
		obstacles[i].positionX-=velocityX;	//aggiorna la posizione degli ostacoli
		fill(color(obstacles[i].color));
		rect(obstacles[i].positionX, obstacles[i].positionY, obstacles[i].width, obstacles[i].height);//disegna il personaggio
	}


	//STAMPA NEMICO
	if(enemy.isAlive==true){
		fill(color(enemy.color));
		rect(enemy.positionX, enemy.positionY, enemy.width, enemy.height);
	}


	//STAMPA PROIETTILI
	for(var i=0; i<colpi.length; i++){
		colpi[i].positionX+=velocitaProiettili;	//aggiorna la posizione dei proiettili
		fill(color(colpi[i].color));
		ellipse(colpi[i].positionX, colpi[i].positionY, colpi[i].width, colpi[i].height);//disegna il personaggio
	}

	//STAMPA UI
	fill(0);
	textSize(32);
	text(obstacleCounter, 10, 250);
	text(currentPowerup, 500, 250);

	//CONTROLLI
	controlli();

}

function controlli(){
	contaSpara++;


	
	//CONTROLLO COMANDI PREMUTI
	if(keyIsDown(UP_ARROW)){
		if(player.onGround==true)
			player.salta();
	}
	if(keyIsDown(RIGHT_ARROW)&& contaSpara>rateoDiFuoco){
		var colpo= new Proiettile(dimensioneProiettile, dimensioneProiettile, "#000000", player.positionX+(player.width/2), player.positionY+(player.height/2));
		colpi.push(colpo);
		contaSpara=0;
	}

	//CONTROLLO DIFFICOLTA' DI GIOCO
	//la velocita aumenta di 0.5 ogni 10 ostacoli saltati
	if(difficultyLevel%2==0 && (obstacleCounter+1)%10==0){
		velocityX+=0.5;
		difficultyLevel++;
	}

	//spawna un nemico 5 salti di ostacoli dopo velocità aumentata 
	if(difficultyLevel%2!=0 && (obstacleCounter+1)%7==0 && (obstacleCounter+1)%10!=0){
		enemy.alive();
		difficultyLevel++;
	}

	//AGGIUNTA BACKGROUND
	if(backgrounds[0].positionX<=-backgrounds[0].width)
		addBackground();


	//AGGIUNTA OSTACOLI
	if(obstacles[0].positionX<-100)
		addObstacle();

	//AGGIORNA POSIZIONE Y GIOCATORE (SALTO)
	if(player.positionY>=positionYMin){
		player.onGround=true;
		player.positionY=positionYMin
	}
	else
	{
		player.onGround=false;
		player.positionY-=player.velocityY;
		player.velocityY-=gravity;
	}

	//CONTROLLO PROIETTILI
	if(colpi[0]!= undefined){
		if(colpi[0].positionX>larghezzaCanvas)
			colpi.splice(0,1);
			//se i colpi finiscono fuori dal canvas, vengono tolti
	}

	//CONTROLLO NEMICO
	if(enemy.isAlive==true){
		fluttua+=0.1;
		enemy.positionX-=3;
		enemy.positionY=((Math.sin(fluttua))*20)+100;
	//se il nemico è vivo viene spostato verso sinistra e fluttua
	}

	collisioni();

}

//CONTROLLO COLLISIONI
function collisioni(){

	//collisioni personaggio-ostacoli (e personaggio-powerups)
	if(player.isColliding(obstacles[0].positionX, obstacles[0].positionY, obstacles[0].width, obstacles[0].height)==true){
		if(obstacles[0].isSpecial==2){
			powerup();
			obstacles.splice(i,1);//elimina il powerup
		}
		else if(obstacles[0].isSpecial!=2)
			fine();
	}

	//collisione ostacoli-colpi
	for(var i=0; i<obstacles.length; i++){
		for(var j=0; j<colpi.length; j++){
			if(obstacles[i].isColliding(colpi[j].positionX, colpi[j].positionY, colpi[j].width, colpi[j].height)==true){
				colpi.splice(j,1);
				if(obstacles[i].isSpecial==1)
					obstacles[i].becomePowerup();
			}
		}		
	}

	//collisioni nemico-colpi
	if(enemy.isAlive==true){
		for(var i=0; i<colpi.length; i++){
			if(enemy.isColliding(colpi[i].positionX, colpi[i].positionY, colpi[i].width, colpi[i].height)==true){
				enemy.health-=danno;
				colpi.splice(i,1);
				if(enemy.health<=0)
					enemy.die();
			}
		}
	}


	//collisioni personaggio-nemico
	if(player.isColliding(enemy.positionX, enemy.positionY, enemy.width, enemy.height)==true)
		fine();
}

//FUNZIONI CHE AGGIUNGONO DINAMICAMENTE OSTACOLI E IMMAGINE DI SFONDO
function addBackground(){
		var bg=new Background(263, 480, "img/background.png", backgrounds[backgrounds.length-1].positionX+480, 0);
		bg.src=loadImage("img/background.png");
		backgrounds.push(bg);

		if(backgrounds.length>=4)
			backgrounds.splice(0,1);
}

function addObstacle(){
	//gli ostacoli possono essere di due tipi: uno alto e stretto e l'altro basso e largo
	var possibleHeight=[50, 30];
	var possibleWidth=[30, 50];

	do{
		var positionX=Math.round(Math.random()*larghezzaCanvas); //genera la distanza del nuovo ostacolo rispetto a quello vecchio
	}while(positionX<250);
	positionX+=obstacles[obstacles.length-1].positionX;

	var isSpecial=Math.round(Math.random()*100);
	if(isSpecial<=90){ //10% probabilita di essere speciale
		isSpecial=0; //non e' speciale
		var color="#00FFF0";
	}
	else{
		isSpecial=1;//è speciale
		var color="#004440";
	}
	var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
	var positionY=lunghezzaCanvas-possibleHeight[type]-80; //laposizione y si calcola come quella del giocatore
	var obstacle= new Obstacle(possibleHeight[type], possibleWidth[type],color, positionX, positionY, isSpecial); //istanzia un nuovo ostacolo

	obstacles.push(obstacle);

	if(obstacles.length>6){ //se viene raggiunto il numero massimo di ostacoli
		obstacles.splice(0,1); //elimina il primo ostacolo (obstacles è un array FILO)
		obstacleCounter++;
	}
}

//ASSEGNAZIONE DI UN POWERUP RANDOM
function powerup(){
	var randomPowerup=Math.round(Math.random()*3);
	//MITRA
	if(randomPowerup==0 && currentPowerup!="mitra"){
		currentPowerup="mitra";
		velocitaProiettili=50;
		rateoDiFuoco=4;
		danno=0.5;
		dimensioneProiettile=7;
	}
	//CANNONE 
	else if(randomPowerup==1 && currentPowerup!="cannone"){
		currentPowerup="cannone";
		velocitaProiettili=25;
		rateoDiFuoco=30;
		danno=2;
		dimensioneProiettile=25;

	}
	//PISTOLA
	else if(randomPowerup==2 && currentPowerup!="pistola"){
		currentPowerup="pistola";
		velocitaProiettili=30;
		rateoDiFuoco=15;
		danno=1;
		dimensioneProiettile=10;

	}
	//RALLENTATORE
	else{
		alert("rallenta velocita");
		velocityX--;
	}
}

//FINE GIOCO
function fine(){
	noLoop();
	$("#fine").html('<div id="sopra" ><div id="attuale"><img src="" ><div id="tot"> </div></div><div id="record"><img src="img/trophy.png"><div id="myRecord"> </div></div></div><div id="playAgain" onclick="replay()"><img id="refresh" src="img/refresh.png"><h2>Gioca ancora</h2></div><p id="counter">0</p>")');
	$("#myRecord").text(obstacleCounter);
}