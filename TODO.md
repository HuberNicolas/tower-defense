# TODO

Open tasks before the repository is made public. See also [Known issues](README.md#known-issues).

## 1. Repository

- [x] Merge td-client and td-server into one repository with their full history (`client/`, `server/`)
- [x] Keep the 2021 state on the branch `original`
- [ ] Create `HuberNicolas/tower-defense` on GitHub and push `main` and `original`

## 2. Make it run

- [x] Docker setup with Java 15 (server) and Node 14 + nginx (client); `docker compose up --build` starts both
- [x] Play without an OpenWeather key (clear weather instead of a 403 on every new game)
- [x] Load sounds, weather icons and title music from the bundle instead of the old GitHub URLs
- [x] Read the API URL from `REACT_APP_API_URL` instead of the dead Heroku URL
- [x] Fix the client test (`Button3` used its keyframes before defining them)
- [x] Tested in the browser: register, log in, main menu, buy and place towers, Ready, Spawn Wave, round 2, Quit, settings
- [ ] Test with a real OpenWeather key (weather icon, location check in the settings)

## 3. Clean-up and security

- [x] Remove assets of unclear origin (menu music, background photos, title image, tree images)
- [x] Allow the H2 console only from localhost (it was open to everyone, without a password)
- [x] Add `.env.example`
- [ ] Unused code stays for now (multiplayer screens and endpoints, `client/.github`, `server/.github`, Heroku and
      SonarCloud files); remove it when deploying the game somewhere
- [ ] Return 404 instead of 500 for unknown game and user IDs (`getOne` → `findById`; the unit tests mock `getOne`)

## 4. Documentation

- [x] README with features, architecture, quick start, configuration, known issues, authors and credits
- [x] Guides in `docs/`: gameplay, architecture, API, development
- [x] New screenshots in `docs/images` (the old README linked to expired Discord attachments)
- [x] Credit Mauro by first name and GitHub account (`maurohirt`); his last name is uncertain

## 5. Before publishing

- [x] License: MIT with the team copyright (2021) and Nicolas Huber (2026); third-party assets listed separately
- [x] Credit third parties (sound effects, Feather icons, 3D Galax, Pokémon sprites, OpenWeather, fonts)
- [x] Keep the title music (own arrangement by Nicolas Huber of Ben Daglish's "3D Galax"), credited and excluded from
      the MIT License
- [x] Check for secrets in the files and the git history. Known: an OpenWeather API key of a former team member in
      commits `baf413c`/`07b58a6` (td-server history, April 2021). It has been public in the original repository since
      2021 and is left as is
- [ ] Set the GitHub description and topics
