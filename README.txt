Ghost Index Analyzer - Setup Instructions
=========================================

This is a full-stack React application with an Express backend using Vite, Puppeteer, and Tailwind CSS.
The UI is themed after "Cyberpunk: Edgerunners".

## Prerequisites

1.  **Node.js**: Ensure you have Node.js (v18 or higher) installed on your machine.
    You can check if it is installed by running:
    `node -v`

2.  **npm**: Comes with Node.js. Check the version with:
    `npm -v`

## Installation

1.  **Clone or extract the repository** to your local machine.

2.  **Install dependencies**:
    Navigate to the root directory of the project in your terminal and run:
    `npm install`

    This will install all necessary packages, including React, Express, Vite, Tailwind CSS, Puppeteer, and Lucide React.

## Configuration

Since this application uses Puppeteer to scrape data from `felo.ai`, it does not strictly require a Gemini API Key to function for the primary search, but it still loads the environment setup.

1.  **Copy the environment file**:
    Create a `.env` file based on the example:
    `cp .env.example .env`

    You can optionally provide a `GEMINI_API_KEY` in the `.env` file if you plan to extend the AI capabilities later.

## Running the Application (Development Mode)

To start the development server (which starts the Express backend and Vite frontend together), run:

`npm run dev`

The application will be accessible at:
http://localhost:3000

*Note: Since Puppeteer runs a headless Chrome instance to scrape search results, the first search query might take a few extra seconds as it launches the browser in the background.*

## Building for Production

To build the application for production deployment:

1.  **Build the app**:
    `npm run build`

    This creates a `dist` folder containing the compiled frontend and backend code.

2.  **Start the production server**:
    `npm start`

    The production server will run on port 3000 by default.

## Troubleshooting

-   **Puppeteer Errors**: If you encounter errors launching Puppeteer on Linux, you may need to install missing system dependencies for Chromium. See the Puppeteer troubleshooting guide: https://pptr.dev/troubleshooting
-   **Rate Limiting**: If you do a lot of queries back-to-back, `felo.ai` might temporary rate-limit the headless browser. Just wait a few moments before trying again.

## Tech Stack
- Frontend: React 19, Tailwind CSS v4, Lucide React, Framer Motion
- Backend: Express, Puppeteer (Headless Browser Scraping)
- Build Tooling: Vite, tsx, esbuild
