import mongoose from "mongoose";

const DefaultCommandSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, default: true }
});

DefaultCommandSchema.index({ guildId: 1, name: 1 }, { unique: true });

export default mongoose.model("DefaultCommand", DefaultCommandSchema);