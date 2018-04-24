//##################INIZIALIZZAZIONI#####################
function setup(){
		$("#all").hide();

	//INIZIALIZZAZIONE CANVAS E FISICA
	larghezzaCanvas=650;
	lunghezzaCanvas=263;
	createCanvas(larghezzaCanvas, lunghezzaCanvas);		//id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");	//rinomina l'id di default
	frameRate(30);
	gravity=1;
	velocityX=10;
	difficultyLevel=0;
	contaSprite=0;
	velocitaSprite=3;

	//INIZIALIZZAZIONI OGGETTO PERSONAGGIO
	var velocityY=0, height=48, width=64, positionX=30;
	positionYMin=lunghezzaCanvas-height-80;			// = grandezza canvas-altezza-80(per non attaccarsi al fondo)
	player= new Player(true,velocityY, "img/player.png", height, width, "#FF0000", positionX, positionYMin, 100);
	player.sprites=loadImage("img/player.png");
	spriteRun=32;
	oldSpriteRun=0;
	oldSpriteShoot=0;
	oldSpriteShootBug=3;
	contaScrittaPowerup=0;
	scrittaPowerup="";

	//INIZIALIZZAZIONE NEMICO
	enemy=new Enemy(false,"img/player.png",50, 84, "#0000FF", larghezzaCanvas, (lunghezzaCanvas-(lunghezzaCanvas/3)), 2 );
	enemy.sprites=loadImage("img/player.png");
	fluttua=0;
	oldSpriteEnemy=0;

	//INIZIALIZZAZIONE PROIETTILI e POWERUP
	currentPowerup="pistola";
	dimensioneProiettile=10;
	danno=1;
	rateoDiFuoco=15;
	velocitaProiettili=30;
	contaSpara=0;
	isGeneratoPowerup=false;

	//INIZIALIZZAZIONE BACKGROUND
	backgrounds=[];
	for(var i=0; i<4; i++){
		var bg=new Background(263, 480, "img/background.png", i*480, 0);
		bg.src=loadImage("img/background.png");
		backgrounds.push(bg);
	}

	//INIZIALIZZAZIONE ARRAY DI OSTACOLI
	obstacleCounter=0;
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

	loop();
}





//######## AGGIORNAMENTO IMMAGINE CANVAS (draw) ##############
function draw(){

	//STAMPA BACKGROUND
	for(var i=0; i<backgrounds.length; i++){
		backgrounds[i].positionX-=velocityX;
		image(backgrounds[i].src, backgrounds[i].positionX, backgrounds[i].positionY);
	}

	noStroke();

	//STAMPA GIOCATOREgt
	if(keyIsDown(RIGHT_ARROW)){ //se sta sparando
		oldSpriteShootBug=0;
		if(oldSpriteShoot<=40)
			oldSpriteShoot=40;
	}
	else if(!keyIsDown(RIGHT_ARROW)){
		oldSpriteShoot=3;
		oldSpriteShootBug=0;
	}

	if(player.onGround==true){ //se sta correndo
		//controlli per non fa andare le sprite troppo veloce e per selezionarle
		if (contaSprite==0){
			oldSpriteRun=oldSpriteRun+spriteRun;
			if(oldSpriteRun>=120 || oldSpriteRun<=32)
				spriteRun=-1*spriteRun;
		}
		image(player.sprites,player.positionX,player.positionY,player.width,player.height,oldSpriteRun,0+oldSpriteShoot,player.width/2,player.height/2+oldSpriteShootBug );
	}

	else //se sta saltando
		image(player.sprites,player.positionX,player.positionY-10,player.width,player.height+10,110,oldSpriteShoot,player.width/2,(player.height/2)+7+oldSpriteShootBug );

	//STAMPA PROIETTILI
	for(var i=0; i<colpi.length; i++){
		colpi[i].positionX+=velocitaProiettili;	//aggiorna la posizione dei proiettili
		fill(color(colpi[i].color));
		ellipse(colpi[i].positionX, colpi[i].positionY, colpi[i].width, colpi[i].height);//disegna il personaggio
	}

	//STAMPA NEMICO
	if(enemy.isAlive==true){
		if(contaSprite==0)
			oldSpriteEnemy=32;
		else
			oldSpriteEnemy=0;
		image(enemy.sprites,enemy.positionX,enemy.positionY,enemy.width,enemy.height,oldSpriteEnemy,80,(enemy.width-20)/2,(enemy.height-20)/2 );
	}

	//STAMPA OSTACOLI
	for(var i=0; i<obstacles.length; i++){
		obstacles[i].positionX-=velocityX;	//aggiorna la posizione degli ostacoli
		fill(color(obstacles[i].color));
		rect(obstacles[i].positionX, obstacles[i].positionY, obstacles[i].width, obstacles[i].height);//disegna il personaggio
	}

	//STAMPA INTERFACCIA UTENTE
	fill(0);
	textSize(32);
	text(obstacleCounter, 10, 250);
	text(currentPowerup, 500, 250);
	if(contaScrittaPowerup!=0){
		text(scrittaPowerup, (larghezzaCanvas/2)-(scrittaPowerup.length*12),50);
		contaScrittaPowerup--;
	}


	//CONTROLLI
	controlli();
}





//######## CONTROLLI EFFETTUATI AD OGNI FRAME ##############
function controlli(){
	//CONTROLLO CONTATORI FRAME
	contaSpara++;
	if(contaSprite>=velocitaSprite)
		contaSprite=0;
	else
		contaSprite++;

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


//AGGIUNGE E RIMUOVE OSTACOLI DOPO CHE FINISCONO SOTTO LO 0
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



//ASSEGNAZIONE DI UN POWERUP RANDOM (DOPO CHE E' STATO PRESO)
function powerup(){

	do{
		var randomPowerup=Math.round(Math.random()*3);
		//MITRA
		if(randomPowerup==0 && currentPowerup!="mitra"){
			currentPowerup="mitra";
			velocitaProiettili=50;
			rateoDiFuoco=5;
			danno=0.7;
			dimensioneProiettile=7;
			isGeneratoPowerup=true;
			contaScrittaPowerup=60;
			scrittaPowerup="MITRAGLIATORE";
		}
		//CANNONE
		else if(randomPowerup==1 && currentPowerup!="cannone"){
			currentPowerup="cannone";
			velocitaProiettili=25;
			rateoDiFuoco=30;
			danno=2;
			dimensioneProiettile=25;
			isGeneratoPowerup=true;
			contaScrittaPowerup=60;
			scrittaPowerup="CANNONE";

		}
		//PISTOLA
		else if(randomPowerup==2 && currentPowerup!="pistola"){
			currentPowerup="pistola";
			velocitaProiettili=30;
			rateoDiFuoco=15;
			danno=1;
			dimensioneProiettile=10;
			isGeneratoPowerup=true;
			contaScrittaPowerup=60;
			scrittaPowerup="PISTOLA";

		}
		//RALLENTATORE
		else if(randomPowerup==3 && velocityX>9){
			velocityX--;
			isGeneratoPowerup=true;
			contaScrittaPowerup=60;
			scrittaPowerup="VELOCITA' RALLENTATA";
		}
	}while(isGeneratoPowerup==false);

	isGeneratoPowerup=false;
}




//FINE GIOCO
function fine(){
	noLoop();
	$("#all").show();
}
