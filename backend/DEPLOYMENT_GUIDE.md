# Deployment Guide: Pushing Backend to Art-Ecommerce-backend Repository

This guide explains how to push the backend directory to a separate repository called `Art-Ecommerce-backend`.

## Option 1: Using Git Subtree Split (Recommended)

This method preserves the git history for the backend directory.

1. **Create the new repository on GitHub:**
   - Go to GitHub and create a new repository named `Art-Ecommerce-backend`
   - Don't initialize it with README, .gitignore, or license (we have these already)

2. **Split the backend directory into its own branch:**
   ```bash
   cd /path/to/Art-Ecommerce-v2
   git subtree split -P backend -b backend-only
   ```

3. **Create a new directory and initialize it:**
   ```bash
   cd ..
   mkdir Art-Ecommerce-backend
   cd Art-Ecommerce-backend
   git init
   ```

4. **Pull the backend-only branch:**
   ```bash
   git pull ../Art-Ecommerce-v2 backend-only
   ```

5. **Add the remote and push:**
   ```bash
   git remote add origin https://github.com/hrithiknl17/Art-Ecommerce-backend.git
   git branch -M main
   git push -u origin main
   ```

6. **Clean up the temporary branch:**
   ```bash
   cd ../Art-Ecommerce-v2
   git branch -D backend-only
   ```

## Option 2: Simple Copy Method

This method is simpler but doesn't preserve git history.

1. **Create the new repository on GitHub:**
   - Go to GitHub and create a new repository named `Art-Ecommerce-backend`
   - Don't initialize it with README, .gitignore, or license

2. **Copy the backend directory:**
   ```bash
   cd /path/to/somewhere
   cp -r /path/to/Art-Ecommerce-v2/backend Art-Ecommerce-backend
   cd Art-Ecommerce-backend
   ```

3. **Initialize git and push:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Backend server with Cloudinary integration"
   git remote add origin https://github.com/hrithiknl17/Art-Ecommerce-backend.git
   git branch -M main
   git push -u origin main
   ```

## After Pushing to Separate Repository

Once the backend is in its own repository:

1. **Update the main repository:**
   - You may want to add `backend/` back to the root `.gitignore` file in Art-Ecommerce-v2
   - Or remove the backend directory entirely if it's no longer needed in the main repo

2. **Set up CI/CD:**
   - Consider setting up deployment workflows for the backend
   - Configure environment variables in your hosting platform

3. **Update documentation:**
   - Update the main repository's README to point to the separate backend repository
   - Document how the frontend and backend interact

## Keeping Both Repositories in Sync

If you want to keep the backend in both repositories:

1. Use git submodules:
   ```bash
   # In Art-Ecommerce-v2 directory
   git rm -r backend
   git commit -m "Remove backend directory"
   git submodule add https://github.com/hrithiknl17/Art-Ecommerce-backend.git backend
   ```

2. Or maintain them separately and sync changes manually as needed.

## Testing the Separated Backend

After pushing to the new repository:

1. Clone the new repository:
   ```bash
   git clone https://github.com/hrithiknl17/Art-Ecommerce-backend.git
   cd Art-Ecommerce-backend
   ```

2. Set up and run:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm start
   ```

3. Verify the server starts on port 5000 and the upload endpoint works.
