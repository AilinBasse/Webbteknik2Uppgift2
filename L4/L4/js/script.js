// Globala konstanter och variabler
// Städer och bilder
const allWords = ["Borgholm","Gränna","Gävle","Göteborg","Halmstad","Jönköping","Kalmar","Karlskrona","Kiruna","Ljungby","Malmö","Norrköping","Skara","Stockholm","Sundsvall","Umeå","Visby","Västervik","Växjö","Örebro"];	// Array med namn på städer
const allDescriptions = ["Kyrkan","Storgatan","Julbock","Operan","Picassoparken","Sofiakyrkan","Domkyrkan","Rosenbom","Stadshus","Garvaren","Stortorget","Spårvagn","Domkyrka","Rosenbad","Hotell Knaust","Storgatan","Stadsmur","Hamnen","Teater","Svampen"];	// Array med kort beskrivning av bilderna för städerna
// Element i gränssnittet
var startGameBtn;		// Referenser till start-knappen (button)
var checkAnswersBtn;	// Referens till knappen för att kontrollera svar (button)
var wordListElem;		// Referens till listan med de ord som kan dras (ul-elemntet)
var	wordElems;			// Array med referenser till elementen för de åtta orden (li-elemnten)
var imgElems;			// Array med referenser till elementen med de fyra bilderna (img)
var answerElems;		// Array med referenser till elementen för orden intill bilderna (p)
var correctElems;		// Array med referenser till element för rätta svar (p)
var largeImgElem;		// Referens till elementet med den stora bilden (img)
var msgElem; 			// Referens till div-element för utskrift av meddelanden (div)
// Element vid drag and drop
var dragWordElem;		// Det ord som dras (kan vara både li och p)
// ------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt händelsehanterare.
function init() {
	// Referenser till element i gränssnittet
		startGameBtn = document.getElementById("startGameBtn");
		checkAnswersBtn = document.getElementById("checkAnswersBtn");
		wordListElem = document.getElementById("wordList").getElementsByTagName("ul")[0];
		wordElems = wordListElem.getElementsByTagName("li");
		imgElems = document.getElementById("imgList").getElementsByTagName("img");
		msgElem = document.getElementById("message");
		answerElems = document.getElementsByClassName("userAnswer");
		correctElems = document.getElementsByClassName("correctAnswer");
		largeImgElem = document.getElementById("largeImg");
	// Lägg på händelsehanterare
		startGameBtn.addEventListener("click",startGame);
		checkAnswersBtn.addEventListener("click",checkAnswers);
		for (var i = 0; i < imgElems.length; i++) {
			imgElems[i].addEventListener("mouseenter", showLargeImg);
			imgElems[i].addEventListener("mouseleave", hideLargeImg);
		}
	// Aktivera/inaktivera knappar
		startGameBtn.disabled = false;
		checkAnswersBtn.disabled = true;
} // End init
window.addEventListener("load",init); // Se till att init aktiveras då sidan är inladdad
// ------------------------------
// Initiera spelet. Välj ord slumpmässigt. Visa ord och bilder.
function startGame() {
	let tempList = allWords.slice(0);	// Kopiera arrayen
	let words = [];						// Array för ord
	for (var i = 0; i < 4; i++) {
		let r = Math.floor(Math.random()*tempList.length); // Slumpar ett tal
		words.push(tempList[r]);
		let ix = allWords.indexOf(tempList[r]); // Hittar index för ordet i all ord listan
		imgElems[i].src = "img/" + ix + ".jpg";
		imgElems[i].id = ix;
		tempList.splice(r,1);
	}
	for (var i = 0; i < 4; i++) {
		let r = Math.floor(Math.random()*tempList.length); // Slumpar ett tal
		words.push(tempList[r]);	
		tempList.splice(r,1);
	}
	words.sort();
	for (var i = 0; i < wordElems.length; i++) {
		wordElems[i].innerHTML = words[i];
		wordElems[i].addEventListener("dragstart", dragstartWord);
		wordElems[i].addEventListener("dragend", dragendWord);
		wordElems[i].draggable = true;
	}
	for (var i = 0; i < answerElems.length; i++) {
		answerElems[i].addEventListener("dragstart", dragstartWord);
		answerElems[i].addEventListener("dragend", dragendWord);
		answerElems[i].draggable = true;
		answerElems[i].innerHTML = "";
		correctElems[i].innerHTML = "";
	}
	msgElem.innerHTML = "";
	checkAnswersBtn.disabled = false;
	startGameBtn.disabled = true;
} // End startGame

