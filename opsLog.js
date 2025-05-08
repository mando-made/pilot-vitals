(function () {
  "use strict";
  window.PilotVitals = window.PilotVitals || {};

  // Pulls recent commit activity from a public GitHub repo (configured in
  // config.js) via GitHub's unauthenticated REST API and renders it as an
  // incoming-transmissions feed.

  var CONFIG = window.PilotVitals.CONFIG;
  var panelEl = null;
  var pollTimer = null;

  function init() {
    panelEl = document.getElementById("ops-log-panel");

    if (!CONFIG.opsLog.repo) {
      renderUnconfigured();
      return;
    }

    renderLoading();
    fetchCommits();

    var intervalMs = (CONFIG.opsLog.pollMinutes || 10) * 60 * 1000;
    pollTimer = setInterval(fetchCommits, intervalMs);
  }

  function title() {
    return "OPS LOG" + (CONFIG.opsLog.repo ? ": " + CONFIG.opsLog.repo.toUpperCase() : "");
  }

  function renderUnconfigured() {
    panelEl.innerHTML =
      '<div class="log-title">' + title() + '</div>' +
      '<div class="ops-line sys">Not configured. Set opsLog.repo in config.js to a "owner/repo" on your own GitHub to see live activity here.</div>';
  }

  function renderLoading() {
    panelEl.innerHTML =
      '<div class="log-title">' + title() + '</div>' +
      '<div class="ops-line sys">Establishing comms link...</div>';
  }

  function fetchCommits() {
    var url =
      "https://api.github.com/repos/" +
      CONFIG.opsLog.repo +
      "/commits?per_page=" +
      (CONFIG.opsLog.maxEntries || 5);

    fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API responded with " + res.status);
        return res.json();
      })
      .then(renderCommits)
      .catch(renderError);
  }

  function timeAgo(dateStr) {
    var diffMs = Date.now() - new Date(dateStr).getTime();
    var mins = Math.floor(diffMs / 60000);
    if (mins < 60) return mins + "m ago";
    var hours = Math.floor(mins / 60);
    if (hours < 24) return hours + "h ago";
    var days = Math.floor(hours / 24);
    return days + "d ago";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCommits(commits) {
    if (!commits || !commits.length) {
      panelEl.innerHTML = '<div class="log-title">' + title() + '</div><div class="ops-line sys">No recent activity.</div>';
      return;
    }

    var rows = commits
      .map(function (c) {
        var author = (c.commit && c.commit.author && c.commit.author.name) || "unknown";
        var message = ((c.commit && c.commit.message) || "").split("\n")[0];
        var when = c.commit && c.commit.author ? timeAgo(c.commit.author.date) : "";
        return (
          '<div class="ops-line">' +
          '<span class="ops-when">' + when + "</span> " +
          '<span class="ops-author">' + escapeHtml(author) + "</span>: " +
          '<span class="ops-msg">' + escapeHtml(message) + "</span>" +
          "</div>"
        );
      })
      .join("");

    panelEl.innerHTML = '<div class="log-title">' + title() + "</div>" + rows;
  }

  function renderError() {
    panelEl.innerHTML =
      '<div class="log-title">' + title() + '</div>' +
      '<div class="ops-line crit">Comms link down. Couldn\'t reach GitHub (rate limit or offline). Retrying next cycle.</div>';
  }

  window.PilotVitals.OpsLog = {
    init: init
  };
})();
