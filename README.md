# 🎬 cinereserve – Online Movie Ticket Booking System

> **A Complete Full-Stack Web Application built with Java Spring Boot, MySQL, and Vanilla JavaScript for B.Tech CSE Projects, College PBL, Resume Portfolio, and Technical Interviews.**

---

## 📌 1. Project Overview
**cinereserve** is an enterprise-style, full-stack movie ticketing and cinema auditorium management web application. It automates ticket reservation workflows by providing an **interactive 2D cinema hall seating matrix**, an **ACID-compliant transactional booking engine with double-booking prevention**, **live price calculations with tax/fee breakdowns**, **simulated multi-channel checkout**, **printable digital e-tickets**, and a **role-secured cinema administration dashboard**.

---

## ❓ 2. Problem Statement
Manual box-office ticketing and unintegrated cinema tools suffer from:
- Long physical waiting lines and slow counter ticket issuance.
- Inability for patrons to visually inspect screen distance, aisle location, or seat tier before purchasing.
- Concurrency conflicts and duplicate ticket issuance (double-booking) during rush hours.
- Manual financial accounting and spreadsheet reconciliations prone to human error.
- Static scheduling difficulties when managing multiple screens across multiplexes.

---

## 🎯 3. Main Objectives
1. **Interactive Seat Selection:** Provide an intuitive 2D visual layout of cinema auditoriums with distinct seat tiers (Standard, Premium, VIP Recliner).
2. **Concurrency Integrity:** Guarantee zero double-booking at the database and application levels using composite unique keys and transactional locking.
3. **Automated Price Ledger:** Compute ticket subtotals, convenience fees (5%), and GST (18%) automatically on the server.
4. **Digital Invoicing:** Generate instant digital e-tickets with unique alphanumeric booking references and barcode visualizers.
5. **Cinema Management Portal:** Give cinema owners real-time control over film catalogues, auditorium screens, showtimes, and sales analytics.

---

## ✨ 4. Key Features

### User Features:
- **Age Verification for Restricted (18+) Movies:** Dynamic age verification modal prompting Date of Birth (DOB) and government photo ID proof type (Aadhaar, Passport, Driving Licence, Voter ID, Other Photo ID) without storing sensitive documents. Strict dual-layer client/server age calculation prevents underage bookings ($<18$) and blocks unauthorized API bypass attempts.
- **User Registration & Login:** BCrypt password encryption with stateless HMAC-SHA256 session token management.
- **Movie Catalog Discovery:** Browse "Now Showing" and "Coming Soon" movies with poster art, censor ratings, language, and duration.
- **Real-Time Search & Filters:** Filter movies instantly by title, genre, language, and status.
- **Movie Details & Trailer Player:** View complete synopsis, censor certifications, and links to official trailers.
- **Dynamic Showtime Selector:** Date-picker tabs (Today, Tomorrow, +2 days) with showtimes grouped by cinema complexes and screens.
- **2D Interactive Cinema Seat Map:** Curved cinema screen representation, real-time availability indicator, tier color coding, and running subtotal ledger.
- **Simulated Payment Checkout:** Sandbox checkout supporting UPI (GPay/PhonePe/Paytm), Credit/Debit Cards, NetBanking, and Digital Wallets.
- **Digital E-Ticket & Invoice:** Printable/downloadable e-ticket with barcode graphic, cinema address, allocated seat codes, and 18+ theatre entrance verification notice.
- **Booking History & Self-Service Cancellation:** View past/active tickets and cancel bookings with automated seat release and refund tracking.
- **User Profile Management:** Update personal profile details (full name, phone number) with account role indicator.

### Admin Features:
- **Executive Analytics Dashboard:** Real-time metrics showing total box-office revenue, total bookings, active shows, and catalog counts.
- **Movie Catalogue CRUD:** Add new theatrical releases, edit film metadata, and archive movies.
- **Theatre & Screen Management:** View multiplex complexes, auditorium screen details, and master seating templates.
- **Show Scheduling Engine:** Schedule movie screenings for specific screens with temporal collision prevention.
- **Transaction & Booking Audit Logs:** Complete audit table of all customer bookings, payment methods, and transaction references.

