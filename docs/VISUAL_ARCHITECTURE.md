# Architecture Overview - Visual Guide

## 🎬 The Complete Picture

### Development Environment

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browser                                                    │
│    │                                                        │
│    ├─→ http://localhost:5173 (User App)                    │
│    │   ↓                                                    │
│    │   Vite Dev Server                                     │
│    │   ├─ Reads: src/client/                              │
│    │   ├─ Hot reload: YES ✓                               │
│    │   └─ Serves React with JSX                           │
│    │                                                        │
│    ├─→ http://localhost:5174 (Admin App)                   │
│    │   ↓                                                    │
│    │   Vite Dev Server                                     │
│    │   ├─ Reads: src/admin/                               │
│    │   ├─ Hot reload: YES ✓                               │
│    │   └─ Serves React with JSX                           │
│    │                                                        │
│    └─→ http://localhost:8080 (API)                         │
│        ↓                                                    │
│        Express Server                                      │
│        ├─ Routes: /api/*                                  │
│        └─ Database: MySQL                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SERVER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Your Browser                                               │
│    │                                                        │
│    └─→ http://yourdomain.com                               │
│        ↓                                                    │
│    ┌─────────────────────────────────┐                     │
│    │  Express Server (Port 8080)     │                     │
│    │  ─────────────────────────────  │                     │
│    │  Serves:                        │                     │
│    │  • GET / → public/client/       │                     │
│    │  • GET /admin → public/admin/   │                     │
│    │  • GET /api/* → API endpoints   │                     │
│    └─────────────────────────────────┘                     │
│        ↓                ↓              ↓                    │
│    ┌────────┐  ┌──────────────┐  ┌────────────┐            │
│    │public/ │  │ API Routes   │  │ Database   │            │
│    │client/ │  │ (Express)    │  │ (MySQL)    │            │
│    │admin/  │  │              │  │            │            │
│    └────────┘  └──────────────┘  └────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Files in Different Stages

### Stage 1: Initial Setup (Before Any Build)

```
src/
├── client/          ← React source (JSX)
│   ├── App.jsx
│   ├── main.jsx
│   └── components/
├── admin/           ← React source (JSX)
│   ├── AdminApp.jsx
│   ├── main.jsx
│   └── components/
└── routes/          ← Express backend

public/
└── bird.png         ← Only static assets
```

### Stage 2: After Build (npm run build)

```
src/
├── client/          ← Still here (not needed)
├── admin/           ← Still here (not needed)
└── routes/

public/
├── client/          ← ✅ NEW - Built user app
│   ├── index.html
│   └── assets/
│       ├── main-abc123.js
│       └── main-abc123.css
├── admin/           ← ✅ NEW - Built admin app
│   ├── index.html
│   └── assets/
│       ├── AdminApp-xyz.js
│       └── AdminApp-xyz.css
└── bird.png
```

---

## 🔄 Request Journey

### Development: User Visits http://localhost:5173

```
1. Browser requests http://localhost:5173/
                ↓
2. Vite dev server intercepts
                ↓
3. Vite reads src/client/main.jsx
                ↓
4. Vite compiles JSX → JavaScript (in memory)
                ↓
5. Vite serves compiled code to browser
                ↓
6. Browser downloads React app
                ↓
7. React renders in browser
                ↓
8. User sees app! ✓
```

### Production: User Visits http://yourdomain.com/

```
1. Browser requests http://yourdomain.com/
                ↓
2. Express server receives request
                ↓
3. Express checks route: GET /
                ↓
4. Express finds public/client/index.html
                ↓
5. Express sends file to browser
                ↓
6. Browser downloads pre-built index.html
                ↓
7. Browser loads pre-built JavaScript
                ↓
8. React runs (already compiled!)
                ↓
9. User sees app! ✓
```

---

## 📊 Data Flow Comparison

### Development: API Call

```
React App (on Vite)
    ↓ axios.get('/api/discussions')
Vite dev server
    ↓ (proxy configured)
Express server (8080)
    ↓ (routes to /api/discussions)
Database
    ↓ (returns data)
Express
    ↓ (sends JSON)
Vite
    ↓ (forwards response)
React receives data ✓
```

### Production: API Call

```
React App (already in browser)
    ↓ axios.get('/api/discussions')
Express server (8080)
    ↓ (routes to /api/discussions)
Database
    ↓ (returns data)
Express
    ↓ (sends JSON)
React receives data ✓
```

---

## 🎯 File Serving Process

### What Express Does In Production

```
Browser: GET /
    ↓
Express checks...
    ├─ Is it /api/* ? → NO
    ├─ Is it /admin* ? → NO
    └─ Is it default route? → YES (/)
    ↓
Express looks in public/
    ├─ Finds public/client/index.html
    ↓
Express sends index.html
    ↓
Browser receives HTML

Browser: GET /admin
    ↓
Express checks...
    ├─ Is it /api/* ? → NO
    ├─ Is it /admin* ? → YES ✓
    ↓
Express sends public/admin/index.html
    ↓
Browser receives HTML

Browser: GET /api/discussions
    ↓
Express routes to API handler
    ↓
Express queries database
    ↓
Express sends JSON response
```

---

## 🏗️ Build Architecture

### The Vite Build Pipeline

```
User App Build:
src/client/
    ├─ App.jsx
    ├─ components/
    ├─ hooks/
    └─ index.html
         ↓ (Vite build)
    Compilation
    ├─ JSX → JavaScript
    ├─ Imports → Single bundle
    ├─ CSS → Minified
    └─ Images → Optimized
         ↓
    public/client/
    ├─ index.html
    └─ assets/
        ├─ main-abc123.js (minified, hashed)
        └─ main-abc123.css (minified, hashed)

Admin App Build:
src/admin/
    ├─ AdminApp.jsx
    ├─ components/
    ├─ hooks/
    └─ index.html
         ↓ (Vite build)
    public/admin/
    ├─ index.html
    └─ assets/
        ├─ AdminApp-xyz.js
        └─ AdminApp-xyz.css
```

---

## 📱 URL Routing

### Development URLs

```
User App:      http://localhost:5173/
Admin App:     http://localhost:5174/
API:           http://localhost:8080/api/*
Health Check:  http://localhost:8080/health
```

### Production URLs

```
User App:      http://yourdomain.com/
Admin App:     http://yourdomain.com/admin
API:           http://yourdomain.com/api/*
Health Check:  http://yourdomain.com/health
```

---

## 🔐 Security: What Gets Exposed

### Development

```
Browser sees:
├─ React source code (development only)
├─ Component names
├─ API calls (visible in network tab)
└─ Source maps (for debugging)
```

### Production

```
Browser sees:
├─ Minified JavaScript (unreadable)
├─ Hashed file names (cache-busting)
├─ API calls (but no source code)
└─ NO source maps by default
```

---

## ⚡ Performance Impact

### File Sizes

```
Development:
React source:           ~50 KB (uncompressed)
Dependencies:           ~1 MB (uncompressed)
Vite serves:            On-demand (fast)

Production:
Minified React:         ~150 KB (compressed)
Minified CSS:           ~50 KB (compressed)
Gzipped:                ~40 KB (compressed)
Vite serves:            Already optimized
```

---

## 🚀 Deployment Steps

```
Step 1: Local Development Complete
src/                (React code ready)
    ↓
Step 2: Build
npm run build
    ↓
Step 3: Output Created
public/client/      (built app)
public/admin/       (built app)
    ↓
Step 4: Upload to Server
Copy public/
Copy app.js
Copy package.json
    ↓
Step 5: Server Startup
npm install
NODE_ENV=production node app.js
    ↓
Step 6: Live
http://yourdomain.com/ ✓
```

---

## 📈 Comparison: Dev vs Prod

```
┌──────────────┬──────────────┬──────────────┐
│  Aspect      │  Development │  Production  │
├──────────────┼──────────────┼──────────────┤
│ React Served │ Via Vite     │ Via Express  │
│ Files        │ JSX (source) │ JS (compiled)│
│ Servers      │ 3 (Vite x2 + │ 1 (Express)  │
│              │ Express)     │              │
│ Hot Reload   │ Yes          │ No           │
│ File Size    │ Large        │ Small        │
│ Speed        │ Fast (dev)   │ Fast (prod)  │
│ Security     │ Low          │ High         │
│ Database     │ Local        │ Remote       │
│ HTTPS        │ No           │ Yes          │
└──────────────┴──────────────┴──────────────┘
```

---

## ✅ Summary Diagram

```
┌─────────────────────────────────────────────────────────┐
│             YOUR FULL-STACK ARCHITECTURE                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend Layer:                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React Apps                                      │  │
│  │  ├─ User App (src/client/ → public/client/)     │  │
│  │  └─ Admin App (src/admin/ → public/admin/)      │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  Middleware Layer:                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express Server (app.js)                         │  │
│  │  ├─ Routes static files from public/             │  │
│  │  ├─ Handles SPA routing (React Router)           │  │
│  │  └─ Provides REST API endpoints                  │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  Data Layer:                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MySQL Database                                  │  │
│  │  ├─ Discussions table                            │  │
│  │  ├─ Users table                                  │  │
│  │  ├─ Responses table                              │  │
│  │  └─ Sessions table                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

**You now have a complete understanding of how React files are hosted on your Express server!** 🎉
