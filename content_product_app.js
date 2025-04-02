// Code to be run on the product app page

entry();

// When a page change is detected
chrome.runtime.onMessage.addListener((message) => {
    entry();
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