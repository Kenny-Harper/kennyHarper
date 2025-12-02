# KennyHarper – Portfolio Projects

This repository contains my IT Career Switch portfolio projects.  
Each project demonstrates different skills in PHP, JavaScript, AJAX, APIs, and frontend libraries.

---

## 📍 Project 1: Gazetteer

A fully interactive, web-based **Gazetteer application** that provides **real-time information** about countries around the world. 

The system brings together multiple data sources to display **weather**, **news**, **cities**, **airports**, **Wikipedia summaries**, **demographics**, and **currency exchange rates**.

Designed as a modern **geographic information tool**, it allows users to explore countries visually and retrieve **live data** through a custom **PHP backend** and several **external APIs**.


---

## 🚀 Features

### 🌦️ Weather Information  
Uses the **OpenWeather API** to fetch current weather conditions such as temperature, humidity, and general conditions.

### 🗞️ Latest News  
Integrates with **NewsData.io** to retrieve the latest news headlines related to a selected country.

### 🌍 GeoNames Data  
Uses the **GeoNames API** to list:
- Major cities  
- Airports  

### 📖 Wikipedia Overview  
Fetches an introductory summary from **Wikipedia REST API** for any selected country.

### 💱 Currency Exchange Rates  
Retrieves live exchange rates using multiple fallback APIs.

---

## 🧩 Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript**
- **PHP** (server-side)
- **cURL / file_get_contents**
- **REST APIs**
- **Leaflet.js** for interactive maps

---

## 📁 Project Structure

Gazetteer/
│
├── api/                       # PHP backend API endpoints
│   ├── border.php
│   ├── countries.php
│   ├── country.php
│   ├── exchange.php
│   ├── geocode.php
│   ├── geonames.php
│   ├── news.php
│   ├── weather.php
│   └── wiki.php
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   └── airport-icon.png
│   └── js/
│       └── main.js
│
├── data/
│   └── countryBorders.geo.json
│
├── logs/
│   └── api_log.txt        # empty for security (full logs available if needed)
│
├── config_local.php       # private API keys (NOT included on GitHub)
│
└── index.php              # main application page


---
## How to View the Live Project
🌐 This project is hosted online and can be accessed here:

🔗 Live Demo:

https://kennyharper.wuaze.com/?i=1

No local setup is required.

---
## 📸 Screenshots

### 🗺️ Main Interface
<img width="1916" height="874" alt="Main interface" src="https://github.com/user-attachments/assets/6f07d3e8-8a1d-4a74-b499-11cfe2fa90e3" />

### 📍 Country Dropdown
<img width="1918" height="876" alt="Country dropdown " src="https://github.com/user-attachments/assets/579e7820-8b93-4db8-970e-665c7fa2bb29" />

### 📊 Demographics
<img width="1918" height="880" alt="Demographics panel" src="https://github.com/user-attachments/assets/ffc81625-4ed0-4e2b-811c-dde08a92537e" />

### 📘 Wikipedia
<img width="1917" height="881" alt="Wikipedia panel" src="https://github.com/user-attachments/assets/0b2394ff-8db1-4ed5-9f65-2cd1f3ac78f8" />

### 📰 News Feed
<img width="1917" height="876" alt="News feed" src="https://github.com/user-attachments/assets/84bf23c3-888b-472b-8661-cb67b5296378" />

### 💲 Currency Exchange 
<img width="1915" height="880" alt="Currency exchange panel" src="https://github.com/user-attachments/assets/4f680533-883f-4314-b7e7-a43f4117e6e3" />

### 🌦️ Weather
<img width="1916" height="876" alt="Weather panel" src="https://github.com/user-attachments/assets/ce8d5ccb-c4fc-4ab2-933d-35d0d0b59618" />

### ✈️ Airport & City Markers
<img width="1918" height="877" alt="Cities and airport markers" src="https://github.com/user-attachments/assets/89003d91-d425-4eee-9ff8-e5e006dcde6a" />

---

## 📌 Project 2
(Coming soon)

---
