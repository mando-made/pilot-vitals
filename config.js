(function () {
  "use strict";
  window.PilotVitals = window.PilotVitals || {};

  window.PilotVitals.CONFIG = {
    // ---- Vitals (the three core gauges) ----
    vitals: [
      {
        id: "coolant",
        label: "COOLANT",
        unit: "(hydration)",
        action: "Refuel Coolant",
        decaySeconds: 2 * 60 * 60, // 2 hours to fully drain
        messages: {
          warn: "COOLANT RUNNING LOW. Refuel before thermal drift sets in.",
          crit: "COOLANT CRITICAL. Reactor efficiency dropping. Refuel now.",
          refuel: "Coolant refueled. Thermal margins restored."
        }
      },
      {
        id: "servo",
        label: "SERVO INTEGRITY",
        unit: "(stretch)",
        action: "Run Servo Diagnostic",
        decaySeconds: 90 * 60, // 1.5 hours
        messages: {
          warn: "SERVO STIFFNESS DETECTED. Run a diagnostic cycle.",
          crit: "SERVO INTEGRITY CRITICAL. Joints locking up. Diagnostic required.",
          refuel: "Servo diagnostic complete. Full range of motion restored."
        }
      },
      {
        id: "reactor",
        label: "REACTOR CORE",
        unit: "(movement)",
        action: "Vent Reactor",
        decaySeconds: 150 * 60, // 2.5 hours
        messages: {
          warn: "REACTOR HEAT BUILDING. Vent before you redline.",
          crit: "REACTOR OVERHEAT IMMINENT. Vent now or risk shutdown.",
          refuel: "Reactor vented. Core temperature nominal."
        }
      }
    ],

    // ---- Mission Timer (pomodoro-equivalent) ----
    missionTimer: {
      workMinutes: 25,
      restMinutes: 5
    },

    // ---- Ops Log (live commit activity feed) ----
    opsLog: {
      // Public GitHub repo to watch, as "owner/repo", e.g. "yourname/pilot-vitals"
      // once you've pushed this (or any other repo) to your own GitHub.
      // Leave blank until then; the panel shows an "unconfigured" message
      // instead of making a pointless API call.
      repo: "",
      pollMinutes: 10,
      maxEntries: 5
    }
  };
})();
