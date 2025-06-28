import mongoose from "mongoose";

const CustomCommandSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  name: { type: String, required: true },
  action: { type: String, required: true },
  content: String,
  roles: [String],
  channel: String
});

CustomCommandSchema.index({ guildId: 1, name: 1 }, { unique: true });

export default mongoose.model("CustomCommand", CustomCommandSchema);