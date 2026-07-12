# AI-Powered Helpdesk System

A full-stack customer support ticketing system powered by React, Express, MongoDB, and OpenAI. Supports JWT authentication, role-based access control (User / Agent / Admin), and AI-driven ticket classification, reply suggestions, conversation summaries, and duplicate detection.

## Live Demo Architecture

```
[ React (Vite) on Vercel ] ──HTTPS──▶ [ Express API on Render ] ──▶ [ MongoDB Atlas ]
                                              │
                                              └──▶ [ OpenAI API (optional) ]
```

---

## Features

| Feature | Details |
|---|---|
| **Authentication** | JWT-based login & registration with bcrypt password hashing |
| **Role-Based Access** | Three roles: `user`, `agent`, `admin` — each with scoped permissions |
| **Ticket Management** | Create, view, update status (`open`, `in-progress`, `resolved`, `closed`), set priority & category |
| **AI Classification** | Auto-predicts category & priority on ticket creation (OpenAI GPT-3.5 or rule-based fallback) |
| **AI Reply Suggestions** | Generates a step-by-step resolution draft for agents |
| **AI Summarization** | Summarizes the comment thread of a ticket |
| **Duplicate Detection** | Detects similar open tickets using Jaccard similarity |
| **Attachments** | Attach file links to tickets (URL-based) |
| **Comments** | Nested comment threads per ticket |

---

## Tech Stack

**Frontend** (in `/client`):
- React 19 + Vite 8
- React Router v7
- Axios (with JWT interceptor)
- Tailwind CSS v4
- Lucide React icons

**Backend** (in `/backend`):
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- OpenAI SDK (with offline fallback)
- dotenv, cors

---

## Project Structure

```
AI_Helpdesk-/
├── .gitignore
├── README.md
│
├── backend/
│   ├── .env.example             # Environment variable template
│   ├── package.json
│   └── src/
│       ├── server.js            # Entry point (Express app)
│       ├── config/db.js         # MongoDB connection
│       ├── middleware/
│       │   └── authMiddleware.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Ticket.js
│       │   ├── Comment.js
│       │   └── Attachment.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── ticketController.js
│       │   ├── commentController.js
│       │   └── attachmentController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── ticketRoutes.js
│       └── services/
│           └── aiService.js     # OpenAI integration with fallback
│
└── client/
    ├── .env.example             # Environment variable template
    ├── vite.config.js           # Dev proxy: /api → localhost:5001
    ├── package.json
    └── src/
        ├── context/AuthContext.jsx  # Auth state + Axios instance
        ├── components/
        ├── pages/
        └── main.jsx
```

---

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- (Optional) [OpenAI API Key](https://platform.openai.com/) — rule-based fallback is used if omitted

### 1. Clone the repository
```bash
git clone https://github.com/pracheedhar/AI_Helpdesk-.git
cd AI_Helpdesk-
```

### 2. Configure the backend
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env`:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ai_helpdesk
JWT_SECRET=your_secure_random_secret
FRONTEND_URL=http://localhost:3000
# OPENAI_API_KEY=your_openai_api_key
```

### 3. Configure the frontend
```bash
cd ../client
cp .env.example .env
```
`client/.env` (default works out-of-the-box with Vite proxy):
```env
VITE_API_BASE=/api
```

### 4. Run the backend
```bash
cd backend
npm install
npm run dev
```
Server starts at `http://localhost:5001`

### 5. Run the frontend
```bash
cd client
npm install
npm run dev
```
App opens at `http://localhost:3000` (Vite proxies `/api/*` to the backend automatically)

---

## API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login and get JWT |
| `GET` | `/api/auth/me` | Private | Get current user |
| `GET` | `/api/tickets` | Private | List tickets (scoped by role) |
| `POST` | `/api/tickets` | Private | Create a ticket |
| `GET` | `/api/tickets/:id` | Private | Get a single ticket |
| `PUT` | `/api/tickets/:id` | Private | Update ticket |
| `DELETE` | `/api/tickets/:id` | Admin | Delete ticket |
| `PATCH` | `/api/tickets/:id/status` | Agent/Admin | Update status |
| `PATCH` | `/api/tickets/:id/assign` | Admin | Assign ticket to agent |
| `GET` | `/api/tickets/agents` | Admin | List all agents |
| `POST` | `/api/tickets/:id/comments` | Private | Add comment |
| `GET` | `/api/tickets/:id/comments` | Private | Get comments |
| `POST` | `/api/tickets/:id/attachments` | Private | Add attachment |
| `GET` | `/api/tickets/:id/attachments` | Private | Get attachments |
| `GET` | `/api/tickets/:id/ai-summary` | Private | AI summary of ticket |
| `GET` | `/api/tickets/:id/ai-suggested-reply` | Agent/Admin | AI draft reply |
| `GET` | `/api/tickets/:id/ai-duplicates` | Private | Find duplicate tickets |
| `GET` | `/health` | Public | Health check |

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5001` | Port to run the server |
| `NODE_ENV` | Yes | `development` | `development` or `production` |
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `JWT_SECRET` | Yes | — | Secret for signing tokens |
| `FRONTEND_URL` | No | `*` (all origins) | Allowed CORS origin |
| `OPENAI_API_KEY` | No | — | OpenAI key (uses fallback if omitted) |
| `SERVE_STATIC` | No | — | Set to `true` for monolithic deploy only |

### Frontend (`client/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE` | No | `/api` | Full backend API URL for production |

> In development, leave `VITE_API_BASE=/api` — Vite's proxy handles forwarding to `localhost:5001`.
> In production on Vercel, set it to the full Render backend URL.

---

## User Roles

| Role | Permissions |
|---|---|
| `user` | Create and view their own tickets; add comments and attachments |
| `agent` | View all tickets; update status; add comments; access AI tools |
| `admin` | All of the above + assign tickets, delete tickets, manage users |
