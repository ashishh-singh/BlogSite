const JWT = require("jsonwebtoken")

const secret = "$uperMan"

function createtoken(user){
    const payload = {
        _id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
        profile:user.profile,

    }
    const token = JWT.sign(payload, secret)
    return token;
}

function validateToken(token){
    const check = JWT.verify(token, secret);
    console.log(check + "this is the token when we validate the token")
    return check;

    
}

module.exports = {
    createtoken,
    validateToken
}