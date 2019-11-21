import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const roleSchema = Schema({
  name: String
}).plugin(timestamps);

export const Role = mongoose.model("role", roleSchema);
