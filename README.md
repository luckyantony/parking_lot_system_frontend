# SafeSpot Parking Lot Management System

A web-based parking lot reservation system where users can register, log in, and reserve a parking spot labeled from A–Z.

> **Live Backend**: [`https://parking-lot-system-3g7g.onrender.com`](https://parking-lot-system-3g7g.onrender.com)

---

## Project Overview:

SafeSpot allows authenticated users to reserve parking spaces in a virtual parking lot that represents the parking lot owned by the company. The frontend is built with **React and Vite**, uses **Tailwind CSS** for styling, and communicates with a **token-based backend API** .

---

## System Features:

- User registration and login using username/password.
- Protected routes for authenticated and logged in users.
- Token stored in local storage.
- Reserve parking slots.
- Context-based auth state management
- Tailwind CSS styling.

---

## Folder Structure:
```
├── package.json
├── package-lock.json
├── public
│ └── vite.svg
├── README.md
├── src
│ ├── App.jsx
│ ├── assets
│ │ └── react.svg
│ ├── AuthContext.jsx
│ ├── components
│ │ ├── AuthForm.jsx
│ │ ├── BookingForm.jsx
│ │ ├── SpotList.jsx
│ │ ├── VehicleForm.jsx
│ │ └── VehicleList.jsx
│ ├── config.js
│ ├── index.css
│ ├── main.jsx
│ └── pages
│ └── Home.jsx
└── vite.config.js
```
---

## Authentication Procedure:

1. User registers or logs in via `POST /register` or `POST /login`
2. Backend responds with a token

## Setup Instructions:

### 1. Clone the Repository:

```
bash

git clone https://github.com/your-team/safespot-parking-app.git
```

### 2. Move into the Repository Directory:

```
bash

cd safespot-parking-app
```

### 3. Install Dependencies:

```
bash

npm install
```

### 4. Run the App:

```
bash

npm run dev
```

---

### 5. Open your browser at http://localhost:5173.

### 6. Login/Register to reserve your space.

---

## Team Roles:

## Front End

### Kyle Mwendwa (Frontend Auth + UI)

- Login & Register UI using `username` + `password`
- AuthContext with `token` management
- Home page layout
- Logout and protected dashboard routing
- API endpoints made configurable in `config.js`
- README file

### Lydia Okwemba (Parking Slot Management)

- Add/Edit vehicle form
- Vehicle List
- User list

### Sharlyn Sirma (Vehicle Booking + Forms)
- Spot reservation logic (A–Z)
- Fetch and display reserved slots from backend
- Spot status updates

## Back End

### Luckyantony Leshan(Backend)

- Flask 
- RESTful API having secure access and token using JWT auth
- Data management for saving vehicle details and parking spot statuses in the database
- API Endpoints for login, register, reservations, adding vehicles, fetching lists, booking spots, and checking out.
- Error handling for invalid inputs and expired tokens with realtime data sync
- Backend and frontend integration
- Hosted on Render

---
