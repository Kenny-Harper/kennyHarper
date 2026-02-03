# Portfolio Website

Welcome to my personal portfolio website.  
This project acts as a central hub to showcase my work completed during the **IT Career Switch program**, alongside my technical skills and development approach.

The site brings together multiple projects and case studies into a single, professional web presence.

Across this project, I work with:
- **HTML5 & CSS3** for semantic structure and responsive layout  
- **JavaScript** for interactive behaviour and UI enhancements  
- **Bootstrap** for layout, components, and responsiveness  
- **PHP** for backend form handling  
- **PHPMailer** for secure email delivery  

The portfolio focuses on clarity, usability, and real-world development practices, reflecting how projects would be structured and deployed in a professional environment.

---

## 📍 Portfolio Overview

The website provides an overview of my background, skills, and featured projects, supported by detailed case-study pages and screenshots.

Each project section highlights:
- The problem being solved  
- Key technologies used  
- Core features and functionality  
- Visual examples of the finished application  

The layout is fully responsive, ensuring a consistent experience across desktop and mobile devices.

---

## 📌 Featured Projects

### Gazetteer
A fully interactive, web-based **Gazetteer application** that provides **real-time country information**.

The project integrates multiple data sources to display **weather**, **news**, **cities**, **airports**, **Wikipedia summaries**, **demographics**, and **currency exchange rates**, all accessible through an intuitive, map-based interface.

Data is retrieved via a custom **PHP backend** and several **external APIs**, allowing users to explore countries visually and access live information on demand.

---

### Company Directory
A responsive, web-based **Company Directory application** designed to manage **Personnel**, **Departments**, and **Locations** within an organisation.

The system supports full **CRUD functionality** using **Bootstrap modals**, alongside **search** and **filtering** features to quickly locate employees by department or location.

Built with a **PHP + MySQL backend** and a dynamic **JavaScript (jQuery/AJAX) frontend**, the application ensures data consistency while preventing the deletion of records that have active dependencies.

---

## 📂 Project Structure

portfolio/
├── assets/
│ ├── css/
│ │ └── main.css
│ ├── js/
│ │ └── main.js
│ ├── img/
│ │ ├── favicon/
│ │ └── portfolio/
│ ├── vendor/ # Third-party libraries (Bootstrap, AOS, Swiper, etc.)
│ └── CV/
│ └── Kenny Harper CV.pdf
│
├── forms/
│ ├── contact.php.example # Mail handler template (no credentials)
│ └── PHPMailer/ # PHPMailer library
│
├── index.html
├── portfolio-details.html
├── portfolio-details-companydirectory.html
├── portfolio-details-gazetteer.html
├── service-details.html
├── starter-page.html
└── README.md


---

## 🌐 Live Site
https://kennyharper.co.uk/portfolio/

---

## 🔒 Contact Form Notes
- Email credentials are **not stored** in this repository  
- `contact.php.example` is provided as a reference template only  
- The live server uses a separate, secure configuration outside version control

---