---

## 🛠️ 5. Technology Stack

| Layer | Technology | Purpose & Justification |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, CSS3, Vanilla JavaScript (ES6+) | Semantic layout, custom Dark Cinema styling (Obsidian & Amber Gold), responsive DOM manipulation, Fetch API client without heavy framework bloat. |
| **Backend Framework** | Java 17 LTS, Spring Boot 3.2.4 | Enterprise REST API, Inversion of Control (IoC), Dependency Injection, declarative transaction management (`@Transactional`). |
| **Security** | Spring Security 6.x + BCrypt + JWT | Stateless HMAC-SHA256 authentication, Role-Based Access Control (`ROLE_CUSTOMER`, `ROLE_ADMIN`), password salting (12 rounds). |
| **Database** | MySQL Server 8.0+ | ACID-compliant relational storage, foreign key constraints, composite unique indexes, optimistic locking versioning. |
| **ORM / Data Access** | Spring Data JPA / Hibernate | Object-Relational Mapping, automated CRUD repository generation, parameterized queries preventing SQL injection. |
| **Build & Tooling** | Apache Maven & Maven Wrapper (`mvnw.cmd`) | Standardized dependency management and reproducible build lifecycles. |

---

## 🏛️ 6. System Architecture

The application follows the **3-Tier Layered Architecture**:

```
+-------------------------------------------------------------------------+
|                        PRESENTATION TIER (Frontend)                     |
|  - HTML5 Pages (index, movies, movie-details, seat-booking, checkout)   |
|  - Vanilla CSS3 Theme (style.css, seat-grid.css, admin.css)             |
|  - Vanilla JS Controllers (api.js, auth.js)                             |
+-------------------------------------------------------------------------+
                                     │  (JSON over REST API)
                                     ▼
+-------------------------------------------------------------------------+
|                        APPLICATION TIER (Spring Boot)                   |
|  - REST Controllers (Auth, Movie, Show, Booking, Theatre, Payment)      |
|  - Security Filter Chain (AuthTokenFilter, JwtUtils, BCrypt)            |
|  - Service Layer (@Transactional BookingService, ShowService)           |
|  - Data Transfer Objects (DTOs) & Global Exception Handler              |
|  - Data Access Layer (Spring Data JPA Repositories)                     |
+-------------------------------------------------------------------------+
                                     │  (JDBC / SQL)
                                     ▼
+-------------------------------------------------------------------------+
|                          DATA TIER (MySQL Database)                     |
|  - 10 Relational Tables (users, movies, theatres, screens, seats,       |
|    shows, show_seats, bookings, booking_items, payments)                |
|  - Unique Constraints, Foreign Keys & Indexes                           |
+-------------------------------------------------------------------------+
```

---

## 📂 7. Project Structure

