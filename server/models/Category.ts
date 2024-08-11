import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  category_id: number;
  category_name: string;
  parent_id: number | null;
  is_deleted: boolean
}

// create Mongoose Schema
const CategorySchema: Schema = new Schema({
  category_id: { type: Number, required: true },
  name: { type: String, required: false },
  description: { type: String, required: false },
});

// create Mongoose model
const Category = mongoose.model<ICategory>('Category', CategorySchema, 'category');
export default Category;