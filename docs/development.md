# Development

The project keeps the versions from 2021. The easiest way to get the matching Java and Node versions is Docker.

| Part | Runtime | Build tool |
|---|---|---|
| Server | Java 15 | Gradle 6.8.1 (wrapper) |
| Client | Node 14 (react-scripts 4 fails on Node 17+ with an OpenSSL error) | npm with `package-lock.json` |

## Server

Build and run all tests in a Java 15 container (from the repository root):

```bash
docker run --rm -v "$PWD/server:/app" -v td-gradle-cache:/root/.gradle -w /app azul/zulu-openjdk:15 ./gradlew --no-daemon build
```

This compiles the server, runs 107 JUnit tests and writes reports to `server/build/reports/tests/test`. One test
(`editProfile_invalidLocation_throwsException`) needs the real OpenWeather API and is skipped unless `WeatherKey` is
set; pass it with `-e WeatherKey=<your key>`.

## Client

Install the locked dependencies and run the test in a Node 14 container:

```bash
docker run --rm -v "$PWD/client:/app" -w /app node:14 npm ci
```

```bash
docker run --rm -v "$PWD/client:/app" -w /app -e CI=true node:14 npm test
```

The only test renders the app once. It prints `Not implemented: HTMLCanvasElement.prototype.getContext`, because jsdom
has no canvas; the test still passes.

ESLint runs as part of `npm run build` and `npm run dev` with the Create React App rules (`react-app`).

## Without Docker

Not tested with current systems; you need the old runtimes.

Server, with a JDK 15 installed:

```bash
cd server
```

```bash
./gradlew bootRun
```

Client, with Node 14 or 16 (for example through [nvm](https://github.com/nvm-sh/nvm)):

```bash
cd client
```

```bash
npm ci
```

```bash
npm run dev
```

`npm run dev` starts the development server on port 3000 and talks to `http://localhost:8080`. Set
`REACT_APP_API_URL` to use another server.

## Where to change what

| Change | File |
|---|---|
| Tower damage, speed, reload time, colours | [Game.js](../client/src/components/game/Game.js), objects `TOWERS`, `TOWERS2`, `TOWERS3` |
| Tower and monster prices | [GameService.java](../server/src/main/java/ch/uzh/ifi/hase/soprafs21/service/GameService.java), maps `towerLevel1Map` … `minionMap`, and the `towerCost` values in `Game.js` (both must match) |
| Monster health, speed, damage | [Game.js](../client/src/components/game/Game.js), object `MINIONS` |
| Composition of waves | `GameService.startBattlePhase` |
| Path and board layout | [Board.java](../server/src/main/java/ch/uzh/ifi/hase/soprafs21/entity/Board.java) (`gameMap`) and the path drawing in `Game.js` |
| Start gold and HP | [Board.java](../server/src/main/java/ch/uzh/ifi/hase/soprafs21/entity/Board.java) |
| Sounds | [client/src/assets/sounds](../client/src/assets/sounds), imported at the top of `Game.js` |
| API URL of the client | [getDomain.js](../client/src/helpers/getDomain.js) / `REACT_APP_API_URL` |
| Routes | [AppRouter.js](../client/src/components/shared/routers/AppRouter.js) |

## Code conventions

- Client: React class components, styled-components for most styles, inline style objects in some screens.
  Game code lives in one file and uses closures inside `componentDidMount` instead of separate modules.
- Server: layered Spring structure (controller → service → repository), DTOs mapped with MapStruct
  (`DTOMapper`). Services throw `ResponseStatusException` for client errors.
- Game names are German Pokémon names (`Karpador` = Magikarp, `Nebulak` = Gastly, `Garados` = Gyarados,
  `Lavados` = Moltres, `Arktos` = Articuno).

## Troubleshooting

| Problem | Cause and fix |
|---|---|
| `error:0308010C:digital envelope routines::unsupported` | Node 17 or newer. Use Node 14/16 or Docker |
| Gradle or the build fails on a newer JDK | Gradle 6.8 and the toolchain setting expect Java 15. Use Java 15 or Docker |
| Port 3000 or 8080 is in use | Set `CLIENT_PORT` / `SERVER_PORT` in `.env` |
| "The server cannot be reached" alert | Server not running, or the client was built with another `SERVER_PORT`; rebuild with `docker compose up --build` |
| No monster or tower images | The browser cannot reach `raw.githubusercontent.com` |
| Game is cut off | The canvas needs about 1400 × 800 pixels; zoom out in the browser |
