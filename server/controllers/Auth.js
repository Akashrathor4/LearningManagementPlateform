  const User = require("../models/user");
  const OTP = require("../models/otp");
  const otpgenerator = require("otp-generator");
  const Profile = require("../models/Profile");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  require("dotenv").config();

// sendOTP
     
      exports.sendOTP = async (req,res) => {
        try{

            //fetch email from request body
           const {email} = req.body;

            // check if user already exist
            const checkUserPresent = await User.findOne({email});
            //if user already exist then return a resp
            if(checkUserPresent){
                return res.status(401).json({
                    success:false,
                    message:'User already registered',
                })
            }

            //generate otp 

            var otp = otpgenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });

            console.log("otp generated",otp);

            //check unique otp or not

            const result = await OTP.findOne({otp:otp});
            while(result){
                otp = otpgenerator.generate(6,{
                    upperCaseAlphabets:false,
                    lowerCaseAlphabets:false,
                    specialChars:false,
                });
                result = await OTP.findOne({otp:otp});
            }


           //const otpPayload = {email,otp};

            //create an entry for otp
             const otpBody =await OTP.create(
               {
                            email,
                            otp,
               }
             );
             console.log("OTP BODY",otpBody);

            //return response

           return  res.status(200).json({
                success:true,
                message:"OTP Sent Successfully",
                otp,
            })


        }catch(error){
                 console.log(error);
                 return res.status(500).json({
                    success:false,
                    message:error.message,
                 })
        }

      }

// signup

exports.signUp = async (req,res) =>{
     try{

        //data fetch from request body
         const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
         } = req.body;
        //validate karlo 
         if(!firstName||!lastName|| !email||!password|| !confirmPassword|| !otp ){
            return  res.status(403).json({
                success:false,
                message:"Fill all field",
                
            })
         }

        //password match 2
         if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Passwords does not matched'
            })
         }

        //already user exist

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist",
            })
        }

        console.log("existingUser",existingUser);
        
        //fetch most recent one otp
          const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
          console.log("recentOtp",recentOtp);
        //  recentOtp is an array
        
        console.log("recentOtp[0]",recentOtp[0].otp);

        //validate otp
        

        if(recentOtp.length == 0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:'recentOtp not found',
            })
        }else if(otp != recentOtp[0].otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }

        //hash password 

        const hashedPassword = await bcrypt.hash(password,10);

        //crete entry in db

         const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
         })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetail:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,  

        })
        //return res
        return res.status(200).json({
            success:true,
            message:'SignUp successfully',
            user,
        })

     }catch(error){
         console.log(error);
         return res.status(500).json({
            success:false,
            message:"SignUp Failed",
         })
     }
}

//login


  exports.login = async (req,res) =>{
             try{
                 //get data from req. body
                 const {email,password} = req.body;

                 //validation data
                 if(!email  || !password){
                    return res.status(403).json({
                        success:false,
                        message:'Fill Carefully',
                    });
                 }
                 //user check exit
                 const user = await User.findOne({email}).populate("additionalDetail");
                 if(!user){
                    return  res.status(401).json({
                        success:false,
                        message:"User is not Registered ",  
                    })
                 }
                 console.log("User",user);
                 //create jwt after password matching
                 if(await bcrypt.compare(password,user.password)){

                    const payload = {
                        email :user.email,
                        id:user._id,
                        accountType:user.accountType,
                    }

                    const token = jwt.sign(payload , process.env.JWT_SECRET,{
                        expiresIn : '2h',
                    })

                    console.log("token",token);

                    user.token = token;
                    user.password = undefined;



                    //create cookies and send response
                    const options = {
                        expires:new Date(Date.now()+3*24*60*60*1000),
                        httpOnly:true,
                    }

                    res.cookie("token",token,options).status(200).json({
                        success:true,
                        token,
                        user,
                        message:'logged in Successfully',
                    })
                 }

                 else{
                    return res.status(401).json({
                        success:false,
                        message:'Password is incorrect',
                    })
                 }
            
             }catch(error){
                  console.log(error);
                  return res.status(500).json({
                    success:false,
                    message:'Login failure',
                  })
             }
  };


// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};