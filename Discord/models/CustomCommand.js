import mongoose from 'mongoose';

const CustomCommandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Command name (e.g., hello)
  action: { type: String, required: true }, // Action type
  message: { type: String }, // Only for Send Message
  createdAt: { type: Date, default: Date.now }
});

const CustomCommand = mongoose.model('CustomCommand', CustomCommandSchema);
export default CustomCommand;