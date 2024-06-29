// Select the element with the specific class and ID
const pluElement = document.querySelector('.zm2jk14#pdp-title-plu');


if (pluElement) {
  
  // Detects when the page URL has changed (due to carousel involvement and updates the PLU Barcode). Listens to message from background.js
  chrome.runtime.onMessage.addListener((message) => {
    
    if (message.url) {
      
      console.log("Page Change detected");
      
      refreshBarcode();

    }
  });

  // First run generates barcode
  refreshBarcode();
  
} 
else {
  console.log("PLU element not found on this webpage.");
}

// Function for the code that actually refreshes the barcode on the page
function refreshBarcode() {
  
  // Extract the current PLU number (assuming it's after the colon)
  const currentPlu = pluElement.textContent.split(':')[1].trim();

  // Print the PLU to the console
  console.log("PLU:", currentPlu);
  
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
  
  console.log("The barcode has been refreshed.");

  return null;
}

// Made with love xx