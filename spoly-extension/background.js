chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(['spolyBotActive'], (result) => {
    const newState = !result.spolyBotActive;
    chrome.storage.local.set({ spolyBotActive: newState });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GLOBAL_CLOSE' || request.action === 'GLOBAL_OPEN') {
    chrome.storage.local.set({ spolyBotActive: request.action === 'GLOBAL_OPEN' });
  }
  else if (request.action === 'RECORDING_STARTED') {
    chrome.storage.local.set({ spolyRecordingLive: true });

    chrome.tabs.query({ url: "*://localhost:5173/*" }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true }, () => {
          setTimeout(() => broadcastToAllTabs({ action: 'RECORDING_STARTED', title: request.title }), 300);
        });
      } else {
        chrome.tabs.create({ url: "http://localhost:5173/live?autoStart=true" });
        setTimeout(() => broadcastToAllTabs({ action: 'RECORDING_STARTED', title: request.title }), 1500);
      }
    });
  }
  else if (request.action === 'REMOTE_CONTROL') {
    broadcastToAllTabs({ action: `REMOTE_${request.command}` });
  }
  else if (request.action === 'PROCESS_CHUNK') {
    // 🚀 We now pass the specific Index to guarantee perfect chronological order
    broadcastToAllTabs({ action: 'RECEIVE_CHUNK', audioData: request.audioData, index: request.index });
  }
  else if (request.action === 'PROCESS_AND_SEND_AUDIO') {
    chrome.storage.local.set({ spolyRecordingLive: false });
    broadcastToAllTabs({ action: 'RECORDING_STOPPED' });
  }
  else if (request.action === 'RECORDING_STOPPED') {
    chrome.storage.local.set({ spolyRecordingLive: false });
    broadcastToAllTabs({ action: request.action });
  }
  else if (request.action === 'SHOW_NOTIFICATION') {
    chrome.notifications.create({ type: 'basic', iconUrl: 'icon.png', title: 'Spoly AI', message: request.message, priority: 2 });
  }
  else if (request.action === 'SET_BADGE') {
    chrome.action.setBadgeText({ text: request.text });
    chrome.action.setBadgeBackgroundColor({ color: request.color });
  }
});

function broadcastToAllTabs(messageObj) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && !tab.url.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tab.id, messageObj).catch(() => { });
      }
    });
  });
}