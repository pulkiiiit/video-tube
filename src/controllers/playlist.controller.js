import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "There was some error while fetching the userId")
    }
    const playlist = await Playlist.create({
        name : name,
        description: description,
        videos : [],
        owner : userId
    })

    if(!playlist){
        throw new ApiError("there was some mistake in while registering playlist to DB")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist , "create your playlist successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const {userId} = req.params

    if (!userId) {
        throw new ApiError(400, "Cannot find the user")
    }

    const userPlaylist = await Playlist.find({owner : userId})

    if (!userPlaylist) {
        throw new ApiError(400 , "cannnot get userPlaylist from the API")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, userPlaylist, "Fetched the user playlist successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!playlistId) {
        throw new ApiError(400, "please sed the proper playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "Cannot get the playlist from the DB")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist , "Fectched your playlist sucessfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!playlistId) {
        throw new ApiError(400, "Provide the Api Error properly")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Deleted the playlist")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!playlistId || !name || !description) {
        throw new ApiError(400, "Some Error with playlistId , Name  and description")
    }

    const video = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : {
                name : name,
                description : description
            }
        }
    )

    if(!video){
        throw new ApiError(400, "cannot update the video in DB")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video , "updated the playlist successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
