
const intervalId = setInterval(() => {
    const elements = Array.from(document.getElementsByTagName('h3'));
    const hasJBProducts = elements.some(h3 => h3.textContent.trim() === "JB Products");

    

    chrome.storage.local.get(["productSearch", "productListing"], (result) => {
        if (result.productSearch === false && result.productListing === false) {
            console.log("JB Barcodify: Both productSearch and productListing are false.");
            clearInterval(intervalId); // Stop the interval as there is no point looking for anything, as the settings are false
        }
        else {
            // display an info message inside of the product app
            const mainMessage = document.querySelector('.css-1hk9k3n, .css-1gf9cnm');
            const myMessage = document.querySelector('.existingMessage');
            if (mainMessage && !myMessage) {
                const newDiv = document.createElement('p');
                newDiv.textContent = 'JB Barcodify technology inside. If rendering issues occur, please disable the Product App options in the JB Barcodify extension menu.';
                newDiv.classList.add('existingMessage');
                newDiv.style.textAlign = 'center';
                newDiv.style.color = 'grey'; 
                mainMessage.parentNode.insertBefore(newDiv, mainMessage);
            }
        } 
    });


    


    // check settings
    chrome.storage.local.get(["productSearch"], (result) => { 
        if (result.productSearch === undefined) {
            console.log("JB Barcodify: The barcodes will not be displayed, as the productSearch setting has not been set.");
        }
        else if (result.productSearch === true){
            console.log("JB Barcodify: The barcodes will be displayed, as the productSearch setting is true.");

            if (hasJBProducts) {
                console.log('Search Page: True');
                generateBarcodes();
            } else {
                console.log('Search Page: False');
            }

        }
        else {
            console.log("JB Barcodify: The barcodes will not be displayed, as the productSearch setting is false.");
        }
    });
}, 1000);


function generateBarcodes() {
    document.querySelectorAll("div").forEach(div => {
        const strong = div.querySelector("strong");
        if (strong && strong.textContent.trim() === "Sku:") {
            const skuNumber = strong.nextSibling.textContent.trim();
            if (/^\d+$/.test(skuNumber)) {
                
                // Check if the barcode already exists
                if (!document.querySelector(`#barcode-${skuNumber}`)) {
                    // Create SVG barcode element
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.id = "barcode-" + skuNumber;
                    strong.parentNode.parentNode.insertBefore(svg, strong.previousSibling);
                    
                    JsBarcode("#" + svg.id, skuNumber, {
                        displayValue: false,
                        margin: 0,
                        height: 27
                    });
                }    
            }
        }
    });
}



