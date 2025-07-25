
const User  = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken(sending mail)
 exports.resetPasswordToken = async(req,res)=>{
     try{
            //get email from req body
            const email = req.body.email;
            //check user for this email , email validation
            const user = await User.findOne({email:email});
            if(!user){
                return res.json({
                    success:false,
                    message:'Your Email is not registered with us'
                })
     }
     //generate token
     //this token is a simple kinda unique number
     const token = crypto.randomUUID();
        //update user by adding token and expiration

        const updatedDetails = await User.findOneAndUpdate(
                    {email:email},
                    {
                        token:token,
                        resetPasswordExpire:Date.now()+60*60*1000,
                    },
                    {new:true}

      );

     //create url for front end
     const url = `http://localhost:3002/update-password/${token}`

     //send mail containing the url
     await mailSender(email,
            "Password Reset link",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
     );
     //return response

     return res.json({
        success:true,
        message:`Email Sent Successfully , please check email`,
     });
     }
     catch(error){
           return res.status(500).json({
        success:false,
        message:`error occured while Reset , please check leter`,
       })
     }
 }

//resetPassword (save in db  )

exports.resetPassword =async(req,res)=>{
    try{
            // data fetch 
            const {password , confirmPassword,token} = req.body;
            //validation
            if(password!=confirmPassword){
                return res.json({
                    success:false,
                    message:'Password not matching',
                });
            }
            //get userdetails from db using token
            const userDetails = await User.findOne({token:token});
            //if no entry - invalid token
            if(!userDetails){
                return res.json({
                    success:false,
                    message:'token is invalid',
                });
            }
            //token time check
            if(userDetails.resetPasswordExpire < Date.now()){
                return res.json({
                    success:false,
                    message:'Token is Expired , please regenerate',
                });
            }
            //hash password
            const hashedPassword = await bcrypt.hash(password,10);
            //password update
            await User.findOneAndUpdate(
                {token:token},
                {password:hashedPassword},
                {new:true},
            );
            //return response
            return res.status(200).json({
                success:true,
                message:"Password reset successfully"
            });
    }catch(error){
           return res.status(500).json({
        success:false,
        message:`error occured while Reset , please check leter`,
       })
     }
}