from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
COMMANDS_FILE = os.path.join(BASE_DIR, "../../data/commands.json")
CONFIG_FILE = os.path.join(BASE_DIR, "../../data/config.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Command(BaseModel):
    trigger: str
    response: str

class Status(BaseModel):
    status_text: str

def load_json(path, default):
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump(default, f)
    with open(path, "r") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# ---- WebSocket manager for notifications ----
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

@app.websocket("/ws/notify")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep the connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ---- REST endpoints ----

@app.get("/api/commands")
def get_commands():
    return load_json(COMMANDS_FILE, [])

@app.post("/api/commands")
async def add_command(cmd: Command):
    commands = load_json(COMMANDS_FILE, [])
    commands.append(cmd.dict())
    save_json(COMMANDS_FILE, commands)
    await manager.broadcast("update")
    return {"message": "Command added!"}

@app.put("/api/commands/{idx}")
async def edit_command(idx: int, cmd: Command):
    commands = load_json(COMMANDS_FILE, [])
    if idx < 0 or idx >= len(commands):
        raise HTTPException(404, "Command index out of range")
    commands[idx] = cmd.dict()
    save_json(COMMANDS_FILE, commands)
    await manager.broadcast("update")
    return {"message": "Command updated!"}

@app.delete("/api/commands/{idx}")
async def delete_command(idx: int):
    commands = load_json(COMMANDS_FILE, [])
    if idx < 0 or idx >= len(commands):
        raise HTTPException(404, "Command index out of range")
    commands.pop(idx)
    save_json(COMMANDS_FILE, commands)
    await manager.broadcast("update")
    return {"message": "Command deleted!"}

@app.get("/api/status")
def get_status():
    return load_json(CONFIG_FILE, {"status_text": "Ready to serve!"})

@app.post("/api/status")
async def set_status(status: Status):
    save_json(CONFIG_FILE, {"status_text": status.status_text})
    await manager.broadcast("update")
    return {"message": "Status updated!"}