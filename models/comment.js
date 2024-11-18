const mongoose = require("mongoose")
const {Schema} = require("mongoose")

const commentBlock  = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"blog",

    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref:"entry",
    }
},{timestamps:true}
);

const comment = mongoose.model("commentBlog", commentBlock)

module.exports = comment;