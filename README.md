# Cyberpunk GHOSTrunners: Ghost Index Analyzer

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)

**Ghostrunners** is a full-stack intelligence tool designed to expose "Ghost Jobs" in the corporate world. By analyzing corporate job requisition data and recent public contract awards, it calculates a **Corporate Ghost Index (CGI)** and an **Operational Health Score**.

It leverages headless browser automation (Puppeteer) to query real-time AI search engines and process the raw intelligence into a sleek, *Cyberpunk: Edgerunners* inspired interface.

---

## ✨ Features

- **Neon Cyberpunk UI**: A highly stylized, terminal-like interface featuring authentic glitch animations, aggressive neon colors, and custom clip-path geometry.
- **Real-Time Data Extraction**: Utilizes Puppeteer to securely automate and scrape data from modern AI search engines such as Perplexity, Felo, etc...
- **Data Matrix Breakdown**:
  - **Estimated Total**: Cross-references official career portals to find total open requisitions.
  - **Suspected Ghost Reposts**: Estimates the volume of stale or endlessly recycled job postings.
  - **Recent Contracts**: Pulls recent public revenue signals to balance the health score.
- **Algorithmic Scoring**:
  - **Corporate Ghost Index (CGI)**: The probability that current open roles are stale or "ghost" jobs.
  - **Operational Health**: A 1-100 score weighing job vitality against revenue signals.

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Tailwind CSS v4 (Custom configured for Cyberpunk aesthetics)
- Lucide React (Icons)
- Framer Motion (Transitions)
- TypeScript

**Backend:**
- Node.js & Express
- Puppeteer (Headless Chromium Automation)
- Vite (Development Server & Middleware)
- ESBuild

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

Clone the repository to your local machine, then use the provided setup scripts based on your OS:

**Windows:**
Double-click `install.bat` or run:
```cmd
.\install.bat
```

**Linux/macOS:**
Make the script executable and run it:
```bash
chmod +x install.sh
./install.sh
```
*(Alternatively, you can just run `npm install` in the project root).*

### Running in Development

To start the local development server (which spins up both the frontend and the Express backend):

```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

> *Note: The first search query may take an extra 10-15 seconds as Puppeteer launches the headless browser instance in the background and waits for DOM rendering.*

### Building for Production

To compile the application into a standalone production build:

```bash
npm run build
npm start
```
This will bundle the React frontend into `dist/` and compile the Express server for standard execution.

---

## 👾 Troubleshooting

- **Puppeteer Launch Errors (Linux)**: If you are running this on a Linux server or WSL, you may need to install Chromium dependencies. See the [Puppeteer Troubleshooting Guide](https://pptr.dev/troubleshooting).
- **Timeouts / Missing Data**: The application relies on scraping DOM elements from `felo.ai`. If their UI updates, the Puppeteer selectors in `server.ts` may need adjustments. Rate-limiting can also occur if you spam requests.

---

<p align="center">
  <b>&copy; 2026 Team Gecko</b>
</p>
