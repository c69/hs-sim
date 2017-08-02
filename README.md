# hs-sim

To run: `node main.js` (or press `F5` in VSCode)

To configure: edit **main.js** (yes, manually)

### Webstorm Users: To enable better automatic code style fixes install
jscs globally and enable the plugin in webstorm
https://www.themarketingtechnologist.co/how-to-get-airbnbs-javascript-code-style-working-in-webstorm/

### "Light" workflow (No server watch, no webpack-dev-server, no live reload, cheaper source maps)

When running `watch:light` open: http://localhost:8000

```
cd client
npm run watch:light

// Open another tab in terminal
cd server
npm start // will start node without nodemon watcher

// You can still run npm run watch if you're planning to develop node
```
