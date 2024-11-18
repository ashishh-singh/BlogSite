const mongoose = require("mongoose")

function mongoConnection(url){
    mongoose.connect(url)
}

// module.exports = mongoConnection;