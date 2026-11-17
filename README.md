# VoyagePilot AI — Autonomous Travel Intelligence & Management Platform

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v6-007FFF.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/License-Proprietary-navy.svg)](#)

---

## Executive Overview

**VoyagePilot AI** is an enterprise-grade, full-stack travel intelligence and itinerary orchestration platform. Designed for modern corporate and personal travelers, VoyagePilot AI harmonizes end-to-end trip planning, real-time flight telemetry, hotel reservations, interactive geospatial mapping, predictive disruption mitigation powered by Google Gemini, and automated email/in-app notifications into a unified, high-performance web experience.

---

## Technology Stack

### Frontend Architecture
- **Framework:** React 19 + Vite 6
- **UI Design System:** Material UI (MUI v6) with customized Royal Blue / Executive Navy SaaS palette (`#2563EB`, `#0B132B`, `#0EA5E9`)
- **Routing:** React Router v7 with route code-splitting (`React.lazy` and `Suspense`)
- **Geospatial Visualization:** Vector SVG Equirectangular Projection Engine (`InteractiveMap.jsx`) with pan/zoom, flight corridors, destination waypoints, and accommodation pins
- **Charts & Telemetry:** Recharts 2.x
- **Animations:** Framer Motion
- **State & Context:** React Context API (`SearchContext`, `NotificationContext`)
- **HTTP Client:** Axios with JWT auto-injection interceptor

### Backend Architecture
- **Runtime:** Java 21 LTS
- **Core Framework:** Spring Boot 3.4.3
- **Security:** Spring Security 6 with stateless JWT authentication & refresh token rotation
- **Persistence:** Spring Data JPA / Hibernate
- **Database Engine:** MySQL 8.0+
- **Schema Management:** Flyway Migrations (Versions `V1` through `V8`)
- **API Documentation:** OpenAPI 3.0 (Swagger UI at `/swagger-ui/index.html`)
- **Observability:** Spring Boot Actuator (`/actuator/health`, `/actuator/info`)
- **AI Engine:** Google Gemini API integration with rule-based graceful fallback

---

## Key Features & Capabilities

### 1. Executive Dashboard (`/dashboard`)
- Live user telemetry calculated dynamically from the backend:
  - Total Trips, Total Flights, Active Disruption Alerts, Cumulative Budget, and Logged Stays.
  - Next Upcoming Trip card with countdown days.
  - Active Flight Corridor status.
  - Real-time recent disruption notifications.
  - Quick action shortcuts (Plan Trip, Add Flight, Book Stay, Open Map).

### 2. Multi-Tenant Trip Management (`/trips`)
- Full lifecycle CRUD for trips with strict user data isolation.
- Destination details, date ranges, budget tracking, and status filtering (`PLANNED`, `ACTIVE`, `COMPLETED`, `CANCELLED`).
- Associated flights and hotels count per trip.

### 3. Flight Tracking & Corridors (`/flights`)
- Real-time flight tracking across airline, flight number, departure/arrival IATA hubs, terminal, gate, and schedule.
- Instant flight status updates (`SCHEDULED`, `ON_TIME`, `DELAYED`, `CANCELLED`).
- Automatic integration with the disruption monitoring engine.

### 4. Hotels & Accommodation (`/hotels`)
- Comprehensive lodging management linked to specific trips.
- Hotel name, address/city, check-in/check-out datetime, room type, total cost, and booking confirmation code.
- Status management (`CONFIRMED`, `PLANNED`, `CANCELLED`).

### 5. Geospatial Interactive Map (`/map`)
- Proprietary vector world map supporting smooth zoom (0.8x to 3.0x) and 2D pan.
- Geodesic flight corridor arcs between departure and arrival hubs.
- Destination pins and hotel stay badges with click-to-inspect modal popups.
- Trip-specific corridor filtering.

### 6. AI Disruption Analysis & Recommendations (`/recommendations`, `/disruptions`)
- AI-driven disruption risk analysis powered by Google Gemini.
- Contextual mitigation strategies (alternative flights, hotel re-booking, refund guidance).
- Built-in rule-based fallback when external AI API credentials are not supplied.

### 7. Notification System (`/api/notifications`)
- Live notifications for flight status updates, upcoming departures, and disruption alerts.
- Topbar notification bell with unread badge counter, popover menu, and "Mark all as read" capability.

### 8. User Profile & Security Settings (`/settings`)
- Profile update (first name, last name, phone).
- Secure password change with old password verification.
- Safe self-service account deletion with full transactional cascade.

---

## Repository Structure

```
VoyagePilotAI/
├── backend/                        # Spring Boot 3.4 REST API
│   ├── src/main/java/com/travelguardian/
│   │   ├── auth/                   # Security, JWT, Auth Controller/Service
│   │   ├── config/                 # SecurityConfig, OpenApiConfig, CorsConfig
│   │   ├── dashboard/              # Aggregated dashboard metrics API
│   │   ├── disruption/             # Disruption tracking & Gemini AI engine
│   │   ├── exception/              # GlobalExceptionHandler, ConflictException
│   │   ├── flight/                 # Flight entity, repository, controller, service
│   │   ├── hotel/                  # Hotel entity, repository, controller, service
│   │   ├── notification/           # Live user notification engine
│   │   ├── recommendation/         # Recommendation entity, controller, service
│   │   ├── trip/                   # Trip & Itinerary entities and services
│   │   └── user/                   # User profile, repository, controller, service
│   ├── src/main/resources/
│   │   ├── application.yaml        # Parameterized environment configuration
│   │   └── db/migration/           # Flyway migrations V1 through V8
│   ├── src/test/java/              # Unit & integration test suites
│   ├── Dockerfile                  # Multi-stage production container
│   ├── .env.example                # Backend configuration template
│   └── pom.xml                     # Maven project descriptor
├── frontend/                       # React 19 + Vite 6 Single Page App
│   ├── src/
│   │   ├── api/                    # Axios API service clients (auth, trip, flight, hotel, etc.)
│   │   ├── components/             # Reusable design system components
│   │   │   ├── analytics/          # Recharts visualization modules
│   │   │   ├── common/             # Loader, EmptyState, ConfirmDialog, StatCard
│   │   │   ├── dashboard/          # Topbar, Sidebar, FlightTable
│   │   │   ├── flights/            # FlightDialog modal
│   │   │   ├── hotels/             # HotelDialog modal
│   │   │   ├── landing/            # Hero, Navbar, Features, StatsSection
│   │   │   ├── map/                # InteractiveMap SVG projection
│   │   │   └── trips/              # TripDialog modal
│   │   ├── context/                # SearchContext, NotificationContext
│   │   ├── layouts/                # DashboardLayout with responsive sidebar
│   │   ├── pages/                  # Lazy-loaded page views
│   │   └── theme/                  # MUI theme palette (Royal Blue / Navy)
│   ├── Dockerfile                  # Multi-stage Nginx container
│   ├── nginx.conf                  # Nginx SPA router & compression config
│   ├── .env.example                # Frontend configuration template
│   └── package.json
├── docker-compose.yml              # Complete 3-tier local stack (DB + Backend + Frontend)
├── LOCAL_DEV_GUIDE.md              # Local workstation development guide
├── PRODUCTION_DEPLOYMENT_GUIDE.md  # Production Docker & Cloud deployment guide
├── API_DOCUMENTATION.md            # Comprehensive REST API reference
├── TESTING_REPORT.md               # Unit, integration, and build test results
└── SECURITY_REPORT.md              # Security audit & remediation report
```

---

## Quick Start (Docker Compose)

The easiest way to run the entire VoyagePilot AI stack locally:

```bash
# 1. Clone or extract the project repository
cd VoyagePilotAI

# 2. Start MySQL 8, Backend, and Frontend in containers
docker compose up --build -d

# 3. Access the services:
# Frontend Application:  http://localhost
# Backend REST API:     http://localhost:8080/api
# Swagger UI Docs:      http://localhost:8080/swagger-ui/index.html
# Spring Health Check:  http://localhost:8080/actuator/health
```

For detailed manual installation instructions, refer to [LOCAL_DEV_GUIDE.md](LOCAL_DEV_GUIDE.md).
For cloud hosting (AWS, Render, Railway, Vercel), refer to [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md).
