// Code to be run on the product app page

let hidePrice = false;


// check settings
chrome.storage.local.get(["productListing"], (result) => { 
    if (result.productListing === undefined) {
        entry();
        console.log("JB Barcodify: The barcode will be displayed, as the productListing setting has not been set.");
    }
    else if (result.productListing === true){
        entry();
        console.log("JB Barcodify: The barcode will be displayed, as the productListing setting is true.");
    }
    else {
        console.log("JB Barcodify: The barcode will not be displayed, as the productListing setting is false.");
    }
});

chrome.storage.local.get(["productListingHide"], (result) => { 
    if (result.productListingHide === undefined) {
        console.log("JB Barcodify: Prices will not be hidden, as the productListingHide setting has not been set.");
    }
    else if (result.productListingHide === true){
        hidePrice = true;
        console.log("JB Barcodify: Prices will be hidden, as the productListingHide setting is true.");
    }
    else {
        console.log("JB Barcodify: Prices will not be hidden, as the productListingHide setting is false.");
    }
});




// When a page change is detected
chrome.runtime.onMessage.addListener((message) => {
    
    // check settings
    chrome.storage.local.get(["productListing"], (result) => { 
        if (result.productListing === undefined) {
            entry();
            console.log("JB Barcodify: The barcode will be displayed, as the productListing setting has not been set.");
        }
        else if (result.productListing === true){
            entry();
            console.log("JB Barcodify: The barcode will be displayed, as the productListing setting is true.");
        }
        else {
            console.log("JB Barcodify: The barcode will not be displayed, as the productListing setting is false.");
        }
      });
});



function entry() {
    // Check if we are at the right URL to make a barcode.
    if (window.location.hostname === 'products.jbhifi.tech' && 
        (window.location.pathname.startsWith('/au/product/') || window.location.pathname.startsWith('/nz/product/'))) {
            
        // Check if PLU element exists and repeat check until it exists

        const interval = setInterval(() => {
            const pluElement = grabPluElement();
            if (pluElement) {
                clearInterval(interval);
                console.log('JB Barcodify Debug: PLU Element Exists!');

                // The Plu Element exists, now lets create a barcode

                // Get the PLU in a text form
                const currentPlu = pluElement.textContent.replace('PLU:', '').trim();

                // Generate the PLU
                createBarcode(pluElement, currentPlu);

                // Hide prices
                if (hidePrice) {

                    // Find elements and add a class to them
                    hidePriceElements();
                    // Add css with said elements
                    addPriceHidingStyles();

                }
                

            }
            else{
                console.log("plu element not found, retrying.")
            }
        }, 300);
    }
}



function grabPluElement() {
    // Select the PLU element and ensure it contains "PLU:"
    const elements = document.querySelectorAll('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-sm-12.css-h719to');
    let pluElement = null;
    elements.forEach(element => {
        if (element.textContent.includes('PLU:')) {
            pluElement = element;
        }
    });
    if (pluElement) {
        const pluText = pluElement.textContent.replace('PLU:', '').trim();
    }
    return pluElement;
}


function createBarcode(pluElement, currentPlu) {
    
    // check if barcode alredy exists
    if (document.getElementById('barcode')) {
        
        JsBarcode("#barcode", currentPlu, {
            displayValue: false,
            margin: 0,
            height: 27
          });
        
        return;
    }
    else {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "barcode";
        pluElement.parentNode.insertBefore(svg, pluElement);

        JsBarcode("#barcode", currentPlu, {
            displayValue: false,
            margin: 0,
            height: 27
          });
    }   
}


function hidePriceElements() {
    // Find all price elements
    const priceElements = document.querySelectorAll('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-6.MuiGrid-grid-md-4.MuiGrid-grid-lg-6.css-h3531k');
    
    priceElements.forEach(element => {
        // Check if it contains a price (starts with $)
        if (element.textContent.trim().startsWith('$')) {
            element.classList.add('price-hidden');
        }
    });
}

function addPriceHidingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .price-hidden {
            position: relative;
            cursor: pointer;
            border-radius: 4px;
        }

        .price-hidden::before {
            content: 'Hover to reveal';
            position: absolute;
            top: 0;
            left: 0;
            width: 85%;
            height: 85%;
            background-color: #ebebebff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #000000ff;
            transition: opacity 0.3s ease;
            borderRadius: 5px;
        }

        .price-hidden:hover::before {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
}