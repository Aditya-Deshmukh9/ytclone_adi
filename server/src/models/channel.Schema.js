import mongoose, { Model } from 'mongoose';

// name, description, owner,subscribers,videos

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'channel name is required'],
      unique: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Channel = new Model('Channel', ChannelSchema);

export default Channel;
