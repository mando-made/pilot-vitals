# pilot-vitals

A terminal-style dashboard that nags you to drink water, stretch, and move,
reskinned as a mech cockpit readout. Hydration becomes coolant level, stretch
breaks become servo maintenance, and getting up to move becomes a reactor
cooldown cycle.

## Run it

No build step. Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server
```

or, if you have Node:

```bash
npm start
```

## Features

- **Vitals**: three gauges (Coolant / hydration, Servo Integrity / stretch,
  Reactor Core / movement) that drain over time and escalate from green to
  amber to red the longer they're neglected.
- **Mission Timer**: a pomodoro-style work/stand-down cycle.
- **Ops Log**: pulls recent commit activity from a public GitHub repo you
  configure and displays it as an incoming-transmissions feed. Unconfigured
  by default; set `opsLog.repo` in `config.js` to one of your own repos
  once it's live.
- **System Log**: a shared event log that every module above writes to.
- State persists in `localStorage`, so leaving the tab open genuinely nags
  you over time.

## Files

- `index.html`: markup
- `style.css`: HUD styling (colours, gauges, layout)
- `config.js`: every tunable setting in one place (decay rates, timer
  lengths, which repo the ops log watches)
- `storage.js`: shared `localStorage` helpers
- `log.js`: the shared system log panel
- `vitals.js`: the three core gauges
- `missionTimer.js`: the pomodoro-style work/rest timer
- `opsLog.js`: the live GitHub activity feed
- `app.js`: wires everything together and runs the main clock/tick loop
- `package.json` / `.gitignore` / `LICENSE`: standard project scaffolding
