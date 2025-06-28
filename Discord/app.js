import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import commandsRouter from './routes/commands.js';
import rolesRouter from './routes/roles.js';
import modpermsRouter from './routes/modperms.js';

const app = express();

app.use(express.json());
app.use('/api/commands', commandsRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/modperms', modpermsRouter);

app.get('/', (req, res) => res.send("Bot API Running"));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
});