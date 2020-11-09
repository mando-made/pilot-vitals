(function () {
  "use strict";
  window.PilotVitals = window.PilotVitals || {};

  var CONFIG = window.PilotVitals.CONFIG;
  var Storage = window.PilotVitals.Storage;
  var Log = window.PilotVitals.Log;

  var STORAGE_KEY = "pilotVitals.vitals.v1";
  var panelsEl = null;
  var state = {};

  function getVitalState(id) {
    if (!state[id]) {
      state[id] = { lastServiced: Date.now(), lastWarnLogged: false, lastCritLogged: false };
    }
    return state[id];
  }

  function pctFor(vital) {
    var vs = state[vital.id];
    var elapsed = (Date.now() - vs.lastServiced) / 1000;
    var pct = 100 - (elapsed / vital.decaySeconds) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    return pct;
  }

  function levelFor(pct) {
    if (pct <= 20) return "crit";
    if (pct <= 50) return "warn";
    return "ok";
  }

  function init() {
    panelsEl = document.getElementById("vitals-panels");
    state = Storage.load(STORAGE_KEY, {});
    CONFIG.vitals.forEach(function (v) {
      getVitalState(v.id);
    });

    panelsEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".action-btn");
      if (!btn) return;
      var id = btn.getAttribute("data-id");
      var vital = CONFIG.vitals.filter(function (v) {
        return v.id === id;
      })[0];
      var vs = state[id];
      vs.lastServiced = Date.now();
      vs.lastWarnLogged = false;
      vs.lastCritLogged = false;
      Log.push(vital.label + ": " + vital.messages.refuel, "ok");
      render();
    });
  }

  // Renders all vital panels and returns the worst current level
  // ("ok" | "warn" | "crit"), used by app.js to drive the header status dot.
  function render() {
    panelsEl.innerHTML = "";
    var worstLevel = "ok";

    CONFIG.vitals.forEach(function (vital) {
      var pct = pctFor(vital);
      var level = levelFor(pct);
      if (level === "crit") worstLevel = "crit";
      else if (level === "warn" && worstLevel !== "crit") worstLevel = "warn";

      var vs = state[vital.id];

      if (level === "warn" && !vs.lastWarnLogged) {
        Log.push(vital.label + ": " + vital.messages.warn, "warn");
        vs.lastWarnLogged = true;
      }
      if (level === "crit" && !vs.lastCritLogged) {
        Log.push(vital.label + ": " + vital.messages.crit, "crit");
        vs.lastCritLogged = true;
      }
      if (level === "ok") {
        vs.lastWarnLogged = false;
        vs.lastCritLogged = false;
      }

      var panel = document.createElement("div");
      panel.className = "panel";
      var glowVar = level === "crit" ? "var(--crit-glow)" : level === "warn" ? "var(--warn-glow)" : "var(--ok-glow)";
      var colorVar = level === "crit" ? "var(--crit)" : level === "warn" ? "var(--warn)" : "var(--ok)";
      panel.style.setProperty("--vital-color", colorVar);
      panel.style.setProperty("--vital-glow", glowVar);

      var statusText = level === "crit" ? "CRITICAL" : level === "warn" ? "ELEVATED RISK" : "NOMINAL";

      panel.innerHTML =
        '<div class="vital-row">' +
        '<div class="vital-label">' + vital.label + " <small>" + vital.unit + "</small></div>" +
        '<div class="vital-pct" style="color:' + colorVar + '">' + Math.round(pct) + "%</div>" +
        "</div>" +
        '<div class="gauge-track"><div class="gauge-fill ' + level + '" style="width:' + pct + '%"></div></div>' +
        '<div class="vital-foot">' +
        '<span class="vital-status ' + level + '">' + statusText + "</span>" +
        '<button class="action-btn" data-id="' + vital.id + '">' + vital.action + "</button>" +
        "</div>";

      panelsEl.appendChild(panel);
    });

    Storage.save(STORAGE_KEY, state);
    return worstLevel;
  }

  window.PilotVitals.Vitals = {
    init: init,
    render: render
  };
})();
