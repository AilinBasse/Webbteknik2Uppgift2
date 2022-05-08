// Globala konstanter och variabler
const roomPrice = [600,800,950];	// Pris för rumstyperna
const extraPrice = [40,80,100];		// Pris för extravalen
var formElem;		// Referens till elementet med hela formuläret
var totalCostElem;	// Referens till elementet för totalpris
// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	formElem = document.getElementById("booking");
	totalCostElem = document.getElementById("totalCost");
	for (var i = 0; i < formElem.roomType.length; i++) {
		formElem.roomType[i].addEventListener("click", checkIfFamilyRoom);
		formElem.roomType[i].parentNode.lastChild.textContent += " (" + roomPrice[i] + " kr)";
		formElem.roomType[i].addEventListener("click", calculateCost);
	}
	for (var i = 0; i < formElem.extra.length; i++) {
		formElem.extra[i].parentNode.lastChild.textContent += " (" + extraPrice[i] + " kr)";
		formElem.extra[i].addEventListener("click", calculateCost);
	}
	formElem.nrOfNights.addEventListener("change", calculateCost);
	checkIfFamilyRoom();
	calculateCost();
	// Händelsehanterare för textfält som ska kontrolleras
	formElem.city.addEventListener("blur", checkCity);
	formElem.telephone.addEventListener("blur", checkField);
	formElem.zipcode.addEventListener("blur", checkField);
	// Händelsehanterare för kampanjkod
	formElem.campaigncode.addEventListener("focus", checkCampaign);
	formElem.campaigncode.addEventListener("keyup", checkCampaign);
	formElem.campaigncode.addEventListener("blur", endCheckCampaign);
	
} // End init
window.addEventListener("load",init);
// ------------------------------

//Ändrar formuläret baserat på om det är ett familierum eller inte
function checkIfFamilyRoom() {
	if (formElem.roomType[2].checked) {
		formElem.persons.disabled = false;
		formElem.persons.parentNode.style.color = "#000";
		formElem.extra[2].disabled = true;
		formElem.extra[2].parentNode.style.color = "#999";
		formElem.extra[2].checked = false;
	} else {
		formElem.persons.disabled = true;
		formElem.persons.parentNode.style.color = "#999";
		formElem.extra[2].disabled = false;
		formElem.extra[2].parentNode.style.color = "#000";
	}
} // End checkIfFamilyRoom

//Beräknar totalpriset
function calculateCost() {
	var price; // Priset för vald rumstyp + valda extraval
	for (var i = 0; i < formElem.roomType.length; i++) {
		if (formElem.roomType[i].checked) {
			price = roomPrice[i];
			break;
		}
	}
	for (var i = 0; i < formElem.extra.length; i++) {
		if (formElem.extra[i].checked) {
			price += extraPrice[i];
		}
	}
	let nrOfNights = formElem.nrOfNights.value; // Referens till elementet för antalet valda nätter
	totalCostElem.innerHTML = price * nrOfNights;
} // End calculateCost

//Ändrar inskriven ort till stora bokstäver
function checkCity() {
	let city = this.value; // Ort som är inskriven
	city = city.toUpperCase();
	formElem.city.value = city;
} // End checkCity

//Ser till att fälten för zip och mobilnummer är korrekt ifyllda
function checkField() {
	const fieldNames = ["zipcode", "telephone"]; // Namnen på fälten för zipkod och telefonnummer
	const re = [/^\d{3} ?\d{2}$/, /^0\d{1,3}[-/ ]?\d{5,8}$/]; // Regex för zipkod och telefonnummer
	const errMsg = ["Postnumret måste bestå av fem siffror", "Telefonnumret måste börja med en 0:a och följas av 6-11 siffror"]; // Felmeddelanden om fälten inte är korrekt ifyllda
	let ix = fieldNames.indexOf(this.name); // Index för vilket fält som är aktivt
	let errMsgElem = this.nextElementSibling; // Referens till elementet där felmeddelandet kommer stå vid fel
	errMsgElem.innerHTML = "";
	if (!re[ix].test(this.value)) {
		errMsgElem.innerHTML = errMsg[ix];
		return false; //Fel i fältet
	}
	else return true; //Korrekt i fältet
} // End checkField

//Gör att kampanjkoden blir till stora bokstäver och tar bort bakgrundfärgen
function endCheckCampaign() {
	this.style.backgroundColor = "";
	let campaign = this.value // Kampanjkoden som är inskriven
	campaign = campaign.toUpperCase();
	formElem.campaigncode.value = campaign;
} // End endCheckCampaign

//Kollar om kampanjkoden är korrekt
function checkCampaign() {
	let re = /^[a-zA-Z]{3}[-]\d{2}[-][a-zA-Z]{1}\d{1}$/; // Kampanjkoden ska vara i formatet ABC-12-A1
	if (re.test(this.value)) {
		this.style.backgroundColor = "#6F9";
	} else {
		this.style.backgroundColor = "#F99";
	}
} // End checkCampaign