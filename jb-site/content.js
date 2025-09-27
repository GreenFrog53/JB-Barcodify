// Okay this code DESPERATELY needs a rewrite, because I honestly have noidea how it works and its a huge pain to maintain.
// Goodluck to anyone that actually wants to do anything :/
// lmao, its only going to be me :(

// Global Variables

// Element Selectors
// JB Barcodify Top Element barcodify-element
const pluElement = document.querySelector('.zm2jk14#pdp-title-plu'); // PLU Element
const skuElement = document.querySelector('.zm2jk12#pdp-title-sku'); // SKU Element
const buttonElement = document.getElementById('pdp-call-to-action-wrapper'); // Call to action buttons (Being Depreciated)

// Settings Selectors
// let showBarcode = false; // Soon to be used
// let showProductAppButton = false; // Soon to be used
let showIntInfo = false; // False by default until settings are checked
let showInventoryData = false; // Testing at this stage

// Temporary Flag Selectors
let pageHasBeenRefreshed = false; // Will be set to true when a refresh is triggered





// for the int info section
chrome.storage.local.get(["websiteExtraToggle"], (result) => { 
  if (result.websiteExtraToggle === undefined) {
    showIntInfo = false;
    console.log("JB Barcodify: The Internal Info Section will not be displayed as the websiteExtraToggle setting has not been set.");
  }
  else if (result.websiteExtraToggle === true){
    showIntInfo = true;
    console.log("JB Barcodify: The Internal Info Section will be displayed as the websiteExtraToggle is true.");
  }
  else {
    console.log("JB Barcodify: The Internal Info Section will not be displayed as the websiteExtraToggle is false.");
  }
});

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
    const barcodeSvg = createBarcode();
    // const buttonElement = createProductAppButton();
    createIntInfo();
  
    
  
  
  
    // Detects when the page URL has changed (due to carousel involvement and updates the PLU Barcode). Listens to message from background.js
    chrome.runtime.onMessage.addListener((message) => {
      if (message.url) {
        
        console.log("Page Change detected");
        pageHasBeenRefreshed = true;
        
        const currentPlu = pluElement.textContent.split(':')[1].trim();
        JsBarcode("#barcode", currentPlu, {
          displayValue: false,
          margin: 0,
          height: 27
        });
        console.log("Barcode Updated to PLU: " + currentPlu);
        
        /* code for old button
        const currentSku = skuElement.textContent.split(':')[1].trim();
        buttonElement.href = "https://products.jbhifi.tech/product/" + currentSku;
        console.log("Product App Button Updated to SKU: " + currentSku);
        */
        
        createIntInfo();

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





// Create internal info Section
function createIntInfo() {

  // Find the Right Panel
  const pdpRight = document.getElementById("pdp-right-panel");

  // Check if the internal info div already exists and remove it
  const existingIntInfo = pdpRight.querySelector('.internal-info-section');
  if (existingIntInfo) {
    existingIntInfo.remove();
    console.log("Removed Internal Info Section for recreation.")
  }

  const firstChildDiv = document.createElement("div");
  firstChildDiv.classList.add('internal-info-section');

  // Apply styles to highlight the div

  firstChildDiv.style.padding = "5px"; // Add some padding
  firstChildDiv.style.paddingBottom = "20px"; // Add some padding
  
  firstChildDiv.style.paddingLeft = "24px";
  firstChildDiv.style.borderRadius = "5px"; // Add rounded corners (optional)

  if (showIntInfo) {
    // Create an H1 element
    const h1Element = document.createElement("h3");
    h1Element.textContent = "Internal Info"; // Set the text content of the H1
    h1Element.style.marginTop = "0px";
    h1Element.style.marginBottom = "5px";
    // Append the H1 to the new div
    firstChildDiv.appendChild(h1Element);

    if (pageHasBeenRefreshed) {
      const disclaimerElement = document.createElement("p");
      disclaimerElement.textContent = "Warning, internal info is not always acurate once a different varient is selected. Refresh for accurate info."
      disclaimerElement.style.marginTop = "5px";
      disclaimerElement.style.marginBottom = "5px";
      disclaimerElement.style.color = "#666";
      firstChildDiv.appendChild(disclaimerElement);
    }



    // Create a Season Code display
    const seasonElement = document.createElement("p");
    seasonElement.textContent = "Season: " + getSeasonCode(); // Set the text content of the H1
    seasonElement.style.margin = "0px";
    firstChildDiv.appendChild(seasonElement);

    // Create a manufacturers warranty display
    const warrantyElement = document.createElement("p");
    warrantyElement.textContent = "Manufacturers Warranty: " + getWarranty(); 
    warrantyElement.style.margin = "0px";
    firstChildDiv.appendChild(warrantyElement);

  }

if (showIntInfo && showInventoryData) {

  // Create a element for a heading
  const headingElement = document.createElement("h6");
  headingElement.textContent = "Inventory"; // Set the text content of the H1
  headingElement.style.marginTop = "5px";
  headingElement.style.marginBottom = "5px";
  // Append to div
  firstChildDiv.appendChild(headingElement);





  // Create SOH element with loading text initially
  let sohElement = document.createElement("p");
  sohElement.textContent = "Available SOH: Loading...";
  sohElement.style.margin = "0px";
  firstChildDiv.appendChild(sohElement);

  // Get inventory data for the sku (wait for the Promise to resolve)
  getInventoryData(345, 43)
    .then(currentData => {
      if (currentData && currentData.SaleableSoh !== undefined) {
        sohElement.textContent = "Available SOH: " + currentData.SaleableSoh;
      } else {
        sohElement.textContent = "Available SOH: N/A";
      }
    })
    .catch(error => {
      console.error('Error loading inventory data:', error);
      sohElement.textContent = "Available SOH: Error loading data";
    });
}

  


  // Create a product app button
  const viewButton = document.createElement("button");
  viewButton.textContent = "Open in Product App";
  viewButton.style.marginTop = "10px";
  viewButton.style.padding = "13px";
  viewButton.style.cursor = "pointer";
  viewButton.style.width = "100%";
  viewButton.style.fontWeight = "bold";
  const currentSku = skuElement.textContent.split(':')[1].trim();
  viewButton.href = "https://products.jbhifi.tech/product/" + currentSku;

  firstChildDiv.appendChild(viewButton);

  viewButton.addEventListener('click', function() {
    console.log("View button clicked!");
    window.open(viewButton.href, "_blank");
  });

  // Create a blank div line for spacing
  const blankDiv = document.createElement("div");
  blankDiv.style.height = "10px"; // Adjust height as needed
  firstChildDiv.appendChild(blankDiv);

  
  // Insert as the first child
  pdpRight.insertBefore(firstChildDiv, pdpRight.firstChild);

  
}












// Made with love xx



// add injected script to the page (testing only)
// Create a script element
const script = document.createElement('script');

// Set the source of the script to the external file
script.src = chrome.runtime.getURL('injected-script.js');

// Inject the script into the page
document.documentElement.appendChild(script);

// Remove the script element after it has been added to the page
script.onload = () => script.remove();






function getSeasonCode() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const targetScript = scripts.find(script => script.textContent.includes('product.metafields'));
  console.log("getSeasonCode() ran");

  if (targetScript) {

    // Use a regular expression to extract the value of "SeasonCode"
    const match = targetScript.textContent.match(/"SeasonCode":"(.*?)"/);

    if (match && match[1]) {
        console.log("SeasonCode:", match[1]); // Logs the value of SeasonCode

        if (match[1] == "M") {
          return match[1] + " (Hardware Managed Stock)";
        }
        else if (match[1] == "E") {
          return match[1] + " (CD/DVD Essential Range)";
        }
        else if (match[1] == "MW") {
          return match[1] + " (Managed Warehouse)";
        }
        else if (match[1] == "MW+") {
          return match[1] + " (Managed Warehouse Event)";
        }
        else if (match[1] == "M+") {
          return match[1] + " (Managed Stock, Product Managers)";
        }
        else if (match[1] == "NR") {
          return match[1] + " (New Release)";
        }
        else if (match[1] == "D") {
          return match[1] + " (Deleted Range, not to be re-ordered)";
        }
        else if (match[1] == "S") {
          return match[1] + " (CD/DVD Specialist Range)";
        }
        else if (match[1] == "Q") {
          return match[1] + " (Quit Stock, to be cleared)";
        }
        else if (match[1] == "A") {
          return match[1] + " (Hardware Stock, ranged in all stores)";
        }
        else if (match[1] == "A") {
          return match[1] + " (Hardware Stock, ranged in all stores)";
        }
        else if (match[1] == "SW") {
          return match[1] + " (Steering Wheel Games)";
        }
        else if (match[1] == "Z") {
          return match[1] + " (Online Only Product)";
        }
        else if (match[1] == "Z+") {
          return match[1] + " (Online Only Product + Select Stores)";
        }
        else if (match[1] == "W") {
          return match[1] + " (Online Only Product)";
        }
        else if (match[1] == "X") {
          return match[1] + " (Not to be sold or ordered)";
        }
        else if (match[1] == "EL") {
          return match[1] + " (End of Life)";
        }
        else if (match[1] == "CAMERA") {
          return match[1] + " (Full Camera Stores Only)";
        }
        else if (match[1] == "FIRM SALE") {
          return match[1] + " (Firm Sale Product, cannot be returned)";
        }
        else if (match[1] == "CHART") {
          return match[1] + " (CD/DVD Chart)";
        }
        else if (match[1] == "O") {
          return match[1] + " (CD/DVD Optional Range)";
        }
        else if (match[1] == "COM") {
          return match[1] + " (Commercial Exclusive Products)";
        }



        return match[1];
    } else {
        console.log("SeasonCode not found.");
        return "N/A";
    }
  }
  else {
    console.log("SeasonCode not found. Way to locate it no longer works :(");
    return "N/A";
  }
  
  

}

function getWarranty() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const targetScript = scripts.find(script => script.textContent.includes('product.metafields'));

  if (targetScript) {
    // Use a regular expression to extract the Manufacturer's warranty
    const match = targetScript.textContent.match(/"Name":"Manufacturer's warranty","Values":\["(.*?)"\]/);

    if (match && match[1]) {
        console.log("Manufacturer's warranty:", match[1]); // Logs the warranty value
        return match[1];
    } else {
        console.log("Manufacturer's warranty not found.");
        return "N/A";
    }
  }
  else {
    console.log("Manufacturer's warranty not found. Way to locate it no longer works :(");
    return "N/A";
  }
}





// Following is code for the API calls that are being tested for inventory :)

// Make getInventoryData return a Promise
function getInventoryData(apiSku, apiLocationId) {
  return fetch('http://localhost:3000/0')
    .then(response => {
      if (!response.ok) {
        throw new Error(`getInventoryData: HTTP error! Status: ${response.status}`);
      }
      return response.json(); 
    })
    .then(data => {
      const inventoryData = data[0];
      console.log('getInventoryData: Inventory data loaded:', inventoryData);

      // examples for testing
      console.log("SKU:", inventoryData.Sku);
      console.log("Saleable Stock on Hand:", inventoryData.SaleableSoh);
      console.log("Location ID:", inventoryData.LocationId);
      console.log("Exhaustion Date:", inventoryData.ExhaustionDate);
      
      return inventoryData; // Return the data
    })
    .catch(error => {
      console.error('Failed to fetch inventory:', error);
      return null; // Return null on error
    });
}