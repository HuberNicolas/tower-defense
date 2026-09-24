# Client

React 17 single-page app (Create React App 4). The game runs on an HTML canvas in
[src/components/game/Game.js](src/components/game/Game.js).

| Command | Purpose |
|---|---|
| `npm ci` | Install the locked dependencies (Node 14 or 16) |
| `npm run dev` | Development server on [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build in `build/` |
| `npm test` | Run the test |

The API URL is read from `REACT_APP_API_URL` at build time (default `http://localhost:8080`).
[Dockerfile](Dockerfile) builds with Node 14 and serves the result with nginx ([nginx.conf](nginx.conf)).

See the [main README](../README.md), [architecture](../docs/architecture.md) and
[development guide](../docs/development.md). The original 2021 README is on the
[`original` branch](../../../blob/original/client/README.md).
