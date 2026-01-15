## 📍 Project 1: Gazetteer

A fully interactive, web-based **Gazetteer application** that provides **real-time information** about countries around the world. 

The system brings together multiple data sources to display **weather**, **news**, **cities**, **airports**, **Wikipedia summaries**, **demographics**, and **currency exchange rates**.

Designed as a modern **geographic information tool**, it allows users to explore countries visually and retrieve **live data** through a custom **PHP backend** and several **external APIs**.


---

## 🚀 Features

###   🌍 Interactive Map Interface
Built with Leaflet.js for smooth map navigation
Highlights the selected country using GeoJSON borders
Supports marker clustering for cities and airports
Uses custom icons via Leaflet.ExtraMarkers

###   📍 Automatic Geolocation
Detects the user’s location with the browser’s geolocation API
Automatically selects and zooms to the user's current country

###   🌆 Cities & Airports (GeoNames API)
Displays major cities and airports on the map
Each marker includes a popup with the location name
Uses clustering for performance and cleaner visuals

###   🗺️ Country Information (REST Countries)
Detailed demographics including:
- Capital city
- Continent
- Population
- Area
- Languages

###   🌦️ Weather Information
Uses OpenWeather API to display:
- Current temperature
- Weather description
- “Feels like” temperature
- Weather icon

###   🗞️ Latest News
Retrieves real-time news headlines from NewsData.io, filtered by country.

###   📖 Wikipedia Overview
Fetches a concise country summary using the Wikipedia REST API
with a direct link to the full article.

###   💱 Currency Exchange Rates
Uses multiple fallback APIs to ensure data reliability:
- Shows live exchange rates
- Includes a currency converter

###   🧭 Modern UI with Modals (Bootstrap)
Fully responsive "mobile-first" design
Five modals: Demographics, Wiki, News, Currency, Weather
Styled using Bootstrap 5 for a clean and consistent UI

---

## 🧩 Technologies Used

### Frontend
HTML5,
CSS3 (with Bootstrap 5 for responsive UI),
JavaScript (ES6),
jQuery for DOM manipulation & AJAX,
Leaflet.js for interactive maps,
Leaflet.markercluster for clustering markers,
Leaflet.ExtraMarkers for custom map icons,
Leaflet.easyButton for interactive map buttons.

### Backend
PHP 8+,
API integration using cURL and file_get_contents,
Custom REST-style PHP endpoints for data retrieval.

### External APIs
GeoNames API – cities & airports,
OpenWeather API – weather data,
REST Countries API – country details,
NewsData.io API – latest news,
Wikipedia REST API – summaries,
Open Exchange Rates (with fallbacks) – currency conversion.

### Other Tools
JSON for structured data,
Git / GitHub for version control,
InfinityFree for live hosting and deployment.

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

[https://kennyharper.wuaze.com/](https://kennyharper.wuaze.com/project1/)

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
