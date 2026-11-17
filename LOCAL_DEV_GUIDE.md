# VoyagePilot AI — Local Development Guide

This guide walks you through setting up and running **VoyagePilot AI** on your local machine for active development and debugging.

---

## 1. Prerequisites

Ensure the following tools are installed on your workstation:

| Tool | Recommended Version | Verification Command |
|---|---|---|
| **Java JDK** | 21 LTS (or 17+) | `java -version` |
| **Apache Maven** | 3.9+ | `mvn -version` |
| **Node.js** | 20+ (LTS) | `node -v` |
| **npm** | 10+ | `npm -v` |
| **MySQL Server** | 8.0+ | `mysql -V` |

---

## 2. Database Setup

1. Start your local MySQL service (e.g. via MySQL Workbench, Windows Services, or terminal).
2. Open your MySQL client and create a dedicated database and development user:

```sql
CREATE DATABASE IF NOT EXISTS voyagepilot_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'voyage_user'@'localhost' IDENTIFIED BY 'voyage_secure_pwd_123';
GRANT ALL PRIVILEGES ON voyagepilot_db.* TO 'voyage_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Backend Setup & Run

### A. Environment Configuration
Navigate to the `backend` folder and copy `.env.example` to `.env` (or set environment variables in your IDE):

```bash
cd backend
cp .env.example .env
```

Review or edit `backend/src/main/resources/application.yaml`. Default properties read from environment variables or fall back safely:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/voyagepilot_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
    username: ${SPRING_DATASOURCE_USERNAME:voyage_user}
    password: ${SPRING_DATASOURCE_PASSWORD:voyage_secure_pwd_123}
```

### B. Run Database Migrations & Compile
Flyway runs automatically upon application startup. To compile the backend and verify the test suite:

```bash
mvn clean test
```

### C. Run the Spring Boot Server
Launch the Spring Boot server using Maven:

```bash
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`.
- **Health Check:** `http://localhost:8080/actuator/health`
- **Swagger Documentation:** `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON Spec:** `http://localhost:8080/v3/api-docs`

---

## 4. Frontend Setup & Run

### A. Environment Configuration
Navigate to the `frontend` directory:

```bash
cd ../frontend
cp .env.example .env
```

Ensure `frontend/.env` points to the local backend:
```ini
VITE_API_BASE_URL=http://localhost:8080/api
```

### B. Install Dependencies
```bash
npm install
```

### C. Run the Development Server
```bash
npm run dev
```

The Vite dev server will spin up on `http://localhost:5173`. Open your browser and navigate to `http://localhost:5173`.

---

## 5. Verification Checklist

1. **User Registration:** Navigate to `/register`, fill out the registration form, and submit. You will automatically receive an access token and be redirected to `/dashboard`.
2. **Dashboard Telemetry:** Verify that all dashboard statistics (Trips, Flights, Stays, Budget) reflect the user's newly created account state.
3. **Trip Creation:** Go to `/trips` -> click **Create New Trip** -> specify title, destination, dates, budget.
4. **Flight Association:** Go to `/flights` -> click **Add Flight** -> select your trip -> enter airline, flight number, departure/arrival IATA hubs (e.g. `BOM` -> `LHR`).
5. **Hotel Booking:** Go to `/hotels` -> click **Add Hotel / Stay** -> link to your trip -> provide hotel name, address, dates, cost.
6. **Geospatial Map:** Go to `/map` -> observe the interactive world map drawing geodesic flight corridors and destination pins.
7. **Disruption & AI Recommendations:** Go to `/disruptions` -> create or view disruptions -> click **AI Recommendation** to receive context-aware mitigation actions.
8. **Settings & Profile:** Go to `/settings` -> update user details or test changing the account password.

---

## 6. Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| `Access denied for user 'voyage_user'@'localhost'` | Incorrect MySQL credentials | Verify username/password in `application.yaml` or `.env`. Ensure MySQL user has permissions granted on `voyagepilot_db`. |
| `Communications link failure` | MySQL service not running | Start your MySQL service via `net start MySQL80` or service manager. |
| `CORS Error in Browser Console` | Frontend origin not whitelisted | Ensure `CORS_ALLOWED_ORIGINS` in backend configuration includes `http://localhost:5173`. |
| `Gemini API key missing` | `GEMINI_API_KEY` not configured | The system gracefully falls back to deterministic rule-based disruption analysis without crashing. Add your Gemini key to `.env` to enable live LLM synthesis. |
