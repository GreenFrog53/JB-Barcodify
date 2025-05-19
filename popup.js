// Takes u to the login / switch user page
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') { // Check if the spacebar is pressed
        chrome.tabs.create({ url: 'https://m365.cloud.microsoft/login?es=Click&ru=%2Fapps%3Fhome%3D1%26acctsw%3D1&prompt=select_account' }); // redirect to sign in :)
    }
    else if (event.code === 'KeyM') { // Check if the M key is pressed
        chrome.tabs.create({ url: 'https://myapps.microsoft.com/' }); // redirect to sign in :)
    }
    else if (event.code === 'KeyP') { // Check if the P key is pressed
        chrome.tabs.create({ url: 'https://products.jbhifi.tech/' }); // redirect to product app :)
    }
    else if (event.code === 'KeyI') { // Check if the I key is pressed
        chrome.tabs.create({ url: 'http://intranet/' }); // redirect to intranet :)
    }
    else if (event.code === 'KeyS') { // Check if the S key is pressed
        chrome.tabs.create({ url: 'https://launcher.myapps.microsoft.com/api/signin/46749113-3e12-47a7-8971-b0eab9c2338f' }); // redirect to solvup :)
    }
    else if (event.code === 'KeyF') { // Check if the F key is pressed
        chrome.tabs.create({ url: 'http://fulfilment.jbhifi.tech/' }); // redirect to fulfilment :)
    }
    else if (event.code === 'KeyR') { // Check if the R key is pressed
        chrome.tabs.create({ url: 'https://receiptlookupprod.z26.web.core.windows.net/' }); // redirect to receipt lookup :)
    }

    else if (event.code === 'Slash' || event.code === '?') { // check if the slash key is pressed
        console.log('Key pressed!');
        const introducingContainer = document.querySelector('.introducing_container');
        if (introducingContainer) {
            const siblingDiv = document.createElement('div');
            siblingDiv.style.textAlign = 'center'; // Center the text
            siblingDiv.className = 'hidden_container'; // Add the class name
            
            const heading = document.createElement('h1');
            heading.textContent = "Testing";
            siblingDiv.appendChild(heading);

            const paragraph = document.createElement('p');
            paragraph.textContent = "Heyo, I'm testing some keyboard shortcuts, lemme know if you think they're useful. Please note you need to click on the extension icon first :)";
            siblingDiv.appendChild(paragraph);

            const paragraph2 = document.createElement('p');
            paragraph2.innerHTML = "<strong>Spacebar</strong> = Switch User";
            siblingDiv.appendChild(paragraph2);

            const paragraph4 = document.createElement('p');
            paragraph4.innerHTML = "<strong>M Key</strong> = Microsoft Application Launcher";
            siblingDiv.appendChild(paragraph4);

            const paragraph3 = document.createElement('p');
            paragraph3.innerHTML = "<strong>S Key</strong> = Solvup";
            siblingDiv.appendChild(paragraph3);

            const paragraph7 = document.createElement('p');
            paragraph7.innerHTML = "<strong>R Key</strong> = Receipt Lookup";
            siblingDiv.appendChild(paragraph7);

            const paragraph5 = document.createElement('p');
            paragraph5.innerHTML = "<strong>P Key</strong> = Product App";
            siblingDiv.appendChild(paragraph5);

            const paragraph6 = document.createElement('p');
            paragraph6.innerHTML = "<strong>F Key</strong> = Fulfilment App";
            siblingDiv.appendChild(paragraph6);

            introducingContainer.parentNode.insertBefore(siblingDiv, introducingContainer.nextSibling);
        }
    }


});


// Checkboxes for settings

const websiteToggleCheckbox = document.getElementById("website-toggle");
const productSearchToggle = document.getElementById("product-search");
const productListingToggle = document.getElementById("product-listing");

// Load settings from chrome local storage

chrome.storage.local.get(["websiteToggle"], (result) => { 
    if (result.websiteToggle === undefined) {
        // If the value does not exist, set it to true
        chrome.storage.local.set({ websiteToggle: true });
        websiteToggleCheckbox.checked = true;
    }
    else {
        websiteToggleCheckbox.checked = !!result.websiteToggle;
    }
});

chrome.storage.local.get(["productSearch"], (result) => { 
    if (result.productSearch === undefined) {
        // If the value does not exist, set it to false (as this feature is experimental)
        chrome.storage.local.set({ productSearch: false });
        productSearchToggle.checked = false;
    }
    else {
        productSearchToggle.checked = !!result.productSearch;
    }
});

chrome.storage.local.get(["productListing"], (result) => { 
    if (result.productListing === undefined) {
        // If the value does not exist, set it to true
        chrome.storage.local.set({ productListing: true });
        productListingToggle.checked = true;
    }
    else {
        productListingToggle.checked = !!result.productListing;
    }
});
    
    
    
  


// Event listeners that listen for changes

websiteToggleCheckbox.addEventListener("change", (event) => {
  chrome.storage.local.set({ websiteToggle: event.target.checked });
});

productSearchToggle.addEventListener("change", (event) => {
  chrome.storage.local.set({ productSearch: event.target.checked });
});

productListingToggle.addEventListener("change", (event) => {
  chrome.storage.local.set({ productListing: event.target.checked });
});