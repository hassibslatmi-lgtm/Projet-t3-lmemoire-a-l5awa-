# AgriGov Project Summary - Handover Document

## 🚀 Project Overview
**AgriGov** is an Administrative Dashboard designed for the Ministry of Agriculture to manage a marketplace for Farmers, Buyers, and Transporters.

- **Frontend**: React (Vite), Vanilla CSS, Tailwind CSS.
- **Backend**: Django, Django REST Framework (DRF), MySQL.

## 📂 Current Project Structure (Updated)
**Root Directory**: `C:\Users\Informatics\Desktop\projet memoire\Projet-t3-lmemoire-a-l5awa-`
- **Frontend**: `/projet memoire test/`
- **Backend**: `/Backend/`

---

## ✅ Completed Work
### 1. Centralized API Service
- Created `src/services/api.js` to handle all HTTP requests.
- Implemented Token-based authentication (Token stored in `localStorage`).
- Automatic error handling and server-connectivity detection.

### 2. Authentication Flow (Integrated)
- **Login**: Connected to `POST /users/login/`. Handles role-based redirection (Ministry -> Admin Dashboard).
- **Signup**: Connected to `POST /users/signup/`. Supports dynamic "Extra Data" fields (Farmer card, Transporter license, etc.).

### 3. Account Moderation (Integrated)
- **Validate Accounts**: Admin can view pending users and Approve/Reject them via API.
- **Block/Unblock**: Admin can toggle "Blocked" status for validated users.
- **Live Stats**: Dashboard cards pull real-time counts (Total Users, Pending, Blocked) from `/users/admin/stats/`.

---

## 🛠️ Infrastructure & Setup
### Backend Dependencies (Python)
- `djangorestframework`, `django-cors-headers`, `mysqlclient`, `pillow`.

### Frontend Dependencies (NPM)
- `react-router-dom`, `axios`, `lucide-react`, `tailwindcss`.

---

## ⚠️ Current Blockers & Debugging
### 1. Backend Startup Issue
Currently, the backend fails to start (`python manage.py runserver`) because of a **MySQL Authentication Error**:
`django.db.utils.OperationalError: (1045, "Access denied for user 'root'@'localhost' (using password: YES)")`

**Fix needed**: Update `DATABASES` in `Backend/core/settings.py` with the correct local MySQL root password.

### 2. Database Prerequisites
- Ensure `agrigov_db` is created in MySQL.
- Run `python manage.py migrate` after fixing the password.

---

## 📝 Next Integration Steps
1.  **Categories Section**: Connect the `AdminManageCategories.jsx` to the product categories API.
2.  **Official Prices**: Implement the CRUD for prices and statistics.
3.  **Complaints**: Connect the complaints list to the backend model.
4.  **Dynamic Role Dashboard**: Ensure non-admin users see their specific landing pages.

---
*Created on 2026-03-28 by Antigravity AI*
