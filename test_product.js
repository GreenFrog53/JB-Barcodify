
setInterval(() => {
    const elements = Array.from(document.getElementsByTagName('h3'));
    const hasJBProducts = elements.some(h3 => h3.textContent.trim() === "JB Products");

    if (hasJBProducts) {
        console.log('Search Page: True');
        generateBarcodes();
    } else {
        console.log('Search Page: False');
    }
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