```
cinereserve-movie-booking/
├── database/
│   ├── 01_schema.sql                  # MySQL DDL: Tables, constraints, unique keys, indexes
│   └── 02_seed_data.sql               # MySQL DML: Sample movies, theatres, screens, seats, shows
├── backend/
│   ├── pom.xml                        # Maven dependencies & build plugins
│   ├── mvnw & mvnw.cmd                # Maven Wrapper execution scripts
│   ├── .mvn/wrapper/                  # Maven Wrapper binary configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/cinereserve/
│       │   │   ├── cinereserveApplication.java
│       │   │   ├── config/            # SecurityConfig, JwtUtils, AuthTokenFilter
│       │   │   ├── controller/        # Auth, Movie, Show, Booking, Theatre, Payment, Admin, User, Health
│       │   │   ├── dto/               # Request/Response DTOs & ApiResponse wrapper
│       │   │   ├── entity/            # User, Movie, Theatre, Screen, Seat, Show, ShowSeat, Booking, Payment
│       │   │   ├── exception/         # ResourceNotFound, BadRequest, Conflict, GlobalExceptionHandler
│       │   │   ├── repository/        # 9 Spring Data JPA Repositories
│       │   │   └── service/           # AuthService, MovieService, ShowService, BookingService, TheatreService
│       │   └── resources/
│       │       ├── application.properties         # Active MySQL datasource & constants
│       │       ├── application-example.properties # Template configuration for Git
│       │       └── static/                        # Embedded copy of frontend for single-port run
│       └── test/
│           ├── java/com/cinereserve/
│           │   ├── cinereserveApplicationTests.java  # Spring Boot Context Bootstrapping Test
│           │   └── BookingServiceTest.java        # JUnit 5 + Mockito Unit & Concurrency Tests
│           └── resources/
│               └── application.properties         # In-memory H2 test configuration
└── frontend/                          # Standalone Web Client
    ├── index.html                     # Home page, now showing, upcoming movies & auth modals
    ├── movies.html                    # Dedicated catalogue search & filter page
    ├── movie-details.html             # Movie synopsis, trailer player & showtimes grouped by hall
    ├── seat-booking.html              # 2D Interactive Seat Matrix with curved screen visual
    ├── checkout.html                  # Order summary, session timer & simulated payment
    ├── ticket.html                    # Printable digital e-ticket invoice with barcode
    ├── history.html                   # Booking history dashboard with cancellation trigger
    ├── profile.html                   # User profile overview & account update
    ├── admin.html                     # Cinema management console & audit ledger
    ├── css/                           # style.css, seat-grid.css, admin.css
    └── js/                            # api.js (REST client), auth.js (Auth state manager)
```

---

## 🗄️ 8. Database Design & Tables

The relational schema consists of **10 normalized tables (up to 3NF)**:

| # | Table Name | Purpose | Key Columns & Constraints |
| :--- | :--- | :--- | :--- |
| 1 | **`users`** | Customer & Admin accounts. | `id` (PK), `email` (UNIQUE), `password` (BCrypt hash), `role` (`ROLE_CUSTOMER`/`ROLE_ADMIN`). |
| 2 | **`movies`** | Film catalog. | `id` (PK), `title`, `genre`, `language`, `duration_minutes`, `censor_rating`, `status`. |
| 3 | **`theatres`** | Multiplex buildings. | `id` (PK), `name`, `city`, `address`, `total_screens`. |
| 4 | **`screens`** | Individual auditoriums. | `id` (PK), `theatre_id` (FK), `screen_name`, `total_rows`, `total_cols`, `capacity`. |
| 5 | **`seats`** | Master layout template. | `id` (PK), `screen_id` (FK), `seat_row`, `seat_number`, `seat_type` (`STANDARD`/`PREMIUM`/`VIP`), `UNIQUE(screen_id, seat_row, seat_number)`. |
| 6 | **`shows`** | Scheduled screenings. | `id` (PK), `movie_id` (FK), `screen_id` (FK), `start_time`, `end_time`, `base_price`, `status`. |
| 7 | **`show_seats`** | **Live availability per show.** | `id` (PK), `show_id` (FK), `seat_id` (FK), `status` (`AVAILABLE`/`LOCKED`/`BOOKED`), `price`, `version` (Optimistic lock), **`UNIQUE(show_id, seat_id)`**. |
| 8 | **`bookings`** | Confirmed reservation. | `id` (PK), `booking_number` (UNIQUE), `user_id` (FK), `show_id` (FK), `total_amount`, `tax_amount`, `convenience_fee`, `status`. |
| 9 | **`booking_items`**| Reserved seat line items. | `id` (PK), `booking_id` (FK), `show_seat_id` (FK), `unit_price`. |
| 10| **`payments`** | Transaction audit log. | `id` (PK), `booking_id` (FK), `transaction_ref` (UNIQUE), `payment_method`, `amount`, `status` (`SUCCESS`/`REFUNDED`). |

### 🛡️ Double-Booking Prevention Mechanism:
- Physical seat `C4` is defined **once** in the `seats` table.
- When **Show 1** is scheduled, a record is created in `show_seats` for `(Show 1, Seat C4)`.
- When **Show 2** is scheduled, a separate record is created for `(Show 2, Seat C4)`.
- The database constraint `UNIQUE KEY uk_show_seat (show_id, seat_id)` physically prevents duplicate records from ever being created.
- In the application layer, the `@Transactional` method checks seat status and locks versions, rejecting any conflicting concurrent attempts with `409 Conflict`.

