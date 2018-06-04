//Copyright (C) 2018  Napolitano Daniele

//inizializzazione storage
storage=window.localStorage;
if(storage.getItem("record")==undefined)
	storage.setItem("record", 0);
larghezzaPagina=$(window).width();



//##################INIZIALIZZAZIONI VARIABLI DI GIOCO#####################
function setup() {

	$("#sopra").hide();
	$("#playAgain").hide();
	$( "*" ).unbind();
	$("#finestra").css("filter", "blur(0px)");

	//INIZIALIZZAZIONE CANVAS E FISICA
	larghezzaCanvas=650;
	lunghezzaCanvas=263;
	createCanvas(larghezzaCanvas, lunghezzaCanvas);		//id="defaultCanvas0"
	$("#defaultCanvas0").attr("id","finestra");	//rinomina l'id di default
	frameRate(30);
	gravity=1.2;
	luna=false;
	velocityX=14;
	difficultyLevel=0;
	contaSprite=0;
	invincibleCounter=0;
    velocitaSprite = 3;
    font = loadFont("css/8BIT.TTF");
	cuore=loadImage("img/player.png");
	bgmusic=document.getElementById("bgmusic");
	bgmusic.volume=1.0;
	shootfx=document.getElementById("shootfx");
	jumpfx=document.getElementById("jumpfx");
	pickupfx=document.getElementById("pickupfx");
	hitfx=document.getElementById("hitfx");
	jumpfx.volume=0.5; jumpfx.playbackRate=1;
	shootfx.volume=0.5; shootfx.playbackRate=1;
	bgmusic.currentTime=0; bgmusic.play();


	//INIZIALIZZAZIONI OGGETTO PERSONAGGIO
	var velocityY=0, height=48, width=64, positionX=30;
	positionYMin=lunghezzaCanvas-height-80;			// = grandezza canvas-altezza-80(per non attaccarsi al fondo)
	player= new Player(true,velocityY, "img/player.png", height, width, "#FF0000", positionX, positionYMin, 3);
	player.sprites=loadImage("img/player.png");
	spriteRun=32;
	oldSpriteRun=0;
	oldSpriteShoot=0;
	oldSpriteShootBug=3;
	contaScrittaPowerup=0;
	scrittaPowerup="";
	contaCollisioni=60;
	oldHealth=40;

	//INIZIALIZZAZIONE NEMICO
	var randEnemyType=Math.round(Math.random());
	enemy=new Enemy(false,"img/player.png",50, 84, "#0000FF", larghezzaCanvas, (lunghezzaCanvas-(lunghezzaCanvas/3)), 2, 0 );
	enemy.sprites=loadImage("img/player.png");
	fluttua=0;
	oldSpriteEnemy=0;

	//INIZIALIZZAZIONE PROIETTILI e POWERUP
	currentPowerup="gun";
	danno=1;
	rateoDiFuoco=15;
	velocitaProiettili=30;
	contaSpara=0;
	isGeneratoPowerup=false;
	larghezzaProiettile=22*2;
	lunghezzaProiettile=9*2;
	spriteProiettile=[29,179];

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
	var possibleSpritesPositionX=[129, 173]
	var possibleSpritesPositionY=[103, 94]
	var possibleHeight=[22, 40];//due possibili altezze(alto e basso)
	var possibleWidth=[70, 38];//due possibili larghezze(stretto e alto)
	var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
	positionYO=lunghezzaCanvas-possibleHeight[type]-80; //la posizione y si calcola come quella del giocatore
	var obstacle= new Obstacle("img/player.png",possibleSpritesPositionX[type],possibleSpritesPositionY[type], possibleHeight[type], possibleWidth[type], 900, positionYO, 0); //istanzia un nuovo ostacolo
	obstacle.sprites=loadImage("img/player.png");
	obstacles.push(obstacle);
	var obstacle= new Obstacle("img/player.png",possibleSpritesPositionX[type],possibleSpritesPositionY[type], possibleHeight[type], possibleWidth[type], larghezzaCanvas+1000, positionYO, 0); //istanzia un nuovo ostacolo
	obstacle.sprites=loadImage("img/player.png");
	obstacles.push(obstacle);

	//INIZIO LOOP GIOCO
	loop();
}

