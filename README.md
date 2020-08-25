# sche
some web tools for making/viewing schedules

## description
sche is 3 tools:
- [schedule](https://hywn.github.io/sche/schedule.html): type schedule info and get nice schedule
- [uva](https://hywn.github.io/sche/uva.html): type UVA class codes and get nice schedule
- [clock](https://hywn.github.io/sche/clock.html): take schedule info and get clock
	- not very fleshed out

schedule and uva are both imo pretty complete 'type some stuff, press ctrl+s, and see visual change'-type app?s, and I hope the included tutorials explain how to use them.

clock is kinda weird; I haven't worked it out very well.

## files
```
index.html    -- index/info page
schedule.html -- display schedule
uva.html      -- display UVA schedule
clock.html    -- display schedule clock

schedule.css -- stylesheet for schedule.html and uva.html

canvasschedule.js -- turn schedule data into canvas display
schedule.js       -- turn text into schedule data (and vice-versa)
louscurl.js       -- turn UVA class codes into schedule data
```

## notes
- sche is entirely vanilla HTML+JS and can run from your filesystem in most modern browsers (have tested in Chrome + Firefox)
- uva/louscurl.js gets its data from [louslist.org](https://louslist.org/) via a CORS workaround currently hosted on my personal school account