# Discord Bot Dashboard

## Features

- Add, edit, and remove custom slash commands for your Discord bot
- Change the bot’s status in real time
- Modern dark UI with orange accents

## How to run

### Backend (FastAPI)

1. Go to `dashboard/backend`
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the API server:
   ```
   uvicorn main:app --reload
   ```
   The API is now available at `http://localhost:8000`

### Frontend (React + Vite)

1. Go to `dashboard/frontend`
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend server:
   ```
   npm run dev
   ```
   The dashboard is now available at (usually) `http://localhost:5173`.

The frontend is set to proxy `/api` requests to your FastAPI backend.

### Bot integration

- Make sure your bot.py uses the updated integration code (see project root).
- The bot fetches custom commands and status from the dashboard API.
- Add/edit commands or change status in the dashboard, then run `/reload` in Discord (as admin) for instant update.

### Data

- Custom commands are stored in `data/commands.json`
- Bot status is stored in `data/config.json`

## Security

This dashboard does not include authentication. For production, protect the backend API (e.g., with an API key, password, or OAuth).
