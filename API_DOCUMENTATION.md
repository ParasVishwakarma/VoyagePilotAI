# VoyagePilot AI — REST API Documentation

**API Specification Version:** 2.4.0  
**Base URL:** `http://localhost:8080/api` (Local) | `https://api.voyagepilot.ai/api` (Production)  
**OpenAPI / Swagger UI:** `http://localhost:8080/swagger-ui/index.html`

---

## 1. Authentication & Security

All protected endpoints require an HTTP `Authorization` header containing a valid JSON Web Token:
```http
Authorization: Bearer <your_jwt_access_token>
Content-Type: application/json
```

Standard Error Response Envelope:
```json
{
  "message": "Detailed description of error",
  "status": 400,
  "timestamp": "2026-11-17T00:00:00Z"
}
```

---

## 2. Authentication API (`/api/auth`)

### Register New User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "firstName": "Paras",
  "lastName": "Sharma",
  "email": "paras@example.com",
  "password": "SecurePassword123!",
  "phone": "+91 9876543210"
}
```
- **Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

### User Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "paras@example.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK):** Same token envelope as Register.

### Refresh Access Token
- **Endpoint:** `POST /api/auth/refresh-token`
- **Access:** Public
- **Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response (200 OK):** New `accessToken` and `refreshToken`.

### Request Password Reset
- **Endpoint:** `POST /api/auth/forgot-password`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "paras@example.com"
}
```
- **Response (200 OK):**
```json
{
  "message": "If an account with that email exists, password reset instructions have been sent.",
  "resetToken": "<development-token-if-active>"
}
```

### Complete Password Reset
- **Endpoint:** `POST /api/auth/reset-password`
- **Access:** Public
- **Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword456!"
}
```
- **Response (200 OK):**
```json
{
  "message": "Password successfully updated. You may now sign in."
}
```

---

## 3. User Account API (`/api/users`)

### Get Current Profile
- **Endpoint:** `GET /api/users/me`
- **Access:** Authenticated
- **Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "Paras",
  "lastName": "Sharma",
  "email": "paras@example.com",
  "phone": "+91 9876543210",
  "role": "ROLE_USER"
}
```

### Update Profile
- **Endpoint:** `PUT /api/users/me`
- **Access:** Authenticated
- **Request Body:** `{ "firstName": "Paras", "lastName": "Sharma", "phone": "+91 9999999999" }`

### Change Password
- **Endpoint:** `PUT /api/users/change-password`
- **Access:** Authenticated
- **Request Body:** `{ "currentPassword": "OldPassword123!", "newPassword": "NewPassword456!" }`

### Delete Account (Cascade)
- **Endpoint:** `DELETE /api/users/me`
- **Access:** Authenticated
- **Response (204 No Content)**

---

## 4. Dashboard Metrics API (`/api/dashboard`)

### Get Real-Time Dashboard Summary
- **Endpoint:** `GET /api/dashboard`
- **Access:** Authenticated
- **Response (200 OK):**
```json
{
  "totalTrips": 4,
  "totalFlights": 8,
  "activeAlerts": 1,
  "totalBudget": 4200.00,
  "totalSpent": 1850.50,
  "totalHotels": 3,
  "upcomingTrip": {
    "id": 12,
    "title": "Summer Europe Expedition",
    "destination": "Zurich, Switzerland",
    "startDate": "2026-07-15",
    "endDate": "2026-07-28",
    "daysUntil": 15
  },
  "activeFlights": [
    {
      "id": 24,
      "flightNumber": "LH757",
      "airline": "Lufthansa",
      "departureAirport": "BOM",
      "arrivalAirport": "FRA",
      "status": "ON_TIME"
    }
  ]
}
```

---

## 5. Trips API (`/api/trips`)

- `GET /api/trips/my-trips?page=0&size=10` — List authenticated user's trips.
- `GET /api/trips/{id}` — Get trip by ID (strictly isolated to owner).
- `POST /api/trips` — Create new trip.
```json
{
  "title": "Swiss Alps Tour",
  "destination": "Zurich",
  "startDate": "2026-08-01",
  "endDate": "2026-08-10",
  "budget": 3500.00,
  "status": "PLANNED"
}
```
- `PUT /api/trips/{id}` — Update existing trip.
- `DELETE /api/trips/{id}` — Delete trip and all cascading associations.

---

## 6. Flights API (`/api/flights`)

- `GET /api/flights/trip/{tripId}` — Get all flights associated with a specific trip.
- `POST /api/flights` — Create new flight entry.
```json
{
  "tripId": 12,
  "flightNumber": "BA138",
  "airline": "British Airways",
  "departureAirport": "BOM",
  "arrivalAirport": "LHR",
  "departureTime": "2026-08-01T02:15:00",
  "arrivalTime": "2026-08-01T07:30:00",
  "status": "SCHEDULED"
}
```
- `PUT /api/flights/{id}` — Update flight details or flight status.
- `DELETE /api/flights/{id}` — Delete flight record.

---

## 7. Hotels & Accommodations API (`/api/hotels`)

- `GET /api/hotels` — Get all hotel bookings for the authenticated user.
- `GET /api/hotels/trip/{tripId}` — Get all stays for a specific trip.
- `POST /api/hotels` — Create a new hotel accommodation.
```json
{
  "tripId": 12,
  "name": "Baur au Lac Luxury Suites",
  "address": "Talstrasse 1, 8001 Zurich",
  "checkIn": "2026-08-01T15:00:00",
  "checkOut": "2026-08-06T11:00:00",
  "roomType": "Deluxe Alpine View",
  "price": 1450.00,
  "confirmationCode": "BAL-98231",
  "status": "CONFIRMED"
}
```
- `PUT /api/hotels/{id}` — Update hotel details.
- `DELETE /api/hotels/{id}` — Delete hotel booking.

---

## 8. Disruptions & AI Engine API (`/api/disruptions`)

- `GET /api/disruptions` — List disruptions belonging to the current user's flights.
- `POST /api/disruptions` — Register a disruption event.
```json
{
  "flightId": 24,
  "type": "WEATHER_DELAY",
  "severity": "HIGH",
  "description": "Severe thunderstorms causing 180-minute ground delay."
}
```
- `POST /api/disruptions/{id}/ai-recommendation` — Trigger Google Gemini AI Disruption Engine to generate mitigation action.

---

## 9. Recommendations API (`/api/recommendations`)

- `GET /api/recommendations` — List all user recommendations.
- `PUT /api/recommendations/{id}/accept` — Accept suggested recommendation.
- `PUT /api/recommendations/{id}/reject` — Reject suggested recommendation.

---

## 10. Notifications API (`/api/notifications`)

- `GET /api/notifications` — Retrieve live notification items for the current user.
- `POST /api/notifications/mark-all-read` — Mark all active alerts as read.
