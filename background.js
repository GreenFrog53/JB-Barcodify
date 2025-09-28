chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.startsWith("https://www.jbhifi.com.au")) {
    console.log("page change detected for main");
    chrome.tabs.sendMessage(tabId, { url: changeInfo.url });
  }
  if (changeInfo.url && changeInfo.url.startsWith("https://www.jbhifi.co.nz")) {
    console.log("page change detected for main");
    chrome.tabs.sendMessage(tabId, { url: changeInfo.url });
  }
  if (changeInfo.url && changeInfo.url.startsWith("https://products.jbhifi.tech")) {
    console.log("page change detected for products");
    chrome.tabs.sendMessage(tabId, { url: changeInfo.url });
  }
});
  
// Handle inventory data requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getInventoryData') {
    const { apiSku, apiLocationId } = request;
    const apiUrl = "https://api-lb01.jbhifi.com.au/InventoryApi/api/Detail?";
    
    fetch(apiUrl + "sku=" + apiSku + "&locationId=" + apiLocationId + "&time=" + Math.floor(Date.now() / 1000))
      .then(response => {
        if (!response.ok) {
          throw new Error(`getInventoryData: HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
      })
      .then(data => {
        console.log('Background: Inventory data loaded:', data[0]);
        sendResponse({ success: true, data: data[0] });
      })
      .catch(error => {
        console.error('Background: Failed to fetch inventory:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep the message channel open for async response
  }
});