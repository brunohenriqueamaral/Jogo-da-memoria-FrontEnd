var movimentos = 0;
var estrelas ="";
 
 function ScoreBoardGameControl (){ /*pontos*/
	var score = 0;
	var POINT_GAME = 10;
	var TEXT_SCORE = "Score : "

	var TOTAL_CORRECT = 10;
	var corrects = 0;

	this.updateScore =  function (){    /*atualiza pontuação*/
		var scoreDiv = document.getElementById("score");
		scoreDiv.innerHTML =  TEXT_SCORE + score;
	}

	this.incrementScore =  function (){ 
		corrects++;
		score+= POINT_GAME;
		if (corrects ==  TOTAL_CORRECT){
			swal({
				title: "Voce ganhou!",
				text: "O total de movimentos foi " + movimentos + " e " + estrelas + " estrelas e " + counter + " segundos. Jogar novamente?",
				icon: "success",
				buttons: true,
			}).then((reiniciar) => {
				if (reiniciar) {
					restartGame();
				} else {
				  swal("Pausou!");
				}
			});
		}
	}

	this.decrementScore =  function (){
		score-= POINT_GAME;
	}
}

function setEstrelas() {
	if (movimentos >= 0 && movimentos <= 20) {
		estrelas = "✮✮✮";
	} else if (movimentos > 20 && movimentos < 40 ) {
		estrelas = "✮✮✰";
	} else if (movimentos >= 40 && movimentos < 60 ) {
		estrelas = "✮✰✰";
	} else if (movimentos >= 60) {
		estrelas = "✰✰✰";
	}
}


function Card(picture){ /*imagen cartas*/
	var FOLDER_IMAGES = 'resources/'
	var IMAGE_QUESTION  = 'fundo.PNG'
	this.picture = picture;
	this.visible = false;
	this.block = false;

	this.equals =  function (cardGame){
		if (this.picture.valueOf() == cardGame.picture.valueOf()){
			return true;
		}
		return false;
	}
	this.getPathCardImage =  function(){
		return FOLDER_IMAGES+picture;
	}
	this.getQuestionImage =  function(){
		return FOLDER_IMAGES+IMAGE_QUESTION;
	}
}

function ControllerLogicGame(){ /*logica do jogo*/
	var firstSelected;
	var secondSelected;
	var block = false;
	var TIME_SLEEP_BETWEEN_INTERVAL = 1000;
	var eventController = this;

	this.addEventListener =  function (eventName, callback){
		eventController[eventName] = callback;
	};

	this.doLogicGame =  function (card,callback){/*cartas*/		
			if (!card.block && !block) {
			if (firstSelected == null){
				firstSelected = card;
				card.visible = true;
			}else if (secondSelected == null && firstSelected != card){
				secondSelected = card;
				card.visible = true;
			}	

			if (firstSelected != null && secondSelected != null){   /* temporizador */
				setEstrelas();
				movimentos++;
				
				block = true;
				var timer = setInterval(function(){
					if (secondSelected.equals(firstSelected)){
						firstSelected.block = true;
						secondSelected.block = true;
						eventController["correct"](); 
					}else{
						firstSelected.visible  = false;
						secondSelected.visible  = false;
						eventController["wrong"]();
					}        				  		
					firstSelected = null;
					secondSelected = null;
					clearInterval(timer);
					block = false;
					eventController["show"]();
				},TIME_SLEEP_BETWEEN_INTERVAL);
			} 
			eventController["show"]();
		};
	};

}

function CardGame (cards , controllerLogicGame,scoreBoard){
	var LINES = 4;
	var COLS  = 5;
	this.cards = cards;
	var logicGame = controllerLogicGame;
	var scoreBoardGameControl = scoreBoard;

	this.clear = function (){
		var game = document.getElementById("game");
		game.innerHTML = '';
	}

	this.show =  function (){
		this.clear();
		scoreBoardGameControl.updateScore();
		var cardCount = 0;
		var game = document.getElementById("game");
		for(var i = 0 ; i < LINES; i++){
			for(var j = 0 ; j < COLS; j++){
				card = cards[cardCount++];
				var cardImage = document.createElement("img");
				if (card.visible){
					cardImage.setAttribute("src",card.getPathCardImage());
				}else{
					cardImage.setAttribute("src",card.getQuestionImage());
				}
				cardImage.onclick =  (function(position,cardGame) {
					return function() {


						if (movimentos > 60){
							swal({
								title: "Voce perdeu!",
								text: "O total de movimentos foi " + movimentos + " e " + estrelas + " estrelas e " + counter + " segundos. Jogar novamente?",
								icon: "error",
								buttons: true,
							}).then((reiniciar) => {
								if (reiniciar) {
									restartGame();
								} else {
								  swal("Pausou!");
								}
							});
							
						}
						
						var movimentosDiv = document.getElementById("movimentos");
						movimentosDiv.innerHTML =  movimentos + ' movimento(s)';

						var estrelasDiv = document.getElementById("estrelas");
						estrelasDiv.innerHTML =  estrelas + ' estrelas(s)';

						
						card = cards[position];
						var callback =  function (){
							cardGame.show();
						};
						logicGame.addEventListener("correct",function (){
							scoreBoardGameControl.incrementScore();
							scoreBoardGameControl.updateScore();
						});
						logicGame.addEventListener("wrong",function (){
							scoreBoardGameControl.decrementScore();
							scoreBoardGameControl.updateScore();
						});

						logicGame.addEventListener("show",function (){
							cardGame.show();
						});

						logicGame.doLogicGame(card);
						
					};
				})(cardCount-1,this);

				game.appendChild(cardImage);
			}
			var br = document.createElement("br");
			game.appendChild(br);
		}
	}
}

function BuilderCardGame(){    /*imagens cartas*/
	var pictures = new Array ('10.JPG','10.JPG',
		'1.JPG','1.JPG',
		'2.JPG','2.JPG',
		'3.JPG','3.JPG',
		'4.JPG','4.JPG',
		'5.JPG','5.JPG',
		'6.JPG','6.JPG',
		'7.JPG','7.JPG',
		'8.JPG','8.JPG',
		'9.JPG','9.JPG');

	this.doCardGame =  function (){
		shufflePictures();
		cards  = buildCardGame();
		cardGame =  new CardGame(cards, new ControllerLogicGame(), new ScoreBoardGameControl())
		cardGame.clear();
		return cardGame;
	}

	var shufflePictures = function(){
		var i = pictures.length, j, tempi, tempj;
		if ( i == 0 ) return false;
		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			tempi = pictures[i];
			tempj = pictures[j];
			pictures[i] = tempj;
			pictures[j] = tempi;
		}
	}

	var buildCardGame =  function (){
		var countCards = 0;
		cards =  new Array();
		for (var i = pictures.length - 1; i >= 0; i--) {
			card =  new Card(pictures[i]);
			cards[countCards++] = card;
		};
		return cards;
	}
}

var counter = 0;

var myTimer;

function Timer() {
	myTimer = setInterval(setTimer, 1000);
}

function setTimer() {
	counter++;
	var timerDiv = document.getElementById("timer");
	timerDiv.innerHTML =  counter + ' segundo(s)';
}

function restartTimer() {
	clearInterval(myTimer);
	counter = 0;
}

function restartGame() {
	score = 0;
	movimentos = 0;
	estrelas = "";
	restartTimer();
	GameControl.createGame();	
}

function GameControl (){

}


GameControl.createGame = function(){
	var builderCardGame =  new BuilderCardGame();
	cardGame = builderCardGame.doCardGame();
	cardGame.show();
	Timer();
}
