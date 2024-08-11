import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    // order_id: number;
    buyer_id: string;
    seller_id: string;
    product_id: mongoose.Types.ObjectId;
    modified_at: Date;
    created_at: Date;
    is_deleted: boolean;
    order_status: string | null;
}

// create Mongoose Schema
const OrderSchema: Schema = new Schema({
    // order_id: { type: Number, required: true },
    buyer_id: { type: String, required: true },
    seller_id: { type: String, required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    modified_at: { type: Date, required: false },
    created_at: { type: Date, required: false },
    is_deleted: { type: Boolean, required: true, default: false },
    order_status: { type: String, required: false, default: "fulfilled" } // not fulfilled / fulfilled
});

const Order = mongoose.model<IOrder>('Order', OrderSchema, 'order');

export default Order;
