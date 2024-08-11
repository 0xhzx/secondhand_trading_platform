import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  user_id: string;
  name: string;
  email: string;
  roles: string[];
  is_deleted: boolean;
}


// create Mongoose Schema
const UserSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  roles: { type: [String], required: false },
  is_deleted: { type: Boolean, required: true, default: false },
});

// create Mongoose model
const User = mongoose.model<IUser>('User', UserSchema, 'user');

export default User;
