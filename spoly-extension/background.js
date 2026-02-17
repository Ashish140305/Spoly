// 1. Listen for you clicking the extension icon to spawn the bot manually
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "toggle_widget" });
});

// 2. The Global Relay Server (Cross-Tab Communication)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "RECORDING_STARTED" || request.action === "RECORDING_STOPPED") {
    // Broadcast this exact signal to EVERY open tab
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, request).catch(() => {}); // Catch prevents errors on tabs that don't have the script
      });
    });
  }
});