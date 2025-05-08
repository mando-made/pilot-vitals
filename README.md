# pilot-vitals

I am bad at taking breaks when I am deep in something, so I built myself a
dashboard that nags me to drink water, stretch, and get up and move. I did
not want a plain to-do widget though, so I dressed the whole thing up as a
mech cockpit readout: hydration is coolant level, stretch breaks are servo
maintenance, and getting up to move is a reactor cooldown cycle. If my
coolant is in the red, I am dehydrated.

## How I built it

I wanted it to actually keep nagging me over a long session, not just show
a static page, so the core is a set of gauges that drain over time and
escalate through green, amber, and red the longer I ignore them. Each gauge
is just a value and a decay rate, and the tick loop in `app.js` drops them
on a timer.

I kept every tunable number in one `config.js` file (decay rates, timer
lengths, the warning messages) so I can tweak how naggy it is without
digging through the logic. State goes into `localStorage` wrapped in
try/catch, so if I leave the tab open and come back, it has genuinely been
counting down the whole time, and if storage is blocked it just resets
instead of breaking.

Once the gauges worked I added two more panels that turned it from a toy
into something I actually leave open:

- a **Mission Timer**, which is a pomodoro-style work/stand-down cycle
- an **Ops Log**, which pulls recent commits from a public GitHub repo I
  point it at and shows them as an incoming-transmissions feed

Everything writes to one shared **System Log** panel, so there is a single
running record of what every module has done.

## Run it

No build step. I just open `index.html`, or serve the folder:

```bash
python -m http.server
```

or, with Node:

```bash
npm start
```

## Configuring the Ops Log

It starts unconfigured. To switch it on, I set `opsLog.repo` in `config.js`
to one of my own public repos (for example `mando-made/scriptyr`) and it
starts pulling that repo's recent commits.

## What's in here

- `index.html`: markup
- `style.css`: the HUD styling, gauges and layout
- `config.js`: every tunable setting in one place
- `storage.js`: my shared `localStorage` helpers
- `log.js`: the shared system log panel
- `vitals.js`: the three core gauges
- `missionTimer.js`: the pomodoro-style work/rest timer
- `opsLog.js`: the live GitHub activity feed
- `app.js`: wires it all together and runs the main tick loop

## Notes

No dependencies and no build tool, it is all plain script tags. I wanted to
be able to open the raw file and have it just work.
