import User from '../models/user.Schema.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);

    throw new ApiError(
      500,
      'Something went while generating refresh and access Token'
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User with email or username already exists');
  }

  const avatarPath = req.file?.path;

  //if use not upload avatar then
  let uploadedAvatar = {
    url: 'https://res.cloudinary.com/dxo5lxx5e/image/upload/c_thumb,w_200,g_face/v1743855895/oe7it5rz5o3msddiwlps.png',
    public_id: 'no',
    secure_url: 'no',
    width: 200,
    height: 200,
    format: 'png',
  };

  // if use upload avatar then upload on cloudinary
  if (avatarPath) {
    const uploadOptions = {
      folder: 'avatar',
      transformation: [
        {
          width: 200,
          height: 200,
          crop: 'fill',
          gravity: 'faces', // smart cropping based on detected face
        },
      ],
    };

    uploadedAvatar = await uploadOnCloudinary(avatarPath, uploadOptions);

    if (!uploadedAvatar) {
      throw new ApiError(500, 'Something went wrong while uploading avatar');
    }
  }

  const avatarData = {
    url: uploadedAvatar?.url,
    public_id: uploadedAvatar?.public_id,
    secure_url: uploadedAvatar?.secure_url,
    width: uploadedAvatar?.width,
    height: uploadedAvatar?.height,
    format: uploadedAvatar?.format,
  };

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarData,
  });

  const registerUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!registerUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  return res.status(200).json(
    new ApiResponse(200, 'User Successfully Register', {
      data: { user: registerUser },
    })
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  //get details from user
  //validation for non empty
  //check user exits
  //check password is correct
  //generate access token
  //login use give it details save token in cookies

  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalud user credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, 'User Successfully Logged In', {
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
      })
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json({
      success: true,
      message: 'User logged Out',
    });
});
