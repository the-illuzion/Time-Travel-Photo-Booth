<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1le8tQFwp248ZELGj3VY3fZQeojunUUxS

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages Deployment

This repository includes automated deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages** in your repository:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **The workflow will automatically deploy** when you push to the `copilot/deploy-github-pages-workflow` branch

3. **Manual deployment** can be triggered via the Actions tab using the "workflow_dispatch" event

### Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) performs the following steps:
- Checks out the code
- Sets up Node.js environment
- Installs dependencies
- Builds the production bundle
- Deploys to GitHub Pages

### Access Your Deployed App

Once deployed, your app will be available at:
`https://the-illuzion.github.io/Time-Travel-Photo-Booth/`
