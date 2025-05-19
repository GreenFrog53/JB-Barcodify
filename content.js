
// Selectors for all of the elements

// Select the element with the specific class and ID
const pluElement = document.querySelector('.zm2jk14#pdp-title-plu');
// Select the element with the compare and wishlist buttons
const buttonElement = document.getElementById('pdp-call-to-action-wrapper');

// Select the element with SKU's
const skuElement = document.querySelector('.zm2jk12#pdp-title-sku');



// Find out whether the settings page has allowed the mofifications to run on this page

chrome.storage.local.get(["websiteToggle"], (result) => { 
  if (result.websiteToggle === undefined) {
    enabled()
    console.log("JB Barcodify: The barcode will be displayed, as the websiteToggle setting has not been set.");
  }
  else if (result.websiteToggle === true){
    enabled()
    console.log("JB Barcodify: The barcode will be displayed, as the websiteToggle setting is true.");
  }
  else {
    console.log("JB Barcodify: The barcode will not be displayed, as the websiteToggle setting is false.");
  }
});



function enabled() {
  if (pluElement) {


    // To be run when the webpage is first loaded
    // removeAnnoyances();
    const barcodeSvg = createBarcode();
    const buttonElement = createProductAppButton();
  
    
  
  
  
    // Detects when the page URL has changed (due to carousel involvement and updates the PLU Barcode). Listens to message from background.js
    chrome.runtime.onMessage.addListener((message) => {
      if (message.url) {
        
        console.log("Page Change detected");
        
        const currentPlu = pluElement.textContent.split(':')[1].trim();
        JsBarcode("#barcode", currentPlu, {
          displayValue: false,
          margin: 0,
          height: 27
        });
        console.log("Barcode Updated to PLU: " + currentPlu);
  
        const currentSku = skuElement.textContent.split(':')[1].trim();
        buttonElement.href = "https://products.jbhifi.tech/product/" + currentSku;
        console.log("Product App Button Updated to SKU: " + currentSku);
  
      }
    });
  
    // detects when the product app button is clicked
    buttonElement.addEventListener('click', () => {
      console.log("Product App Button Clicked: " + buttonElement.href);
      window.open(buttonElement.href, "_blank");
  
    });
  
  
  } 
  else {
    console.log("PLU element not found on this webpage.");
  }
}



function createBarcode() {
  
  // Extract the current PLU number (assuming it's after the colon)
  const currentPlu = pluElement.textContent.split(':')[1].trim();
  
  // Create the element for the barcode to sit
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "barcode";
  pluElement.insertBefore(svg, pluElement.firstChild);

  // Call JsBarcode and generate the barcode
  JsBarcode("#barcode", currentPlu, {
    displayValue: false,
    margin: 0,
    height: 27
  });
  
  console.log("Barcode Created with PLU: " + currentPlu);

  return svg;
}


function createProductAppButton() {
  
  // create a new button to be filled with info
  const newButton = document.createElement('button');

  // Set the attributes for the new button
  newButton.href = "https://products.jbhifi.tech/product/" + skuElement.textContent.split(':')[1].trim(); // sets the url
  newButton.textContent = "View Product App"; // sets the buttons text
  newButton.target = "_blank"; // makes sure it opens in a new tab
  newButton.classList.add("_2jjtjo3"); //makes the button fit in with the rest of the buttons
  newButton.style.fontWeight = "bold"; // makes the text bold
  newButton.style.textDecoration = "none"; // removes the underline from the text


  // Appends the new button as a child of the buttonElement
  //buttonElement.appendChild(newButton);
  buttonElement.insertBefore(newButton, buttonElement.firstChild);


  console.log("Button Created with SKU: " + skuElement.textContent.split(':')[1].trim());

  return newButton;
}

function removeAnnoyances() {

  // remove BNPL Buttons
  var bnElement = document.querySelector('div._1i9r0yk0#pdp-bnpl-wrapper');
  if (bnElement) {
    bnElement.parentNode.removeChild(bnElement);
  }

  // remove JB Deal element
  var jbdElement = document.querySelector('div._1tcgqky0#pdp-seenitcheaper-cta');
  if (jbdElement) {
    jbdElement.parentNode.removeChild(jbdElement);
  }

  return null;
}

// Made with love xx
