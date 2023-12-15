import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  comments: [
    {
      content: { type: String, required: true },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      point: { type: Number, required: true },
    },
  ],
  actors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Actor",
    },
  ],
  directors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Actor",
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const MovieModel = mongoose.model("Movie", MovieSchema);

export default MovieModel;
