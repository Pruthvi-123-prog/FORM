# Deployment Instructions for Alternative Platforms

## 🎯 **RECOMMENDED: Render.com (Best Railway Alternative)**

### Why Render?
- ✅ Generous free tier (750 hours/month)
- ✅ Similar to Railway's simplicity
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration

### Steps:
1. **Go to Render.com**
   - Sign up at https://render.com
   - Connect your GitHub account

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `form-builder-backend`
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://pruthvis2004:2C8DWVeuMfKCYQ5v@cluster0.wk9kdhx.mongodb.net/formbuilder?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.vercel.app
   ```

4. **Deploy & Get URL**
   - Render will provide a URL like: `https://your-app.onrender.com`

---

## 🚀 **Alternative Option: Cyclic.sh**

### Why Cyclic?
- ✅ Extremely generous free tier
- ✅ No sleep/cold starts
- ✅ Easy deployment

### Steps:
1. **Go to Cyclic.sh**
   - Visit https://app.cyclic.sh
   - Sign in with GitHub

2. **Deploy Repository**
   - Click "Deploy"
   - Select your form-builder repository
   - It auto-detects Node.js

3. **Configure**:
   - Root directory: `server`
   - Environment variables (same as above)

---

## 💡 **Option: Glitch.com (Beginner-friendly)**

### Steps:
1. Go to https://glitch.com
2. Click "New Project" → "Import from GitHub"
3. Import your repository
4. Configure environment variables
5. Your app runs instantly!

---

## 🔧 **Quick Setup Commands**

Run these to prepare for any platform:
