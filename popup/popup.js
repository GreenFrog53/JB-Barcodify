// Get version from manifest for the little heading :)
function updateVersionDisplay() {
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;
    
    const versionSpan = document.querySelector('h1 span');
    if (versionSpan) {
        versionSpan.textContent = `v${version}`;
    }
}

document.addEventListener('DOMContentLoaded', updateVersionDisplay);



// Function to manage redirects
function redirect(site) {

    if (site == "switch-user") {
        chrome.tabs.create({ url: 'https://m365.cloud.microsoft/login?es=Click&ru=%2Fapps%3Fhome%3D1%26acctsw%3D1&prompt=select_account' }); // redirect to sign in :)
    }
    else if (site == "my-apps") {
        chrome.tabs.create({ url: 'https://myapps.microsoft.com/' }); // redirect to sign in :)
    }
    else if (site == "solvup") {
        chrome.tabs.create({ url: 'https://launcher.myapps.microsoft.com/api/signin/46749113-3e12-47a7-8971-b0eab9c2338f' }); // redirect to solvup :)
    }
    else if (site == "receipt-lookup") {
        chrome.tabs.create({ url: 'https://receiptlookupprod.z26.web.core.windows.net/' }); // redirect to receipt lookup :)
    }
    else if (site == "product-app") {
        chrome.tabs.create({ url: 'https://products.jbhifi.tech/' }); // redirect to product app :)
    }
    else if (site == "fulfilment-app") {
        chrome.tabs.create({ url: 'http://fulfilment.jbhifi.tech/' }); // redirect to fulfilment :)
    }
    else if (site == "intranet") {
        chrome.tabs.create({ url: 'http://intranet/' }); // redirect to intranet :)
    }
    else if (site == "zendesk") {
        chrome.tabs.create({ url: 'https://launcher.myapps.microsoft.com/api/signin/63028bf6-ee9d-44dc-bfd2-fe8382a2dd27?tenantId=9a40006c-780f-4b23-84f0-61950e9f1cca' }); // redirect to zendesk :)
    }
    else if (site == "backstage") {
        chrome.tabs.create({ url: 'https://jbhifi.sharepoint.com/sites/Backstage/Pages/Home.aspx' }); // redirect to backstage :)
    }
    else if (site == "t2w") {
        chrome.tabs.create({ url: 'https://jbhifi.time2work.com/' }); // redirect to time2work :)
    }
    // Hopefully these don't need to much updating :)

}


// Event Listener for when shortcut keys are pressed
document.addEventListener('keydown', function(event) {

    if (event.code === 'Space') { // Check if the spacebar is pressed
        redirect("switch-user");
    }
    else if (event.code === 'KeyM') { // Check if the M key is pressed
        redirect("my-apps");
    }
    else if (event.code === 'KeyP') { // Check if the P key is pressed
        redirect("product-app");
    }
    else if (event.code === 'KeyI') { // Check if the I key is pressed
        redirect("intranet");
    }
    else if (event.code === 'KeyS') { // Check if the S key is pressed
        redirect("solvup");
    }
    else if (event.code === 'KeyF') { // Check if the F key is pressed
        redirect("fulfilment-app");
    }
    else if (event.code === 'KeyR') { // Check if the R key is pressed
        redirect("receipt-lookup");
    }
    else if (event.code === 'KeyZ') { // Check if the Z key is pressed
        redirect("zendesk");
    }
    else if (event.code === 'KeyB') { // Check if the B key is pressed
        redirect("backstage");
    }
    else if (event.code === 'KeyT') { // Check if the t key is pressed
        redirect("t2w");
    }

    // Following should be removed in future

    else if (event.code === 'Slash' || event.code === '?') { // check if the slash key is pressed for testing purposes
        console.log('Key pressed!');
        websiteStockCheckbox.disabled = false;
        websiteLocationTextbox.disabled = false;
    }


});


// Checkboxes for settings

const websiteBarcodesCheckbox = document.getElementById("website-barcodes");
const websiteButtonCheckbox = document.getElementById("website-button");
const websiteExtraCheckbox = document.getElementById("website-extra");
const websiteStockCheckbox = document.getElementById("website-stock");
const websiteLocationTextbox = document.getElementById("website-location");

