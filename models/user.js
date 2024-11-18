const mongo = require("mongoose")
const {createHmac, randomBytes} = require("crypto");
const {validateToken, createtoken} = require("../services/authentication")

const schema = new mongo.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    salt:{
        type: String,
        require:true
    },

    password:{
        type: String,
        require:true,

    },
    gender:{
        type:String,    
        enum: ["male", "female", "other"],
        require:true,
    },

    profile:{
        type:String,
        default: function(){
            return this.gender === 'male' ? '/images/male.jpg' : 'images/female.jpg';
        }
        
    },
    role:{
        type: String,
        enum:["USER", "ADMIN"],
        default: "USER",

    }




}, {timestamps: true})


schema.static("matchpasswordandGenerateToken", async function(username, password){
    const user = await this.findOne({username})
    // console.log(`the user is ${user}`)
    if (!user){ 
        return false
        throw new Error ("no user found")
        };
    
    const salt = user.salt;
    // console.log(`the salt or key is ${salt} and the username and password is ${username}, ${password}`)
    const currentpassword = user.password
    // console.log(currentpassword)
    const hasedpassword = createHmac("sha256", salt).update(password).digest("hex");
    // console.log(`${hasedpassword} and the saved password is ${currentpassword}`)
    if (hasedpassword === currentpassword){
        console.log("enter in if block")
        const token = createtoken(user)
        return token
        // return ({...user._doc, password:undefined, salt:undefined});
    }
    else{
        console.log("enter in else block")
        return false
        throw new Error ("Password is incorrect")
        
    }
})

schema.pre("save", function (next) {
    const user = this;
    
    if(!user.isModified("password")) return false;

    const key = randomBytes(16).toString();
    // const key = "hasedit"
    const hashedPassword = createHmac("sha256", key).update(user.password).digest("hex");
    this.salt = key;
    this.password = hashedPassword;
    next();

})



const user = mongo.model("blog", schema)

module.exports = user;