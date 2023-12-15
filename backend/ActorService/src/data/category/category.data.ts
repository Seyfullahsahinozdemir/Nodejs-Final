import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
