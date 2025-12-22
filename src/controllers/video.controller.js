import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination 

    const filter = {};

    if(query) {
        filter.$or = [
            { title : { $regex : query, $options: "i"}},
            { description : { $regex : query, $options: "i"}},

        ]
    }

    if (userId) {
        filter.owner = userId
    }

    const sortOptions = {
        [sortBy] : sortType === "asc" ? 1 : -1,
    };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber
    const video = await Video.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)

    const totalVideos = await Video.countDocuments(filter);
    const totalPages =  Math.ceil(totalVideos/ limitNumber)
    console.log(video);

    video.page = pageNumber
    video.limit = limitNumber
    video.totalPages = totalPages

    return res
    .status(200)
    .json(
        new ApiResponse(200, video , "All the videos fetched successfully")
    )
    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description) {
        throw new ApiError(400, "Title and description cannot be empty")
    }

    const user = await User.findById(req.user?._id)

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "upload the video and thumbnail properly")
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    


    console.log(thumbnailLocalPath)

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "There was some error while uploding your stuff on clodinary")
    }


    const video = await Video.create({
        title,
        description,
        videoFile : videoFile.url,
        duration : videoFile.duration,
        thumbnail : thumbnail.url,
        owner : user._id,
        views
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while registering the Video on database")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video registerd successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId)

    console.log(video)

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title , description} = req.body


    const updateField = {}
    if (title) {
        updateField.title = title
    }

    if (description) {
        updateField.description = description
    }

    if (req.file?.path) {
        const newThumbnail = await uploadOnCloudinary(req.file.path)

        if (!newThumbnail?.url) {
            throw new ApiError(400, "Error uploading thumbnail")
        }

        updateField.thumbnail = newThumbnail.url
    }

    if (Object.keys(updateField).length === 0) {
        throw new ApiError(400, "At least one field is requried to update")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        { $set : updateField},
        {new : true}
    )

    if (!video) {
        throw new ApiError(404, "Cannot retrive the video while updating")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "video detials updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, "video deleted successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findByIdAndUpdate(
        videoId,
        [
            {
                $set:{
                    isPublished: { $not: "$isPublished" }
                }
            }
        ],
        {new : true}
    )

    if (!video) {
        throw new ApiError(400, "cannot fetch the video after updating the toggle status")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , video , "changed the publishing status successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
