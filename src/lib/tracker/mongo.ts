import mongoose from "mongoose"
import {platform} from "os";

// @ts-ignore
mongoose.connect(platform.env.MONGO_TRACKING_URI)
export const trackerCollection = mongoose.connection.useDb("mc-utils").collection("tracker")
