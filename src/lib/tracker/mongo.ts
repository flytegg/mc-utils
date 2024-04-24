import {MONGO_TRACKING_URI} from "$env/static/private";

const mongoose = require('mongoose');
mongoose.connect(MONGO_TRACKING_URI)

export const trackerCollection = mongoose.connection.useDb("mc-utils").collection("tracker")
