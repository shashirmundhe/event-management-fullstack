# 🎊 Full-Stack Event Decoration Portfolio

An advanced portfolio management system for event decorators, built using **Spring Boot** and **React**. This application allows decorators to showcase their work in categories like Weddings, Birthdays, and Openings, while providing a direct lead generation tool via WhatsApp.



## 🛠 Features
* **Dynamic Portfolio:** Filter work by categories (Wedding, Birthday, Balloon Decor).
* **Admin Control:** Create and Delete portfolio items in real-time.
* **Lead Generation:** Integrated WhatsApp button for instant client inquiries.
* **Full-Stack Sync:** React frontend communicates with a Java Spring Boot REST API.

## 💻 Tech Stack
* **Frontend:** React.js, Vite, Axios, CSS3
* **Backend:** Java 17, Spring Boot, Spring Data JPA
* **Database:** H2 (In-memory) / MySQL (Production)

## 🚀 How to Run Locally

### 1. Backend
- Navigate to the root folder.
- Run: `./mvnw spring-boot:run`
- The API will be available at `http://localhost:8081`

### 2. Frontend
- Navigate to the `frontend` folder.
- Run: `npm install`
- Run: `npm run dev`
- The UI will be available at `http://localhost:5173`