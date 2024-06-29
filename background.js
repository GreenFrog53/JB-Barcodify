chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.startsWith("https://www.jbhifi.com.au")) {
      chrome.tabs.sendMessage(tabId, { url: changeInfo.url });
    }
  });
  