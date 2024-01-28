const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const isAuthenticated =(req, res, next)=>{
    const headers = req.headers.authorization;
    if(!headers || !headers.startsWith('Bearer ')){
        return res.status(403).json({status:"Fail",message:"Forbidden"})
    }

    const token = headers.split(" ")[1]; // Bearer esquyfdagdasjb122323asbdjmbjwq2ye1uhbk

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id
        next()
    }
    catch(err){
        return res.status(403).json({status:"Fail", message: err.message})
    }
}

module.exports = isAuthenticated;