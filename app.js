(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    window.PilotVitals.Log.init();
    window.PilotVitals.Vitals.init();
    window.PilotVitals.MissionTimer.init();
    window.PilotVitals.OpsLog.init();

    if (!window.PilotVitals.Storage.isAvailable()) {
      window.PilotVitals.Log.push("LOCAL STORAGE UNAVAILABLE. Vitals and timer will reset on reload.", "warn");
    } else {
      window.PilotVitals.Log.push("PILOT VITALS ONLINE. All systems reporting.", "sys");
    }

    tick();
    setInterval(tick, 1000);
  });

  function tick() {
    var now = new Date();
    var clockEl = document.getElementById("clock");
    if (clockEl) {
      clockEl.textContent =
        now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
        " · " +
        now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    var worstLevel = window.PilotVitals.Vitals.render();
    window.PilotVitals.MissionTimer.tick();
    updateStatusDot(worstLevel);
  }

  function updateStatusDot(level) {
    var dot = document.getElementById("status-dot");
    if (!dot) return;
    var color = level === "crit" ? "var(--crit)" : level === "warn" ? "var(--warn)" : "var(--ok)";
    dot.style.background = color;
    dot.style.boxShadow = "0 0 6px " + color;
  }
})();
