// 1. Listen for manual clicks on the Chrome Puzzle Piece
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(['spolyBotActive'], (result) => {
    const newState = !result.spolyBotActive;
    chrome.storage.local.set({ spolyBotActive: newState }, () => {
      const action = newState ? 'GLOBAL_OPEN' : 'GLOBAL_CLOSE';
      broadcastToAllTabs(action);
    });
  });
});

// 2. The Global Relay Server (Listens to the React App)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GLOBAL_CLOSE' || request.action === 'GLOBAL_OPEN') {
    const isActive = request.action === 'GLOBAL_OPEN';
    
    // Save state permanently
    chrome.storage.local.set({ spolyBotActive: isActive }, () => {
      broadcastToAllTabs(request.action);
    });
  } 
  else if (request.action === 'RECORDING_STARTED' || request.action === 'RECORDING_STOPPED') {
    broadcastToAllTabs(request.action);
  }
});

// 🚀 3. THE FORCE INJECTOR FUNCTION
function broadcastToAllTabs(action) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      // Security Check: Never inject into internal Chrome settings pages
      if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://') && !tab.url.startsWith('about:')) {
        
        // Attempt to send the signal
        chrome.tabs.sendMessage(tab.id, { action: action }).catch(() => {
          
          // ⚠️ If it FAILS, the tab is a "Ghost Tab" that needs the script!
          // If the command is to OPEN, force-inject the script right now.
          if (action === 'GLOBAL_OPEN') {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            }).then(() => {
              // Once injected, tell it to open immediately
              chrome.tabs.sendMessage(tab.id, { action: 'GLOBAL_OPEN' }).catch(() => {});
            }).catch(err => console.log("Cannot inject into strict security tab:", tab.url));
          }
          
        });

      }
    });
  });
}