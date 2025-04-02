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
  