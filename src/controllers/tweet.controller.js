import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    // Steps to complete the todo : 
    // input the content of the tweet : Owner : taken on who is logged in , content from the body
    // Then create a new model and save it in the database

    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "Send a comment to register")
    }

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(500, "Cannot get the user in tweet")
    }

    console.log(user);
    

    const tweet = await Tweet.create({
        content,
        owner : user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if (!userId) {
        throw new ApiError(500, "Cannot get the user in tweet")
    }
    console.log(userId);
    

   const userTweets = await Tweet.find({
    owner: userId
})

    return res
    .status(200)
    .json(
        new ApiResponse(200, userTweets, "User tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    // TODO's : 
    // Accect the content and userid to check for the vaerifid user
    // then check if the user is logged in or not 
    // then find the tweet using the id and update it with content

    const {content} = req.body
    const {tweetId} = req.params

    if (!content || !tweetId) {
        throw new ApiError(400, "either content or tweet id is missing make sure to check them both")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set : {
                content: content
            }
        },
        {new: true}

    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Updated the tweet")
    )


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if (!tweetId) {
        throw new ApiError(400, "Tweet id has not been recieved")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Deleted the tweet successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
