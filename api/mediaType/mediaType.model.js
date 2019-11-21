import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const mediaTypeSchema = Schema({
  name: String
}).plugin(timestamps);

export const MediaType = mongoose.model("mediatype", mediaTypeSchema);
