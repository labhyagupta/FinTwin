# FinTwin — Microfinance Group Risk Monitoring & ML Stress Diffusion

A modern, accessible web application for microfinance lending circles (such as the Mwangaza Circle) that models financial distress and mutual-guarantee transmission across connected borrowers through an organic spiderweb graph visualization.

## Features

- **Orb Weaver Spiderweb Network Graph**: Visualizes mutual guarantees and co-bound lending ties across borrowers.
- **Light & Dark Mode**: Default calm pastel palette (soft cream, sage green, pastel yellow) with full light/dark responsiveness.
- **Dynamic Stress Simulation**: Test unexpected economic events (crop failure, medical emergencies, price drops) and observe real-time multi-month contagion.
- **Support & Remedies**: Compare cascade mitigation through grace periods, liquidity relief, or loan restructuring.
- **In-Browser Machine Learning & Synthetic Dataset Studio**:
  - Generates parameterized synthetic lending circle datasets (150 - 1,000 samples) with 14 financial and topological features.
  - Multi-variable gradient descent training in TypeScript to predict 6-month contagion stress with R² and MAE evaluation metrics.
  - Real-time model inference simulator and JSON dataset export.

## Tech Stack

- **Frontend**: React 18+, TypeScript, Tailwind CSS, Lucide Icons
- **Visualization**: D3.js & SVG radial web coordinate projection
- **ML / Data**: Custom In-Browser Gradient Descent Trainer & Synthetic Dataset Generator

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Pushing to GitHub

To push this repository to GitHub:

1. **Option A (AI Studio UI)**:
   - Click the **Settings** menu (top-right gear icon) in Google AI Studio.
   - Select **Export to GitHub** to link and push directly to your GitHub repository.

2. **Option B (Command Line / Git)**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Financial Nexus with ML dataset studio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
