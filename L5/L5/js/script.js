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
var pigElem;			// Referens till bild av vildsvin
var pigTimerRef = null  // Ostartad timer
var pigDuration = 2000  // Anger tid mellan vildsvin i millisekunder
var pigNr;				// Används för att se om antalet vildsvin är mindre än 10
var hitCounter;			// Antalet vildsvins som har träffats av bilen
var pigNrElem;			// Referens till element som visar hur många vildsvin som har hittats
var hitCounterElem;		// Referens till element som visar hur många vildsvin som har träffats av bilen
var catchedPig;  		// Ser om ett vildsvin redan har fångats

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
		pigTimerRef = setTimeout(newPig, pigDuration);
		pigNr = document.getElementById("pigNr")
		hitCounter = document.getElementById("hitCounter")
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
	pigNr = 0
	hitCounter = 0
	pigNrElem.innerHTML = 0
	hitCounterElem.innerHTML = 0
	newPig()
	catchedPig = true
} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i labben === */
	if(pigTimerRef != null) clearTimeout(pigTimerRef)
	pigElem.visibility = hidden;
} // End stopGame
// ------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth; // Bredd på spelplanen (minus bildens bredd)
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight; // Höjd på spelplanen (minus bildens höjd)
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
	checkHit()

} // End moveCar
// ------------------------------

/* === Tillägg av nya funktioner i labben === */
// Skapar nytt vildsvin så länge antalet vildsvin är mindre än 10
function newPig() {
	if(pigNr < 10) {
		let xLimit = boardElem.offsetWidth - pigElem.offsetWidth - 20 	// Bredd på spelplanen (minus bildens bredd)
		let yLimit = boardElem.offsetHeight - pigElem.offsetHeight - 20 	// Höjd på spelplanen (minus bildens höjd)
		let x = Math.floor(xLimit*Math.random()) + 10 						// x-koordinat (left) för vildsvinet
		let y = Math.floor(yLimit*Math.random()) + 10 						// y-koordinat (top) för vildsvinet
		document.getElementById("pig").src = "img/smack.png"
		pigElem.visibility = visible
		pigTimerRef = setTimeout(newPig, pigDuration)
		pigNr++
		pigNrElem.innerHTML = pigNr
		catchedPig = false
	} else {
		stopGame()
	}
}

// Kollar om vildsvinet har träffats
function checkHit() {
	if(catchedPig == true) {
		return
	}
	let cSize = carElem.offsetWidth // Bredd på bilen
	let pSize = pigElem.offsetWidth // Bredd på vildsvinet
	let cL = parseInt(carElem.style.left) // Bilens x-koordinat (vänster)
	let cT = parseInt(carElem.style.top) // Bilens y-koordinat (topp)
	let pL = parseInt(pigElem.style.left) // Vildsvinets x-koordinat (vänster)
	let pT = parseInt(pigElem.style.top) // Vildsvinets y-koordinat (topp)
	if(cL+10 < pL+pSize && cL+cSize-10 > pL && cT+10 < pT+pSize && cT+cSize-10 > pT){
		clearTimeout(pigTimerRef)
		document.getElementById("pig").src = "img/smack.png"
		pigTimerRef = setTimeout(newPig, pigDuration)
		hitCounter++
		hitCounterElem.innerHTML = hitCounter
		catchedPig = true
	}
}