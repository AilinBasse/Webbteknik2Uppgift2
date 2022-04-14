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
	checkIfFamilyRoom()
	calculateCost()
	// Händelsehanterare för textfält som ska kontrolleras
	for(let i = 0; i < formElem.roomType.length; i++) {
		formElem.roomType[i].addEventListener("click", checkIfFamilyRoom)
		formElem.roomType[i].parentNode.lastChild.textContent += " (" + roomPrice[i] + " kr)";
		formElem.roomType[i].addEventListener("click", calculateCost)
	}
	for(let i = 0; i < formElem.extra.length; i++) {
		formElem.extra[i].parentNode.lastChild.textContent += " (" + extraPrice[i] + " kr)";
		formElem.extra[i].addEventListener("click", calculateCost)
	}
	formElem.nrOfNights.addEventListener("change", calculateCost)
	formElem.city.addEventListener("blur", checkCity)
	formElem.zipCode.addEventListener("blur", checkField)
	formElem.telephone.addEventListener("blur", checkField)
	// Händelsehanterare för kampanjkod
	formElem.campaigncode.addEventListener("focus", checkCampaign)
	formElem.campaigncode.addEventListener("keyup", checkCampaign)
	formElem.campaigncode.addEventListener("blur", stopCheckCampaign)
} // End init

window.addEventListener("load",init);
// ------------------------------
// Kontrollera om familjrum är valt och gör tillgängligt eller ej textfält för antal barn baserat på valt rum
function checkIfFamilyRoom() {
	if(formElem.roomType[2].checked) {
		formElem.persons.disabled = false;
		formElem.persons.parentNode.style.color = "#000"
		formElem.extra[2].disabled = true
		formElem.extra[2].checked = false
	} else {
		formElem.persons.disabled = true
		formElem.persons.parentNode.style.color = "#999"
		formElem.extra[2].disabled = false
	}
}

// Beräkna totalpriset baserat på valda rum och extraval
function calculateCost() {
	let price = 0; // Sätter variabel price till 0 då inga val är gjorda
	for(let i = 0; i < formElem.roomType.length; i++) {
		if(formElem.roomType[i].checked) {
			price += roomPrice[i];
		}
	}
	for(let i = 0; i < formElem.extra.length; i++) {
		if(formElem.extra[i].checked) {
			price += extraPrice[i];
		}
	}
	let nrOfNights = formElem.nrOfNights.value; // Sätter variabel nrOfNights till värdet på textfältet för antal nätter
	totalCostElem.textContent = price * nrOfNights;
}

// Sätter postort till stor bokstäver
function checkCity() {
	let city = this.value; //Sätter variabel city till värdet på textfältet
	city = city.toUpperCase();
	formElem.city.textContent = city;
}

// Kontroll av textfält
function checkField() {
	const fieldNames = ["zipCode", "telephone"]; // Sätter variabel fieldNames till en array med namn på textfält för postnummer och telefonnummer
	const re = [/^\d{3} ?\d{2}$/, /^0\d{1,3}[-/ ]?\d{5,8}$/]; // Sätter variabel re till en array med reguljära uttryck för postnummer och telefonnummer
	const errMsg = ["Postnummer måste bestå av fem siffror", "Telnr måste börja med en 0:a och följas av 6-11 siffror"]; // Sätter variabel errMsg till felmeddelanden för postnummer och telefonnummer
	let ix = fieldNames.indexOf(this.name); // Sätter variabel ix till indexet i arrayen fieldNames för textfältet
	let errMsgElem = this.nextElementSibling; // Sätter variabel errMsgElem till elementet som är efter textfältet
	errMsgElem.innerHTML = "";
	if(re[ix].test(this.value)) {
		errMsgElem.innerHTML = errMsg[ix];
		return false;
	}
	else {
		return true;
	}
}

// Stoppar kontrollen av kampanjkod
function stopCheckCampaign() {
	this.style.backgroundColor = "";
	let campaignCode = this.value; // Sätter variabel campaignCode till värdet på textfältet
	campaignCode = campaignCode.toUpperCase();
	formElem.campaigncode.textContent = campaignCode;
}

// Kontroll av kampanjkod
function checkCampaign() {
	let re = /^[a-zA-Z]{3}[-/]\d{3}[-][a-zA-Z]{1}\d{1}$/; // Sätter variabel re till reguljära uttryck för kampanjkod i formen ABC-123-A1
	if(re.test(this.value)) {
		this.style.backgroundColor = "#6F9";
	} else {
		this.style.backgroundColor = "#F99";
	}
}