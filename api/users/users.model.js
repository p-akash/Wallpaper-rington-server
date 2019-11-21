import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const userSchema = Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  mobileNo: String,
  onboardingStatus: String,
  passwordResetIteration: Number,
  passwordResetStatus: String,
  passwordResetDate: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Number },
  lastLoginAttempt: { type: Date }
}).plugin(timestamps);

export const Users = mongoose.model("users", userSchema);
