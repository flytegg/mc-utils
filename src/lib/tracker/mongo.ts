import mongoose from "mongoose"

// @ts-ignore
mongoose.connect(process.env['MONGO_TRACKING_URI'])
export const trackerCollection = mongoose.connection.useDb("mc-utils").collection("tracker")
