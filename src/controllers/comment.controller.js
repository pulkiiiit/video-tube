import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User} from "../models/user.model.js"
import jwt from "jsonwebtoken"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId) {
        throw new ApiError(400, "provide a valid videoId")
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1)*limitNumber
    const comment = await Comment.find().skip(skip).limit(limitNumber)

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "got all the comments")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const {videoId} = req.params
    const user = await User.findById(req.user?._id)
    if (!content || !videoId || !user) {
        throw new ApiError(400, "Either VideoId, content, or user is missing")
    }

    const comment = await Comment.create({
        content ,
        video : videoId,
        owner : user._id
    })

    return res
    .status (200)
    .json(
        new ApiResponse(200, comment ,"created the comment")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {updatedContent} = req.body
    const {commentId} = req.params

    if (!updatedContent || !commentId) {
        throw new ApiError(400, "Either updatedContent or commentId is missing")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content : updatedContent
            }
        },
        {new : true}
        
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "updated the comment")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if (!commentId) {
        throw new ApiError(400, "comment Id is missing")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, "comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
