# Server

Spring Boot 2.4 REST server with Java 15, Gradle 6.8.1 and an in-memory H2 database.

| Command | Purpose |
|---|---|
| `./gradlew bootRun` | Start the server on [http://localhost:8080](http://localhost:8080) |
| `./gradlew build` | Compile and run the tests |
| `./gradlew test` | Run the tests |

Set the environment variable `WeatherKey` to an [OpenWeather](https://openweathermap.org/api) API key to use real
weather; without it the game uses clear weather. [Dockerfile](Dockerfile) builds and runs the server with Java 15.

See the [main README](../README.md), [API](../docs/api.md), [architecture](../docs/architecture.md) and
[development guide](../docs/development.md). The original 2021 README is on the
[`original` branch](../../../blob/original/server/README.md).
