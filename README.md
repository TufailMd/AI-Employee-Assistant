# AI Employee Assistant

A full-stack HR management platform I built to explore how GenAI can make everyday employee workflows — like applying for leave, checking salary slips, or getting HR-related answers — actually feel effortless.

The idea was simple: instead of digging through portals or emailing HR for basic stuff, employees should just be able to *ask*. So I built an AI chatbot backed by a RAG pipeline that understands your company's HR data and responds intelligently.

---

## 🌐 Live Demo

👉 https://feels-like-home-one.vercel.app/ 

---

## 🌟 Key Highlights

- 🧠 GenAI Integration (OpenAI + RAG pipeline)  
- 🔐 Secure JWT Authentication with role-based access  
- 🏢 Enterprise-level HR workflows  
- 📊 Admin analytics dashboard  
- 🧱 Scalable MVC architecture  
- 💬 AI-powered employee assistant 

---


## What it does

**For Employees**
- View dashboard with leave balance, salary history, and recent activity
- Apply for leave and track status in real time
- Chat with the AI assistant for any HR-related queries
- Get salary slip details without contacting anyone

**For Admins**
- Approve or reject leave requests
- Upload bulk salary data via CSV or JSON
- Parse resumes using OpenAI to extract structured info
- View analytics across employees, payroll, and leave patterns
- Create and manage employee accounts

---

## Tech Stack

| Layer | What I Used |
|---|---|
| Frontend | Next.js (React) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (role-based: employee / admin) |
| AI | OpenAI API + LangChain (RAG) |
| File Handling | Multer + pdf-parse |

---

## Project Structure

```
AIEmployeeAssistant/
├── backend/
│   └── src/
│       ├── config/        # DB and env config
│       ├── controllers/   # Route handlers
│       ├── middleware/     # Auth, validation
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       ├── services/       # Business logic
│       ├── utils/
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/               # Next.js pages and components
├── uploads/
└── README.md
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/TufailMd/AI-Employee-Assistant
cd AIEmployeeAssistant
npm install
```

### 2. Set up environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Edit `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ai_employee_assistant
JWT_SECRET=your-long-random-secret
CLIENT_URL=http://localhost:3000
# For deployment, use comma-separated allowed frontend origins:
# CLIENT_URLS=https://your-frontend.vercel.app,http://localhost:3000
OPENAI_API_KEY=your-openai-key   # Required for AI features
```

### 3. Run the app

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** The first user who signs up automatically becomes an admin. All subsequent signups are employees by default. Additional admins can be created from the admin dashboard.

---

## Deployment

### Frontend on Vercel

In the Vercel screen shown in your screenshot:

- Root Directory: `frontend`
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: leave default
- Environment Variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

Do not put `MONGO_URI`, `JWT_SECRET`, or `OPENAI_API_KEY` in Vercel frontend variables.

### Backend on Render or Railway

Deploy the backend as a separate web service:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Backend environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ai_employee_assistant
JWT_SECRET=use-a-long-random-production-secret
JWT_EXPIRES_IN=7d
CLIENT_URLS=https://your-frontend.vercel.app
OPENAI_API_KEY=your-openai-key
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
MAX_UPLOAD_MB=10
```

After backend deploys, open `https://your-backend-domain.com/health`. It should return:

```json
{"status":"ok","service":"ai-employee-assistant"}
```

---

## Salary Upload Format

**CSV**
```csv
email,month,currency,basePay,bonus,deductions,netPay
jane@example.com,2026-05,USD,6000,500,300,6200
```

**JSON**
```json
[
  {
    "email": "jane@example.com",
    "month": "2026-05",
    "currency": "USD",
    "basePay": 6000,
    "bonus": 500,
    "deductions": 300,
    "netPay": 6200
  }
]
```

---

## API Reference

**Auth**
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
```

**Employee**
```
GET    /api/employee/dashboard
POST   /api/leaves
GET    /api/leaves/mine
```

**Admin**
```
GET    /api/leaves                    # All leave requests
PATCH  /api/leaves/:id/review        # Approve / Reject
GET    /api/admin/analytics
GET    /api/admin/employees
POST   /api/admin/employees
POST   /api/admin/salary/upload
POST   /api/resumes/parse
```

**Chat**
```
GET    /api/chat/history
POST   /api/chat
```

---

## How the AI Works

The chatbot uses a **RAG (Retrieval-Augmented Generation)** pipeline:
1. HR documents and policies are embedded using OpenAI's embedding model
2. Embeddings are stored in MongoDB via a `KnowledgeEmbedding` collection
3. When an employee asks a question, the most relevant chunks are retrieved and passed to the LLM as context
4. The AI responds with accurate, grounded answers — not just generic LLM output

Chat history is persisted per user so the assistant maintains context across sessions.

---

## Production Checklist

- [ ] Use a strong, random `JWT_SECRET`
- [ ] Enable HTTPS and restrict CORS to your frontend domain
- [ ] Use MongoDB Atlas (or any managed instance) instead of local
- [ ] Move file uploads to S3 or Cloudinary for persistence
- [ ] Deploy frontend on Vercel (`npm run build:frontend`)
- [ ] Run backend with PM2, or deploy on Render / Railway / Fly.io

---

## What I Learned Building This

- Structuring a full MVC backend with clean service-layer separation
- Implementing RAG from scratch — chunking, embedding, retrieval
- Handling file uploads and PDF parsing in a production-like setup
- Role-based access control with JWT across a multi-user system
- How to make AI responses feel contextual rather than generic

---

### 👨‍💻 About the Developer
This portfolio was designed and built by Md Tufail.
- 🎓 B.Tech Computer Science Student at Parul University
- 💻 Full-Stack Developer (React, Node.js, MongoDB)
- 🧠 Strong foundation in DSA, OOP, and MVC Architecture
- 🎯 Actively seeking internships and real-world projects

### 📫 Connect with Me
- GitHub: https://github.com/TufailMd
- LinkedIn: https://linkedin.com/in/tufailmd
- Email: jrtufailmd@gmail.com
