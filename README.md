# 🚀 HeloMeet - Video Conferencing Platform

HeloMeet is a full-stack MERN video conferencing application that allows users to create and join video meetings with secure authentication. It supports real-time video/audio communication, chat, screen sharing, and Google Sign-In.

## 🌐 Live Demo

- **Frontend:** https://halo-meet-3-gs9xiz1f7-pari-rastogis-projects.vercel.app
- **Backend:** https://halomeet-backend.onrender.com

---

## ✨ Features

- 🔐 User Authentication (Email & Password)
- 🔑 Google Sign-In (OAuth 2.0)
- 🔄 JWT Authentication with Refresh Tokens
- 🍪 Secure HTTP-Only Cookies
- 📹 Real-time Video Calling (WebRTC)
- 🎤 Audio & Video Controls
- 💬 Real-time Chat
- 🖥️ Screen Sharing
- 👥 Join Meeting via Room ID
- 📱 Responsive UI
- 🌐 Socket.IO for Real-time Communication

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Socket.IO Client
- Bootstrap / CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Passport.js
- Passport Google OAuth 2.0
- JWT
- Socket.IO

### Deployment
- Render (Frontend & Backend)
- MongoDB Atlas

---

## 📂 Project Structure

```
HeloMeet/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/PariRastogi18/HeloMeet.git
cd HeloMeet
```

### Backend

```bash
cd backend
npm install
npm run start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## 🔒 Authentication Flow

- User Registration
- User Login
- Google OAuth Login
- JWT Access Token
- Refresh Token stored in HTTP-Only Cookie
- Secure Logout

---

## 🚀 Future Improvements

- Meeting Recording
- Meeting Scheduling
- Virtual Background
- File Sharing
- Meeting History
- Notifications
- Waiting Room
- Dark Mode

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 👩‍💻 Author

**Pari Rastogi**

GitHub: https://github.com/PariRastogi18

LinkedIn: https://www.linkedin.com/in/pari-rastogi-907336309

---

## ⭐ Support

If you like this project, don't forget to **Star ⭐ the repository**.
