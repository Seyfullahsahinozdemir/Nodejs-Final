import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
  preferences: {
    gender: String,
    phone: String,
    address: String,
    about: String,
    birthDate: Date,
  },
});
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
