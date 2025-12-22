import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ifError } from "assert"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const {channelId} = req.params
    const userId = req.user._id

    if (!userId || !channelId) {
        throw new ApiError(400, "Either user id or channel ID is missing")
    }

    if (userId === channelId) {
        throw new ApiError(400, "User cannot subscriber to itself")
    }

    const subscriptionDoc = await Subscription.findOne({subscriber : userId , channel : channelId})

    if(!subscriptionDoc){

        const subscription = await Subscription.create({
            subscriber : userId,
            channel : channelId
        })

        if (!subscription) {
            throw new ApiError(400, "There might be some trouble while registering the data on DB")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, subscription , "Registered your subscription successfully")
        )
    }else {

        await Subscription.findByIdAndDelete(subscriptionDoc._id)
        
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Removed the subscription successfully")
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params

    if(!subscriberId){
        throw new ApiError(400 , "proveide a valid channel id")
    }

    const listOfSubscribersOfChannel = await Subscription.find({channel : subscriberId}).select("-channel");

    if (!listOfSubscribersOfChannel) {
        throw new ApiError("cannot get list of subscriber of a channel from the DB")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, listOfSubscribersOfChannel ,"Fetched the list of subscriber of a channel")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "Please send a vallid channel id")
    }

    const listOfChannelUserHasSubscribedTo = await Subscription.find({subscriber : channelId}).select("-subscriber");

    if (!listOfChannelUserHasSubscribedTo) {
        throw new ApiError(400, "Cannot get the channels that user has subcribed to")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, listOfChannelUserHasSubscribedTo , "Here are the list of channels that user has subscribed to")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}