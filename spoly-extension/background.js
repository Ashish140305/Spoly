chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(["spolyBotActive"], (result) => {
    const newState = !result.spolyBotActive;
    chrome.storage.local.set({ spolyBotActive: newState });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GLOBAL_CLOSE" || request.action === "GLOBAL_OPEN") {
    chrome.storage.local.set({
      spolyBotActive: request.action === "GLOBAL_OPEN",
    });
  } else if (request.action === "RECORDING_STARTED") {
    chrome.storage.local.set({ spolyRecordingLive: true });

    chrome.tabs.query({ url: "*://localhost:5173/*" }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true }, () => {
          setTimeout(
            () =>
              broadcastToAllTabs({
                action: "RECORDING_STARTED",
                title: request.title,
              }),
            300,
          );
        });
      } else {
        chrome.tabs.create({
          url: "http://localhost:5173/live?autoStart=true",
        });
        setTimeout(
          () =>
            broadcastToAllTabs({
              action: "RECORDING_STARTED",
              title: request.title,
            }),
          1500,
        );
      }
    });
  } else if (request.action === "REMOTE_CONTROL") {
    broadcastToAllTabs({ action: `REMOTE_${request.command}` });
  } else if (request.action === "PROCESS_CHUNK") {
    // 🚀 We now pass the specific Index to guarantee perfect chronological order
    broadcastToAllTabs({
      action: "RECEIVE_CHUNK",
      audioData: request.audioData,
      index: request.index,
    });
  } else if (request.action === "PROCESS_AND_SEND_AUDIO") {
    chrome.storage.local.set({ spolyRecordingLive: false });
    broadcastToAllTabs({ action: "RECORDING_STOPPED" });
  } else if (request.action === "RECORDING_STOPPED") {
    chrome.storage.local.set({ spolyRecordingLive: false });
    broadcastToAllTabs({ action: request.action });
  } else if (request.action === "SHOW_NOTIFICATION") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Spoly AI",
      message: request.message,
      priority: 2,
    });
  } else if (request.action === "SET_BADGE") {
    chrome.action.setBadgeText({ text: request.text });
    chrome.action.setBadgeBackgroundColor({ color: request.color });
  }
});

function broadcastToAllTabs(messageObj) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && !tab.url.startsWith("chrome://")) {
        chrome.tabs.sendMessage(tab.id, messageObj).catch(() => {});
      }
    });
  });

  async function fetchYouTubeTranscript(videoId) {
    try {
      // 1. Fetch the video page HTML
      const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
      const html = await res.text();

      // 2. Extract the hidden JSON data containing caption info
      const match = html.match(
        /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+meta|<\/script|\n)/,
      );
      if (!match)
        throw new Error(
          "Could not find video data. The video might be private or invalid.",
        );

      const playerResponse = JSON.parse(match[1]);
      const tracks =
        playerResponse?.captions?.playerCaptionsTracklistRenderer
          ?.captionTracks;

      if (!tracks || tracks.length === 0)
        throw new Error("This video does not have closed captions enabled.");

      // 3. Find the English track, or fallback to the first available track
      let track =
        tracks.find((t) => t.languageCode.startsWith("en")) || tracks[0];

      // 4. Fetch the actual XML subtitle data
      const xmlRes = await fetch(track.baseUrl);
      const xmlText = await xmlRes.text();

      // 5. Clean the XML into pure readable text
      const textMatch = xmlText.match(/<text[^>]*>(.*?)<\/text>/g);
      if (!textMatch) throw new Error("Could not parse the subtitle format.");

      const plainText = textMatch
        .map((t) => {
          // Remove XML tags and decode HTML entities
          return t
            .replace(/<[^>]+>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"');
        })
        .join(" ");

      return plainText;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Add this Listener INSIDE or AFTER your existing chrome.runtime.onMessage.addListener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // ... your existing listeners ...

    if (request.action === "FETCH_YT_TRANSCRIPT") {
      fetchYouTubeTranscript(request.videoId)
        .then((text) => sendResponse({ success: true, text: text }))
        .catch((err) => sendResponse({ success: false, error: err.message }));

      return true; // Required to tell Chrome we will answer asynchronously!
    }
  });
}
