// Okay so I did a rewrite, is it okay? yea ig, its not great tho
// but at least *I* can understand the code, which as I'm the only maintainer, is good
// But yea, enjoy new features, internal info got a redesign, settings don't depend on each other anymore (yay!)
// Honestly idk what else I did, Ive spend like 10 hours working on this, and my memory is terrible



// Global Variables
let pageSku; // Contains the current SKU
let pagePlu; // Contains the current PLU

let apiUrl = "https://api-lb01.jbhifi.com.au/InventoryApi/api/Detail?"


// Element Selectors
// JB Barcodify Top Element barcodify-element
const pluElement = document.querySelector('.zm2jk14#pdp-title-plu'); // PLU Element
const skuElement = document.querySelector('.zm2jk12#pdp-title-sku'); // SKU Element
const buttonElement = document.getElementById('pdp-call-to-action-wrapper'); // Call to action buttons (Being Depreciated)
const pdpRight = document.getElementById("pdp-right-panel") // Element that contains the right hand side of the page.

// Settings Selectors
let showBarcode = false; // Soon to be used
let showProductAppButton = false; // Soon to be used
let showIntInfo = false; // False by default until settings are checked

let showSohData = false; // Testing at this stage, should be false at start
let inventoryDataLocation = null; // Testing at this stage

// Temporary Flag Selectors
let pageHasBeenRefreshed = false; // Will be set to true when a refresh is triggered



// Check settings and change variables to match
// Settings will only be checked on page refresh

function loadSettings() {
  return Promise.all([
    // Show Internal Information
    new Promise((resolve) => {
      chrome.storage.local.get(["websiteExtra"], (result) => { 
        if (result.websiteExtra === true){
          showIntInfo = true; // Update settings variable
          console.log("JB Barcodify Settings: The Internal Info Section will be displayed as websiteExtra is true.");
        }
        resolve();
      });
    }),

    // Show Soh Data
    new Promise((resolve) => {
      chrome.storage.local.get(["websiteStock"], (result) => { 
        if (result.websiteStock === true){
          showSohData = true; // Update settings variable
          console.log("JB Barcodify Settings: The Soh data Section will be displayed as the websiteStock is true.");
        }
        resolve();
      });
    }),

    // Show Soh store code
new Promise((resolve) => {
  chrome.storage.local.get(["websiteLocation"], (result) => { 
    if (result.websiteLocation !== undefined && 
        !isNaN(result.websiteLocation) && 
        Number(result.websiteLocation) > 0) {
      inventoryDataLocation = Number(result.websiteLocation);
      console.log("JB Barcodify Settings: The Soh location will be " + result.websiteLocation);
    }
    resolve();
  });
}),

    // Show Barcodes
    new Promise((resolve) => {
      chrome.storage.local.get(["websiteBarcodes"], (result) => { 
        if (result.websiteBarcodes === undefined) {
          console.log("JB Barcodify Settings: The barcode will be displayed, as the websiteBarcodes setting has not been set.");
          showBarcode = true;
        }
        else if (result.websiteBarcodes === true){
          console.log("JB Barcodify Settings: The barcode will be displayed, as the websiteBarcodes setting is true.");
            showBarcode = true;
        }
        else {
          console.log("JB Barcodify Settings: The barcode will not be displayed, as the websiteBarcodes setting is false.");
        }
        resolve();
      });
    }),

    // Show Product App Button
    new Promise((resolve) => {
      chrome.storage.local.get(["websiteButton"], (result) => { 
        if (result.websiteButton === undefined) {
          console.log("JB Barcodify Settings: The button will be displayed, as the websiteButton setting has not been set.");
          showProductAppButton = true;
        }
        else if (result.websiteButton === true){
          console.log("JB Barcodify Settings: The button will be displayed, as the websiteButton setting is true.");
            showProductAppButton = true;
        }
        else {
          console.log("JB Barcodify Settings: The barcode will not be displayed, as the websiteButton setting is false.");
        }
        resolve();
      });
    })
  ]);
}

