const { validateToken } = require("../services/authentication");

function checkforAuthenticationCookie(cookieName){
    return(req,res,next) =>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }
        try {
            // console.log(req.user + "this is authcookie")
            const userpayload = validateToken(tokenCookieValue);
            req.user = userpayload;
            console.log(req.user)
           


            
        } catch (error) {}
         return next();
            
        }
    }


module.exports = {
    checkforAuthenticationCookie
}   