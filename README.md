# DevPulse Enhanced 🚀

**DevPulse Enhanced** is a production-ready developer productivity dashboard designed to visualize engineering metrics, identify delivery bottlenecks, and provide actionable AI-driven insights for both individual contributors and engineering managers.

![DevPulse Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **Individual Contributor (IC) View**: 
  - Personal productivity metrics (Lead Time, Cycle Time, PR Throughput).
  - **Bottleneck Analysis**: Automatically identifies the stage (Development, PR Review, Deployment) causing the most delay.
  - **Health Score**: A composite score reflecting overall delivery health.
- **Manager View**: 
  - Team-level aggregate metrics.
  - **Health Signals**: Quick indicators of team flow (e.g., "Healthy Flow" vs "High Wait Time").
- **AI Insights**: Contextual observations with evidence, conclusions, and recommended actions.
- **Dynamic Visuals**: Glassmorphic UI with vibrant data visualization.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS (Glassmorphism design).
- **Backend**: Node.js, Express 5.
- **Data**: JSON-based mock database (easily swappable for PostgreSQL/MongoDB).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Vaishnavi835/devpulse-enhanced.git
   cd devpulse-enhanced
   ```
2. Install dependencies for all packages:
   ```bash
   npm install
   ```

### Running Locally
To start both the frontend and backend in production-ready mode:
```bash
npm start
```
The app will be available at `http://localhost:3001`.

## 📦 Project Structure

```text
├── backend/            # Express server and API routes
│   ├── metrics.json    # Metrics data
│   ├── managers.json   # Team/Manager data
│   └── server.js       # Main API & Static File server
├── frontend/           # React application
│   ├── src/            # Components, logic, and styling
│   └── dist/           # Built production files
├── package.json        # Root orchestration scripts
└── render.yaml         # Deployment configuration for Render
```

## 🌐 Deployment

This project is optimized for deployment on **Render**, **Vercel**, or **Railway**.

### Deploy to Render
1. Connect your GitHub repository to Render.
2. Render will automatically detect the `render.yaml` blueprint.
3. Click **Apply** and wait for the build to finish.

## 📄 License
This project is licensed under the MIT License.
