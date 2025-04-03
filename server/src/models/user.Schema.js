import { Schema, model } from 'mongoose';

// username, email, password, profilepic

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
    },
    avatar: {
      type: String, //cloudinary URL needed
      default: 'https://avatar.iran.liara.run/public/boy',
    },
    coverImage: {
      type: String, //cloudinary URL needed
    },
    password: { type: String, required: [true, 'password is required'] },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = new model('User', userSchema);

export default User;
