import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
  const { name, description } = req.body;
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "There was some error while fetching the userId");
  }
  const playlist = await Playlist.create({
    name: name,
    description: description,
    videos: [],
    owner: userId,
  });

  if (!playlist) {
    throw new ApiError(
      "there was some mistake in while registering playlist to DB"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "create your playlist successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "Cannot find the user");
  }

  const userPlaylist = await Playlist.find({ owner: userId });

  if (!userPlaylist) {
    throw new ApiError(400, "cannnot get userPlaylist from the API");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userPlaylist,
        "Fetched the user playlist successfully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!playlistId) {
    throw new ApiError(400, "please sed the proper playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Cannot get the playlist from the DB");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Fectched your playlist sucessfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;

  if (!playlistId || !videoId || !userId) {
    throw new ApiError(400, "either playlist , video or user id is missing");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(
      400,
      "There might be some isssue while retreving the playlist from the DB"
    );
  }

  const ownerId = playlist.owner;

  if (userId.toString() !== ownerId.toString()) {
    throw new ApiError(
      400,
      "Current logged in user is not the owner of he playlist"
    );
  }

  const video = await Video.findById(videoId);

  console.log(video);

  if (videoId.toString() !== video._id.toString()) {
    throw new ApiError(
      400,
      "The video id that you ahve shared does not exist in video model"
    );
  }

  if (playlist.videos.some((v) => v.toString() === videoId)) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "The video already exists in the playlist"
        )
      );
  } else {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $push: {
          videos: videoId,
        },
      },
      { new: true }
    ).populate("videos");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Successfully added the video to your playlist"
        )
      );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  const userId = req.user?._id;

  if (!playlistId || !videoId || !userId) {
    throw new ApiError(400, "either playlist , video or user id is missing");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(
      400,
      "There might be some isssue while retreving the playlist from the DB"
    );
  }

  const ownerId = playlist.owner;

  if (userId.toString() !== ownerId.toString()) {
    throw new ApiError(
      400,
      "Current logged in user is not the owner of he playlist"
    );
  }

  if (playlist.videos.some((v) => v.toString() === videoId)) {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: {
          videos: videoId,
        },
      },
      { new: true }
    ).populate("videos");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Removed the video from the playlist successfully"
        )
      );
  } else {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "The video already exists in the playlist"
        )
      );
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId) {
    throw new ApiError(400, "Provide the Api Error properly");
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res.status(200).json(new ApiResponse(200, "Deleted the playlist"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!playlistId || !name || !description) {
    throw new ApiError(
      400,
      "Some Error with playlistId , Name  and description"
    );
  }

  const video = await Playlist.findByIdAndUpdate(playlistId, {
    $set: {
      name: name,
      description: description,
    },
  });

  if (!video) {
    throw new ApiError(400, "cannot update the video in DB");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "updated the playlist successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
