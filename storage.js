(function () {
  "use strict";
  window.PilotVitals = window.PilotVitals || {};

  var storageOk = null;

  function testStorage() {
    if (storageOk !== null) return storageOk;
    try {
      localStorage.setItem("__pv_test__", "1");
      localStorage.removeItem("__pv_test__");
      storageOk = true;
    } catch (e) {
      storageOk = false;
    }
    return storageOk;
  }

  function load(key, fallback) {
    if (!testStorage()) return fallback;
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    if (!testStorage()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // best-effort; ignore quota/availability errors
    }
  }

  window.PilotVitals.Storage = {
    isAvailable: testStorage,
    load: load,
    save: save
  };
})();
