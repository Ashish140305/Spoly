console.log("✅ Spoly Extension Connected! (Persistent Smart Timer Active)");

if (!document.getElementById('spoly-extension-marker')) {
  const marker = document.createElement('div');
  marker.id = 'spoly-extension-marker';
  marker.style.display = 'none';
  document.body.appendChild(marker);
}

let isDragging = false;
let hostElem = null;
let isMasterTab = false; 
let remoteTimerInterval = null; 

function injectNexusBot() {
  if (document.getElementById('spoly-fab-root')) {
    const wrapper = document.getElementById('spoly-fab-root').shadowRoot.getElementById('widget-wrapper');
    chrome.storage.local.set({ spolyPanelOpen: true });
    wrapper.classList.add('open');
    return;
  }

  const host = document.createElement('div');
  host.id = 'spoly-fab-root';
  hostElem = host;
  
  let startX = window.innerWidth - 80;
  let startY = Math.max(0, (window.innerHeight / 2) - 30);
  
  host.style.cssText = `position: fixed; left: ${startX}px; top: ${startY}px; z-index: 2147483647; width: 60px; height: 60px; touch-action: none;`;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; margin: 0; padding: 0; }
    
    .wrapper { position: relative; width: 60px; height: 60px; }
    
    .panel { 
        display: none; position: absolute; width: 110px; height: max-content; 
        background: rgba(24, 24, 27, 0.95); backdrop-filter: blur(20px); 
        border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 36px; 
        box-shadow: 0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05); 
        padding: 16px; flex-direction: column; align-items: center; gap: 16px; 
        
        opacity: 0; transform: scaleY(0.4) scaleX(0.8); 
        transition: opacity 0.2s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); 
        z-index: 20; pointer-events: none; 
    }
    
    .wrapper.open .panel { 
        display: flex; opacity: 1; transform: scaleY(1) scaleX(1); pointer-events: auto; 
    }
    
    .header { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin: 0; }
    .header-title { display: none; }
    .icon-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05); color: #9ca3af; cursor: pointer; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; transition: 0.2s; border-radius: 50%; }
    .icon-btn:hover { background: rgba(255,255,255,0.15); color: white; }

    .visualizer { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; }
    .bars { display: flex; gap: 4px; height: 16px; align-items: center; }
    .bar { width: 3px; background: #555; border-radius: 4px; height: 20%; transition: height 0.15s ease, background 0.3s ease, box-shadow 0.3s ease; opacity: 0.8; }
    
    /* 🚀 DUAL COLOR VISUALIZER STYLES */
    .wrapper.recording .bar { animation: bounceWave 0.8s ease-in-out infinite; background: #ef4444; opacity: 1; box-shadow: 0 0 8px rgba(239,68,68,0.4); }
    .wrapper.recording.speaker-mic .bar { background: #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.6); }
    .wrapper.recording.speaker-sys .bar { background: #a855f7; box-shadow: 0 0 10px rgba(168,85,247,0.6); }
    
    .wrapper.recording .bar:nth-child(1) { animation-delay: 0.0s; } .wrapper.recording .bar:nth-child(2) { animation-delay: 0.1s; } .wrapper.recording .bar:nth-child(3) { animation-delay: 0.2s; } .wrapper.recording .bar:nth-child(4) { animation-delay: 0.3s; }
    .wrapper.paused .bar { animation: none; height: 4px; background: #f59e0b; opacity: 1; box-shadow: none; }
    
    .timer { font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important; font-size: 13px; font-weight: 600; color: #808080; text-align: center; letter-spacing: 0.5px; }
    .wrapper.recording .timer { color: #f87171; font-weight: 700; }
    .wrapper.paused .timer { color: #fbbf24; animation: blinkWarning 1.5s infinite; font-weight: 700; }

    .action-buttons { 
        display: none; 
        grid-template-columns: 1fr 1fr; 
        gap: 8px; 
        width: 100%; 
        justify-items: center; 
        position: relative; z-index: 50; 
    }
    .wrapper.recording .action-buttons, .wrapper.paused .action-buttons { display: grid; }
    .wrapper.recording #startBtn, .wrapper.paused #startBtn { display: none; }
    
    .btn { cursor: pointer; border: none; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; color: white; position: relative; z-index: 50; pointer-events: auto; }
    
    .btn .btn-text { display: none; } 
    .btn svg { pointer-events: none; width: 16px; height: 16px; }

    .btn-start { background: linear-gradient(135deg, #2563eb, #4f46e5); box-shadow: 0 4px 12px rgba(37,99,235,0.4); width: 64px; height: 64px; align-self: center; border-radius: 50%; }
    .btn-start svg { width: 24px; height: 24px; }
    
    .btn-send { background: linear-gradient(135deg, #7c3aed, #6d28d9); box-shadow: 0 4px 12px rgba(124,58,237,0.3); }
    .btn-pause, .btn-stop, .btn-mute, .btn-resume { background: rgba(255, 255, 255, 0.08); color: #d1d5db; border: 1px solid rgba(255,255,255,0.05); }
    .btn-pause:hover, .btn-stop:hover, .btn-mute:hover { background: rgba(255, 255, 255, 0.15); color: white; }
    
    .btn-resume { background: linear-gradient(135deg, #d97706, #b45309); color: white; border: none; box-shadow: 0 4px 12px rgba(217,119,6,0.3); }
    .btn-stop:hover { background: #dc2626; border-color: transparent; box-shadow: 0 4px 12px rgba(220,38,38,0.3); }
    .btn-mute.muted { background: linear-gradient(135deg, #e11d48, #be123c); color: white; border: none; box-shadow: 0 4px 12px rgba(225,29,72,0.3); }
    
    .btn:active { transform: scale(0.9); }

    .nexus-container { width: 60px; height: 60px; position: absolute; top: 0; left: 0; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none; z-index: 30;}
    .nexus-container:active { cursor: grabbing; }
    .orbital-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1.5px solid rgba(255, 255, 255, 0.05); border-top: 1.5px solid #4f46e5; border-right: 1.5px solid #7c3aed; animation: spin 4s linear infinite; transition: all 0.3s ease; }
    .orbital-ring-inner { position: absolute; width: 75%; height: 75%; border-radius: 50%; border: 1px dashed rgba(255, 255, 255, 0.15); animation: spin-reverse 6s linear infinite; transition: all 0.3s ease; }
    .nexus-core { position: relative; width: 40px; height: 40px; border-radius: 50%; background: #1e1e22; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; pointer-events: none;}
    .spark { width: 10px; height: 10px; background: linear-gradient(135deg, #a78bfa, #c084fc); transform: rotate(45deg); box-shadow: 0 0 10px #a78bfa; border-radius: 2px; animation: breathe 3s ease-in-out infinite; }

    .wrapper.recording .orbital-ring { border-top-color: #ef4444; border-right-color: #f43f5e; animation: spin 1s linear infinite; }
    .wrapper.recording .orbital-ring-inner { border-color: rgba(244, 63, 94, 0.4); animation: spin-reverse 1.5s linear infinite; }
    .wrapper.recording .nexus-core { box-shadow: inset 0 0 15px rgba(239,68,68,0.3), 0 4px 12px rgba(0,0,0,0.5); border-color: rgba(239,68,68,0.4); }
    .wrapper.recording .spark { border-radius: 50%; background: #fca5a5; transform: rotate(0); box-shadow: 0 0 12px #ef4444; animation: heartBeat 0.8s ease-in-out infinite alternate; }

    .wrapper.paused .orbital-ring { border-top-color: #f59e0b; border-right-color: #d97706; animation: spin 4s linear infinite; }
    .wrapper.paused .orbital-ring-inner { border-color: rgba(245, 158, 11, 0.3); animation: spin-reverse 5s linear infinite; }
    .wrapper.paused .nexus-core { box-shadow: inset 0 0 15px rgba(245,158,11,0.3), 0 4px 12px rgba(0,0,0,0.5); border-color: rgba(245,158,11,0.4); }
    .wrapper.paused .spark { border-radius: 50%; background: #fde68a; transform: rotate(0); box-shadow: 0 0 12px #fbbf24; animation: breathe 2s ease-in-out infinite alternate; }

    .orb-timer { position: absolute; left: 50%; transform: translateX(-50%) scale(0.8); background: rgba(30, 30, 34, 0.95); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 999px; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; font-weight: 600; color: #f87171; opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 40; white-space: nowrap; }
    .wrapper.pos-top .orb-timer, .wrapper:not(.pos-top):not(.pos-bottom) .orb-timer { bottom: -24px; top: auto; }
    .wrapper.pos-bottom .orb-timer { top: -24px; bottom: auto; }
    .wrapper.recording .orb-timer, .wrapper.paused .orb-timer { opacity: 1; transform: translateX(-50%) scale(1); }
    .wrapper.paused .orb-timer { color: #fcd34d; animation: blinkWarning 1.5s infinite; }
    .wrapper.open .orb-timer { opacity: 0 !important; transform: translateX(-50%) scale(0.8) !important; }

    .orbital-menu { position: absolute; top: 50%; left: 50%; width: 250px; height: 250px; transform: translate(-50%, -50%); z-index: 10; pointer-events: none; border-radius: 50%; }
    .wrapper.open .orbital-menu { display: none !important; }
    .wrapper:not(.dragging):hover .orbital-menu { pointer-events: auto; }
    
    .orb-btn {
      position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(40, 40, 45, 0.9); border: 1px solid rgba(255,255,255,0.1); color: white;
      transform: translate(-50%, -50%) scale(0.4); opacity: 0;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      --tx: 0px; --ty: 0px;
    }
    
    .wrapper:not(.dragging):hover .orb-btn { opacity: 1; pointer-events: auto; }
    .wrapper:not(.dragging):hover .orb-btn:hover { filter: brightness(1.2); transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.1) !important; }
    .wrapper:hover .orb-btn { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); }

    .wrapper.recording.pos-right .orb-send,   .wrapper.paused.pos-right .orb-send   { --tx: -20px; --ty: -82px; }
    .wrapper.recording.pos-right .orb-expand, .wrapper.paused.pos-right .orb-expand { --tx: -65px; --ty: -55px; }
    .wrapper.recording.pos-right .orb-pause,  .wrapper.paused.pos-right .orb-pause  { --tx: -85px; --ty: 0px;   }
    .wrapper.recording.pos-right .orb-mute,   .wrapper.paused.pos-right .orb-mute   { --tx: -65px; --ty: 55px;  }
    .wrapper.recording.pos-right .orb-stop,   .wrapper.paused.pos-right .orb-stop   { --tx: -20px; --ty: 82px;  }

    .wrapper.recording.pos-left .orb-send,   .wrapper.paused.pos-left .orb-send   { --tx: 20px; --ty: -82px; }
    .wrapper.recording.pos-left .orb-expand, .wrapper.paused.pos-left .orb-expand { --tx: 65px; --ty: -55px; }
    .wrapper.recording.pos-left .orb-pause,  .wrapper.paused.pos-left .orb-pause  { --tx: 85px; --ty: 0px;   }
    .wrapper.recording.pos-left .orb-mute,   .wrapper.paused.pos-left .orb-mute   { --tx: 65px; --ty: 55px;  }
    .wrapper.recording.pos-left .orb-stop,   .wrapper.paused.pos-left .orb-stop   { --tx: 20px; --ty: 82px;  }

    .wrapper:not(.recording):not(.paused).pos-right .orb-start  { --tx: -65px; --ty: -30px; }
    .wrapper:not(.recording):not(.paused).pos-right .orb-expand { --tx: -65px; --ty: 30px;  }
    .wrapper:not(.recording):not(.paused).pos-left .orb-start   { --tx: 65px; --ty: -30px;  }
    .wrapper:not(.recording):not(.paused).pos-left .orb-expand  { --tx: 65px; --ty: 30px;   }

    .orb-start { background: linear-gradient(135deg, #2563eb, #4f46e5); border: none; }
    .orb-send  { background: linear-gradient(135deg, #7c3aed, #6d28d9); border: none; }
    .orb-mute.muted { background: linear-gradient(135deg, #e11d48, #be123c); border: none; }

    .wrapper:not(.recording):not(.paused) .orb-pause,
    .wrapper:not(.recording):not(.paused) .orb-stop,
    .wrapper:not(.recording):not(.paused) .orb-send,
    .wrapper:not(.recording):not(.paused) .orb-mute { display: none; }

    @keyframes spin { 100% { transform: rotate(360deg); } } @keyframes spin-reverse { 100% { transform: rotate(-360deg); } } @keyframes breathe { 0%, 100% { transform: rotate(45deg) scale(1); } 50% { transform: rotate(45deg) scale(1.1); } } @keyframes heartBeat { 0% { transform: scale(0.85); } 100% { transform: scale(1.15); } } @keyframes bounceWave { 0%, 100% { height: 20%; } 50% { height: 90%; } } @keyframes blinkWarning { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  `;
  shadow.appendChild(style);

  const wrapperElement = document.createElement('div');
  wrapperElement.className = 'wrapper';
  wrapperElement.id = 'widget-wrapper';
  
  wrapperElement.innerHTML = `
    <div class="panel" id="spoly-panel">
      <div class="header">
        <button class="icon-btn" id="collapse-panel" title="Collapse"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <button class="icon-btn" id="close-panel" title="Close"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg></button>
      </div>
      
      <div class="visualizer" id="visualizerBox">
        <div class="bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        <span class="timer" id="timerDisplay">Ready</span>
      </div>
      
      <button class="btn btn-start" id="startBtn" title="Capture Meeting">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> 
      </button>
      
      <div class="action-buttons" id="actionBtns">
          <button class="btn btn-pause" id="pauseBtn" title="Pause">
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> 
          </button>
          
          <button class="btn btn-mute" id="muteBtn" title="Toggle Mic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></svg> 
          </button>
          
          <button class="btn btn-stop" id="stopBtn" title="Save Local">
            <svg viewBox="0 0 24 24" fill="currentColor"><rect width="16" height="16" x="4" y="4" rx="3"/></svg> 
          </button>
          
          <button class="btn btn-send" id="sendBtn" title="Analyze with Spoly">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> 
          </button>
      </div>
    </div>

    <div class="nexus-container" id="nexus-trigger"><div class="orbital-ring"></div><div class="orbital-ring-inner"></div><div class="nexus-core"><div class="spark"></div></div></div>
    <div class="orb-timer" id="orbTimer">00:00</div>

    <div class="orbital-menu" id="orbital-menu">
       <button class="orb-btn orb-start" id="orbStart" title="Start Capture">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
       </button>
       <button class="orb-btn orb-pause" id="orbPause" title="Pause">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
       </button>
       <button class="orb-btn orb-mute" id="orbMute" title="Toggle Mic">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></svg>
       </button>
       <button class="orb-btn orb-stop" id="orbStop" title="Save File Locally">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect width="16" height="16" x="4" y="4" rx="3"/></svg>
       </button>
       <button class="orb-btn orb-send" id="orbSend" title="Send to Spoly Dashboard">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
       </button>
       <button class="orb-btn orb-expand" id="orbExpand" title="Expand Panel">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
       </button>
    </div>
  `;
  shadow.appendChild(wrapperElement);

  const wrapper = shadow.getElementById('widget-wrapper');
  const panel = shadow.getElementById('spoly-panel');
  const nexusTrigger = shadow.getElementById('nexus-trigger');
  
  const startBtn = shadow.getElementById('startBtn');
  const actionBtns = shadow.getElementById('actionBtns');
  const pauseBtn = shadow.getElementById('pauseBtn');
  const muteBtn = shadow.getElementById('muteBtn');
  const stopBtn = shadow.getElementById('stopBtn');
  const sendBtn = shadow.getElementById('sendBtn');
  const collapsePanelBtn = shadow.getElementById('collapse-panel');
  const closePanelBtn = shadow.getElementById('close-panel');
  const timerDisplay = shadow.getElementById('timerDisplay');

  const orbStart = shadow.getElementById('orbStart');
  const orbPause = shadow.getElementById('orbPause');
  const orbMute = shadow.getElementById('orbMute');
  const orbStop = shadow.getElementById('orbStop');
  const orbSend = shadow.getElementById('orbSend');
  const orbExpand = shadow.getElementById('orbExpand');
  const orbTimer = shadow.getElementById('orbTimer');

  let mediaRecorder = null; let audioChunks = []; let timerInterval = null; let seconds = 0;
  let isSendingToCloud = false; let audioCtx, silenceTimer;
  let isAutoPaused = false; 

  let displayStream = null;
  let micStreamGlobal = null; 
  let isMicMuted = true; 

  const formatTime = (sec) => { const m = Math.floor(sec / 60).toString().padStart(2, '0'); const s = (sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; };
  const updateTimers = (timeStr) => { timerDisplay.textContent = timeStr; orbTimer.textContent = timeStr; };

  function applyMuteUI(muted) {
    isMicMuted = muted;
    const activeSvg = muted 
      ? `<line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 1.67"/><line x1="12" x2="12" y1="19" y2="22"/>`
      : `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>`;

    muteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${activeSvg}</svg>`;
    orbMute.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${activeSvg}</svg>`;

    if (muted) { muteBtn.classList.add('muted'); orbMute.classList.add('muted'); } 
    else { muteBtn.classList.remove('muted'); orbMute.classList.remove('muted'); }
  }

  muteBtn.onclick = (e) => {
    if (e && e.isTrusted && !isMasterTab) return chrome.runtime.sendMessage({ action: 'REMOTE_CONTROL', command: 'MUTE' });
    isMicMuted = !isMicMuted;
    applyMuteUI(isMicMuted);
    
    if (isMasterTab && micStreamGlobal) {
      micStreamGlobal.getAudioTracks().forEach(t => t.enabled = !isMicMuted);
    }
    chrome.storage.local.set({ spolyMicMuted: isMicMuted });
  };

  orbMute.onclick = (e) => { e.stopPropagation(); muteBtn.click(); };
  orbStart.onclick = (e) => { e.stopPropagation(); startBtn.click(); };
  orbPause.onclick = (e) => { e.stopPropagation(); isAutoPaused = false; pauseBtn.click(); };
  orbStop.onclick = (e) => { e.stopPropagation(); stopBtn.click(); };
  orbSend.onclick = (e) => { e.stopPropagation(); sendBtn.click(); };
  orbExpand.onclick = (e) => { e.stopPropagation(); chrome.storage.local.set({ spolyPanelOpen: true }); applyPanelState(true); };

  function updatePanelPosition() {
    const rect = host.getBoundingClientRect();
    const isTop = rect.top < 160;
    const isLeftHalf = rect.left < window.innerWidth / 2;   
    
    if (isLeftHalf) { 
        wrapper.classList.add('pos-left'); wrapper.classList.remove('pos-right'); 
    } else { 
        wrapper.classList.add('pos-right'); wrapper.classList.remove('pos-left'); 
    }
    
    if (rect.left < 30) {
        panel.style.left = '0px'; panel.style.right = 'auto'; panel.style.transformOrigin = `${isTop ? 'top' : 'bottom'} left`;
    } else if (window.innerWidth - rect.right < 30) {
        panel.style.right = '0px'; panel.style.left = 'auto'; panel.style.transformOrigin = `${isTop ? 'top' : 'bottom'} right`;
    } else {
        panel.style.left = '-25px'; panel.style.right = 'auto'; panel.style.transformOrigin = `${isTop ? 'top' : 'bottom'} center`;
    }
    
    if (isTop) { 
       panel.style.top = '72px'; panel.style.bottom = 'auto'; wrapper.classList.add('pos-top'); wrapper.classList.remove('pos-bottom');
    } else { 
       panel.style.bottom = '72px'; panel.style.top = 'auto'; wrapper.classList.add('pos-bottom'); wrapper.classList.remove('pos-top');
    }
  }

  function applyPanelState(isOpen) {
    if (isOpen) wrapper.classList.add('open'); 
    else wrapper.classList.remove('open');
    updatePanelPosition();
  }

  // 🚀 FIX: Sync ALL visual states when injected on a new tab
  chrome.storage.local.get(['spolyBotX', 'spolyBotY', 'spolyPanelOpen', 'spolyRecordingLive', 'spolyRecordingPaused', 'spolyRecordingStartTime', 'spolyMicMuted', 'spolySpeakerState'], (res) => {
    if (res.spolyBotX !== undefined && res.spolyBotY !== undefined) {
      host.style.left = `${Math.max(0, Math.min(res.spolyBotX, window.innerWidth - 60))}px`;
      host.style.top = `${Math.max(0, Math.min(res.spolyBotY, window.innerHeight - 60))}px`;
    }
    applyPanelState(res.spolyPanelOpen !== false); 
    applyRemoteUI(res.spolyRecordingLive, res.spolyRecordingPaused, res.spolyRecordingStartTime);
    
    if (res.spolyMicMuted !== undefined) applyMuteUI(res.spolyMicMuted);
    else applyMuteUI(true); 
    
    if (res.spolyRecordingLive && res.spolySpeakerState && wrapper) {
        wrapper.classList.remove('speaker-mic', 'speaker-sys');
        if (res.spolySpeakerState === 'mic') wrapper.classList.add('speaker-mic');
        if (res.spolySpeakerState === 'sys') wrapper.classList.add('speaker-sys');
    }
  });

  let hasMoved = false; let dragOffsetX = 0, dragOffsetY = 0;
  nexusTrigger.ondragstart = () => false;
  nexusTrigger.onpointerdown = (e) => { isDragging = true; hasMoved = false; wrapper.classList.add('dragging'); const rect = host.getBoundingClientRect(); dragOffsetX = e.clientX - rect.left; dragOffsetY = e.clientY - rect.top; host.style.transition = 'none'; nexusTrigger.setPointerCapture(e.pointerId); };
  nexusTrigger.onpointermove = (e) => { if (!isDragging) return; if (Math.abs(e.movementX) > 1 || Math.abs(e.movementY) > 1) hasMoved = true; let newLeft = e.clientX - dragOffsetX; let newTop = e.clientY - dragOffsetY; newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 60)); newTop = Math.max(0, Math.min(newTop, window.innerHeight - 60)); host.style.left = `${newLeft}px`; host.style.top = `${newTop}px`; updatePanelPosition(); };
  nexusTrigger.onpointerup = (e) => { isDragging = false; wrapper.classList.remove('dragging'); nexusTrigger.releasePointerCapture(e.pointerId); const rect = host.getBoundingClientRect(); chrome.storage.local.set({ spolyBotX: rect.left, spolyBotY: rect.top }); };
  
  nexusTrigger.addEventListener('click', () => { 
    if (!hasMoved) { 
      const newOpenState = !wrapper.classList.contains('open');
      chrome.storage.local.set({ spolyPanelOpen: newOpenState }); 
      applyPanelState(newOpenState);
    } 
  });
  
  closePanelBtn.onclick = () => { 
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      alert("⚠️ A recording is currently in progress!\n\nPlease use the 'Save' or 'Send' button to stop the recording before closing the widget.");
      return;
    }
    chrome.runtime.sendMessage({ action: 'GLOBAL_CLOSE' }); 
  };
  
  collapsePanelBtn.onclick = () => { chrome.storage.local.set({ spolyPanelOpen: false }); applyPanelState(false); };

  function monitorAudio(micStream, sysStream, ctx) {
    if (!ctx) return;
    let micAnalyser = null, sysAnalyser = null;
    let micData = null, sysData = null;
    let lastSpeakerState = 'none'; 

    if (micStream && micStream.getAudioTracks().length > 0) {
      const micSource = ctx.createMediaStreamSource(new MediaStream([micStream.getAudioTracks()[0]]));
      micAnalyser = ctx.createAnalyser(); micAnalyser.fftSize = 256;
      micSource.connect(micAnalyser);
      micData = new Uint8Array(micAnalyser.frequencyBinCount);
    }

    if (sysStream && sysStream.getAudioTracks().length > 0) {
      const sysSource = ctx.createMediaStreamSource(new MediaStream([sysStream.getAudioTracks()[0]]));
      sysAnalyser = ctx.createAnalyser(); sysAnalyser.fftSize = 256;
      sysSource.connect(sysAnalyser);
      sysData = new Uint8Array(sysAnalyser.frequencyBinCount);
    }

    function checkLevel() {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
      
      let micVol = 0, sysVol = 0;
      if (micAnalyser && !isMicMuted) {
        micAnalyser.getByteFrequencyData(micData);
        micVol = micData.reduce((a, b) => a + b, 0) / micData.length;
      }
      if (sysAnalyser) {
        sysAnalyser.getByteFrequencyData(sysData);
        sysVol = sysData.reduce((a, b) => a + b, 0) / sysData.length;
      }

      if (mediaRecorder.state === 'recording') {
        let currentSpeaker = 'none';
        if (micVol > sysVol + 5 && micVol > 5) currentSpeaker = 'mic';
        else if (sysVol > micVol + 5 && sysVol > 5) currentSpeaker = 'sys';

        if (currentSpeaker !== lastSpeakerState) {
           lastSpeakerState = currentSpeaker;
           // Push to storage so other tabs see the color change instantly!
           chrome.storage.local.set({ spolySpeakerState: currentSpeaker });
           
           wrapper.classList.remove('speaker-mic', 'speaker-sys');
           if (currentSpeaker === 'mic') wrapper.classList.add('speaker-mic');
           if (currentSpeaker === 'sys') wrapper.classList.add('speaker-sys');
        }

        const maxVol = Math.max(micVol, sysVol);
        if (maxVol < 2) { 
          if (!silenceTimer) { silenceTimer = setTimeout(() => { if (mediaRecorder.state === 'recording') { isAutoPaused = true; pauseBtn.click(); chrome.runtime.sendMessage({ action: 'SHOW_NOTIFICATION', message: 'Spoly paused recording due to silence.' }); } }, 30000); }
        } else { clearTimeout(silenceTimer); silenceTimer = null; }
      } else if (mediaRecorder.state === 'paused' && isAutoPaused) {
        const maxVol = Math.max(micVol, sysVol);
        if (maxVol > 4) { isAutoPaused = false; pauseBtn.click(); chrome.runtime.sendMessage({ action: 'SHOW_NOTIFICATION', message: 'Audio detected! Spoly resumed recording.' }); }
      }
      requestAnimationFrame(checkLevel);
    }
    checkLevel();
  }

  startBtn.onclick = async () => {
    displayStream = null;
    micStreamGlobal = null;

    try {
      try {
        micStreamGlobal = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
        
        if (isMicMuted && micStreamGlobal) {
          micStreamGlobal.getAudioTracks().forEach(t => t.enabled = false);
        }
      } catch (micErr) {
        console.warn("Spoly: Microphone access denied or unavailable.");
      }

      displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, 
        preferCurrentTab: true, systemAudio: "include" 
      });

      const displayAudioTracks = displayStream.getAudioTracks();
      const micAudioTracks = micStreamGlobal ? micStreamGlobal.getAudioTracks() : [];

      if (displayAudioTracks.length === 0 && micAudioTracks.length === 0) { 
        alert("⚠️ No audio detected. Please share tab audio or allow microphone access."); 
        displayStream.getTracks().forEach(t => t.stop()); 
        if (micStreamGlobal) micStreamGlobal.getTracks().forEach(t => t.stop());
        return; 
      }
      
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const destNode = audioCtx.createMediaStreamDestination();

      if (displayAudioTracks.length > 0) {
        const displaySource = audioCtx.createMediaStreamSource(new MediaStream([displayAudioTracks[0]]));
        displaySource.connect(destNode);
      }

      if (micAudioTracks.length > 0) {
        const micSource = audioCtx.createMediaStreamSource(new MediaStream([micAudioTracks[0]]));
        micSource.connect(destNode);
      }

      const mixedAudioStream = destNode.stream;

      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) options.mimeType = 'audio/webm;codecs=opus';
      else if (MediaRecorder.isTypeSupported('audio/webm')) options.mimeType = 'audio/webm';

      mediaRecorder = new MediaRecorder(mixedAudioStream, options);
      mediaRecorder.ondataavailable = e => { if (e.data && e.data.size > 0) audioChunks.push(e.data); };
      
      mediaRecorder.onstop = () => {
        displayStream.getTracks().forEach(t => t.stop()); 
        if (micStreamGlobal) micStreamGlobal.getTracks().forEach(t => t.stop());
        if (audioCtx) audioCtx.close();
        
        isMasterTab = false; isAutoPaused = false; 
        
        applyMuteUI(true); 
        chrome.storage.local.set({ spolyMicMuted: true, spolyRecordingLive: false });
        
        chrome.runtime.sendMessage({ action: 'SET_BADGE', text: '', color: '#000000' });
        
        wrapper.classList.remove('recording', 'paused', 'speaker-mic', 'speaker-sys');
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
        orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
        pauseBtn.classList.remove('btn-resume'); pauseBtn.classList.add('btn-pause');
        
        clearInterval(timerInterval); updateTimers("Ready");

        if (isSendingToCloud) {
          const finalBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const reader = new FileReader(); reader.readAsDataURL(finalBlob);
          reader.onloadend = () => {
            chrome.runtime.sendMessage({ action: 'PROCESS_AND_SEND_AUDIO', audioData: reader.result });
            chrome.runtime.sendMessage({ action: 'SHOW_NOTIFICATION', message: 'Meeting successfully sent to Spoly!' });
            chrome.storage.local.set({ spolyPanelOpen: false }); 
          };
        } else {
          chrome.runtime.sendMessage({ action: 'RECORDING_STOPPED' }).catch(() => {});
          const finalBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(finalBlob); a.download = `Spoly_Audio_${Date.now()}.webm`; a.click(); 
          chrome.runtime.sendMessage({ action: 'SHOW_NOTIFICATION', message: 'Audio saved locally!' });
        }
      };

      displayStream.getVideoTracks()[0].onended = () => { if (mediaRecorder && mediaRecorder.state !== 'inactive') stopBtn.click(); };

      mediaRecorder.start();
      monitorAudio(micStreamGlobal, displayStream, audioCtx); 
      isMasterTab = true; isAutoPaused = false;
      
      const pageTitle = document.title || "Live Web Capture";
      
      // 🚀 Save Title directly to Storage for bulletproof syncing
      chrome.storage.local.set({ 
          spolyRecordingLive: true, 
          spolyRecordingStartTime: Date.now(), 
          spolyRecordingPaused: false,
          spolyRecordingTitle: pageTitle 
      });
      
      chrome.runtime.sendMessage({ action: 'RECORDING_STARTED', title: pageTitle }).catch(() => {});
      chrome.runtime.sendMessage({ action: 'SHOW_NOTIFICATION', message: 'Dual-Stream Recording started successfully!' });
      chrome.runtime.sendMessage({ action: 'SET_BADGE', text: 'REC', color: '#EF4444' }); 
      
      wrapper.classList.add('recording');
      seconds = 0; updateTimers("00:00"); 
      timerInterval = setInterval(() => { seconds++; updateTimers(formatTime(seconds)); }, 1000);
      
    } catch (err) { 
      if (displayStream) displayStream.getTracks().forEach(t => t.stop());
      if (micStreamGlobal) micStreamGlobal.getTracks().forEach(t => t.stop());
      if (err.name === "NotReadableError") alert("⚠️ Chrome failed to read the audio. Select 'Chrome Tab' and ensure 'Also share tab audio' is checked.");
    }
  };
  
  pauseBtn.onclick = (e) => {
    if (e && e.isTrusted) isAutoPaused = false;
    if (!isMasterTab) return chrome.runtime.sendMessage({ action: 'REMOTE_CONTROL', command: 'PAUSE' });

    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      wrapper.classList.remove('recording', 'speaker-mic', 'speaker-sys'); wrapper.classList.add('paused');
      pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg>`;
      orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg>`;
      pauseBtn.classList.remove('btn-pause'); pauseBtn.classList.add('btn-resume');

      chrome.storage.local.set({ spolyRecordingPaused: true }); 
      clearInterval(timerInterval); updateTimers(`PAUSED`);
      chrome.runtime.sendMessage({ action: 'SET_BADGE', text: 'PAUSE', color: '#F59E0B' });

    } else if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      wrapper.classList.remove('paused'); wrapper.classList.add('recording');
      pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      pauseBtn.classList.remove('btn-resume'); pauseBtn.classList.add('btn-pause');

      chrome.storage.local.set({ spolyRecordingPaused: false, spolyRecordingStartTime: Date.now() - (seconds * 1000) }); 
      updateTimers(formatTime(seconds));
      timerInterval = setInterval(() => { seconds++; updateTimers(formatTime(seconds)); }, 1000);
      chrome.runtime.sendMessage({ action: 'SET_BADGE', text: 'REC', color: '#EF4444' });
    }
  };

  stopBtn.onclick = () => { 
    if (!isMasterTab) return chrome.runtime.sendMessage({ action: 'REMOTE_CONTROL', command: 'STOP' });
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
    isSendingToCloud = false; mediaRecorder.stop(); 
  };

  sendBtn.onclick = async () => {
    if (!isMasterTab) return chrome.runtime.sendMessage({ action: 'REMOTE_CONTROL', command: 'SEND' });
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
    isSendingToCloud = true; 
    mediaRecorder.stop(); 
  };

  window.addEventListener('message', (e) => {
    if (e.data.type === 'INTERNAL_SYNC_UI') { applyRemoteUI(e.data.isLive, e.data.isPaused, e.data.startTime); }
    else if (e.data.type === 'INTERNAL_SYNC_POS') { host.style.left = `${e.data.x}px`; host.style.top = `${e.data.y}px`; updatePanelPosition(); }
    else if (e.data.type === 'INTERNAL_SYNC_PANEL') { applyPanelState(e.data.isOpen); }
    else if (e.data.type === 'INTERNAL_SYNC_MUTE') { applyMuteUI(e.data.isMuted); }
  });

  function applyRemoteUI(isLive, isPaused, startTime) {
    if (isMasterTab) return; 
    clearInterval(remoteTimerInterval);
    if (isLive) {
      wrapper.classList.add('recording');
      if (isPaused) {
        wrapper.classList.remove('recording', 'speaker-mic', 'speaker-sys'); wrapper.classList.add('paused');
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg>`;
        orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg>`;
        pauseBtn.classList.remove('btn-pause'); pauseBtn.classList.add('btn-resume');
        updateTimers('PAUSED');
      } else {
        wrapper.classList.remove('paused'); wrapper.classList.add('recording');
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
        orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
        pauseBtn.classList.remove('btn-resume'); pauseBtn.classList.add('btn-pause');
        if (startTime) {
          const tick = () => { let sec = Math.floor((Date.now() - startTime) / 1000); updateTimers(formatTime(sec)); };
          tick(); remoteTimerInterval = setInterval(tick, 1000);
        }
      }
    } else {
      wrapper.classList.remove('recording', 'paused', 'speaker-mic', 'speaker-sys');
      pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      pauseBtn.classList.remove('btn-resume'); pauseBtn.classList.add('btn-pause');
      updateTimers("Ready");
    }
  }

  window.postMessage({ type: 'SPOLY_WIDGET_STATUS', status: true }, '*');

  chrome.runtime.onMessage.addListener((req) => {
    if (isMasterTab) {
      if (req.action === 'REMOTE_STOP') stopBtn.click();
      if (req.action === 'REMOTE_PAUSE') { isAutoPaused = false; pauseBtn.click(); }
      if (req.action === 'REMOTE_MUTE') muteBtn.click();
      if (req.action === 'REMOTE_SEND') sendBtn.click();
    }
  });
}

// 🚀 FIX: Bulletproof Title Synchronization Heartbeat
setInterval(() => {
  chrome.storage.local.get(['spolyRecordingLive', 'spolyRecordingTitle'], (res) => {
    if (res.spolyRecordingLive) {
        window.postMessage({ type: 'SPOLY_HEARTBEAT_LIVE', title: res.spolyRecordingTitle }, '*');
    }
  });
}, 1000);

// 🚀 FIX: Master State Watcher (Ensures Youtube SPA injection and Dual Color Sync)
chrome.storage.onChanged.addListener((changes) => {
  
  if (changes.spolyBotActive) {
      if (changes.spolyBotActive.newValue) {
          if (!document.getElementById('spoly-fab-root')) injectNexusBot();
      } else {
          const existingBot = document.getElementById('spoly-fab-root');
          if (existingBot) { existingBot.remove(); hostElem = null; window.postMessage({ type: 'SPOLY_WIDGET_STATUS', status: false }, '*'); }
      }
  }
  
  if (changes.spolyBotX || changes.spolyBotY) {
    chrome.storage.local.get(['spolyBotX', 'spolyBotY'], (res) => {
      let targetX = Math.max(0, Math.min(res.spolyBotX, window.innerWidth - 60));
      let targetY = Math.max(0, Math.min(res.spolyBotY, window.innerHeight - 60));
      window.postMessage({ type: 'INTERNAL_SYNC_POS', x: targetX, y: targetY }, '*');
    });
  }
  if (changes.spolyPanelOpen) {
    window.postMessage({ type: 'INTERNAL_SYNC_PANEL', isOpen: changes.spolyPanelOpen.newValue }, '*');
  }
  if (changes.spolyMicMuted) {
    window.postMessage({ type: 'INTERNAL_SYNC_MUTE', isMuted: changes.spolyMicMuted.newValue }, '*');
  }
  if (changes.spolyRecordingLive || changes.spolyRecordingPaused) {
    chrome.storage.local.get(['spolyRecordingLive', 'spolyRecordingPaused', 'spolyRecordingStartTime'], (res) => {
      window.postMessage({ type: 'INTERNAL_SYNC_UI', isLive: res.spolyRecordingLive, isPaused: res.spolyRecordingPaused, startTime: res.spolyRecordingStartTime }, '*');
    });
  }
  if (changes.spolySpeakerState) {
    const state = changes.spolySpeakerState.newValue;
    const wrapper = document.getElementById('spoly-fab-root')?.shadowRoot.getElementById('widget-wrapper');
    if (wrapper && !isMasterTab) {
        wrapper.classList.remove('speaker-mic', 'speaker-sys');
        if (state === 'mic') wrapper.classList.add('speaker-mic');
        if (state === 'sys') wrapper.classList.add('speaker-sys');
    }
  }
});

window.addEventListener('message', (e) => { 
  if (e.data.type === 'SPOLY_TOGGLE_WIDGET') {
    chrome.storage.local.get(['spolyBotActive', 'spolyRecordingLive'], (res) => {
        if (res.spolyRecordingLive && res.spolyBotActive) {
            alert("⚠️ A recording is currently in progress!\n\nPlease use the 'Save' or 'Send' button inside the widget to stop the recording before removing the extension from the screen.");
            return;
        }
        chrome.storage.local.set({ spolyBotActive: !res.spolyBotActive });
    });
  }
});

chrome.runtime.onMessage.addListener((req) => { 
  if (req.action === 'GLOBAL_CLOSE') {
    chrome.storage.local.set({ spolyBotActive: false });
  }
  else if (req.action === 'GLOBAL_OPEN') { 
    chrome.storage.local.set({ spolyBotActive: true, spolyPanelOpen: false });
  }
  else if (req.action === 'COMMAND_TOGGLE_RECORD') {
    const start = document.getElementById('spoly-fab-root')?.shadowRoot.getElementById('startBtn');
    const stop = document.getElementById('spoly-fab-root')?.shadowRoot.getElementById('stopBtn');
    if (start && start.style.display !== 'none') start.click(); else if (stop) stop.click();
  }
  else if (req.action === 'COMMAND_TOGGLE_PAUSE') {
    const pause = document.getElementById('spoly-fab-root')?.shadowRoot.getElementById('pauseBtn');
    if (pause) pause.click();
  }
  else if (req.action === 'RECORDING_STARTED') { 
    window.postMessage({ type: 'SPOLY_RECORDING_STARTED', title: req.title }, '*'); 
  }
  else if (req.action === 'RECORDING_STOPPED') { window.postMessage({ type: 'SPOLY_RECORDING_STOPPED' }, '*'); }
  else if (req.action === 'RECEIVE_AUDIO') { window.postMessage({ type: 'SPOLY_UPLOAD_COMPLETE', audioUrl: req.audioData }, '*'); }
});

if (!window.location.href.startsWith('chrome')) { 
  // Initial Boot
  chrome.storage.local.get(['spolyBotActive'], (result) => {
    if (result.spolyBotActive === true) {
      if (document.readyState === 'complete') injectNexusBot(); 
      else window.addEventListener('load', injectNexusBot); 
    }
  });

  // Watcher for Single Page Apps (like YouTube)
  setInterval(() => {
    if (!document.getElementById('spoly-fab-root')) {
      chrome.storage.local.get(['spolyBotActive'], (res) => {
        if (res.spolyBotActive) injectNexusBot();
      });
    }
  }, 1000);
}