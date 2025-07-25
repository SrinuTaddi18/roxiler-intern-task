# 🏪 FullStack Store Rating App

This is a full-stack web application that allows users to rate stores registered on the platform. The application supports three types of user roles: **System Administrator**, **Normal User**, and **Store Owner**, each with their own set of functionalities.

---

## 🔧 Tech Stack

- **Frontend:** React.js  
- **Backend:** Express.js  
- **Database:** MySQL  

---

## ✨ Features by User Role

### ✅ System Administrator
- Add new stores and users (normal/admin).
- View dashboard with:
  - Total number of users
  - Total number of stores
  - Total number of ratings
- Manage users (Name, Email, Address, Role).
- Manage stores (Name, Email, Address, Rating).
- Filter and sort users/stores by key fields.
- View full user details (if Store Owner, show rating).
- Logout functionality.

---

### 👤 Normal User
- Sign up and log in.
- Update password.
- View list of all registered stores.
- Search stores by Name and Address.
- Submit or update ratings (1 to 5).
- View:
  - Store Name
  - Address
  - Overall Rating
  - User's Submitted Rating
- Logout functionality.

---

### 🛍️ Store Owner
- Log in and update password.
- View:
  - Users who rated their store
  - Average rating of their store
- Logout functionality.

---

## 🛠️ Form Validations

| Field     | Validation |
|-----------|------------|
| **Name**  | Min 20 chars, Max 60 chars |
| **Address** | Max 400 chars |
| **Email** | Valid email format |
| **Password** | 8–16 chars, 1 uppercase, 1 special char |

---

## 📊 Admin Dashboard Sample Metrics

- Total Users: `50`
- Total Stores: `20`
- Total Ratings: `300`

(Values are dynamically fetched from the backend)

---

## 📂 Folder Structure

```bash
root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
├── .env
└── README.md