// Wait for settings to load before continuing
loadSettings().then(() => {
  console.log("All settings loaded, proceeding with initialization...");
  
  // First check if the page is valid
  // Get Plu, SKU and save as global variables
  // Create Barcodify element and set it 

  if (checkPageValidity() && getPageDetails()) {
    
    createBarcodeElement();

    createInfoElement();

    
    // Detects when the page URL has changed (due to carousel involvement and updates the PLU Barcode). Listens to message from background.js
    chrome.runtime.onMessage.addListener((message) => {
      if (message.url) {
        
        console.log("Page Change detected");
        pageHasBeenRefreshed = true;
        getPageDetails();
        
        // Update Barcode
        if(showBarcode) {
          JsBarcode("#barcode", pagePlu, {
            displayValue: false,
            margin: 0,
            height: 27
          });
          console.log("Barcode Updated to PLU: " + pagePlu);
        }
        

        // Update Internal info Section (including Product App Button)
        createInfoElement();

      }
    });







  }
});



function createInfoElement() {

  // Check if the info-element-section div already exists and remove it
  const existingIntInfo = pdpRight.querySelector('.info-element-section');
  if (existingIntInfo) {
    existingIntInfo.remove();
    console.log("Removed info-element-section for recreation.")
  }

  // Create the infoElement and give it the class 
  const infoElement = document.createElement("div");
  infoElement.classList.add('info-element-section');

  // Apply styles to highlight the div
  infoElement.style.padding = "5px"; // Add some padding
  infoElement.style.paddingBottom = "15px"; // Add some padding
  infoElement.style.paddingLeft = "24px";
  infoElement.style.paddingRight = "24px";
  infoElement.style.borderRadius = "5px"; // Add rounded corners (optional)

  // Function for standard stylised text
  function createInfoItem(label, value, parentElement) {
    const infoElement = document.createElement("p");
    infoElement.innerHTML = `<span style="color: #666;">${label}: </span><span style="color: #000;">${value}</span>`;
    infoElement.style.margin = "0px";
    parentElement.appendChild(infoElement);
    return infoElement;
  }

  if (showIntInfo) {

    // Create a heading
    const headingElement = document.createElement("h6");
    headingElement.textContent = "Internal Info";
    headingElement.style.marginTop = "0px";
    headingElement.style.marginBottom = "5px";
    // Append to div
    infoElement.appendChild(headingElement);

    // Disclaimer for refreshes
    if (pageHasBeenRefreshed) {
      const disclaimerElement = document.createElement("p");
      disclaimerElement.textContent = "Warning, internal info is not always acurate once a different varient is selected. Refresh for accurate info."
      disclaimerElement.style.marginTop = "5px";
      disclaimerElement.style.marginBottom = "5px";
      disclaimerElement.style.color = "#666";
      infoElement.appendChild(disclaimerElement);
    }

    // Create a div to prettify internal info
    const infoDiv = document.createElement("div");
    infoDiv.style.padding = "10px";
    infoDiv.style.backgroundColor = "#f0f0f0";
    
    createInfoItem("Season", getSeasonCode(), infoDiv);
    createInfoItem("Manufacturers Warranty", getWarranty(), infoDiv);

    infoElement.appendChild(infoDiv);

    // Extra Internal info Stuff goes here

  }

  if (showSohData) {

    // Create a heading
    const headingElement = document.createElement("h6");
    if (inventoryDataLocation === null) {
      headingElement.textContent = "Stock Levels";
      headingElement.style.marginTop = "5px";
      headingElement.style.marginBottom = "5px";
      // Append to div
      infoElement.appendChild(headingElement);

      const disclaimerElement = document.createElement("p");
      disclaimerElement.textContent = "Please set a store location in the extension settings."
      disclaimerElement.style.margin = "0px";
      disclaimerElement.style.color = "#666";
      infoElement.appendChild(disclaimerElement);

    }
    else {
      headingElement.textContent = "Live Stock ("+ inventoryDataLocation + ")";
      headingElement.style.marginTop = "5px";
      headingElement.style.marginBottom = "5px";
      infoElement.appendChild(headingElement);

      // Create a new div to contain the actual results and stock
      const stockDiv = document.createElement("div");
      stockDiv.style.padding = "10px";
      stockDiv.style.backgroundColor = "#f0f0f0";
      stockDiv.innerHTML = "Loading...";
      
      getInventoryData(pageSku, inventoryDataLocation, stockDiv)

      infoElement.appendChild(stockDiv);


    }
    

    // Extra soh info Stuff goes here

  }

  if (showProductAppButton) {

    // Create a product app button
    const viewButton = document.createElement("button");
    viewButton.textContent = "Open in Product App";
    viewButton.style.marginTop = "10px";
    viewButton.style.padding = "13px";
    viewButton.style.cursor = "pointer";
    viewButton.style.width = "100%";
    viewButton.style.fontWeight = "bold";
    viewButton.href = "https://products.jbhifi.tech/product/" + pageSku;

    infoElement.appendChild(viewButton);

    viewButton.addEventListener('click', function() {
      console.log("View button clicked!");
      window.open(viewButton.href, "_blank");
    });

  }

  // Create a blank div line for spacing
    const blankDiv = document.createElement("div");
    blankDiv.style.height = "10px";
    infoElement.appendChild(blankDiv);

  // Add to the page :)
  pdpRight.insertBefore(infoElement, pdpRight.firstChild);

}



