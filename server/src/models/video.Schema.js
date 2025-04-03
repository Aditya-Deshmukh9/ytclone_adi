import mongoose from 'mongoose';

//title, description,url, thumbnailUrl, channel, likes,deslikes, views,commments,createsAt, updatesAt

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'video title is required'],
    },
    description: {
      type: String,
      required: [true, 'video description is required'],
    },
    videoFile: {
      type: String, //Cloudinary video file
      required: true,
    },
    duration: {
      type: Number, //from cloudinary video duration in seconds
      required: true,
    },
    thumbnailUrl: {
      type: String, //thumbnail file URL
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
