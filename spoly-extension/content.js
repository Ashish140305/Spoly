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
    
    /* MAIN PANEL */
    .panel { display: none; position: absolute; width: 260px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1); padding: 14px; flex-direction: column; opacity: 0; transform: scale(0.98); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); z-index: 20; pointer-events: none; }
    .wrapper.open .panel { display: flex; opacity: 1; transform: scale(1); pointer-events: auto; }
    
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; width: 100%; gap: 10px; }
    .title-badge { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: 700; color: #60a5fa; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .icon-btn { background: transparent; border: none; color: #64748b; cursor: pointer; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; transition: 0.2s; border-radius: 50%; }
    .icon-btn:hover { background: rgba(255,255,255,0.1); color: white; }

    .visualizer { background: rgba(0,0,0,0.3); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.03); }
    .bars { display: flex; gap: 3px; height: 14px; align-items: center; }
    .bar { width: 3px; background: #4f46e5; border-radius: 2px; height: 20%; transition: height 0.2s ease; opacity: 0.6; }
    
    .wrapper.recording .bar { animation: bounceWave 0.8s ease-in-out infinite; background: #f43f5e; opacity: 1; box-shadow: 0 0 6px rgba(244,63,94,0.6); }
    .wrapper.recording .bar:nth-child(1) { animation-delay: 0.0s; } .wrapper.recording .bar:nth-child(2) { animation-delay: 0.1s; } .wrapper.recording .bar:nth-child(3) { animation-delay: 0.2s; } .wrapper.recording .bar:nth-child(4) { animation-delay: 0.3s; }
    .wrapper.paused .bar { animation: none; height: 4px; background: #fbbf24; opacity: 1; box-shadow: 0 0 6px rgba(251,191,36,0.6); }
    
    .timer { font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important; font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; }
    .wrapper.recording .timer { color: #fca5a5; }
    .wrapper.paused .timer { color: #fcd34d; animation: blinkWarning 1.5s infinite; font-weight: 700; }

    .action-buttons { display: none; flex-direction: column; gap: 8px; width: 100%; }
    .wrapper.recording .action-buttons, .wrapper.paused .action-buttons { display: flex; }
    .wrapper.recording #startBtn, .wrapper.paused #startBtn { display: none; }
    
    .btn-row { display: flex; gap: 6px; width: 100%; }
    .btn { padding: 8px 4px; border-radius: 8px; font-weight: 600; font-size: 11px; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 4px; color: white; flex: 1; }
    
    .btn-start { width: 100%; background: linear-gradient(135deg, #2563eb, #4f46e5); box-shadow: 0 4px 10px rgba(37,99,235,0.3); }
    .btn-pause { background: linear-gradient(135deg, #d97706, #b45309); box-shadow: 0 4px 10px rgba(217,119,6,0.3); }
    .btn-resume { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 4px 10px rgba(5,150,105,0.3); }
    .btn-stop { background: linear-gradient(135deg, #dc2626, #9f1239); box-shadow: 0 4px 10px rgba(220,38,38,0.3); }
    .btn-send { background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 10px rgba(139,92,246,0.3); width: 100%; padding: 10px; font-size: 12px; }
    
    /* ✨ MUTE BUTTON UNIQUE COLORS */
    .btn-mute { background: linear-gradient(135deg, #06b6d4, #0369a1); box-shadow: 0 4px 10px rgba(6, 182, 212, 0.3); }
    .btn-mute.muted { background: linear-gradient(135deg, #f43f5e, #9f1239); box-shadow: 0 4px 10px rgba(244, 63, 94, 0.3); }
    
    .btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

    /* NEXUS CORE */
    .nexus-container { width: 60px; height: 60px; position: absolute; top: 0; left: 0; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none; z-index: 30;}
    .nexus-container:active { cursor: grabbing; }
    .orbital-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1.5px solid rgba(59, 130, 246, 0.1); border-top: 1.5px solid #3b82f6; border-right: 1.5px solid #8b5cf6; animation: spin 4s linear infinite; transition: all 0.3s ease; }
    .orbital-ring-inner { position: absolute; width: 75%; height: 75%; border-radius: 50%; border: 1px dashed rgba(139, 92, 246, 0.4); animation: spin-reverse 6s linear infinite; transition: all 0.3s ease; }
    .nexus-core { position: relative; width: 40px; height: 40px; border-radius: 50%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); box-shadow: inset 0 0 12px rgba(59,130,246,0.3); display: flex; align-items: center; justify-content: center; pointer-events: none;}
    .spark { width: 12px; height: 12px; background: linear-gradient(135deg, #60a5fa, #a78bfa); transform: rotate(45deg); box-shadow: 0 0 10px #8b5cf6; border-radius: 2px; animation: breathe 3s ease-in-out infinite; }

    .wrapper.recording .orbital-ring { border-top-color: #ef4444; border-right-color: #f43f5e; animation: spin 1s linear infinite; }
    .wrapper.recording .orbital-ring-inner { border-color: rgba(244, 63, 94, 0.6); animation: spin-reverse 1.5s linear infinite; }
    .wrapper.recording .nexus-core { background: rgba(69, 10, 10, 0.9); box-shadow: inset 0 0 20px rgba(239,68,68,0.5); border-color: rgba(239,68,68,0.4); }
    .wrapper.recording .spark { border-radius: 50%; background: #fca5a5; transform: rotate(0); box-shadow: 0 0 15px #ef4444; animation: heartBeat 0.8s ease-in-out infinite alternate; }

    .wrapper.paused .orbital-ring { border-top-color: #f59e0b; border-right-color: #d97706; animation: spin 4s linear infinite; }
    .wrapper.paused .orbital-ring-inner { border-color: rgba(245, 158, 11, 0.4); animation: spin-reverse 5s linear infinite; }
    .wrapper.paused .nexus-core { background: rgba(69, 26, 3, 0.9); box-shadow: inset 0 0 20px rgba(245,158,11,0.5); border-color: rgba(245,158,11,0.4); }
    .wrapper.paused .spark { border-radius: 50%; background: #fde68a; transform: rotate(0); box-shadow: 0 0 15px #fbbf24; animation: breathe 2s ease-in-out infinite alternate; }

    /* 🚀 PERSISTENT SMART TIMER BADGE */
    .orb-timer { 
       position: absolute; left: 50%; transform: translateX(-50%) scale(0.8); 
       background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); 
       padding: 4px 10px; border-radius: 12px; font-family: ui-monospace, SFMono-Regular, monospace; 
       font-size: 11px; font-weight: 800; color: #fca5a5; opacity: 0; pointer-events: none; 
       transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
       border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 40; 
       white-space: nowrap; 
    }
    
    /* Smart Edge Detection Placement */
    .wrapper.pos-top .orb-timer, .wrapper:not(.pos-top):not(.pos-bottom) .orb-timer { bottom: -24px; top: auto; }
    .wrapper.pos-bottom .orb-timer { top: -24px; bottom: auto; }

    .wrapper.recording .orb-timer, .wrapper.paused .orb-timer { opacity: 1; transform: translateX(-50%) scale(1); }
    .wrapper.paused .orb-timer { color: #fcd34d; animation: blinkWarning 1.5s infinite; }

    /* 🪐 GHOST HITBOX & ORBITAL MENU */
    .orbital-menu { 
      position: absolute; 
      top: 50%; left: 50%; 
      width: 250px; height: 250px; 
      transform: translate(-50%, -50%); 
      z-index: 10; 
      pointer-events: none; 
      border-radius: 50%;
    }
    .wrapper.open .orbital-menu { display: none !important; }
    .wrapper:not(.dragging):hover .orbital-menu { pointer-events: auto; background: rgba(0, 0, 0, 0.01); }
    
    .orb-btn {
      position: absolute; top: 50%; left: 50%;
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.1); color: white;
      transform: translate(-50%, -50%) scale(0.4); opacity: 0;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer; pointer-events: none;
      --tx: 0px; --ty: 0px;
    }
    
    .wrapper:not(.dragging):hover .orb-btn { opacity: 1; pointer-events: auto; }
    .wrapper:not(.dragging):hover .orb-btn:hover { filter: brightness(1.2); transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.15) !important; }
    .wrapper:hover .orb-btn { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); }

    /* 🪐 PERFECT MATHEMATICAL ARC ALIGNMENT (Radius ~ 85px) */
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

    /* IDLE ORBITAL CLUSTER (Tight grouped layout when not recording) */
    .wrapper:not(.recording):not(.paused).pos-right .orb-start  { --tx: -65px; --ty: -30px; }
    .wrapper:not(.recording):not(.paused).pos-right .orb-expand { --tx: -65px; --ty: 30px;  }
    .wrapper:not(.recording):not(.paused).pos-left .orb-start   { --tx: 65px; --ty: -30px;  }
    .wrapper:not(.recording):not(.paused).pos-left .orb-expand  { --tx: 65px; --ty: 30px;   }

    /* Button Colors */
    .orb-start { background: linear-gradient(135deg, #2563eb, #4f46e5); box-shadow: 0 4px 10px rgba(37,99,235,0.4); }
    .orb-pause { background: linear-gradient(135deg, #d97706, #b45309); box-shadow: 0 4px 10px rgba(217,119,6,0.4); }
    .orb-stop  { background: linear-gradient(135deg, #dc2626, #9f1239); box-shadow: 0 4px 10px rgba(220,38,38,0.4); }
    .orb-send  { background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 10px rgba(139,92,246,0.4); }
    .orb-expand{ background: rgba(30, 41, 59, 0.95); box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); }
    
    .orb-mute { background: linear-gradient(135deg, #06b6d4, #0369a1); box-shadow: 0 4px 10px rgba(6, 182, 212, 0.4); }
    .orb-mute.muted { background: linear-gradient(135deg, #f43f5e, #9f1239); box-shadow: 0 4px 10px rgba(244, 63, 94, 0.4); }

    .wrapper:not(.recording):not(.paused) .orb-pause,
    .wrapper:not(.recording):not(.paused) .orb-stop,
    .wrapper:not(.recording):not(.paused) .orb-send,
    .wrapper:not(.recording):not(.paused) .orb-mute { display: none; }
    
    .wrapper.recording .orb-start, .wrapper.paused .orb-start { display: none; }

    @keyframes spin { 100% { transform: rotate(360deg); } } @keyframes spin-reverse { 100% { transform: rotate(-360deg); } } @keyframes breathe { 0%, 100% { transform: rotate(45deg) scale(1); } 50% { transform: rotate(45deg) scale(1.2); } } @keyframes heartBeat { 0% { transform: scale(0.8); } 100% { transform: scale(1.3); } } @keyframes bounceWave { 0%, 100% { height: 20%; } 50% { height: 90%; } } @keyframes blinkWarning { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  `;
  shadow.appendChild(style);

  const wrapperElement = document.createElement('div');
  wrapperElement.className = 'wrapper';
  wrapperElement.id = 'widget-wrapper';
  
  const micIconSvg = `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>`;

  wrapperElement.innerHTML = `
    <div class="panel" id="spoly-panel">
      <div class="header">
        <div class="title-badge header-title"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Spoly AI</div>
        <div style="display:flex; gap:4px;">
          <button class="icon-btn" id="collapse-panel" title="Collapse to Radial Menu"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
          <button class="icon-btn" id="close-panel" title="Close Widget"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg></button>
        </div>
      </div>
      <div class="visualizer" id="visualizerBox">
        <div class="bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        <span class="timer" id="timerDisplay">Ready</span>
      </div>
      <button class="btn btn-start" id="startBtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> <span class="btn-text">Capture Meeting</span>
      </button>
      <div class="action-buttons" id="actionBtns">
        <div class="btn-row">
          <button class="btn btn-pause" id="pauseBtn" title="Pause">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> <span class="btn-text">Pause</span>
          </button>
          <button class="btn btn-mute" id="muteBtn" title="Toggle Mic">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></svg> <span class="btn-text">Mute</span>
          </button>
          <button class="btn btn-stop" id="stopBtn" title="Save Local">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect width="16" height="16" x="4" y="4" rx="3"/></svg> <span class="btn-text">Save</span>
          </button>
        </div>
        <button class="btn btn-send" id="sendBtn" title="Analyze with Spoly">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> <span class="btn-text">Stop & Send to Spoly</span>
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
  let isSendingToCloud = false; let audioCtx, analyser, dataArray, silenceTimer;
  let isAutoPaused = false; 

  let displayStream = null;
  let micStreamGlobal = null; 
  let isMicMuted = true; 

  const formatTime = (sec) => { const m = Math.floor(sec / 60).toString().padStart(2, '0'); const s = (sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; };
  const updateTimers = (timeStr) => { timerDisplay.textContent = timeStr; orbTimer.textContent = timeStr; };

  // 🚀 DYNAMIC MUTE UI RENDERER
  function applyMuteUI(muted) {
    isMicMuted = muted;
    const activeSvg = muted 
      ? `<line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 1.67"/><line x1="12" x2="12" y1="19" y2="22"/>`
      : `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>`;

    muteBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${activeSvg}</svg> <span class="btn-text">${muted ? 'Mic Off' : 'Mic Live'}</span>`;
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
    const isLeft = rect.left < 260; const isTop = rect.top < 160;   
    
    if (isLeft) { panel.style.left = '0px'; panel.style.right = 'auto'; wrapper.classList.add('pos-left'); wrapper.classList.remove('pos-right'); } 
    else { panel.style.right = '0px'; panel.style.left = 'auto'; wrapper.classList.add('pos-right'); wrapper.classList.remove('pos-left'); }
    
    if (isTop) { 
       panel.style.top = '70px'; panel.style.bottom = 'auto'; 
       wrapper.classList.add('pos-top'); wrapper.classList.remove('pos-bottom');
    } 
    else { 
       panel.style.bottom = '70px'; panel.style.top = 'auto'; 
       wrapper.classList.add('pos-bottom'); wrapper.classList.remove('pos-top');
    }
    
    panel.style.transformOrigin = `${isTop ? 'top' : 'bottom'} ${isLeft ? 'left' : 'right'}`;
  }

  function applyPanelState(isOpen) {
    if (isOpen) wrapper.classList.add('open'); 
    else wrapper.classList.remove('open');
    updatePanelPosition();
  }

  chrome.storage.local.get(['spolyBotX', 'spolyBotY', 'spolyPanelOpen', 'spolyRecordingLive', 'spolyRecordingPaused', 'spolyRecordingStartTime', 'spolyMicMuted'], (res) => {
    if (res.spolyBotX !== undefined && res.spolyBotY !== undefined) {
      host.style.left = `${Math.max(0, Math.min(res.spolyBotX, window.innerWidth - 60))}px`;
      host.style.top = `${Math.max(0, Math.min(res.spolyBotY, window.innerHeight - 60))}px`;
    }
    applyPanelState(res.spolyPanelOpen !== false); 
    applyRemoteUI(res.spolyRecordingLive, res.spolyRecordingPaused, res.spolyRecordingStartTime);
    
    if (res.spolyMicMuted !== undefined) applyMuteUI(res.spolyMicMuted);
    else applyMuteUI(true); 
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
  
  closePanelBtn.onclick = () => { chrome.runtime.sendMessage({ action: 'GLOBAL_CLOSE' }); };
  collapsePanelBtn.onclick = () => { chrome.storage.local.set({ spolyPanelOpen: false }); applyPanelState(false); };

  function monitorSilence(stream, ctx) {
    if (!ctx) return;
    const source = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser(); analyser.fftSize = 256;
    source.connect(analyser); dataArray = new Uint8Array(analyser.frequencyBinCount);

    function checkLevel() {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
      analyser.getByteFrequencyData(dataArray);
      let sum = dataArray.reduce((a, b) => a + b, 0);
      let avgVolume = sum / dataArray.length;

      if (mediaRecorder.state === 'recording') {
        if (avgVolume < 2) { 
          if (!silenceTimer) { silenceTimer = setTimeout(() => { if (mediaRecorder.state === 'recording') { isAutoPaused = true; pauseBtn.click(); chrome.runtime.sendMessage({ action: 'SHOW_NOTIFICATION', message: 'Spoly paused recording due to silence.' }); } }, 30000); }
        } else { clearTimeout(silenceTimer); silenceTimer = null; }
      } else if (mediaRecorder.state === 'paused' && isAutoPaused) {
        if (avgVolume > 4) { isAutoPaused = false; pauseBtn.click(); chrome.runtime.sendMessage({ action: 'SHOW_NOTIFICATION', message: 'Audio detected! Spoly resumed recording.' }); }
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
        
        wrapper.classList.remove('recording', 'paused');
        pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> <span class="btn-text">Pause</span>`;
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
            setTimeout(() => { sendBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> <span class="btn-text">Stop & Send to Spoly</span>`; sendBtn.style.opacity = '1'; }, 500);
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
      monitorSilence(mixedAudioStream, audioCtx); 
      isMasterTab = true; isAutoPaused = false;
      
      chrome.storage.local.set({ spolyRecordingLive: true, spolyRecordingStartTime: Date.now(), spolyRecordingPaused: false });
      chrome.runtime.sendMessage({ action: 'RECORDING_STARTED' }).catch(() => {});
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
      wrapper.classList.remove('recording'); wrapper.classList.add('paused');
      pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg> <span class="btn-text">Resume</span>`;
      orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg>`;
      pauseBtn.classList.remove('btn-pause'); pauseBtn.classList.add('btn-resume');

      chrome.storage.local.set({ spolyRecordingPaused: true }); 
      clearInterval(timerInterval); updateTimers(`PAUSED`);
      chrome.runtime.sendMessage({ action: 'SET_BADGE', text: 'PAUSE', color: '#F59E0B' });

    } else if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      wrapper.classList.remove('paused'); wrapper.classList.add('recording');
      pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> <span class="btn-text">Pause</span>`;
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
    isSendingToCloud = true; sendBtn.innerHTML = `<span class="btn-text">Transferring...</span>`; sendBtn.style.opacity = '0.7';
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
        wrapper.classList.remove('recording'); wrapper.classList.add('paused');
        pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg> <span class="btn-text">Resume</span>`;
        orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" rx="1"/></svg>`;
        pauseBtn.classList.remove('btn-pause'); pauseBtn.classList.add('btn-resume');
        updateTimers('PAUSED');
      } else {
        wrapper.classList.remove('paused'); wrapper.classList.add('recording');
        pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> <span class="btn-text">Pause</span>`;
        orbPause.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
        pauseBtn.classList.remove('btn-resume'); pauseBtn.classList.add('btn-pause');
        if (startTime) {
          const tick = () => { let sec = Math.floor((Date.now() - startTime) / 1000); updateTimers(formatTime(sec)); };
          tick(); remoteTimerInterval = setInterval(tick, 1000);
        }
      }
    } else {
      wrapper.classList.remove('recording', 'paused');
      pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> <span class="btn-text">Pause</span>`;
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

setInterval(() => {
  chrome.storage.local.get(['spolyRecordingLive'], (res) => {
    if (res.spolyRecordingLive) window.postMessage({ type: 'SPOLY_HEARTBEAT_LIVE' }, '*');
  });
}, 1000);

chrome.storage.onChanged.addListener((changes) => {
  if (changes.spolyBotX || changes.spolyBotY) {
    chrome.storage.local.get(['spolyBotX', 'spolyBotY'], (res) => {
      let targetX = Math.max(0, Math.min(res.spolyBotX, window.innerWidth - 60));
      let targetY = Math.max(0, Math.min(res.spolyBotY, window.innerHeight - 60));
      window.postMessage({ type: 'INTERNAL_SYNC_POS', x: targetX, y: targetY }, '*');
    });
  }
  if (changes.spolyPanelOpen) {
    chrome.storage.local.get(['spolyPanelOpen'], (res) => {
      window.postMessage({ type: 'INTERNAL_SYNC_PANEL', isOpen: res.spolyPanelOpen }, '*');
    });
  }
  if (changes.spolyMicMuted) {
    window.postMessage({ type: 'INTERNAL_SYNC_MUTE', isMuted: changes.spolyMicMuted.newValue }, '*');
  }
  if (changes.spolyRecordingLive || changes.spolyRecordingPaused) {
    chrome.storage.local.get(['spolyRecordingLive', 'spolyRecordingPaused', 'spolyRecordingStartTime'], (res) => {
      window.postMessage({ type: 'INTERNAL_SYNC_UI', isLive: res.spolyRecordingLive, isPaused: res.spolyRecordingPaused, startTime: res.spolyRecordingStartTime }, '*');
    });
  }
});

window.addEventListener('message', (e) => { 
  if (e.data.type === 'SPOLY_TOGGLE_WIDGET') {
    const isDeployed = !!document.getElementById('spoly-fab-root');
    chrome.runtime.sendMessage({ action: isDeployed ? 'GLOBAL_CLOSE' : 'GLOBAL_OPEN' });
  }
});

chrome.runtime.onMessage.addListener((req) => { 
  if (req.action === 'GLOBAL_CLOSE') {
    const existingBot = document.getElementById('spoly-fab-root');
    if (existingBot) { existingBot.remove(); hostElem = null; window.postMessage({ type: 'SPOLY_WIDGET_STATUS', status: false }, '*'); }
  }
  else if (req.action === 'GLOBAL_OPEN') { 
    chrome.storage.local.set({ spolyPanelOpen: false }, () => { injectNexusBot(); });
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
  else if (req.action === 'RECORDING_STARTED') { window.postMessage({ type: 'SPOLY_RECORDING_STARTED' }, '*'); }
  else if (req.action === 'RECORDING_STOPPED') { window.postMessage({ type: 'SPOLY_RECORDING_STOPPED' }, '*'); }
  else if (req.action === 'RECEIVE_AUDIO') { window.postMessage({ type: 'SPOLY_UPLOAD_COMPLETE', audioUrl: req.audioData }, '*'); }
});

if (!window.location.href.startsWith('chrome')) { 
  chrome.storage.local.get(['spolyBotActive'], (result) => {
    if (result.spolyBotActive === true) {
      setTimeout(() => { 
        if (document.readyState === 'complete') injectNexusBot(); 
        else window.addEventListener('load', injectNexusBot); 
      }, 500);
    }
  });
}