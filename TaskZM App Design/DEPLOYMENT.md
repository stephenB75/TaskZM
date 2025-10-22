# TaskZM Deployment Guide

This guide will help you deploy TaskZM to Railway with Supabase as the backend.

## Prerequisites

- [Railway](https://railway.app) account
- [Supabase](https://supabase.com) account
- Git repository with TaskZM code

## Step 1: Set up Supabase

1. **Create a new Supabase project:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "TaskZM"
   - Set a strong database password
   - Choose a region close to your users

2. **Set up the database schema:**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create tables and policies

3. **Get your Supabase credentials:**
   - Go to Settings > API
   - Copy your Project URL and anon/public key
   - Save these for Railway environment variables

## Step 2: Deploy Backend to Railway

1. **Create a new Railway project:**
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your TaskZM repository

2. **Configure the backend service:**
   - Railway will detect this as a Node.js project
   - Set the root directory to the project root
   - Railway will automatically detect the `server/index.js` file

3. **Set environment variables:**
   - Go to Variables tab in your Railway project
   - Add the following variables:
     ```
     PORT=3001
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     NODE_ENV=production
     ```

4. **Deploy:**
   - Railway will automatically build and deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

## Step 3: Deploy Frontend to Railway

1. **Create a second Railway service:**
   - In the same Railway project, click "New Service"
   - Choose "Deploy from GitHub repo"
   - Select the same repository

2. **Configure the frontend service:**
   - Set the root directory to the project root
   - Railway will detect this as a Vite project

3. **Set environment variables:**
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy:**
   - Railway will build and deploy the frontend
   - You'll get a URL like `https://your-frontend.railway.app`

## Step 4: Configure Supabase Authentication

1. **Set up authentication providers:**
   - Go to Authentication > Settings in Supabase
   - Enable Email provider
   - Configure any additional providers (Google, GitHub, etc.)

2. **Set up redirect URLs:**
   - Add your frontend URL to allowed redirect URLs
   - Add `http://localhost:3000` for local development

3. **Configure email templates:**
   - Customize the email templates for sign-up and password reset

## Step 5: Test the Deployment

1. **Test the backend:**
   - Visit `https://your-backend-url.railway.app/health`
   - Should return a JSON response with status "OK"

2. **Test the frontend:**
   - Visit your frontend URL
   - Try creating an account
   - Test creating, updating, and deleting tasks

## Step 6: Set up Custom Domain (Optional)

1. **In Railway:**
   - Go to your service settings
   - Add a custom domain
   - Follow Railway's DNS instructions

2. **Update Supabase:**
   - Update redirect URLs with your custom domain

## Environment Variables Reference

### Backend (Railway)
```
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
```

### Frontend (Railway)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend.railway.app
```

## Troubleshooting

### Common Issues:

1. **CORS errors:**
   - Ensure your frontend URL is added to Supabase's allowed origins
   - Check that the API URL is correct

2. **Authentication not working:**
   - Verify Supabase URL and keys are correct
   - Check that redirect URLs are configured

3. **Database connection issues:**
   - Verify the database schema was created correctly
   - Check that RLS policies are enabled

4. **Build failures:**
   - Check Railway logs for specific error messages
   - Ensure all dependencies are in package.json

### Getting Help:

- Check Railway logs in the dashboard
- Check Supabase logs in the dashboard
- Review the browser console for frontend errors
- Check the network tab for API call failures

## Next Steps

Once deployed, you can:
- Set up monitoring and alerts
- Configure automated backups
- Set up CI/CD for automatic deployments
- Add custom domains
- Scale resources as needed
