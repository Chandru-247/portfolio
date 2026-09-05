# 🌌 Cosmic Odyssey — Chandru R Portfolio & Admin Portal

A futuristic, high-performance, galaxy-themed portfolio website with dynamic API backend, verified resume generation, mission telemetry dashboard, and secluded administrative command center.

Designed and engineered by **CHANDRU R** — Software Engineer.

---

## ✨ Features

- **🚀 Public Galaxy Portfolio (`/`)**:
  - Cosmic hero section with dynamic interactive starfield canvas
  - Dynamic interactive typing titles & social channel coordinates
  - **Academic & Career Journey**: 10th (84.8%), 12th (90.17%), and BE CSE (CGPA 7.98) milestones
  - **Dynamic Resume Archival**: Generates verified vector PDF resume on-the-fly (`CHANDRU_R_Software_Engineer_Resume.pdf`)
  - **Planetary Transmission Terminal**: Interactive contact form with direct Gmail compose & background FormSubmit cloud dispatch
  - Project showcase & interactive certificate verification modals

- **🛡️ Secure Admin Portal (`/admin`)**:
  - Discreet access route strictly at `/admin` (no public login buttons)
  - Full CRUD management over Profile, Projects, Skills, Certificates, Resume, and Messages
  - Profile photo & custom resume upload managers
  - Real-time mission statistics & telemetry

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Custom Glassmorphic & Canvas CSS
- **Backend**: Node.js, Express, Multer, PDFKit, Nodemailer, JSON Web Tokens (JWT)
- **Deployment**: Vercel (Frontend Static + Serverless Node.js API Functions)

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
# In project root
npm install

# In client directory
cd client
npm install
cd ..

# In server directory
cd server
npm install
cd ..
```

### 2. Run Locally
```bash
# Start backend server (Port 5000)
node server/index.js

# In a separate terminal, start frontend (Port 5173)
npm run client
```

Visit:
- **Portfolio**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## ☁️ Deploying to Vercel

This repository is pre-configured for instant zero-config deployment on Vercel using `vercel.json`:

1. Push this repository to your GitHub account ([Chandru-247](https://github.com/Chandru-247)).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and import your repository.
4. Set the following Build settings (or accept the defaults detected from `vercel.json`):
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/dist`
5. (Optional) In **Environment Variables**, add:
   - `JWT_SECRET`: your secret key (e.g., `cosmic-secret-key-2026`)
6. Click **Deploy**! 🚀

---

## 📡 GitHub Push Instructions

```bash
git init
git add .
git commit -m "feat: cosmic portfolio with admin portal and dynamic resume"
git branch -M main
git remote add origin https://github.com/Chandru-247/<your-repo-name>.git
git push -u origin main
```

---

## 📄 License
MIT © [CHANDRU R](https://github.com/Chandru-247)
