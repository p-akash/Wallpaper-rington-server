import mongoose, { Schema, SchemaTypes } from "mongoose";
import timestamps from "mongoose-timestamp";

const ObjectId = SchemaTypes.ObjectId;
const mediaSchema = Schema({
  name: String,
  publish: Boolean,
  imagePath: String,
  fileName: String,
  title: String,
  tag: [],
  description: String,
  mediaType: String,
  download: Number,
  mediaTypeId: ObjectId,
  categoryId: ObjectId,
  userId: ObjectId
}).plugin(timestamps);
export const Media = mongoose.model("media", mediaSchema);
