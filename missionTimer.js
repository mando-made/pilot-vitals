(function () {
  "use strict";
  window.PilotVitals = window.PilotVitals || {};

  var CONFIG = window.PilotVitals.CONFIG;
  var Storage = window.PilotVitals.Storage;
  var Log = window.PilotVitals.Log;

  var STORAGE_KEY = "pilotVitals.missionTimer.v1";
  var panelEl = null;

  var state = {
    phase: "work", // "work" | "rest"
    running: false,
    remainingSeconds: 0,
    lastTick: null
  };

  function phaseSeconds(phase) {
    var minutes = phase === "work" ? CONFIG.missionTimer.workMinutes : CONFIG.missionTimer.restMinutes;
    return minutes * 60;
  }

  function init() {
    panelEl = document.getElementById("mission-timer-panel");

    var loaded = Storage.load(STORAGE_KEY, null);
    if (loaded) {
      state = loaded;
      state.running = false; // never auto-resume a running timer across reloads
    } else {
      state.remainingSeconds = phaseSeconds("work");
    }

    panelEl.addEventListener("click", function (e) {
      if (e.target.closest(".mt-start")) toggleRunning();
      if (e.target.closest(".mt-skip")) skipPhase();
    });

    render();
  }

  function toggleRunning() {
    state.running = !state.running;
    state.lastTick = Date.now();
    if (state.running) {
      Log.push(
        "MISSION TIMER: " + (state.phase === "work" ? "Operation window started." : "Stand-down started."),
        "sys"
      );
    }
    save();
    render();
  }

  function skipPhase() {
    switchPhase();
    save();
    render();
  }

  function switchPhase() {
    state.phase = state.phase === "work" ? "rest" : "work";
    state.remainingSeconds = phaseSeconds(state.phase);
    Log.push(
      "MISSION TIMER: " +
        (state.phase === "work" ? "Stand-down complete. Back to operations." : "Operation window complete. Stand down."),
      "ok"
    );
  }

  // Called once a second from app.js's main loop.
  function tick() {
    if (!state.running) return;
    var now = Date.now();
    var elapsed = Math.floor((now - (state.lastTick || now)) / 1000);
    if (elapsed <= 0) return;
    state.lastTick = now;
    state.remainingSeconds -= elapsed;

    if (state.remainingSeconds <= 0) {
      switchPhase();
    }
    save();
    render();
  }

  function fmt(totalSeconds) {
    var s = Math.max(0, totalSeconds);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }

  function save() {
    Storage.save(STORAGE_KEY, state);
  }

  function render() {
    var phaseLabel = state.phase === "work" ? "OPERATION WINDOW" : "STAND-DOWN";
    var colorVar = state.phase === "work" ? "var(--cyan)" : "var(--ok)";

    panelEl.innerHTML =
      '<div class="vital-row">' +
      '<div class="vital-label">MISSION TIMER <small>(' + phaseLabel + ')</small></div>' +
      '<div class="vital-pct" style="color:' + colorVar + '">' + fmt(state.remainingSeconds) + "</div>" +
      "</div>" +
      '<div class="vital-foot">' +
      '<span class="vital-status">' + (state.running ? "RUNNING" : "PAUSED") + "</span>" +
      "<span>" +
      '<button class="action-btn mt-start">' + (state.running ? "Pause" : "Start") + "</button> " +
      '<button class="action-btn mt-skip">Skip</button>' +
      "</span>" +
      "</div>";
  }

  window.PilotVitals.MissionTimer = {
    init: init,
    tick: tick
  };
})();
