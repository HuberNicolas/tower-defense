# Java 15 and the Gradle wrapper (6.8.1) as used in 2021
FROM azul/zulu-openjdk:15 AS build
WORKDIR /app
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN ./gradlew --no-daemon dependencies > /dev/null
COPY src ./src
RUN ./gradlew --no-daemon bootJar

FROM azul/zulu-openjdk:15
WORKDIR /app
COPY --from=build /app/build/libs/soprafs21.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
