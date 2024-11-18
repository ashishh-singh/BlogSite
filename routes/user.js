const {Router} = require("express")
const user = require("../models/user")

const route = Router()



route.get("/login", (req,res) =>{
    return res.render("login")
})

route.get("/logout", (req,res) => {
    const user = req.user
    console.log(user)
    res.clearCookie('value', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.redirect("/login")
})

route.get("/signup", (req,res) => {
    return res.render("signup")
})



route.post("/signup", async (req,res) => {
    const { username, password, email, gender, role} = req.body;
    console.log(req.body)
    await user.create({
        username: username,
        password:password,
        gender:gender,
        email:email,

        
     })
    .then(() =>  res.redirect("/"))
    .catch((err) => {
        console.log(err)
        return res.render("signup", {err: "Something went wrong"})
    })

    // return res.render("home", {name : username})

})

route.post("/home", async (req,res) => {
    const {username, password} = req.body;
    // const loginuser = await user.findOne({
    //     username:username,
    //     password: password,

    // })
    // console.log(`the username and password is ${username}, ${password}`)
    const token = await user.matchpasswordandGenerateToken(username, password)
    console.log(token)
    // console.log(user)
    res.cookie("value", token)
    if(!token){
        return res.render("login", {error: "User credentials are invalid"})
    }
    console.log("just before redirect")
    console.log(req.user)
    return res.redirect("/")

    // .then(() => res.render("home")).catch((err) => {
    //     console.log(err)
    //     return res.render("login" , {error: "User credentials are invalid"})
    // })

    // if(!userdetail){
    //     return res.render("login", {error: "User credentials are invalid"})
    // }
    
    // if(userdetail == user){
    // return res.render("home", {name: username})
    // }

})

route.get("/find/user", async(req,res) => {
    const userDetail = await user.find({})
    return res.json(userDetail)
})

route.get("/delete/user", async (req,res) =>{
    const alluser = await user.deleteMany({})
    if (alluser.deletedCount ===0){
        return res.json({status: "no user is deleted ",
            alluser: alluser
        })
    }
    else{
    return res.json({status: `all entites are deleted. Total entery deleted are ${alluser.deletedCount}`})
    }
})


module.exports = route;