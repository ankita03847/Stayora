# Stayora — Property Discovery & Booking Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-stayora--vert.vercel.app-success?style=for-the-badge&logo=vercel)](https://stayora-vert.vercel.app)
[![Sign Up](https://img.shields.io/badge/Get_Started-Sign_Up_Now-ff385c?style=for-the-badge)](https://stayora-vert.vercel.app/signuser)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Cloud-brightgreen.svg?logo=mongodb)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-blue.svg?logo=cloudinary)](https://cloudinary.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg?logo=bootstrap)](https://getbootstrap.com/)
[![Passport.js](https://img.shields.io/badge/Auth-Passport.js-orange.svg?logo=passport)](http://www.passportjs.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> **Stayora** is a full-stack, two-sided property discovery and reservation marketplace built with Node.js, Express, MongoDB Atlas, and EJS. It bridges the gap between travelers searching for unique holiday stays and property owners managing listings, availability, and reservation requests.

🌐 **Live Application**: [https://stayora-vert.vercel.app](https://stayora-vert.vercel.app)  
📝 **Sign Up / Register**: [https://stayora-vert.vercel.app/signuser](https://stayora-vert.vercel.app/signuser)

---

## 🌟 Key Highlights

- **Two-Sided Marketplace**: Distinct user workflows for **Travelers (Guests)** and **Hosts (Property Owners)**.
- **Date-Overlap Availability Engine**: Mathematical date-range validation preventing double bookings.
- **Host & Owner Dashboard**: Real-time business KPIs (Properties, Pending Requests, Confirmed Stays, Revenue) with one-click **Accept / Reject** actions.
- **Interactive Stayora Booking Card**: Real-time client-side calculation for nights, fees, and grand total.
- **Cloud Image Architecture**: Direct multi-format file uploads powered by **Multer** and **Cloudinary**.
- **Categorized Discovery**: 15 custom travel category filters (Beach, Skiing, Desert, Castles, Camping, Arctic, etc.) and real-time destination search.
- **Enterprise-Grade Session Store**: Production sessions backed by MongoDB Atlas (`connect-mongo`) ensuring sessions persist across server restarts.

---

## 🏗️ Platform Architecture

```
                          STAYORA PLATFORM
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
        GUEST WORKFLOW                        OWNER WORKFLOW
              │                                     │
      Browse & Filter Stays                 List & Manage Properties
              │                                     │
      View Property Details                 Cloudinary Image Upload
              │                                     │
     Check Date Availability               Real-Time Request Badges
              │                                     │
      Submit Booking Request                Owner Dashboard Overview
              │                                     │
     Track "My Bookings"                   Accept / Reject Requests
              │                                     │
        Complete Stay                      Auto-Block Booked Dates
              │                                     │
      Verified Guest Review                 Revenue & Payout Tracking
```

---

## 🚀 Features Breakdown

### 1. 🧳 Guest & Traveler Experience
- **15 Category Icon Filters**: Browse by *Beach, Windmills, Modern, Countryside, Pools, Islands, Lake, Skiing, Castles, Caves, Camping, Arctic, Desert, Barns, Lux*.
- **Search Engine**: Case-insensitive instant search across title, location, country, and category.
- **Booking Request Workflow**: Pick check-in and check-out dates, select guests count, and provide an optional note to the host.
- **Live Price Calculator**: Real-time breakdown showing `$ [rate] x [nights] + 10% platform fee = total`.
- **"My Bookings" Trip Center**: Track all requested stays with live status ribbons:
  - 🟡 `Pending Host Approval` (with cancellation option)
  - 🟢 `Confirmed Stay`
  - 🔴 `Declined by Host`
  - ⚪ `Cancelled`
- **Wishlist Heart**: Interactive toggle on all listing cards.

### 2. 🏠 Host & Owner Management
- **Owner Dashboard (`/dashboard`)**:
  - **KPI Cards**: Active properties, pending reservation requests, confirmed stays, and total revenue.
  - **Actionable Booking Requests**: Review incoming guest details, dates, and total payout with **Accept** and **Reject** buttons.
  - **Upcoming Stays Schedule**: View upcoming confirmed guest check-ins.
  - **Property Manager**: Quick shortcuts to view, edit, or delete hosted properties.
- **Self-Booking Protection**: Hosts visiting their own properties see a host management banner instead of the booking form.
- **Live Notification Badge**: Alert badge on the navbar (`🔴 3`) showing pending requests requiring host action.

### 3. 🛡️ Security, Validation & Infrastructure
- **Date Overlap Prevention**: Ensures no overlapping confirmed reservations using:
  $$\text{checkIn} < \text{existingCheckOut} \quad\land\quad \text{checkOut} > \text{existingCheckIn}$$
- **Authentication**: Passport.js local strategy with password hashing and salting via `passport-local-mongoose`.
- **Authorization Middlewares**:
  - `isloggedIn`: Guards booking requests and private pages.
  - `isOwner`: Restricts property modification and deletion to the creator.
  - `isreviewsAuthor`: Restricts review deletion to the author.
- **Joi Validation**: Server-side schema validation for listing input and reviews.
- **MongoDB Atlas + Connect-Mongo**: High-availability cloud database connection with automatic session management.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | EJS, EJS-Mate | Server-side templating with modular layouts |
| **Styling** | Bootstrap 5, Vanilla CSS | Responsive design, modern aesthetics, custom animations |
| **Icons & Fonts** | FontAwesome 6, Plus Jakarta Sans | Modern iconography and typography |
| **Backend** | Node.js, Express.js | Core MVC server architecture and RESTful routing |
| **Database** | MongoDB, Mongoose | NoSQL document database with schema modeling |
| **Cloud Database** | MongoDB Atlas | Free M0 cloud cluster with multi-region replication |
| **Session Store** | `connect-mongo` | MongoDB-backed persistent user sessions |
| **Authentication** | Passport.js, Passport-Local | User registration, login, and session serialization |
| **Cloud Storage** | Cloudinary, Multer | Multi-part media handling and cloud image hosting |
| **Validation** | Joi | Robust request body and schema validation |

---

## 📁 Project Structure

```bash
Stayora/
├── controllers/          # Business logic handlers
│   ├── booking.js        # Booking workflow & overlap validation
│   ├── dashboard.js      # Host metrics & KPI aggregation
│   ├── listing.js        # Property CRUD & search queries
│   ├── reviews.js        # Review submissions & cascades
│   └── user.js           # Authentication & user profile
├── models/               # Mongoose schemas
│   ├── booking.js        # Booking data model & state enum
│   ├── listing.js        # Property listing schema
│   ├── reviews.js        # Review schema with user ref
│   └── user.js           # User schema with Passport plugin
├── route/                # Express router endpoints
│   ├── bookingexpress.js # /bookings & booking action routes
│   ├── dashboardexpress.js # /dashboard host routes
│   ├── listingexpress.js # /listing property routes
│   ├── login.js          # /loginUser authentication
│   ├── reviewexpress.js  # /listing/:id/reviews endpoints
│   └── signuser.js       # /signuser registration
├── views/                # EJS templates
│   ├── bookings/         # Guest "My Bookings" page
│   ├── includes/         # Navbar, Footer, Flash alerts
│   ├── layouts/          # Boilerplate HTML shell
│   ├── owner/            # Host & Owner Dashboard
│   ├── User/             # Sign-up & Login forms
│   ├── index.ejs         # 5-column listing catalog & categories
│   ├── show.ejs          # Property details & Stayora booking card
│   ├── new.ejs           # Property creation form
│   ├── edit.ejs          # Property update form
│   └── error.ejs         # Centralized error display
├── public/               # Static assets
│   ├── css/              # Custom design system (style.css, review.css)
│   └── js/               # Client-side scripts & form validation
├── init/                 # Database initialization & mock data
│   ├── data.js           # Sample properties with cloud images
│   └── insdb.js          # Cloud seeding script
├── utils/                # Error handling utilities
│   ├── ExpressError.js   # Custom HTTP error class
│   └── WrapAsync.js      # Asynchronous error wrapper
├── cloudConfig.js        # Cloudinary SDK & Multer storage configuration
├── middleware.js         # Authentication & authorization guards
├── app.js                # Server entry point & middleware stack
├── package.json          # Node dependencies & npm scripts
└── .gitignore            # Secret & artifact protection
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A free [Cloudinary](https://cloudinary.com/) Account (Cloud Name, API Key, API Secret)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) Account or local MongoDB

### 2. Clone the Repository
```bash
git clone https://github.com/ankita03847/Stayora.git
cd Stayora
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Cloudinary Credentials
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# MongoDB Atlas Connection String
ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/stayora?retryWrites=true&w=majority

# Session Encryption Secret
SECRET=your_secret_session_key
PORT=8080
```

### 5. Seed the Database (Optional)
To populate your database with 29 initial properties across all 15 categories:
```bash
node init/insdb.js
```

### 6. Start the Application
```bash
# Production start
npm start

# Development with hot-reload
npm run dev
```

Open **`http://localhost:8080`** in your browser.

---

## 📋 REST API & Route Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/listing` | Public | Explore all properties (supports `?category=` and `?search=`) |
| `GET` | `/listing/new` | Logged In | Render property listing form |
| `POST`| `/listing` | Logged In | Upload image to Cloudinary & create property |
| `GET` | `/listing/:id` | Public | View property details and interactive booking widget |
| `GET` | `/listing/:id/edit`| Owner Only | Render property edit form |
| `PUT` | `/listing/:id` | Owner Only | Update property details and optional replacement image |
| `DELETE`| `/listing/:id`| Owner Only | Delete property and cascade delete reviews |
| `POST`| `/listing/:id/book`| Logged In (Guest) | Validate dates & submit booking request |
| `GET` | `/bookings` | Logged In (Guest) | View "My Bookings" traveler trip status |
| `POST`| `/bookings/:id/cancel`| Guest Only | Cancel a pending reservation request |
| `GET` | `/dashboard` | Logged In (Host) | View Owner Dashboard & KPI revenue analytics |
| `POST`| `/bookings/:id/accept`| Owner Only | Confirm booking request & block conflicting dates |
| `POST`| `/bookings/:id/reject`| Owner Only | Decline reservation request |
| `POST`| `/listing/:id/reviews`| Logged In | Submit rating and feedback comment |
| `DELETE`| `/listing/:id/reviews/:reviewId`| Author Only | Delete review |
| `GET` | `/signuser` | Public | Render user registration page |
| `POST`| `/signuser` | Public | Register new user & auto-login |
| `GET` | `/loginUser` | Public | Render user login page |
| `POST`| `/loginUser` | Public | Authenticate user via Passport local strategy |
| `GET` | `/logout` | Logged In | Terminate user session and redirect |

---

## 💼 Resume Description

You can add this project to your resume with the following bullet points:

> **Stayora — Property Discovery & Booking Platform**  
> *Node.js, Express.js, MongoDB Atlas, Mongoose, EJS, Bootstrap 5, Passport.js, Cloudinary*  
> **Live Demo:** [https://stayora-vert.vercel.app](https://stayora-vert.vercel.app)
> - Engineered a full-stack, two-sided property discovery and reservation platform with separate guest and property owner workflows.
> - Developed a date-range availability engine utilizing mathematical overlap algorithms to prevent double-booking across simultaneous reservation requests.
> - Built a comprehensive Owner Dashboard displaying real-time KPI metrics (Active Properties, Pending Requests, Confirmed Stays, Revenue) with one-click request approval and auto-rejection of conflicting dates.
> - Implemented secure authentication and authorization using Passport.js with password hashing, persistent session storage via MongoDB Atlas (`connect-mongo`), and role-based route guards.
> - Integrated Cloudinary and Multer for multi-format cloud image handling, dynamic category-based filtering across 15 travel styles, and real-time destination search.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
