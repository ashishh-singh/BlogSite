const mongoose = require("mongoose")
const {Schema} = require("mongoose")


const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        // required:true
    },
    body:{
        type:String,
        require:true,
    },
    coverImage: {
        type:String,
        require:false,
    },
    createdBy: {
        // type:schema.Types.ObjectId,
        type: Schema.Types.ObjectId ,
        ref:"blog",
    },
}, {timestamps: true})

const Blogentry = mongoose.model("entry", blogSchema);

module.exports = Blogentry