---

## 📡 9. Complete REST API Reference

### Authentication Endpoints
- `POST /api/auth/register` – Register customer account (Body: `RegisterRequest`).
- `POST /api/auth/login` – Authenticate user and obtain Bearer JWT token (Body: `AuthRequest`).

### Movie Catalogue Endpoints (Public)
- `GET /api/movies` – Get all active movies.
- `GET /api/movies/now-showing` – Get movies currently running in theatres.
- `GET /api/movies/coming-soon` – Get upcoming releases.
- `GET /api/movies/{id}` – Get detailed movie synopsis by ID.
- `GET /api/movies/search?query={title}&status={status}` – Search movies by query.
- `GET /api/movies/genres` – Get distinct movie genres.
- `GET /api/movies/languages` – Get distinct movie languages.

### Theatre & Screen Endpoints (Public)
- `GET /api/theatres` – List all multiplex theatres.
- `GET /api/theatres/{id}` – Get theatre details.
- `GET /api/theatres/{id}/screens` – Get screens for a theatre complex.
- `GET /api/theatres/screens/{screenId}/seats` – Get master seat layout for a screen.

### Showtime & Seat Matrix Endpoints (Public)
- `GET /api/shows?movieId={id}&date={YYYY-MM-DD}` – Get showtimes for a movie and date.
- `GET /api/shows/{id}` – Get show details.
- `GET /api/shows/{id}/seats` – Fetch 2D seat matrix with live `AVAILABLE` / `BOOKED` statuses and tier prices.

### Booking & Transaction Endpoints (Requires Bearer Token)
- `POST /api/bookings` – Create transactional booking (Body: `BookingRequest` $\rightarrow$ `showId`, `showSeatIds`, `paymentMethod`).
- `GET /api/bookings/my-bookings` – Retrieve authenticated user's booking history.
- `GET /api/bookings/{bookingNumber}` – Retrieve confirmed e-ticket data by booking reference.
- `POST /api/bookings/{id}/cancel` – Cancel eligible booking, release seats, and refund payment.

### Payment Endpoints (Public / Authenticated)
- `GET /api/payments/{transactionRef}` – Get payment audit details.
- `GET /api/payments/status/{transactionRef}` – Get payment status (`SUCCESS`, `REFUNDED`).

### User Profile Endpoints (Requires Bearer Token)
- `GET /api/user/profile` – Retrieve user account information.
- `PUT /api/user/profile` – Update full name or phone number.

### Cinema Admin Endpoints (Requires `ROLE_ADMIN`)
- `GET /api/admin/metrics` – Get box-office revenue, total bookings, active shows, and movie counts.
- `POST /api/admin/movies` – Add a new movie to the catalog.
- `PUT /api/admin/movies/{id}` – Update movie details.
- `DELETE /api/admin/movies/{id}` – Archive a movie.
- `POST /api/admin/shows` – Schedule a new show screening with automatic seat matrix instantiation.
- `GET /api/admin/bookings` – View all customer booking audit logs.
- `GET /api/admin/theatres` – Get all theatres.

### System Heartbeat
- `GET /api/health` – Returns API service health status.

---

## 🚀 10. Installation & Running Instructions

### Prerequisites:
- **Java Development Kit (JDK):** OpenJDK 17 LTS or OpenJDK 21 LTS installed.
- **Database Server:** MySQL Server 8.0+ running on port `3306`.
- **Web Browser:** Google Chrome, Firefox, or Microsoft Edge.

---

### Step 1: Initialize MySQL Database
1. Open MySQL Workbench or your terminal:
   ```bash
   mysql -u root -p
   ```
2. Execute the schema and seed scripts:
   ```sql
   SOURCE c:/Users/guday/Downloads/cinereserve-movie-booking/database/01_schema.sql;
   SOURCE c:/Users/guday/Downloads/cinereserve-movie-booking/database/02_seed_data.sql;
   ```