// ------------------------------
// Visa förstorad bild
function showLargeImg() {
	largeImgElem.src = this.src;
} // End showLargeImg
// ------------------------------
// Dölj förstorad bild
function hideLargeImg() {
	largeImgElem.src = "img/empty.png";
} // End hideLargeImg
// ------------------------------
// Ett ord börjar dras. Spara data om elementet som dras. Händelsehanterare för drop zones
function dragstartWord(e) { // e är Event-objektet
	for	(var i = 0; i < imgElems.length; i++) {
		imgElems[i].addEventListener("dragover", wordOverImg);
		imgElems[i].addEventListener("drop", wordOverImg);
	}
	wordListElem.addEventListener("dragover", wordOverList);
	wordListElem.addEventListener("drop", wordOverList);
	dragWordElem = this;
	e.dataTransfer.setData("text", this.innerHTML);
} // End dragstartWord
// ------------------------------
// Drag-händelsen avslutas. Ta bort händelsehanterare på drop zones
function dragendWord() {
	for	(var i = 0; i < imgElems.length; i++) {
		imgElems[i].removeEventListener("dragover", wordOverImg);
		imgElems[i].removeEventListener("drop", wordOverImg);
	}
	wordListElem.removeEventListener("dragover", wordOverList);
	wordListElem.removeEventListener("drop", wordOverList);
} // End dragendWord
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över en bild
function wordOverImg(e) { // e är Event-objektet
	e.preventDefault();
	if (e.type == "drop") {
		dragWordElem.innerHTML = "";
		let dropWordElem = this.nextElementSibling; // Hämta elementet som är elementet brevid bilden
		if (dropWordElem.innerHTML != "") {
			moveBackToList(dropWordElem.innerHTML);
		}
		dropWordElem.innerHTML = e.dataTransfer.getData("text");
	}
} // End wordOverImg
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över listan med ord
function wordOverList(e) { // e är Event-objektet
	e.preventDefault();
	if (e.type == "drop") {
		dragWordElem.innerHTML = "";
		moveBackToList(e.dataTransfer.getData("text"));
	}
} // End wordOverList
// ------------------------------
// Flytta tillbaks ordet till listan
function moveBackToList(word) { // word är det ord som ska flyttas tillbaks
	for (var i = 0; i < wordElems.length; i++) {
		if (wordElems[i].innerHTML == "") {
			wordElems[i].innerHTML = word;
			break;
		}
	}
} // End moveBackToList
// ------------------------------
// Kontrollera användarens svar och visa de korrekta svaren
function checkAnswers() {
	for (var i = 0; i < answerElems.length; i++) {
		if (answerElems[i].innerHTML == "") {
			alert("Dra först ord till alla bilder!");
			return;
		}
	}
	for (var j = 0; j < wordElems.length; j++) {
		wordElems[j].draggable = false;
		wordElems[j].removeEventListener("dragstart", dragstartWord);
		wordElems[j].removeEventListener("dragend", dragendWord);
	}
	for (var j = 0; j < answerElems.length; j++) {
		answerElems[j].draggable = false;
		answerElems[j].removeEventListener("dragstart", dragstartWord);
		answerElems[j].removeEventListener("dragend", dragendWord);
	}
	var points = 0;
	for (var i = 0; i < answerElems.length; i++) {
		let ix = imgElems[i].id;
		if (answerElems[i].innerHTML == allWords[ix]) {
			points++;
		}
		correctElems[i].innerHTML = allWords[ix] + ", " + allDescriptions[ix];
	}
	msgElem.innerHTML = "Du fick " + points + " poäng!";
	checkAnswersBtn.disabled = true;
	startGameBtn.disabled = false;
} // End checkAnswers
// ------------------------------