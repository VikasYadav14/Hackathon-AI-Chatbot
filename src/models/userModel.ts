import mongoose, { Document, Model, Schema } from 'mongoose';

// Define TypeScript interface for User document
interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  status: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User Schema
const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

// Avoid model overwrite error
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