const productListingToggle = document.getElementById("product-listing");
const productSearchToggle = document.getElementById("product-search");
const productListingHideToggle = document.getElementById("product-listing-hide");

// Load settings from chrome local storage

chrome.storage.local.get(["websiteBarcodes"], (result) => { 
    if (result.websiteBarcodes === undefined) {
        // If the value does not exist, set it to true
        chrome.storage.local.set({ websiteBarcodes: true });
        websiteBarcodesCheckbox.checked = true;
    }
    else {
        websiteBarcodesCheckbox.checked = !!result.websiteBarcodes;
    }
});

chrome.storage.local.get(["websiteButton"], (result) => { 
    if (result.websiteButton === undefined) {
        // If the value does not exist, set it to true
        chrome.storage.local.set({ websiteButton: true });
        websiteButtonCheckbox.checked = true;
    }
    else {
        websiteButtonCheckbox.checked = !!result.websiteButton;
    }
});

chrome.storage.local.get(["websiteExtra"], (result) => { 
    if (result.websiteExtra === undefined) {
        // If the value does not exist, set it to false
        chrome.storage.local.set({ websiteExtra: false });
        websiteExtraCheckbox.checked = false;
    }
    else {
        websiteExtraCheckbox.checked = !!result.websiteExtra;
    }
});

chrome.storage.local.get(["websiteStock"], (result) => { 
    if (result.websiteStock === undefined) {
        // If the value does not exist, set it to false
        chrome.storage.local.set({ websiteStock: false });
        websiteStockCheckbox.checked = false;
    }
    else if (result.websiteStock === true){
        websiteStockCheckbox.checked = !!result.websiteStock;
        websiteStockCheckbox.disabled = false; // to be removed once testing phase is complete
        websiteLocationTextbox.disabled = false; // to be removed once testing phase is complete
    }
    else {
        websiteStockCheckbox.checked = !!result.websiteStock;
    }
});

chrome.storage.local.get(["websiteLocation"], (result) => { 
    if (result.websiteLocation === undefined) {
        // Do nothing :)
    }
    else {
        websiteLocationTextbox.value = result.websiteLocation;
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

chrome.storage.local.get(["productListingHide"], (result) => { 
    if (result.productListingHide === undefined) {
        // If the value does not exist, set it to false
        chrome.storage.local.set({ productListingHide: false });
        productListingHideToggle.checked = false;
    }
    else {
        productListingHideToggle.checked = !!result.productListingHide;
    }
});
    
// Event listeners that listen for changes

websiteBarcodesCheckbox.addEventListener("change", (event) => {
  chrome.storage.local.set({ websiteBarcodes: event.target.checked });
});

websiteButtonCheckbox.addEventListener("change", (event) => {
  chrome.storage.local.set({ websiteButton: event.target.checked });
});

websiteExtraCheckbox.addEventListener("change", (event) => {
  chrome.storage.local.set({ websiteExtra: event.target.checked });
});

websiteStockCheckbox.addEventListener("change", (event) => {
  chrome.storage.local.set({ websiteStock: event.target.checked });
});

websiteLocationTextbox.addEventListener("input", (event) => {
    const value = event.target.value.trim();
    if (value === "") {
        chrome.storage.local.remove("websiteLocation");
    } else {
        chrome.storage.local.set({ websiteLocation: value });
    }
});



productListingToggle.addEventListener("change", (event) => {
  chrome.storage.local.set({ productListing: event.target.checked });
});

productSearchToggle.addEventListener("change", (event) => {
  chrome.storage.local.set({ productSearch: event.target.checked });
});

productListingHideToggle.addEventListener("change", (event) => {
  chrome.storage.local.set({ productListingHide: event.target.checked });
});



// Make the tabs work sir

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});


// Make the shortcut buttons work sirrrr

const shortcutButtons = document.querySelectorAll('.shortcut-button');
shortcutButtons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonId = this.id;
        redirect(buttonId);
    });
});