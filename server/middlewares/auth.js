const  jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

//auth

exports.auth = async (req, res, next) => {
  try {

    console.log("PAYMENT");
    console.log("🛡️ [AUTH] Token checking started");
    console.log("👉 Header Authorization:", req.header("Authorization"));

    const rawToken = req.header("Authorization");
    const token =
      req?.cookies?.token ||
      req?.body?.token ||
      (rawToken && rawToken.replace("Bearer ", ""));

    console.log("🔑 Extracted Token:", token);
    // debugger; // Uncomment this line if you're using a debugger tool like VS Code

    if (!token) {
      console.warn("⚠️ [AUTH] Token is missing");
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is undefined");
        return res.status(500).json({
          success: false,
          message: "Server misconfigured: Missing JWT_SECRET",
        });
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ [AUTH] Token Decoded:", decode);
      req.user = decode;
      next();
    } catch (err) {
      console.error("❌ [AUTH] Token verification failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
        error: err.message,
      });
    }
  } catch (error) {
    console.error("🔥 [AUTH] Unexpected Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
      error: error.message,
    });
  }
};
//isStudent

exports.isStudent = async(req,res,next)=>{
         try{
                if(req.user.accountType !== "Student"){
                    return res.status(401).json({
                        success:false,
                        message:'This is protected route for student only',
                    });
                }
                next();
         }  
         catch(error){
            return res.status(500).json({
                success:false,
                message:'User role cannot be verified',
            })
         }
}


//isinstructor
exports.isInstructor = async(req,res,next)=>{
         try{
                if(req.user.accountType !== "Instructor"){
                    return res.status(401).json({
                        success:false,
                        message:'This is protected route for Instructor only',
                    });
                }
                next();
         }  
         catch(error){
            return res.status(500).json({
                success:false,
                message:'User role cannot be verified',
            })
         }
}


//isAdmin

exports.isAdmin = async(req,res,next)=>{
         try{
                 console.log("req.user.accountType",req.user.accountType);
                if(req.user.accountType !== "Admin"){
                    return res.status(401).json({
                        success:false,
                        message:'This is protected route for isAdmin only',
                    });
                }
                next();
         }  
         catch(error){
            return res.status(500).json({
                success:false,
                message:'User role cannot be verified',
            })
         }
}
