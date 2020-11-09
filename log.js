(function () {
  "use strict";
  window.PilotVitals = window.PilotVitals || {};

  var MAX_ENTRIES = 60;
  var logEl = null;
  var entries = [];

  function init() {
    logEl = document.getElementById("log");
  }

  function push(text, level) {
    var now = new Date();
    var ts = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    entries.unshift({ ts: ts, text: text, level: level || "sys" });
    if (entries.length > MAX_ENTRIES) entries.pop();
    render();
  }

  function render() {
    if (!logEl) return;
    logEl.innerHTML = entries
      .map(function (e) {
        return '<div class="log-line ' + e.level + '">[' + e.ts + "] " + e.text + "</div>";
      })
      .join("");
  }

  window.PilotVitals.Log = {
    init: init,
    push: push
  };
})();
