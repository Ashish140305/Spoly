console.log("✅ Spoly Extension Connected! (Persistent Memory Active)");

if (!document.getElementById('spoly-extension-marker')) {
  const marker = document.createElement('div');
  marker.id = 'spoly-extension-marker';
  marker.style.display = 'none';
  document.body.appendChild(marker);
}

function injectNexusBot() {
  if (document.getElementById('spoly-fab-root')) {
    const panel = document.getElementById('spoly-fab-root').shadowRoot.getElementById('spoly-panel');
    panel.classList.toggle('open');
    return;
  }

  const host = document.createElement('div');
  host.id = 'spoly-fab-root';
  const startX = window.innerWidth - 100;
  const startY = window.innerHeight - 100;
  host.style.cssText = `position: fixed; left: ${startX}px; top: ${startY}px; z-index: 2147483647; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); touch-action: none;`;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; margin: 0; padding: 0; }
    
    .panel { display: none; width: 240px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1); padding: 14px; flex-direction: column; opacity: 0; transform: translateY(10px) scale(0.98); transform-origin: bottom right; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
    .panel.open { display: flex; opacity: 1; transform: translateY(0) scale(1); }
    
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .title-badge { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: 700; color: #60a5fa; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .close-btn { background: transparent; border: none; color: #64748b; cursor: pointer; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; transition: 0.2s; border-radius: 50%; }
    .close-btn:hover { background: rgba(255,255,255,0.1); color: white; }

    .visualizer { background: rgba(0,0,0,0.3); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.03); }
    .bars { display: flex; gap: 3px; height: 14px; align-items: center; }
    .bar { width: 3px; background: #4f46e5; border-radius: 2px; height: 20%; transition: height 0.2s ease; opacity: 0.6; }
    .panel.recording .bar { animation: bounceWave 0.8s ease-in-out infinite; background: #f43f5e; opacity: 1; box-shadow: 0 0 6px rgba(244,63,94,0.6); }
    .panel.recording .bar:nth-child(1) { animation-delay: 0.0s; } .panel.recording .bar:nth-child(2) { animation-delay: 0.1s; } .panel.recording .bar:nth-child(3) { animation-delay: 0.2s; } .panel.recording .bar:nth-child(4) { animation-delay: 0.3s; }
    
    .timer { font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important; font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; }
    .panel.recording .timer { color: #fca5a5; }

    .btn { width: 100%; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 12px; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; color: white; letter-spacing: 0.3px; }
    .btn-start { background: linear-gradient(135deg, #2563eb, #4f46e5); box-shadow: 0 4px 10px rgba(37,99,235,0.3), inset 0 1px 1px rgba(255,255,255,0.2); }
    .btn-start:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 14px rgba(37,99,235,0.4), inset 0 1px 1px rgba(255,255,255,0.2); }
    .btn-stop { background: linear-gradient(135deg, #dc2626, #9f1239); display: none; box-shadow: 0 4px 10px rgba(220,38,38,0.3), inset 0 1px 1px rgba(255,255,255,0.2); }
    .btn-stop:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 14px rgba(220,38,38,0.4), inset 0 1px 1px rgba(255,255,255,0.2); }

    .nexus-container { width: 60px; height: 60px; position: relative; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none;}
    .nexus-container:active { cursor: grabbing; }

    .orbital-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1.5px solid rgba(59, 130, 246, 0.1); border-top: 1.5px solid #3b82f6; border-right: 1.5px solid #8b5cf6; animation: spin 4s linear infinite; transition: all 0.3s ease; }
    .orbital-ring-inner { position: absolute; width: 75%; height: 75%; border-radius: 50%; border: 1px dashed rgba(139, 92, 246, 0.4); animation: spin-reverse 6s linear infinite; transition: all 0.3s ease; }
    .nexus-core { position: relative; width: 40px; height: 40px; border-radius: 50%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); box-shadow: inset 0 0 12px rgba(59,130,246,0.3); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; pointer-events: none;}
    .spark { width: 12px; height: 12px; background: linear-gradient(135deg, #60a5fa, #a78bfa); transform: rotate(45deg); box-shadow: 0 0 10px #8b5cf6; border-radius: 2px; animation: breathe 3s ease-in-out infinite; transition: all 0.3s; }

    .nexus-container:hover .nexus-core { transform: scale(1.05); }
    
    .nexus-container.recording .orbital-ring { border-top-color: #ef4444; border-right-color: #f43f5e; animation: spin 1s linear infinite; }
    .nexus-container.recording .orbital-ring-inner { border-color: rgba(244, 63, 94, 0.6); animation: spin-reverse 1.5s linear infinite; }
    .nexus-container.recording .nexus-core { background: rgba(69, 10, 10, 0.9); box-shadow: inset 0 0 20px rgba(239,68,68,0.5); border-color: rgba(239,68,68,0.4); }
    .nexus-container.recording .spark { width: 14px; height: 14px; border-radius: 50%; background: #fca5a5; transform: rotate(0); box-shadow: 0 0 15px #ef4444; animation: heartBeat 0.8s ease-in-out infinite alternate; }

    @keyframes spin { 100% { transform: rotate(360deg); } } @keyframes spin-reverse { 100% { transform: rotate(-360deg); } } @keyframes breathe { 0%, 100% { transform: rotate(45deg) scale(1); } 50% { transform: rotate(45deg) scale(1.2); } } @keyframes heartBeat { 0% { transform: scale(0.8); } 100% { transform: scale(1.3); } } @keyframes bounceWave { 0%, 100% { height: 20%; } 50% { height: 90%; } }
  `;
  shadow.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex'; wrapper.style.flexDirection = 'column'; wrapper.style.alignItems = 'flex-end'; wrapper.style.gap = '12px';
  wrapper.innerHTML = `
    <div class="panel" id="spoly-panel">
      <div class="header">
        <div class="title-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Spoly AI</div>
        <button class="close-btn" id="close-panel"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg></button>
      </div>
      <div class="visualizer" id="visualizerBox"><div class="bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div><span class="timer" id="timerDisplay">Ready</span></div>
      <button class="btn btn-start" id="startBtn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> Capture Audio</button>
      <button class="btn btn-stop" id="stopBtn"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect width="16" height="16" x="4" y="4" rx="3"/></svg> Stop & Save</button>
    </div>
    <div class="nexus-container" id="nexus-trigger"><div class="orbital-ring"></div><div class="orbital-ring-inner"></div><div class="nexus-core"><div class="spark"></div></div></div>
  `;
  shadow.appendChild(wrapper);

  const panel = shadow.getElementById('spoly-panel');
  const nexusTrigger = shadow.getElementById('nexus-trigger');
  const startBtn = shadow.getElementById('startBtn');
  const stopBtn = shadow.getElementById('stopBtn');
  const timerDisplay = shadow.getElementById('timerDisplay');
  const closePanelBtn = shadow.getElementById('close-panel');

  let mediaRecorder = null; let audioChunks = []; let timerInterval = null; let seconds = 0;
  const formatTime = (sec) => { const m = Math.floor(sec / 60).toString().padStart(2, '0'); const s = (sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; };

  // ==========================================
  // 🛡️ OFFSET DRAG LOGIC
  // ==========================================
  let isDragging = false, hasMoved = false;
  let dragOffsetX = 0, dragOffsetY = 0;

  nexusTrigger.ondragstart = () => false;

  nexusTrigger.onpointerdown = (e) => {
    isDragging = true; hasMoved = false;
    const rect = host.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    host.style.transition = 'none'; 
    nexusTrigger.setPointerCapture(e.pointerId);
  };

  nexusTrigger.onpointermove = (e) => {
    if (!isDragging) return;
    if (Math.abs(e.movementX) > 1 || Math.abs(e.movementY) > 1) hasMoved = true;
    let newLeft = e.clientX - dragOffsetX;
    let newTop = e.clientY - dragOffsetY;
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - host.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - host.offsetHeight));
    host.style.left = `${newLeft}px`;
    host.style.top = `${newTop}px`;
  };

  nexusTrigger.onpointerup = (e) => {
    isDragging = false;
    nexusTrigger.releasePointerCapture(e.pointerId);
  };

  // LOGIC
  nexusTrigger.addEventListener('click', () => { if (!hasMoved) panel.classList.toggle('open'); });
  closePanelBtn.onclick = () => panel.classList.remove('open');

  startBtn.onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (stream.getAudioTracks().length === 0) { alert("⚠️ Toggle ON 'Also share tab audio'!"); stream.getTracks().forEach(t => t.stop()); return; }
      mediaRecorder = new MediaRecorder(new MediaStream([stream.getAudioTracks()[0]]), { mimeType: 'audio/webm' });
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(audioChunks, { type: 'audio/webm' })); a.download = `Spoly_${Date.now()}.webm`; a.click(); audioChunks = [];
        chrome.runtime.sendMessage({ action: 'RECORDING_STOPPED' });
        nexusTrigger.classList.remove('recording'); panel.classList.remove('recording');
        startBtn.style.display = 'flex'; stopBtn.style.display = 'none'; timerDisplay.textContent = "Ready"; clearInterval(timerInterval);
        panel.classList.remove('open');
      };
      mediaRecorder.start();
      chrome.runtime.sendMessage({ action: 'RECORDING_STARTED' });
      nexusTrigger.classList.add('recording'); panel.classList.add('recording');
      startBtn.style.display = 'none'; stopBtn.style.display = 'flex'; setTimeout(() => panel.classList.remove('open'), 1000);
      seconds = 0; timerDisplay.textContent = "00:00"; timerInterval = setInterval(() => { seconds++; timerDisplay.textContent = formatTime(seconds); }, 1000);
    } catch (err) { console.error("Capture error:", err); }
  };
  stopBtn.onclick = () => { if (mediaRecorder) mediaRecorder.stop(); };

  // Tell React we are ALIVE
  window.postMessage({ type: 'SPOLY_WIDGET_STATUS', status: true }, '*');
}

// ==========================================
// GLOBAL EVENT LISTENERS
// ==========================================

// React App -> Content Script
window.addEventListener('message', (e) => { 
  if (e.data.type === 'SPOLY_TOGGLE_WIDGET') {
    const isDeployed = !!document.getElementById('spoly-fab-root');
    chrome.runtime.sendMessage({ action: isDeployed ? 'GLOBAL_CLOSE' : 'GLOBAL_OPEN' });
  }
});

// Background Script -> Content Script -> React App
chrome.runtime.onMessage.addListener((req) => { 
  if (req.action === 'GLOBAL_CLOSE') {
    const existingBot = document.getElementById('spoly-fab-root');
    if (existingBot) {
      existingBot.remove();
      window.postMessage({ type: 'SPOLY_WIDGET_STATUS', status: false }, '*');
    }
  }
  else if (req.action === 'GLOBAL_OPEN') {
    injectNexusBot();
  }
  else if (req.action === 'RECORDING_STARTED') {
    window.postMessage({ type: 'SPOLY_RECORDING_STARTED' }, '*'); 
  }
  else if (req.action === 'RECORDING_STOPPED') {
    window.postMessage({ type: 'SPOLY_RECORDING_STOPPED' }, '*'); 
  }
});

// ==========================================
// 💾 SMART AUTO-INJECTOR (Reads persistent memory)
// ==========================================
if (!window.location.href.startsWith('chrome')) { 
  // Ask the background script if the user wants the bot on
  chrome.storage.local.get(['spolyBotActive'], (result) => {
    // ONLY inject if the saved state is explicitly true
    if (result.spolyBotActive === true) {
      setTimeout(() => { 
        if (document.readyState === 'complete') injectNexusBot(); 
        else window.addEventListener('load', injectNexusBot); 
      }, 500);
    }
  });
}