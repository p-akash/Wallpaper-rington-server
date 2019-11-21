import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const categorySchema = Schema({
  name: String
}).plugin(timestamps);

export const Category = mongoose.model("category", categorySchema);
