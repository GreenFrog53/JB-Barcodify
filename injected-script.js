(function() {


    // finds ean
    if (window.Product && window.Product.ean) {
        console.log("Product EAN:", window.Product.ean);
    } else {
        console.log("Product or EAN not found.");
    }

})();
