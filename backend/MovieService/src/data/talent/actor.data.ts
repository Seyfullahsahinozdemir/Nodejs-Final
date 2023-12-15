import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
  biography: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  birthDate: {
    type: Date,
  },
  movies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});
const ActorModel = mongoose.model("Actor", ActorSchema);

export default ActorModel;
