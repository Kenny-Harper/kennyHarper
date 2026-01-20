## 📌 Project 2: Company Directory

A responsive, web-based **Company Directory application** designed to manage **personnel, departments, and locations** using a full **CRUD system**.

The app provides a clean interface for **adding, editing, deleting, searching and filtering** company records, powered by a **PHP backend API** and a dynamic **JavaScript + AJAX frontend**.

Built as a multi-user server-based solution, it protects database integrity by preventing users from deleting records that have dependencies (e.g. deleting a department that still has assigned personnel).

---

## 🚀 Features

### 👥 Personnel Management (CRUD)
- View all personnel in a responsive table layout
- Add new employees with department assignment
- Edit employee details (name, job title, email, department)
- Delete personnel records safely using confirmation modals

### 🏢 Department Management (CRUD)
- View all departments with their assigned location
- Add new departments and assign a location
- Edit existing departments including changing the assigned location
- Prevents deletion of departments that still contain personnel (integrity protection)

### 📍 Location Management (CRUD)
- View all available locations
- Add and edit locations through modal forms
- Prevents deletion of locations that are still linked to departments (integrity protection)

### 🔎 Search (All Tabs)
- Live search functionality for:
  - Personnel
  - Departments
  - Locations
- Personnel search supports searching by:
  - First name / Last name
  - Email
  - Job title
  - Department name
  - Location name

### 🎛️ Personnel Filter System
- Filter personnel by:
  - Department
  - Location
- Filter selections are loaded dynamically from the database
- Clear filter button restores full personnel list

### 🔄 Refresh Button Improvements
- Refresh button clears search text and reloads current tab
- If filters are active (Personnel tab), refresh resets filters and reloads results
- Allows quick reset without switching tabs

### 🧭 Modern UI with Modals (Bootstrap)
- Built using Bootstrap 5 modals and events:
  - `show.bs.modal`
  - form submit handling
- Mobile-friendly layout using Bootstrap responsive utility classes
- Buttons open modals using `data-bs-toggle` and `data-bs-target`

---

## 🧩 Technologies Used

### Frontend
HTML5  
CSS3 (Bootstrap 5)  
JavaScript (ES6)  
jQuery for DOM manipulation & AJAX  
Font Awesome for icons  

### Backend
PHP 8+  
MySQL / MariaDB database  
REST-style PHP endpoints returning JSON responses  

### Other Tools
AJAX for asynchronous requests  
Git / GitHub for version control  
XAMPP (localhost development environment)  

---

## 📁 Project Structure

CompanyDirectory/
│
├── companydirectory/                  # PHP backend API (server-side)
│   ├── config.php
│   ├── getAll.php
│   ├── searchAll.php
│   ├── getAllDepartments.php
│   ├── getAllLocations.php
│   ├── getPersonnelByID.php
│   ├── getDepartmentByID.php
│   ├── getLocationByID.php
│   ├── insertPersonnel.php
│   ├── insertDepartment.php
│   ├── insertLocation.php
│   ├── updatePersonnelByID.php
│   ├── updateDepartmentByID.php
│   ├── updateLocationByID.php
│   ├── deletePersonnelByID.php
│   ├── deleteDepartmentByID.php
│   └── deleteLocationByID.php
│
└── companydirectory-ui/               # Frontend UI (client-side)
    ├── index.html
    ├── css/
    ├── js/
    │   └── script.js
    └── assets/

---

## How to Run Locally
1. Install and run **XAMPP**
2. Place the backend folder inside:
   - `htdocs/companydirectory/`
3. Open the UI in your browser:
   - `http://localhost/companydirectory-ui/`

Make sure Apache and MySQL are running in XAMPP.

---

## 📸 Screenshots

### 👥 Personnel Table
(Add screenshot here)

### 🏢 Departments Tab
(Add screenshot here)

### 📍 Locations Tab
(Add screenshot here)

### 🎛️ Filter Modal
(Add screenshot here)

---

