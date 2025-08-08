# Deployment Guide for Form Builder Application

## Prerequisites
- GitHub account
- Railway account (for backend deployment)
- Vercel account (for frontend deployment)
- MongoDB Atlas database (already configured)

## Step 1: Initialize Git Repository (if not already done)

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit - Form Builder Application"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/form-builder.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

1. **Go to Railway Dashboard**
   - Visit https://railway.app and sign in
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your form-builder repository

2. **Configure Railway Settings**
   - Root Directory: `/server`
   - Build Command: `npm install`
   - Start Command: `npm run start`

3. **Set Environment Variables in Railway**
   ```env
   MONGODB_URI=mongodb+srv://pruthvis2004:2C8DWVeuMfKCYQ5v@cluster0.wk9kdhx.mongodb.net/formbuilder?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Railway will automatically deploy your backend
   - Copy the generated Railway URL (e.g., `https://your-app-name.railway.app`)

## Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com and sign in
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Vercel Settings**
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Set Environment Variables in Vercel**
   ```env
   REACT_APP_API_BASE_URL=https://your-railway-backend-url.railway.app
   ```

4. **Deploy**
   - Vercel will automatically deploy your frontend
   - Copy the generated Vercel URL

## Step 4: Update CORS Settings

1. **Update Railway Environment Variables**
   - Go back to Railway dashboard
   - Update the `CORS_ORIGIN` environment variable with your Vercel URL
   - Redeploy the Railway app

## Step 5: Final Verification

Test the deployed application:

1. **Visit your Vercel frontend URL**
2. **Create a new form**
3. **Add questions of different types**
4. **Publish the form**
5. **Fill out and submit the form**
6. **Check responses in the dashboard**

## Environment Variables Summary

### Backend (Railway)
```env
MONGODB_URI=mongodb+srv://pruthvis2004:2C8DWVeuMfKCYQ5v@cluster0.wk9kdhx.mongodb.net/formbuilder?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_BASE_URL=https://your-railway-backend-url.railway.app
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure the CORS_ORIGIN in Railway matches your Vercel URL exactly
2. **API Connection Issues**: Verify the REACT_APP_API_BASE_URL in Vercel is correct
3. **Database Connection**: Check MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)

### Logs:
- **Railway**: Check deployment logs in Railway dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **MongoDB**: Check connection logs in MongoDB Atlas

## Post-Deployment Checklist

- [ ] Backend deployed successfully on Railway
- [ ] Frontend deployed successfully on Vercel
- [ ] Environment variables configured correctly
- [ ] CORS settings updated
- [ ] Database connection working
- [ ] All form types working (Categorize, Cloze, Comprehension)
- [ ] Form creation and submission working
- [ ] Response analytics working
- [ ] Mobile responsive design verified

## URLs

Once deployed, update these URLs in your README:

- **Frontend**: https://your-form-builder.vercel.app
- **Backend API**: https://your-api.railway.app
- **GitHub Repository**: https://github.com/yourusername/form-builder

Your Form Builder application is now live and ready for use!