//######## AGGIORNAMENTO IMMAGINE CANVAS (draw) ##############
function draw(){
	//CONTROLLI
	controlli();
	//STAMPA BACKGROUND
	for(var i=0; i<backgrounds.length; i++){
		backgrounds[i].positionX-=velocityX;
		image(backgrounds[i].src, backgrounds[i].positionX, backgrounds[i].positionY);
	}

	//STAMPA GIOCATORE
	if(((contaCollisioni<60 && contaCollisioni%5!=0) || contaCollisioni==60) || (invincibleCounter>0 && invinciblieCounter%5!=0)) { //effetto lampeggia quando viene colpito
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
				oldSpriteRun+=spriteRun;
				if(oldSpriteRun>=64)
					spriteRun=spriteRun*-1;
				if(oldSpriteRun==0)
					spriteRun=spriteRun*-1;
			}
			image(player.sprites,player.positionX,player.positionY,player.width,player.height,oldSpriteRun,0+oldSpriteShoot,player.width/2,player.height/2+oldSpriteShootBug );
		}
		else //se sta saltando
			image(player.sprites,player.positionX,player.positionY-10,player.width,player.height+10,110,oldSpriteShoot,player.width/2,(player.height/2)+7+oldSpriteShootBug );
	}

	//STAMPA PROIETTILI
	for(var i=0; i<colpi.length; i++){
		colpi[i].positionX+=velocitaProiettili;	//aggiorna la posizione dei proiettili
		image(colpi[i].sprites, colpi[i].positionX, colpi[i].positionY, colpi[i].width, colpi[i].height, colpi[i].spritePositionX, colpi[i].spritePositionY, colpi[i].width/2, colpi[i].height/2);
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
		if(obstacles[i].isSpecial==0)
			image(obstacles[i].sprites,obstacles[i].positionX,obstacles[i].positionY,obstacles[i].width,obstacles[i].height,obstacles[i].spritePositionX,obstacles[i].spritePositionY,obstacles[i].width/2,obstacles[i].height/2 );
		else if(obstacles[i].isSpecial==1)
			image(obstacles[i].sprites,obstacles[i].positionX,obstacles[i].positionY,obstacles[i].width,obstacles[i].height,obstacles[i].spritePositionX,obstacles[i].spritePositionY,obstacles[i].width,obstacles[i].height);
		else if(obstacles[i].isSpecial==2)
			image(obstacles[i].sprites,obstacles[i].positionX,obstacles[i].positionY,obstacles[i].width,obstacles[i].height,obstacles[i].spritePositionX,obstacles[i].spritePositionY,obstacles[i].width,obstacles[i].height);
	}

	//STAMPA INTERFACCIA UTENTE
	if((obstacleCounter >= storage.getItem("record")) && (storage.getItem("record")>0))
		fill(209, 74, 66);
	else
		fill(0,0,0);
	textSize(30);
	textFont(font);
	text(obstacleCounter, 10, 30); //contatore
	for(var i=0; i<player.health; i++){ //cuori
		fill(0,0,0);
		image(cuore, -45+oldHealth, 210, 50, 50, 150, 0, 50, 50);
		oldHealth+=40;
	}
	oldHealth=40;
	if(contaScrittaPowerup!=0) {//scritte powerup
		fill(0,0,0);
		text(scrittaPowerup, (larghezzaCanvas/2)-(scrittaPowerup.length*15),50);
		contaScrittaPowerup--;
	}


}

//######## CONTROLLI EFFETTUATI AD OGNI FRAME ##############
function controlli(){

	//CONTROLLO COSSISIONI E SALUTE GIOCATORE
	collisioni();
	if(player.health<=0)
		fine();

	//CONTROLLO CONTATORI FRAME
	contaSpara++;
	if(contaSprite>=velocitaSprite)
		contaSprite=0;
	else
		contaSprite++;

	//CONTROLLO COMANDI CONTROLLER/TASTIERA
    if (keyIsDown(UP_ARROW)){
		if(player.onGround==true){
			jumpfx.play();
			player.salta();
		}
	}
    if (keyIsDown(RIGHT_ARROW)){ 
		if(contaSpara>rateoDiFuoco){
			var colpo= new Proiettile("img/player.png", spriteProiettile[0], spriteProiettile[1], lunghezzaProiettile, larghezzaProiettile, player.positionX+(player.width/2)-10, player.positionY+(player.height/2)-10);
			colpo.sprites=loadImage("img/player.png");
			colpi.push(colpo);
			contaSpara=0;
			shootfx.play();
		}
	}

    //PAUSA
    /*
	if(keyIsDown(27)){
		noLoop();
		scrittaPowerup="PAUSE";
		$("*").keypress(function(){loop()});
    }*/

    //CONTROLLO COMANDI TOUCHSCREEN
 

	//CONTROLLO DIFFICOLTA' DI GIOCO
	if(difficultyLevel%2==0 && (obstacleCounter+1)%10==0){ 	//la velocita aumenta di 0.5 ogni 10 ostacoli saltati
		velocityX+=0.5;
		difficultyLevel++;
	}
	if(difficultyLevel%2!=0 && (obstacleCounter+1)%7==0 && (obstacleCounter+1)%10!=0){ 	//spawna un nemico 5 salti di ostacoli dopo velocità aumentata
		enemy.alive();
		difficultyLevel++;
	}

	//AGGIUNTA BACKGROUND
	if(backgrounds[0].positionX<=-backgrounds[0].width)
		addBackground();

	//AGGIUNTA OSTACOLI
	if(obstacles[0].positionX<-100)
		addObstacle();

	//"RIMOZIONE" NEMICO
	if(enemy.isAlive==true && enemy.positionX<-200)
		enemy.die(); //sono un assassino :(

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
			colpi.splice(0,1); 			//se i colpi finiscono fuori dal canvas, vengono tolti (42)

	}

	//CONTROLLO NEMICO
	if(enemy.isAlive==true){
		//if(enemy.type==0){
			fluttua+=0.03;
			enemy.positionX-=4;
			//enemy.positionY=((Math.sin(fluttua))*30)+100; 	//se il nemico è vivo viene spostato verso sinistra e fluttua
			enemy.positionY= map(noise(fluttua),0,1,0,lunghezzaCanvas-130);
		//}
		/*else{
			//fluttua+=0.5;
			enemy.positionX-=8;
			//enemy.positionY=((Math.sin(fluttua))*30)+100; 	//se il nemico è vivo viene spostato verso sinistra e fluttua
			enemy.positionY=(lunghezzaCanvas/2)-40;	
		}*/
	}
}

