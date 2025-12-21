import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User} from "../models/user.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
    const userId = req.user?._id 
    if(!userId){
        throw new ApiError(400, "cannot find the user")
    }
    const  likeDoc = await Like.findOne({video : videoId , likedBy: userId})
    if (!likeDoc) {
        const like = await Like.create({
            video : videoId,
            likedBy: userId
        })
        if (!like) {
            throw new ApiError(400, "There was some error while registering your Like in DB")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, like , "like has been registered successfully on the video" )
        )
    }else{
        await Like.findByIdAndDelete(likeDoc._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, "like has been removed successfully on the video")
        )
    }
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {commentId} = req.params
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "error in getting the user")
    }

    const likeDoc = await Like.findOne({comment: commentId, likedBy: userId})

    if(!likeDoc){
        const like = await Like.create({
            comment : commentId,
            likedBy: userId
        })
        if (!like) {
            throw new ApiError(400, "cannot regieter you like on DB")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200, like , "Your like is registered successfully on the comment")
        )
    }else {
        await Like.findByIdAndDelete(likeDoc._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, "like has been removed successfully on the comment")
        )

    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "cannot get the user")
    }

    const likeDoc = await Like.findOne({tweet:tweetId , likedBy:userId})

    if(!likeDoc){
        const like = await Like.create({
            tweet : tweetId,
            likedBy: userId
        })
        if (!like) {
            throw new ApiError(400, "cannot regieter you like on DB")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200, like , "Your like is registered successfully on the comment")
        )
    }else{
        await Like.findByIdAndDelete(likeDoc._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, "like has been removed successfully on the comment")
        )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id

    const likedVideos = await Like.find({likedBy: userId})

    return res
    .status(200)
    .json(
        new ApiResponse(200, likedVideos, "Fetched all the liked videos successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}