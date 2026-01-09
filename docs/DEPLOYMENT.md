# Deployment & Production Guide

## 📋 Before Deployment

### Check Environment

```bash
# Verify NODE_ENV setting
echo $NODE_ENV

# Install production dependencies only
npm install --production

# Build React apps (creates public/client/ and public/admin/)
npm run build
```

### Verify Builds

```bash
ls public/client/     # Should contain index.html and assets/
ls public/admin/      # Should contain index.html and assets/
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Production Build

```bash
# Clean build
rm -rf public/client public/admin dist node_modules

# Install dependencies
npm install

# Build both React apps
npm run build

# Verify builds exist
ls -la public/
```

### Step 2: Set Environment Variables

Create `.env` file with:

```env
NODE_ENV=production
PORT=8080
SESSION_SECRET=your-secret-key-here-very-secure
DB_HOST=your-database-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=daily_discussion
```

### Step 3: Upload to Server

Upload these files/folders to your server:

```
public/              ← Built React apps (DO NOT upload src/)
src/                 ← Backend code only
node_modules/        ← (optional) Already installed locally or install on server
app.js
package.json
package-lock.json
.env                 ← DO NOT commit to git, set on server
```

### Step 4: Start Server

```bash
# On your production server:
NODE_ENV=production node app.js

# Or with PM2 (recommended for production):
pm2 start app.js --name "daily-discussion"
pm2 save
pm2 startup
```

---

## 🌐 Access Your Apps

After deployment:

- **User App**: `http://yourdomain.com/`
- **Admin App**: `http://yourdomain.com/admin`
- **API**: `http://yourdomain.com/api/*`
- **Health Check**: `http://yourdomain.com/health`

---

## 🔍 Verify Deployment

```bash
# Check health endpoint
curl http://yourdomain.com/health
# Should return: {"status":"OK"}

# Check user app loads
curl http://yourdomain.com/ | head -20
# Should contain: <div id="root"></div>

# Check admin app loads
curl http://yourdomain.com/admin | head -20
# Should contain: <div id="root"></div>

# Check API responds
curl http://yourdomain.com/api/health
# Should return: {"status":"OK"}
```

---

## 🐛 Troubleshooting Production Issues

### Issue: "Cannot find module"

**Solution**: Run `npm install` on the production server

### Issue: Express serving old files

**Solution**:

- Delete `public/client/` and `public/admin/`
- Run `npm run build` again
- Restart server

### Issue: API calls return 404

**Solution**:

- Verify `/api/` routes are defined in `app.js`
- Check database connection
- Check backend logs for errors

### Issue: React app loads but shows blank page

**Solution**:

- Open browser DevTools → Console
- Check for JavaScript errors
- Verify API endpoints are accessible
- Check that `.env` variables are set correctly

### Issue: Admin page redirects or shows 404

**Solution**:

- Verify `public/admin/index.html` exists
- Check Express routing for `/admin*` path
- Restart Express server

---

## 📊 Production Folder Structure

After deployment, your server should have:

```
/var/www/daily-discussion/          (or your chosen location)
├── app.js
├── package.json
├── package-lock.json
├── .env                             (NOT in git, set on server)
├── public/
│   ├── client/
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── main-xyz.js
│   │   │   └── main-xyz.css
│   │   └── ...
│   ├── admin/
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── AdminApp-abc.js
│   │   │   └── AdminApp-abc.css
│   │   └── ...
│   └── bird.png
├── src/                            (Backend code)
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── config/
│   └── utility/
└── node_modules/                   (Installed dependencies)
```

---

## 🔐 Security Considerations

### Before Going Live

- [ ] Set strong `SESSION_SECRET` in `.env`
- [ ] Use HTTPS (Express has HTTPS enforcement in production)
- [ ] Never commit `.env` to git
- [ ] Use strong database passwords
- [ ] Enable rate limiting (already in app.js)
- [ ] Use helmet for security headers (already in app.js)

### Nginx Reverse Proxy (Optional but Recommended)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📈 Monitoring & Maintenance

### Monitor Logs

```bash
# Using PM2 (recommended)
pm2 logs daily-discussion

# Or direct with Node
node app.js 2>&1 | tee app.log
```

### Monitor Performance

```bash
# Check memory usage
pm2 monit

# Check disk space
df -h

# Check CPU usage
top
```

### Scheduled Backups

```bash
# Backup database weekly
0 2 * * 0 mysqldump -u user -p database > /backups/daily-discussion-$(date +%Y-%m-%d).sql
```

---

## 📦 Zero-Downtime Deployment (Using PM2)

```bash
# Update code on server
git pull origin main

# Build new React apps
npm run build

# Restart app gracefully
pm2 restart daily-discussion --watch

# Verify it's running
pm2 status
```

---

## 🎯 Quick Reference

### Build for Production

```bash
npm run build
```

### Start Server (Development)

```bash
npm run dev              # Backend only
npm run dev:all         # Backend + Vite servers
```

### Start Server (Production)

```bash
NODE_ENV=production node app.js
```

### With PM2 (Production Recommended)

```bash
pm2 start app.js --name "daily-discussion" --env production
```

---

## 🆘 Emergency Procedures

### Server Crashes

1. Check logs: `pm2 logs`
2. Verify database connection
3. Check disk space: `df -h`
4. Restart: `pm2 restart all`

### Corrupted Build

```bash
# Clean and rebuild
rm -rf public/client public/admin
npm run build
pm2 restart all
```

### Database Connection Issues

```bash
# Check connection
mysql -h DB_HOST -u DB_USER -p DB_NAME

# Verify environment variables
echo $DB_HOST
echo $DB_USER
```

---

## 📞 Production Support

**Common Issues & Solutions:**

| Issue               | Solution                           |
| ------------------- | ---------------------------------- |
| Files not updating  | Clear `public/`, rebuild, restart  |
| API 500 errors      | Check database, review logs        |
| CORS errors         | Verify CORS headers in app.js      |
| Blank pages         | Check DevTools console, verify API |
| Port already in use | Change PORT or kill process        |

---

## ✅ Deployment Checklist

- [ ] Build React apps: `npm run build`
- [ ] Verify `public/client/` and `public/admin/` exist
- [ ] Set `.env` file with all variables
- [ ] Install dependencies: `npm install --production`
- [ ] Test locally: `NODE_ENV=production node app.js`
- [ ] Upload files to server
- [ ] Install dependencies on server
- [ ] Set `.env` file on server
- [ ] Start server with PM2
- [ ] Verify health endpoint
- [ ] Test user app loads
- [ ] Test admin app loads
- [ ] Test API endpoints
- [ ] Set up backups
- [ ] Set up monitoring
- [ ] Document server IP/domain

---

Your React applications are now **fully built and ready to be served by Express in production!** 🎉
