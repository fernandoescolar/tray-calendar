# Tray Calendar for mac

An example app for building a native-looking Mac OS X tray app with a popover and a calendar using [Electron](http://electron.atom.io) with typescript.

The app shows a tray icon with the date information and when you press it, it shows a calendar.

![tray-calendar](https://github.com/fernandoescolar/tray-calendar/raw/master/assets/screenshot.png "Tray Calendar Running")

Built with [photon](http://photonkit.com).

## Running

```sh
git clone https://github.com/fernandoescolar/tray-calendar
cd tray-calendar
npm install
npm start
```

## Packaging

```sh
npm run package
open out/tray-calendar-darwin-x64/tray-calendar.app
```

