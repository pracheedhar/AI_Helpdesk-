# AI-Powered Helpdesk System

A complete AI-assisted customer support ticketing system featuring a React client, an Express server, JWT authentication, and AI classification & reply suggestions using OpenAI.

## Features

- **User Authentication**: Secure signup and login for both regular Users and Support Agents/Administrators using JWT.
- **Ticket Management**: Create, view, update status (open, in progress, resolved), and set priority/category of helpdesk tickets.
- **AI-Powered Ticket Analysis**:
  - Automatically predicts categories and priorities.
  - Automatically generates suggested replies for support agents based on ticket context and conversation log.
  - Generates summaries of ticket comment logs.
- **Simulated Attachments**: Support for adding and viewing file attachments (mocked links stored in DB).
- **Duplicate Detection**: Auto-detects potential duplicate tickets using text similarity heuristics.

---

## Directory Structure

```text
├── backend/            # Express.js Server
│   ├── src/
│   │   ├── config/     # DB configurations
│   │   ├── controllers/# Route controllers (auth, tickets, comments, etc.)
│   │   ├── middleware/ # Auth & error handling middleware
│   │   ├── models/     # Mongoose Schemas (User, Ticket, Comment, etc.)
│   │   ├── routes/     # Express route handlers
│   │   ├── services/   # AI services (OpenAI Integration)
│   │   └── server.js   # Server entry point
│   └── package.json
│
└── client/             # Vite + React Client SPA
    ├── src/
    │   ├── assets/     # Images and static assets
    │   ├── components/ # Shared React components (insights panel, cards, etc.)
    │   ├── context/    # Global Context providers (AuthContext)
    │   ├── pages/      # Route pages (Dashboard, Login, Ticket Details)
    │   ├── main.jsx    # Application entry point
    │   └── index.css   # Main styles and design system variables
    ├── index.html
    └── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or in the cloud via MongoDB Atlas)
- (Optional) [OpenAI API Key](https://platform.openai.com/) for AI features (will fall back to rule-based logic if not provided)

---

### Installation & Local Setup

#### 1. Clone the repository
```bash
git clone <repository-url>
cd AI_Helpdesk-
```

#### 2. Configure Environment Variables
Copy the env template files and update the configuration secrets.

**For Backend:**
```bash
cd backend
cp .env.example .env
```
Update `.env` with your database URI, JWT secret, and OpenAI API key:
```env
MONGO_URI=mongodb://localhost:27017/ai_helpdesk
JWT_SECRET=your_jwt_signing_secret
OPENAI_API_KEY=your_openai_api_key
```

**For Client:**
```bash
cd ../client
cp .env.example .env
```
Keep `VITE_API_BASE=/api` if you'd like Vite's development proxy to forward your API requests to the backend server.

---

### Running the Application (Local Development)

#### Start the Backend Server:
```bash
cd backend
npm install
npm run dev
```
The server will start running on `http://localhost:5001`.

#### Start the Frontend Client:
```bash
cd ../client
npm install
npm run dev
```
The client app will start running on `http://localhost:3000`.

---

## Production Deployment

### 1. Build the client assets
```bash
cd client
npm run build
```
This generates static production bundle files in `client/dist`.

### 2. Run the Express server in Production Mode
The Express server has been configured to serve the built static client files when running in production mode. Set your environment variable:
```env
NODE_ENV=production
```
Then start the server:
```bash
cd backend
npm start
```
The backend server will host both the API and the static React app.
