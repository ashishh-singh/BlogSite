const  express = require("express")
// const app  = express()
const route = express.Router();


const multer = require("multer")
const user = require("../models/user")
const blog = require("../models/blog")
const path = require("path");
const comment = require("../models/comment");



// path.join(__dirname, 'public', 'uploads');
// path.resolve("/public/uploads");
route.use(express.static(path.join(__dirname, '../public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })


route.get("/blog", (req,res) => {
    return res.render("blogform", {user: req.user})
})



route.post("/blog",upload.single("coverImage"), async (req,res) => {
    const {title,  body}= req.body
    console.log(req.file)
    const coverImage = req.file
    console.log(req.body, coverImage)
    console.log(title, coverImage, body)
    const blogadd = await blog.create({
        title:title,
        coverImage: coverImage.filename,
        body:body,
        createdBy: req.user._id
    })
    res.status(200).redirect("/")
})

route.get("/blog/:id", async (req,res) => {
  // console.log(req.params.id)
  const blogdetail = await blog.findById(req.params.id).populate("createdBy")
  const com = await comment.find({blogId:req.params.id}).populate("createdBy")
  console.log(blogdetail)
  console.log(req.user)

  console.log(com + "this is comment of specific blog id")
  
  res.render("blogPage", {
    blog: blogdetail,
    user: req.user,
    comment: com,
  
  })

})

route.post("/blog/comment/:blogId", async (req,res) => {
  const com = await comment.create({

    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogId,



  })

  return res.redirect(`/blog/${req.params.blogId}`);

}
);

route.get("/delete/blog", async (req,res) => {
  const deleteBlog = await blog.deleteMany({})
  if( deleteBlog.deletedCount == 0){
    res.send("not deleted")
  }
  else{
    res.send(`delete ${deleteBlog.deletedCount}`)
  }

})
route.get("/find/blog", async (req,res )=> {

  const blogs = await blog.find({})
  res.json(blogs)
})

route.get("/delete/comment",  async (req,res) => {
  const delecom = await comment.deleteMany({})
  if(delecom.deletedCount == 0){
    res.send("no comment is left to delete")
  }
  else{
    res.send("delte" + delecom.deletedCount)
  }
})

module.exports = route