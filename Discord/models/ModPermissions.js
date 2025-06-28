import mongoose from 'mongoose';

const ModPermissionsSchema = new mongoose.Schema({
  command: { type: String, required: true, unique: true }, // e.g. 'kick'
  roles: [{ type: String }] // Array of allowed role IDs
});

const ModPermissions = mongoose.model('ModPermissions', ModPermissionsSchema);
export default ModPermissions;