# AssetFlow - IT Asset Management

A robust IT Asset Management system designed for modern organizations, featuring inventory tracking, staff assignments, and AI-powered audit summaries.

## How to Push to GitHub

To push this project to your own GitHub repository, follow these steps:

1. **Create a new repository** on GitHub (go to [github.com/new](https://github.com/new)). Do **not** initialize it with a README, license, or gitignore.
2. **Open your terminal** in the root of this project.
3. **Initialize Git** (if not already initialized):
   ```bash
   git init
   ```
4. **Add all project files**:
   ```bash
   git add .
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "initial: setup asset management system with AI features"
   ```
6. **Add the remote origin**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
   *(Replace the URL above with the actual URL from your new GitHub repository)*
7. **Set the branch and push**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Key Features

- **Inventory Management**: Track PCs, Laptops, Phones, and Tablets.
- **Staff Directory**: Manage personnel and their assigned equipment.
- **AI Lifecycle Summaries**: GenAI analyzes asset history to provide concise lifecycle overviews.
- **Audit Trail**: Automatically track changes in ownership and acquisition types.
- **Reporting**: Generate snapshots of inventory distribution and status.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI**: Genkit with Google Gemini
- **Icons**: Lucide React
- **Charts**: Recharts