//######## CONTROLLO COLLISIONI #################
function collisioni(){
	//OSTACOLI - COLPI
	for(var i=0; i<obstacles.length; i++){
		for(var j=0; j<colpi.length; j++){
			if(obstacles[i].isColliding(colpi[j].positionX, colpi[j].positionY, colpi[j].width+10, colpi[j].height)==true){
				colpi.splice(j,1);
				if(obstacles[i].isSpecial==1)
					obstacles[i].becomePowerup();
			}
		}
	}

	//NEMICO - COLPI
	if(enemy.isAlive==true){
		for(var i=0; i<colpi.length; i++){
			if(enemy.isColliding(colpi[i].positionX, colpi[i].positionY, colpi[i].width, colpi[i].height)==true){
				enemy.health-=danno;
				hitfx.play();
				colpi.splice(i,1);
				if(enemy.health<=0)
					enemy.die();
			}
		}
	}

	//PERSONAGGIO - POWERUP
	if(player.isColliding(obstacles[0].positionX, obstacles[0].positionY, obstacles[0].width, obstacles[0].height)==true && obstacles[0].isSpecial==2){
			obstacles.splice(0,1);//elimina il powerup
			powerup();
			pickupfx.play();
		}

	//queste collisioni non si controllano se il giocatore è appena stato colpito
	if(contaCollisioni==60 || invincibleCounter>0){
		//PERSONAGGIO - OSTACOLI
		if(player.isColliding(obstacles[0].positionX, obstacles[0].positionY, obstacles[0].width, obstacles[0].height)==true && obstacles[0].isSpecial!=2){
			hitfx.play();
			player.health--;
			contaCollisioni--;
		}

		//PERSONAGGIO - NEMICO
		if(player.isColliding(enemy.positionX, enemy.positionY, enemy.width, enemy.height)==true){
			player.health--;
			hitfx.play();
			contaCollisioni--;
		}

		if(invincibleCounter>0)
			invincibleCounter--;
	}

	else if (contaCollisioni<60){
		contaCollisioni--;
		if(contaCollisioni<=0)
			contaCollisioni=60;
	}
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
	var possibleSpritesPositionX=[129, 173, 85];
	var possibleSpritesPositionY=[103, 94, 85];
	var possibleHeight=[22, 40, 33];
	var possibleWidth=[70, 38, 36];

	do{
		var positionX=Math.round(Math.random()*larghezzaCanvas)+(velocityX*10); //genera la distanza del nuovo ostacolo rispetto a quello vecchio
	}while(positionX<300+(velocityX*5));

	positionX+=obstacles[obstacles.length-1].positionX;
	var type=Math.round(Math.random());	//sceglie che tipo di ostacolo generare
	var isSpecial=Math.round(Math.random()*100);
	if(isSpecial<=95){ //5% probabilita di essere speciale
		isSpecial=0; //non e' speciale
	}
	else{
		isSpecial=1;//è speciale
		type=2;
	}
	var positionY=lunghezzaCanvas-possibleHeight[type]-80; //laposizione y si calcola come quella del giocatore
	var obstacle= new Obstacle("img/player.png",possibleSpritesPositionX[type],possibleSpritesPositionY[type], possibleHeight[type], possibleWidth[type], positionX, positionY, isSpecial); //istanzia un nuovo ostacolo
	obstacle.sprites=loadImage("img/player.png");
	obstacles.push(obstacle);

	if(obstacles.length>6){ //se viene raggiunto il numero massimo di ostacoli
		obstacles.splice(0,1); //elimina il primo ostacolo (obstacles è un array FILO)
		obstacleCounter++;
		var adesso=0;
	}
}

