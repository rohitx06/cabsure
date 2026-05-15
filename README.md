# 🚖 CabSure

CabSure is a crowdsourced ride availability analytics platform that predicts the likelihood of getting a ride accepted in a specific area for services like Uber and Rapido.

Users submit ride outcomes (accepted, cancelled, no driver), and CabSure analyzes historical data to estimate:

* Acceptance probability
* Time-based ride availability
* Best app recommendation
* Average waiting time
* Future prediction trends (planned)

---

## ✨ Features

### Current Features

* Submit ride reports
* Calculate ride acceptance percentage
* Area-based analytics
* Time-based acceptance analytics
* Recommend best ride app by location and hour
* PostgreSQL-backed persistent storage
* React + shadcn dashboard
* REST API architecture

### Planned Features

* Interactive maps
* Heatmap visualization
* Geolocation support
* Weather integration
* ML-based acceptance prediction
* Peak-hour insights
* Mobile app version

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS v4
* shadcn/ui
* Axios

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Tools

* Postman
* Git/GitHub

---

## 📂 Project Structure

```txt
cabsure/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
└── README.md
```

---

## 🔌 API Endpoints

### Submit Ride Report

```http
POST /api/ride-report
```

Example:

```json
{
  "pickup_area":"Thrissur",
  "app_name":"Uber",
  "ride_type":"Auto",
  "status":"accepted",
  "wait_time":3,
  "day_of_week":"Friday",
  "request_time":"2026-05-16T20:00:00"
}
```

---

### Get Overall Stats

```http
GET /api/stats
```

Query:

```txt
pickup_area
app_name
```

Response:

```json
{
  "totalReports":20,
  "acceptedReports":15,
  "acceptanceRate":"75.00"
}
```

---

### Get Time-Based Stats

```http
GET /api/time-stats
```

---

### Get Recommendation

```http
GET /api/recommend
```

Response:

```json
{
  "recommendedApp":"Uber",
  "acceptanceRate":"80.00",
  "avgWaitTime":"2.00"
}
```

---

## ⚙️ Local Setup

Clone:

```bash
git clone https://github.com/rohitx06/cabsure.git
```

Install frontend:

```bash
npm install
```

Install backend:

```bash
cd server
npm install
```

Run frontend:

```bash
npm run dev
```

Run backend:

```bash
cd server
npm run dev
```

---

## 🗄 Environment Variables

Create:

`server/.env`

Example:

```env
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=cabsure
DB_PASSWORD=YOUR_PASSWORD
DB_PORT=5432
```

---

## 🚀 Future Roadmap

* [ ] Heatmaps
* [ ] Location analytics
* [ ] Weather integration
* [ ] Ride prediction model
* [ ] Mobile application
* [ ] Real-time insights

---

## 💡 Motivation

Ride acceptance varies heavily by:

* Area
* Time
* Traffic
* Demand
* Weather

CabSure aims to reduce uncertainty by helping users estimate ride availability before booking.

---

## 👨‍💻 Author

Built by **Rohit**

GitHub:

https://github.com/rohitx06

---

⭐ If you like this project, consider starring the repository.
