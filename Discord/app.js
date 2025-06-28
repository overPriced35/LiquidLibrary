import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import commandsRouter from "./routes/commands.js";
import rolesRouter from "./routes/roles.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use("/api/commands", commandsRouter);
app.use("/api/roles", rolesRouter);

app.listen(3001, () => {
  console.log("API server running on port 3001");
});