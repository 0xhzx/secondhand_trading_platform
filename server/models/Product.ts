import { Double } from 'mongodb';
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    // product_id: number;
    // category_id: number;
    product_name: string;
    price: number;
    seller_id: string;
    description: string;
    image_url: string;
    used_status: string;
    modified_at: Date;
    is_sold: boolean;
    is_deleted: boolean;
}

// create Mongoose Schema
const ProductSchema: Schema = new Schema({
    // product_id: { type: Number, required: true },
    // category_id: { type: Number, required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true }, // Double is a type from mongodb
    seller_id: { type: String, required: true },
    description: { type: String, required: false },
    image_url: { type: String, required: false },
    used_status: { type: String, required: true },
    modified_at: { type: Date, required: false },
    is_sold: { type: Boolean, required: true, default: false },
    is_deleted: { type: Boolean, required: true, default: false },
});

// create Mongoose model
const Product = mongoose.model<IProduct>('Product', ProductSchema, 'product');

export default Product;