# Stage 1: Build JAR with Maven
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace

# Install Maven
RUN apk add --no-cache maven

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build executable fat JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production JRE runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install curl for container health check
RUN apk add --no-cache curl

# Create unprivileged runtime user
RUN addgroup -S voyage && adduser -S voyage -G voyage
USER voyage:voyage

# Copy built JAR from builder stage
COPY --from=builder --chown=voyage:voyage /workspace/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
