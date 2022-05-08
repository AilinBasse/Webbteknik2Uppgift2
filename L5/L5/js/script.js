// Globala konstanter och variabler
var boardElem;			// Referens till div-element för "spelplanen"
const carImgs = ["car_up.png","car_right.png","car_down.png","car_left.png"];
						// Array med filnamn för bilderna med bilen
var carDir = 1;			// Riktning för bilen, index till carImgs
var carElem;			// Referens till img-element för bilen
const xStep = 5;		// Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 5;		// eller y-led i varje steg
const timerStep = 20;	// Tid i ms mellan varje steg i förflyttningen
var timerRef = null;	// Referens till timern för bilens förflyttning
var startBtn;			// Referens till startknappen
var stopBtn;			// Referens till stoppknappen
/* === Tillägg i labben === */
var pigElem;			// Referens till img-element för grisen
var pigTimerRef = null; // Referens till timern för grisen
var pigDuration = 2000; // Sätter tiden som en gris ska vara synlig
var pigNr;			// Nummer för grisen
var hitCounter;	// Hur många griser som har träffats
var pigNrElem; // Referens till element för grisens nummer
var hitCounterElem; // Referens till element för antal träffar
var catchedPig; // Stoppar flera  träffar för en gris
// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	// Referenser till element i gränssnittet
		boardElem = document.getElementById("board");
		carElem = document.getElementById("car");
		startBtn = document.getElementById("startBtn");
		stopBtn = document.getElementById("stopBtn");
	// Lägg på händelsehanterare
		document.addEventListener("keydown",checkKey);
			// Känna av om användaren trycker på tangenter för att styra bilen
		startBtn.addEventListener("click",startGame);
		stopBtn.addEventListener("click",stopGame);
	// Aktivera/inaktivera knappar
		startBtn.disabled = false;
		stopBtn.disabled = true;
	/* === Tillägg i labben === */
		pigElem = document.getElementById("pig");
		hitCounterElem = document.getElementById("hitCounter");
		pigNrElem = document.getElementById("pigNr");
} // End init
window.addEventListener("load",init);
// ------------------------------
// Kontrollera tangenter och styr bilen
function checkKey(e) {
	let k = e.key;
	switch (k) {
		case "ArrowLeft":
		case "z":
			carDir--; // Bilens riktning 90 grader åt vänster
			if (carDir < 0) carDir = 3;
			carElem.src = "img/" + carImgs[carDir];
			break;
		case "ArrowRight":
		case "-":
			carDir++; // Bilens riktning 90 grader åt höger
			if (carDir > 3) carDir = 0;
			carElem.src = "img/" + carImgs[carDir];
			break;
	}
} // End checkKey
// ------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
	startBtn.disabled = true;
	stopBtn.disabled = false;
	document.activeElement.blur(); // Knapparna sätts ur focus, så att webbsidan kommer i fokus igen
								   // Detta behövs för att man ska kunna känna av keydown i Firefox.
	carElem.style.left = "0px";
	carElem.style.top = "0px";
	carDir = 1;
	carElem.src = "img/" + carImgs[carDir];
	moveCar();
	/* === Tillägg i labben === */
	hitCounter = 0;
	pigNr = 0;
	hitCounterElem.innerHTML = 0;
	pigNrElem.innerHTML = 0;
	pigTimerRef = setTimeout(newPig,pigDuration);
	catchedPig = true;
} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i labben === */
	pigElem.style.visibility = "hidden";

} // End stopGame
// ------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;
	let x = parseInt(carElem.style.left);	// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);	// y-koordinat (top) för bilen
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;
			if (y < 0) y = 0;
			break;
		case 1: // Höger
			x += xStep;
			if (x > xLimit) x = xLimit;
			break;
		case 2: // Nedåt
			y += yStep;
			if (y > yLimit) y = yLimit;
			break;
		case 3: // Vänster
			x -= xStep;
			if (x < 0) x = 0;
			break;
	}
	carElem.style.left = x + "px";
	carElem.style.top = y + "px";
	timerRef = setTimeout(moveCar,timerStep);
	/* === Tillägg i labben === */
	checkHit();

} // End moveCar
// ------------------------------

/* === Tillägg av nya funktioner i labben === */
// Skapar en ny gris vid slumpmässig koordinat
function newPig() {
	if (pigNr < 10) {
		let xLimit = boardElem.offsetWidth - pigElem.offsetWidth - 20; // Spelets gränser i bredd - 20 px för att få plats för grisen
		let yLimit = boardElem.offsetHeight - pigElem.offsetHeight - 20; // Spelets gränser i höjd - 20 px för att få plats för grisen
		let x = Math.floor(Math.random() * xLimit) + 10; // slumpa x-koordinat för grisen
		let y = Math.floor(Math.random() * yLimit) + 10; // slumpa y-koordinat för grisen
		pigElem.style.left = x + "px";
		pigElem.style.top = y + "px";
		pigElem.src = "img/pig.png";
		pigElem.style.visibility = "visible";
		pigTimerRef = setTimeout(newPig, pigDuration);
		pigNr++;
		pigNrElem.innerHTML = pigNr;
		catchedPig = false;
	} else {
		stopGame();
	}
}
//Funktion för att kontrollera om grisen har kolliderats med bilen. 
//Kontrollerar även om grisen redan träffats för att se till att den inte ska kollidera med samma gris flera gånger.
function checkHit() {
	if (catchedPig) return;
	let cSize = carElem.offsetWidth; // Storlek på bilen
	let pSize = pigElem.offsetWidth; // Storlek på grisen
	let cL = parseInt(carElem.style.left); // x-koordinat för left för bilen
	let cT = parseInt(carElem.style.top); // y-koordinat för top för bilen
	let pL = parseInt(pigElem.style.left); // x-koordinat för left för grisen
	let pT = parseInt(pigElem.style.top); // y-koordinat för top för grisen
	if (cL + 10 < pL + pSize && cL + cSize-10 > pL && cT + 10 < pT + pSize && cT + cSize-10 > pT) {
		clearTimeout(pigTimerRef);
		pigElem.src = "img/smack.png";
		pigTimerRef = setTimeout(newPig, pigDuration);
		hitCounter++;
		hitCounterElem.innerHTML = hitCounter;
		catchedPig = true;
	}
}