// Gets the SKU and PLU and saves to global variables
function getPageDetails() {

  // Get Sku
  pageSku = skuElement.textContent.split(':')[1].trim()
  console.log("Page SKU fetched: "+ pageSku);

  // Get PLU
  pagePlu = pluElement.textContent.split(':')[1].trim();
  console.log("Page PLU fetched: "+ pagePlu);

  return true;
}



// Checks the pages validity
function checkPageValidity() {

  // Check if barcodify settings are disabled, and if so, return false
  if (showBarcode || showProductAppButton || showIntInfo ||showSohData) { }
  else {
    return false;
  }


  // Stub function for later, assume page is valid for now :)

  return true;

}


// Creates the barcode element
function createBarcodeElement() {
  
  if (showBarcode) {

    // Create the element for the barcode to sit
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "barcode";
    pluElement.insertBefore(svg, pluElement.firstChild);

    // Call JsBarcode and generate the barcode
    JsBarcode("#barcode", pagePlu, {
      displayValue: false,
      margin: 0,
      height: 27
    });
    
    console.log("Barcode Created with PLU: " + pagePlu);

  }

}

// Function to extract the season code from the website. Add the dictionary definition
function getSeasonCode() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const targetScript = scripts.find(script => script.textContent.includes('product.metafields'));
  console.log("getSeasonCode() ran");

  if (targetScript) {

    // extract the value of "SeasonCode"
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



// Function to extract the warranty info from the website
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
function getInventoryData(apiSku, apiLocationId, stockDivInput) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'getInventoryData',
      apiSku: apiSku,
      apiLocationId: apiLocationId
    }, (response) => {
      if (response.success) {
        const inventoryData = response.data;
        console.log('getInventoryData: Inventory data loaded:', inventoryData);

        stockDivInput.innerHTML = "";

        // Apply grid styling to the container
        stockDivInput.style.display = "grid";
        stockDivInput.style.gridTemplateColumns = "1fr 1fr"; // 2 columns
        stockDivInput.style.gap = "5px 25px"; // Space between items
        stockDivInput.style.marginTop = "5px";

        function createSohItem(label, value, parentElement) {
          const infoElement = document.createElement("p");
          infoElement.innerHTML = `<span style="color: #666;">${label}:</span><span style="color: #000; margin-left: auto;">${value}</span>`;
          infoElement.style.margin = "0px";
          infoElement.style.padding = "0px 0";
          infoElement.style.display = "flex"; // Make it a flex container
          infoElement.style.justifyContent = "space-between"; // Push content to opposite ends
          parentElement.appendChild(infoElement);
          return infoElement;
        }

        createSohItem("Available SOH", inventoryData.SaleableSoh, stockDivInput);
        createSohItem("Total SOH", inventoryData.TotalSoh, stockDivInput);

        createSohItem("Repack", inventoryData.RepackQuantity, stockDivInput);
        createSohItem("Display", inventoryData.DisplayQuantity, stockDivInput);

        createSohItem("Purchase Order", inventoryData.OnPurchaseOrderQuantity, stockDivInput);
        createSohItem("Transfer In", inventoryData.PendingTransferInQuantity, stockDivInput);
        
        resolve(inventoryData);
      } else {
        console.error('Failed to fetch inventory:', response.error);
        stockDivInput.innerHTML = "An error occured.";
        reject(new Error(response.error));
      }
    });
  });
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














