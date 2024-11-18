require("dotenv").config()
const express = require("express")
const app = express();
const mongo = require("mongoose")
const PORT = process.env.PORT || 8000
const path = require("path");
const route = require("./routes/user")
const connection = require("./connection")
const cookieParser = require("cookie-parser");
const blogroute = require("./routes/blog")
const blog = require("./models/blog")
const { checkforAuthenticationCookie } = require("./middleware/authentication");

app.set("uploads", path.resolve('/public/uploads'))
app.set("uploads", path.resolve("/public/images"))
// app.set("public", path.resolve("./public"))
app.use(express.static(path.join(__dirname, './public')));
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())
app.use(checkforAuthenticationCookie('value'));
app.use("/", route)
app.use("/", blogroute)

Mongo_URL = 'mongodb+srv://autophileashish:Myblog@blog.dhs5b.mongodb.net/'

mongo.connect(process.env.Mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true })).then((e)=> console.log("MongoDb is connected" + Mongo_URL))
// mongo.connect("mongodb://localhost:27017/bloguser").then(() => console.log(`Server is connected to mongoose`)).catch((err) => console.log(err))

const html = `
<h1 style="text-align:center; margin-top:50px; color:red;">
Hello word
</h1>
`
route.get("/", async(req,res) =>{
    const blogs = await blog.find({}).populate("createdBy")
    
    
    
    res.render("home", {user: req.user,
       
        blog :blogs
        
        
    })

})

app.listen(PORT ,() => console.log(`Server started at port: ${PORT}`))
