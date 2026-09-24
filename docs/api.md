# REST API

Base URL: `http://localhost:8080` (see [Configuration](../README.md#configuration)). All bodies are JSON.

The server has no authentication header. Endpoints that act for a user take the user's **token** in the path or body;
the token is returned by sign-up and login. Errors return the HTTP status and a JSON body with `status`, `error` and
`path`; the `message` field is empty because Spring Boot 2.4 hides exception messages by default.

Controllers: [UserController](../server/src/main/java/ch/uzh/ifi/hase/soprafs21/controller/UserController.java),
[GameController](../server/src/main/java/ch/uzh/ifi/hase/soprafs21/controller/GameController.java),
[LobbyController](../server/src/main/java/ch/uzh/ifi/hase/soprafs21/controller/LobbyController.java).

## Users

| Method and path | Body | Response | Errors |
|---|---|---|---|
| `POST /users` (sign up) | `{username, password}` | `201` `{token, userId}` | `409` username taken |
| `PUT /users` (log in) | `{username, password}` | `200` `{token, userId}` | `404` unknown username, `401` wrong password |
| `PATCH /users` (log out) | `{token}` | `200` | `400` invalid token |
| `PATCH /users/profiles/{token}` | `{username?, password?, location?}`; omitted fields stay unchanged | `200` | `404` user not found, `403` username taken or location unknown to OpenWeather |
| `GET /users` | | `200` list of online users `[{userId, username, status}]` | |

## Singleplayer game

| Method and path | Body | Response | Errors |
|---|---|---|---|
| `POST /games` | `{player1Id}` (a `userId`) | `201` game, see below | `500` unknown player (see below), `403` weather lookup failed |
| `GET /games/{gameId}` | | `200` game | `500` unknown game (see below) |
| `POST /games/towers/{token}` (buy) | `{playable, coordinates}` | `201` `{gold}` | `404` unknown tower, `403` field blocked or not enough gold, `400` invalid coordinates |
| `PATCH /games/towers/{token}` (upgrade) | `{coordinates}` | `200` `{gold}` | `403` not upgradeable or not enough gold |
| `PATCH /games/towers/sales/{token}` (sell) | `{coordinates}` | `200` `{gold}` (70 % of the tower price back) | `403` nothing to sell |
| `GET /games/battles/{token}` (start wave) | | `200` `{player1Minions, player2Minions}` | `400` no game for this token |
| `PATCH /games/{token}` (end of wave) | `{gold, health}` | `200` `{continuing}`; `false` and the game is deleted when `health` ≤ 0 | `404` board not found, `403` negative gold |
| `DELETE /games/{token}` (quit) | | `200` | `404` board not found |

- `playable` is a level-1 tower name: `PlantTower1`, `WaterTower1`, `FireTower1`, `PsychTower1` or `DragonTower1`.
- `coordinates` is `[x, y]` with `x` from 0 to 14 and `y` from 0 to 9.
- `GET /games/battles/{token}` also increases the round and adds 10 % interest to the player's gold.
- Unknown game or user IDs return `500` instead of `404`: the service loads them with `getOne`, which never returns
  `null`, so its not-found check does not trigger.

Game response (`GET /games/{gameId}`, `POST /games`), shortened:

```json
{
  "gameId": 3,
  "round": 1,
  "player1": {
    "owner": "alice",
    "boardId": 4,
    "gold": 500,
    "health": 50,
    "weather": "Clear",
    "board": [[null, "blocked", null, "..."], "..."]
  },
  "player2": null
}
```

`board` has 10 rows of 15 fields. A field is `null` (free), `"blocked"` (path) or a tower name such as `PlantTower2`.
`weather` is the `main` value from OpenWeather, for example `Clear`, `Clouds`, `Rain`.

## Multiplayer (unfinished)

These endpoints exist but the client does not use them in the final game.

| Method and path | Body | Response |
|---|---|---|
| `GET /lobbies` | | `200` `[{lobbyId, lobbyOwner}]` |
| `POST /lobbies` | `{token}` | `201` `{lobbyId}` |
| `GET /lobbies/{lobbyId}` | | `200` `{lobbyOwner, player2, player2Status}` |
| `PATCH /lobbies/{lobbyId}` (join) | `{token}` | `200` `{lobbyOwner, player2, player2Status}` |
| `PUT /lobbies/{lobbyId}` (leave) | `{token}` | `200` |
| `POST /games` | `{player1Id, player2Id}` | `201` game with two boards |
| `POST /games/minions/{gameId}/{token}` | `{minion}` | `200` `{gold}`: buys an extra monster for the opponent's next wave |

## Example with curl

```bash
curl -X POST localhost:8080/users -H 'Content-Type: application/json' -d '{"username":"alice","password":"secret"}'
```

```bash
curl -X POST localhost:8080/games -H 'Content-Type: application/json' -d '{"player1Id":1}'
```

```bash
curl -X POST localhost:8080/games/towers/<token> -H 'Content-Type: application/json' -d '{"playable":"PlantTower1","coordinates":[3,1]}'
```
