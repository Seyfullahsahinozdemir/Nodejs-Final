import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: String,
    required: true,
  },
});
const OtpModel = mongoose.model("Otp", OtpSchema);

export default OtpModel;
