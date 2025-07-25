const mongoose = require("mongoose");
const  mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema =new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*60,
    }
})

//a function to send emails

async function sendVerificationEmail(email,otp){
    // Create a transporter to send emails

	// Define the email options

	// Send the email

    try{
        
            const mailResponse =await mailSender(email,
                "Verification Email from my side",
                emailTemplate(otp));
            
            
            
            
            
            console.log("Email send Successfully:",mailResponse)


    }catch(error){
        console.log("Error in Send otp : ",error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email , this.otp);
    next();
})

module.exports = mongoose.model("OTP",OTPSchema);
