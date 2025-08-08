# Deployment Instructions for Cyclic

## Backend Deployment on Cyclic

1. Visit https://app.cyclic.sh
2. Sign in with GitHub
3. Click "Deploy" and select your repository
4. Configure these settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Set Environment Variables in Cyclic:
   ```
   MONGODB_URI=mongodb+srv://pruthvis2004:2C8DWVeuMfKCYQ5v@cluster0.wk9kdhx.mongodb.net/formbuilder?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

6. Deploy and copy the generated URL

## Frontend Deployment (Same as before - Vercel)
- Frontend deployment on Vercel remains the same
- Just update the API URL to point to your Cyclic backend
