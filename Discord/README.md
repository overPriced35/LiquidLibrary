# LiquidLibrary Discord Bot (Windows Guide)

A modern Discord bot supporting dynamic slash commands and live status—fully managed from a web dashboard!

---

## Features

- **Custom Slash Commands:** The bot fetches commands from the dashboard—no code changes needed for new commands.
- **Live Status:** Change the bot’s status from the dashboard instantly.
- **Real-Time Updates:** Bot uses WebSocket to instantly reload commands and status when updated in the dashboard.
- **Written in Python:** Based on `discord.py`.

---

## Usage (Windows)

### 1. Prerequisites

- Python 3.8+ (Download from [python.org](https://www.python.org/downloads/windows/))
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
- The dashboard backend running (see its README)

### 2. Installation

Open **Command Prompt** and run:

```bat
pip install -r requirements.txt
```

### 3. Environment Variables

You need to set the following environment variables:

- `DISCORD_TOKEN` — Your Discord bot token (required)
- `DASHBOARD_API_URL` — Dashboard API base URL (default: `http://localhost:8000/api`)
- `DASHBOARD_WS_URL` — Dashboard WebSocket URL (default: `ws://localhost:8000/ws/notify`)

Set these in your Command Prompt before running the bot:

```bat
set DISCORD_TOKEN=your_token_here
set DASHBOARD_API_URL=http://localhost:8000/api
set DASHBOARD_WS_URL=ws://localhost:8000/ws/notify
```

*(If you use PowerShell, use `$env:DISCORD_TOKEN="your_token_here"` instead.)*

### 4. Running the Bot

```bat
python bot.py
```

### 5. How It Works

- The bot connects to Discord and to the dashboard's WebSocket.
- Any time you update commands or status in the dashboard, the bot instantly reloads commands and updates its status—no need to restart or reload!
- All custom commands become `/slash` commands in Discord.

---

## Security

- The bot relies on the dashboard API/WebSocket. Secure the backend for public deployments.

---

## Troubleshooting

- If you see errors about missing libraries, make sure to run `pip install -r requirements.txt` first.
- If you see errors about missing environment variables, double-check you set them in **the same Command Prompt window** before running `python bot.py`.

---

## License

MIT