# ClimaRoute – Climate Smart Travel Planner

<p align="center">
  <b>Plan smarter journeys with real-time climate intelligence, smart routing, and nearby place discovery.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Maps-Leaflet.js-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/APIs-OpenMeteo%20%7C%20OSRM%20%7C%20Photon-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge"/>
</p>

---

# Live Demo

🔗 **Try the application here:**
https://climaroute.vercel.app

---

# Overview

**ClimaRoute** is a smart travel planning web application that combines **climate forecasting, route optimization, and nearby place discovery** into one modern interface.

The system helps users make **climate-aware travel decisions** by analyzing weather conditions for a chosen destination and displaying potential risks like:

*  Heatwaves
*  Storms
*  Heavy rainfall

Alongside this, users can explore nearby places such as **restaurants, hotels, and cafés** within a customizable search radius.

The project demonstrates **real-world API integration, responsive design, and modular frontend architecture.**

---

# Key Features

## Climate Intelligence

* Real-time weather forecast using **Open-Meteo API**
* Detects **Heatwave, Storm, and Heavy Rain risks**
* Displays animated **climate warning cards**
* Dynamic **background effects based on weather**

---

## Smart Route Planning

* Accurate road routing with **OSRM**
* Displays:

  * Distance
  * Travel time
* Animated route rendering
* Professional **source and destination markers**

---

## Nearby Place Discovery

Find nearby:

*  Restaurants
*  Hotels
*  Cafés

Features include:

* Multi-category selection
* Adjustable search radius (3–10 km)
* Dynamic marker generation
* Map-based exploration

---

## Custom Calendar

Premium calendar system with:

* Future-only date selection
* Smooth month transitions
* Past date auto-correction
* Modern glassmorphism UI

---

## Mobile App Experience

Mobile interface behaves like a native app:

* Bottom navigation
* Swipe gestures
* Collapsible map
* Sticky action button
* Horizontal category scrolling
* Optimized touch spacing

---

## Modern UI/UX

ClimaRoute uses a premium design system:

* Glassmorphism cards
* Dynamic animations
* Marker glow effects
* Smooth transitions
* Responsive layouts
* Climate-based visual themes

---

# Technology Stack

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| HTML5              | Application structure     |
| CSS3 + Tailwind    | UI styling                |
| Vanilla JavaScript | Core logic                |
| Leaflet.js         | Interactive map rendering |
| OpenStreetMap      | Map tiles                 |
| OSRM               | Route calculation         |
| Open-Meteo API     | Weather forecast          |
| Photon API         | Geocoding & autocomplete  |
| Overpass API       | Nearby places data        |

---

# Project Architecture

```
ClimaRoute/
│
├── index.html
│
├── CSS/
│   ├── animation.css
│   ├── base.css
│   ├── calendar.css
│   ├── components.css
│   ├── layout.css
│   ├── map.css
│   └── themes.css
│
├── JS/
│   ├── autocomplete.js
│   ├── calendar.js
│   ├── generatePlan.js
│   ├── map.js
│   ├── markers.js
│   ├── places.js
│   ├── validation.js
│   └── main.js
│
├── assets/
│   └── favicon.svg
│
├── manifest.json
├── service-worker.js
└── README.md
```

This modular architecture ensures:

  Maintainability
  Scalability
  Clean separation of concerns

---

#  How It Works

1️⃣ User enters **source and destination**
2️⃣ **Photon API** converts locations into coordinates
3️⃣ **OSRM** calculates optimal road route
4️⃣ **Open-Meteo API** fetches weather forecast
5️⃣ System detects climate risks
6️⃣ **Overpass API** fetches nearby places
7️⃣ UI dynamically updates results and map markers

---



# Future Enhancements

Planned improvements include:

*  Dark / Light mode toggle
*  Full mobile PWA support
*  Multi-stop trip planning
*  Climate severity score
*  Offline caching
*  Cloud backend integration
*  User accounts and saved trips

---

# Why This Project Stands Out

ClimaRoute demonstrates:

  Real-world API integration
  Climate-aware decision system
  Production-style modular architecture
  Advanced UI/UX design
  Interactive map-based tools
  Mobile-first user experience

---

# License

This project is licensed under the **MIT License**.

---
