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
├── api/                                   # PHP backend API endpoints
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
│   ├── css/                                # All styling files
│   │   ├── bootstrap.min.css
│   │   ├── leaflet.css
│   │   ├── MarkerCluster.css
│   │   ├── MarkerCluster.Default.css
│   │   ├── easy-button.css
│   │   ├── leaflet.extra-markers.min.css   # For ExtraMarkers icons
│   │   ├── all.min.css                     # Font Awesome icons
│   │   └── style.css                       # Custom site styling
│   │
│   ├── js/                                 # All JavaScript files
│   │   ├── jquery-3.6.0.min.js
│   │   ├── bootstrap.bundle.min.js
│   │   ├── leaflet.js
│   │   ├── leaflet.markercluster.js
│   │   ├── leaflet.extra-markers.js
│   │   ├── leaflet.easybutton.js
│   │   └── main.js                         # Main application logic
│   │
│   ├── images/                             # Default Leaflet icons + custom icons
│   │   ├── airport-icon.png
│   │   ├── marker-icon.png
│   │   ├── marker-icon-2x.png
│   │   ├── marker-shadow.png
│   │   ├── layers.png
│   │   └── layers-2x.png
│   │
│   ├── img/                                # ExtraMarkers required images
│   │   ├── markers_default.png
│   │   └── markers_shadow.png
│   │
│   └── webfonts/                           # Font Awesome webfonts
│       ├── fa-solid-900.woff2
│       ├── fa-solid-900.woff
│       ├── fa-regular-400.woff2
│       ├── fa-brands-400.woff2
│       └── ... other Font Awesome font files
│
├── data/
│   └── countryBorders.geo.json              # World border GeoJSON
│
├── logs/
│   └── api_log.txt                          # Empty for security (optional logging)
│
├── config.php                               # API keys + configuration (NOT public)
│
└── index.html                               # Main application page



---
## How to View the Live Project
🌐 This project is hosted online and can be accessed here:

🔗 Live Demo:

https://kennyharper.wuaze.com/?i=1

No local setup is required.

---
## 📸 Screenshots

### 🗺️ Map Interface 
<img width="1919" height="877" alt="New main interface" src="https://github.com/user-attachments/assets/5bb260f9-ab2e-4ed4-a555-4e164752a4ea" />

### 📍 Country Dropdown
<img width="1918" height="873" alt="country dropdown" src="https://github.com/user-attachments/assets/879bc3e9-98b3-4349-be20-453e72621b7a" />

### 📊 Demographics
<img width="1918" height="876" alt="demographics" src="https://github.com/user-attachments/assets/b00846b6-c260-4bb0-aca0-24865a8922a8" />

### 📘 Wikipedia
<img width="1918" height="875" alt="Wikipedia" src="https://github.com/user-attachments/assets/d8cdc1e5-90d9-4891-b13b-72f6c4281bb0" />

### 📰 News Feed
<img width="1918" height="878" alt="News" src="https://github.com/user-attachments/assets/128df06f-8640-4c2f-a8ac-89ffcff92153" />

### 💲 Currency Exchange 
<img width="1918" height="875" alt="currency exchange" src="https://github.com/user-attachments/assets/55bc521b-e4e3-411a-93a2-419a391888a2" />

### 🌦️ Weather
<img width="1918" height="876" alt="weather" src="https://github.com/user-attachments/assets/6f280b15-5bdf-4173-bc57-fd8eaa6771e6" />

---
