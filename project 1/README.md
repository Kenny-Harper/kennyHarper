## 📍 Project 1: Gazetteer

A fully interactive, web-based **Gazetteer application** that provides **real-time information** about countries around the world. 

The system brings together multiple data sources to display **weather**, **news**, **cities**, **airports**, **Wikipedia summaries**, **demographics**, and **currency exchange rates**.

Designed as a modern **geographic information tool**, it allows users to explore countries visually and retrieve **live data** through a custom **PHP backend** and several **external APIs**.


---

## 🚀 Features

###   🌍 Interactive Map Interface
- Built with Leaflet.js for smooth map navigation
- Highlights the selected country using GeoJSON borders
- Supports marker clustering for cities and airports
- Uses custom icons via Leaflet.ExtraMarkers
- Layer controls for Streets / Satellite and Cities / Airports

###   📍 Automatic Geolocation
- Detects the user’s location with the browser’s geolocation API
- Automatically selects and zooms to the user's current country

###   🌆 Cities & Airports (GeoNames API)
- Displays major cities and airports on the map
- Each marker includes a popup with the location name
- Uses clustering for performance and cleaner visuals

###   🗺️ Country Information (REST Countries)
Detailed demographics including:
- Capital city
- Continent
- Population (formatted using Numeral.js)
- Area (km²)
- Languages
- ISO Alpha-2 and Alpha-3 codes

###   🌦️ Weather Information
- Uses the OpenWeather API to display weather for the capital city
- Shows temperature, min/max values, conditions, and icons
- Includes clearly formatted “last updated” timestamps
- Provides graceful fallbacks when weather data is unavailable

###   🗞️ Latest News
- Fetches real-time headlines using NewsData.io
- Articles are filtered by country
- Displays article images, sources, and publication dates
- Dates formatted using Date.js for readability

###   📖 Wikipedia Overview
- Retrieves concise summaries via the Wikipedia REST API
- Uses the country name (not ISO codes) for accurate results
- Includes a direct link to the full Wikipedia article

###   💱 Currency Exchange Rates
- Displays live currency exchange rates with automatic country matching
- Base currency fixed to USD for consistency
- Target currency selected based on the chosen country
- Includes a built-in currency converter
- Uses fallback APIs to ensure reliability

###   🧭 Modern UI with Modals (Bootstrap)
Built with Bootstrap 5 for a clean, responsive design
Five interactive modals:

- Demographics
- Wikipedia
- News
- Currency
- Weather

Mobile-first layout with accessibility-friendly focus handling

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
Date.js
Numeral.js

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
│   ├── css/                               # All styling files
│   │   ├── bootstrap.min.css
│   │   ├── leaflet.css
│   │   ├── MarkerCluster.css
│   │   ├── MarkerCluster.Default.css
│   │   ├── easy-button.css
│   │   ├── leaflet.extra-markers.min.css  # ExtraMarkers styling
│   │   ├── all.min.css                    # Font Awesome icons
│   │   ├── fontawesome.min.css            # Font Awesome core styles
│   │   └── style.css                      # Custom site styling
│   │
│   ├── js/                                # All JavaScript files
│   │   ├── jquery-3.6.0.min.js
│   │   ├── bootstrap.bundle.min.js
│   │   ├── leaflet.js
│   │   ├── leaflet.markercluster.js
│   │   ├── leaflet.extra-markers.js
│   │   ├── leaflet.easybutton.js
│   │   ├── all.min.js                     # Font Awesome JS
│   │   ├── date.min.js                    # Date formatting library
│   │   ├── numeral.min.js                 # Number formatting library
│   │   └── main.js                        # Main application logic
│   │
│   ├── images/                            # Default Leaflet icons + custom images
│   │   ├── airport-icon.png
│   │   ├── marker-icon.png
│   │   ├── marker-icon-2x.png
│   │   ├── marker-shadow.png
│   │   ├── layers.png
│   │   ├── layers-2x.png
│   │   └── news-placeholder.png           # Fallback image for news articles
│   │
│   ├── img/                               # ExtraMarkers required images
│   │   ├── markers_default.png
│   │   ├── markers_shadow.png
│   │   ├── markers_default@2x.png
│   │   └── markers_shadow@2x.png
│   │
│   ├── favicon/                           # Site favicons
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   └── favicon.ico
│   │
│   └── webfonts/                          # Font Awesome webfonts
│       ├── fa-solid-900.woff2
│       ├── fa-solid-900.woff
│       ├── fa-regular-400.woff2
│       ├── fa-brands-400.woff2
│       └── ... other Font Awesome font files
│
├── data/
│   └── countryBorders.geo.json             # World border GeoJSON
│
├── logs/
│   └── api_log.txt                         # Empty for security (optional logging)
│
├── config.php                              # API keys + configuration (NOT public)
│
└── index.html                              # Main application page



---
## How to View the Live Project
🌐 This project is hosted online and can be accessed here:

🔗 Live Demo:

https://kennyharper.wuaze.com/project1/

No local setup is required.

---
## 📸 Screenshots

### 🗺️ Map Interface 
<img width="376" height="798" alt="Map interface mobile view" src="https://github.com/user-attachments/assets/e3b2a01a-a0bd-41dc-9240-6c15462839d9" />

### 📍 Country Dropdown
<img width="376" height="815" alt="Country dropdown mobile view" src="https://github.com/user-attachments/assets/842ad167-7d60-4b15-a459-e08910e93709" />

### 📊 Demographics
<img width="377" height="814" alt="Demographics mobile view" src="https://github.com/user-attachments/assets/0d9fe139-66d3-4035-a48a-1de377bb3597" />

### 📘 Wikipedia
<img width="376" height="812" alt="Wiki mobile view" src="https://github.com/user-attachments/assets/b2de51f8-ce0f-4923-b6dd-f52d8d023030" />

### 📰 News Feed
<img width="376" height="814" alt="News mobile view" src="https://github.com/user-attachments/assets/c5ff3885-0840-4f11-b60e-88882e7e4615" />

### 💲 Currency Exchange 
<img width="378" height="814" alt="Currency exchange mobile view" src="https://github.com/user-attachments/assets/ebb7b7da-7819-4152-9833-9ef354b6e8a2" />

### 🌦️ Weather
<img width="378" height="816" alt="Weather mobile view" src="https://github.com/user-attachments/assets/62974568-1d25-4bb1-9520-d405980163cf" />

---