//ASSEGNAZIONE DI UN POWERUP RANDOM (DOPO CHE E' STATO PRESO)
function powerup(){
	do{
		var randomPowerup=Math.round(Math.random()*9);
		var abbassaProbLuna=Math.round(Math.random());
		//MITRA
		if(randomPowerup==0 && currentPowerup!="minigun"){
			currentPowerup="minigun";
			shootfx.playbackRate=3;
			velocitaProiettili=50;
			rateoDiFuoco=5;
			danno=0.7;
			larghezzaProiettile=7*2;
			lunghezzaProiettile=4*2;
			spriteProiettile=[17,157];
			isGeneratoPowerup=true;
			contaScrittaPowerup=60;
			scrittaPowerup="MINIGUN";
			luna=false;
			gravity=1.2;
		}
		//CANNONE
		else if(randomPowerup==1 && currentPowerup!="cannon"){
			currentPowerup="cannon";
			shootfx.playbackRate=0.6;
			velocitaProiettili=25;
			rateoDiFuoco=30;
			danno=2;
			larghezzaProiettile=32*2;
			lunghezzaProiettile=20*2;
			spriteProiettile=[35,226];
			isGeneratoPowerup=true;
			contaScrittaPowerup=60;
			scrittaPowerup="CANNON";
			luna=false;
			gravity=1.2;

		}
		//PISTOLA
		else if(randomPowerup==2 && currentPowerup!="gun"){
			currentPowerup="gun";
			shootfx.playbackRate=1;
			velocitaProiettili=30;
			rateoDiFuoco=15;
			danno=1;
			larghezzaProiettile=22*2;
			lunghezzaProiettile=9*2;
			spriteProiettile=[29,179];
			isGeneratoPowerup=true;
			contaScrittaPowerup=60;
			scrittaPowerup="GUN";
			luna=false;
			gravity=1.2;

		}
		//RALLENTATORE
		else if(randomPowerup==3 && velocityX>14){
			velocityX--;
			isGeneratoPowerup=true;
			scrittaPowerup="SLOWER";
			luna=false;
			gravity=1.2;
		}
		//VITA
		else if(randomPowerup==4 && player.health<5){
			player.health++;
			isGeneratoPowerup=true;
			scrittaPowerup="HEALTH";
			luna=false;
			gravity=1.2;
		}
		//GRAVITA
		else if(randomPowerup==5 && luna==false && abbassaProbLuna==1){
			gravity=0.9;
			jumpfx.playbackRate=0.6;
			isGeneratoPowerup=true;
			scrittaPowerup="MOON GRAVITY";
			luna=true;
		}
		else if(randomPowerup==5 && luna==true){
			gravity=1.2;
			jumpfx.playbackRate=1;
			isGeneratoPowerup=true;
			scrittaPowerup="NORMAL GRAVITY";
			luna=false;
		}
		//NIENTE
		else if(randomPowerup==6){
			scrittaPowerup="NOTHING";
			gravity=1.2;
		}
		//invincibilita
		else if(randomPowerup==7){
			scrittaPowerup="INVINCIBLE FOR 10s";
			invincibleCounter=10*30;
			gravity=1.2;
		}

	}while(isGeneratoPowerup==false);

	contaScrittaPowerup=60;
	isGeneratoPowerup=false;
}

//FINE GIOCO
function fine(){
	noLoop();
	velocityX=0; gravity=0;
	bgmusic.pause();
	if(obstacleCounter>=storage.getItem("record")) //aggiornamento localStorage
				storage.setItem("record",obstacleCounter);
	$("#sopra").show();
	$("#playAgain").show();
	$("#finestra").css("filter", "blur(7px)");
	document.getElementById("att").innerHTML=obstacleCounter;
	document.getElementById("rec").innerHTML=storage.getItem("record");
	setTimeout(function(){$( "*" ).keypress(function() { setup()});}, 500);
}


function touchStarted() {
    for (var i = 0; i < touches.length; i++) {
        if (touches[i].x <= (larghezzaPagina / 2)){
            if (player.onGround == true) {
                jumpfx.play();
                player.salta();
            }
        }
        if (touches[i].x > (larghezzaPagina / 2)) {
            if (contaSpara > rateoDiFuoco) {
                var colpo = new Proiettile("img/player.png", spriteProiettile[0], spriteProiettile[1], lunghezzaProiettile, larghezzaProiettile, player.positionX + (player.width / 2) - 10, player.positionY + (player.height / 2) - 10);
                colpo.sprites = loadImage("img/player.png");
                colpi.push(colpo);
                contaSpara = 0;
                shootfx.play();
            }
        }
    }

}