---

### Step 2: Configure Database Credentials
Open `backend/src/main/resources/application.properties` and verify your MySQL password:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cinereserve_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

### Step 3: Run the Spring Boot Application
In your terminal or PowerShell:
```powershell
cd c:\Users\guday\Downloads\cinereserve-movie-booking\backend
.\mvnw.cmd spring-boot:run
```
*(Or in IntelliJ IDEA / Eclipse: Open `backend/pom.xml` and run `cinereserveApplication.java`)*

---

### Step 4: Access the Application
Open your browser and navigate to:
👉 **`http://localhost:8080`**

*(Since all frontend files are embedded into the Spring Boot static bundle, the entire full-stack application runs seamlessly on port 8080!)*

---

## 🔑 11. Default Development Test Accounts

| Account Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Cinema Administrator** | `admin@cinereserve.com` | `admin123` | Dashboard metrics, Movie CRUD, Show scheduler, Booking audit logs. |
| **Demo Customer** | `customer@cinereserve.com` | `customer123` | Browse catalog, Book 2D seats, View e-tickets, Cancel bookings. |

---

## 🧪 12. Automated Testing Summary

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Standard multi-seat booking with tax/fee math | Booking confirmed, total calculated accurately, seats marked BOOKED. | Status `CONFIRMED`, tax (18%) and fee (5%) math verified. | ✅ PASS |
| **TC-02** | Anti-Collision: User B attempts to book User A's booked seat | Request rejected with `409 Conflict`, transaction rolled back. | Throws `ConflictException` (`409 Conflict`). | ✅ PASS |
| **TC-03** | Duplicate seat IDs in same request payload `[1000, 1000]` | Request rejected with `400 Bad Request`. | Throws `BadRequestException`. | ✅ PASS |
| **TC-04** | Exceeding maximum 6-seat limit per transaction | Request rejected with `400 Bad Request`. | Throws `BadRequestException`. | ✅ PASS |
| **TC-05** | Booking attempt on a past or in-progress show | Request blocked before modifying seats. | Throws `BadRequestException`. | ✅ PASS |
| **TC-06** | Spring Boot Application Context Load | All 9 JPA repositories and security filter beans bootstrap cleanly. | Context bootstraps in under 8 seconds. | ✅ PASS |

---

## 🔒 13. Security Features
1. **Password Hashing:** Passwords encrypted using BCrypt with 12 rounds of salting.
2. **DTO Protection:** `@JsonIgnore` prevents password hashes from leaking in API responses.
3. **Role-Based Access Control:** Strict authorization barrier on `/api/admin/**` preventing regular customers from accessing administrative functions.
4. **SQL Injection Defense:** 100% of database access is mediated through Spring Data JPA parameterized queries.
5. **Server-Side Price Calculation:** Prevents frontend price-tampering attacks.

---

## ⚠️ 14. Known Limitations
- **Simulated Payment Gateway:** Payment processing is simulated for academic demonstration purposes and does not charge real currency.
- **SMS Notifications:** Digital tickets are generated dynamically on-screen and are printable/exportable rather than dispatched via paid SMS gateways.

---

## 🔮 15. Future Enhancements
1. **Live Payment Gateway Integration:** Connecting live webhooks with Razorpay, Stripe, or PayPal.
2. **Real-Time WebSockets Seat Locking:** Broadcasting live seat-selection events over STOMP/WebSockets.
3. **QR Code Door Scanner:** Mobile web camera scanner for cinema entry gate staff.
4. **Email Automation:** Automated e-ticket PDF dispatch using Spring Boot `JavaMailSender`.
5. **Food & Beverage (F&B) Add-ons:** Pre-ordering popcorn and snacks bundled into ticket invoices.

---

## 👨‍💻 16. Author & Academic Information
- **Project Title:** Online Movie Ticket Booking System (cinereserve)
- **Course / Degree:** Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)
- **Year / Semester:** Final Year / Project-Based Learning (PBL) Submission
- **Repository:** Private / Academic Portfolio
