# Cobre Analyst Portfolio

Interactive portfolio application for the Cobre Business Analyst Assessment.

## Features

- **Strategic Insights**: Visualization of key findings (USD->MXN failure rates, root cause).
- **Interactive Dashboard**: Operational metrics with drill-down capabilities.
- **AI SQL Agent**: Chatbot connected to the SQLite database (50k records).
- **Design System**: Cobre-branded UI components using Tailwind CSS and Framer Motion.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Environment Variables:
   Create a `.env.local` file with:
   ```
   OPENAI_API_KEY=sk-...
   ```

## Data Pipeline

The data is generated from the Python analysis scripts.
To regenerate data:
```bash
cd ..
source venv/bin/activate
python scripts/generate_web_data.py
```
This updates `public/data/*.json` and `public/assessment.db`.

## Deployment

Deploy to Vercel:
1. Push to GitHub.
2. Import project in Vercel.
3. Set `OPENAI_API_KEY` in Vercel Project Settings.
4. Deploy.
