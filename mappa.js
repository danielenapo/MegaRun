 $(document).ready(function(){
	var canvas = document.getElementById('finestra');
	context = canvas.getContext('2d');
	stampaMappa(); //stampa la mappa di gioco sulla pagina

	function stampaMappa()
	{
		base_image = new Image(); //creazione oggetto immagine
		base_image.src = "img/europa.png"; //assegnazione immagine
		context.drawImage(base_image, 0, 0); //stampa dell'immagine
	}
}); 