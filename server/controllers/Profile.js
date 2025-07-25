const Profile = require("../models/Profile");
const User = require("../models/user");
const Course = require("../models/Course")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration");


require("dotenv").config();
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.updateProfile = async(req,res) => {
       try{
             console.log("Backend call aa gyi")
             
             //get data
             const {dateOfBirth="",about="",contactNumber,gender,firstName ='' , lastName=''}  = req.body;
             //get userId
             const id = req.user.id;
             console.log("Backend 2 call aa gyi")
             //validation
             if(!contactNumber||!gender||!id){
                return res.status(400).json({
                    success:false,
                    message:'All field are required',
                })
             }
              console.log("Backend 3 call aa gyi")
            //  findprofile
             const userDetails = await User.findById(id);
             const profileId = userDetails.additionalDetail;
             console.log("Backend 4 call aa gyi")
             const profileDetails = await Profile.findById(profileId);
             //update profile
            //  similiar line to user.token
              // profileDetails.firstName = firstName ; 
              // profileDetails.lastName = lastName ; 
              profileDetails.dateOfBirth = dateOfBirth;
              profileDetails.about = about;
              profileDetails.gender = gender;
              profileDetails.contactNumber = contactNumber;
              await profileDetails.save();

              console.log("Backend 5 call aa gyi",profileDetails)

              // Find the updated user details
              const updatedUserDetails = await User.findById(id)
                .populate("additionalDetail")
                .exec()
               // issue was in additionalDetail naming
              console.log("Backend 6 call aa gyi",updatedUserDetails)

             //return response
             console.log("profile just before send ",profileDetails)
             return res.status(200).json({
                success:true,
                message:'Profile Updated Successfully',
                updatedUserDetails,
             })
       }catch(error){   
                return res.status(500).json({
                    success:false,
                    message:"error while updatin profile",
                })
       }
}


// Delete Account controller
//HW how can we schedule this deletion operation
//cron jobs
exports.deleteAccount = async(req,res)=>{
        try{

            //get id
            const id = req.user.id;
            //validation
            const userDetails = await User.findById(id);
            if(!userDetails){
                return res.status(404).json({
                    success:false,
                    mesaage:'User not found',
                });
            }
            //jisbhi course me vo enrolled usko delete karna hoga 
            //delete profile
            await Profile.findByIdAndDelete({_id:userDetails.additionalDetail});
            
            //TODO[testing] : HW unenroll user from all enrolled courses
            //delete user
            await User.findByIdAndDelete({_id:id});

            //return response
            return res.status(200).json({
                success:true,
                message:'User Deleted Successfully',
            })

        }catch(error){
                 return res.status(500).json({
                    success:false,
                    message:"error while deleting profile",
                })
        }
}

exports.getAllUserDetails = async (req,res)=>{
    try{
           //get id
           const id = req.user.id;
           
           //validation and get user details
           const userDetails = await User.findById(id).populate("additionalDetail").exec();

           //return response
           return res.status(200).json({
            success:true,
            message:'User Date fetched Successfully',
            userDetails,
           })
    }catch(error){
             return res.status(500).json({
                    success:false,
                    message:"error while fetching data",
                })
    }
}


//updateProfilePicture

exports.updateDisplayPicture = async(req,res) => {
    try{
         console.log(" call at backend before ")
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        //store the picture on cloundinary
        const image = await uploadImageToCloudinary(
                    displayPicture,
                    process.env.FOLDER_NAME,
                    1000,
                    80    
        )

        console.log(" call at backend before ")

        console.log(image)

        const updatedProfile = await User.findByIdAndUpdate({_id:userId},
                        {image:image.secure_url},
                        {new:true},
        )
        
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            data: updatedProfile,
        })

    }catch(error){
                return res.status(500).json({
                success:false,
                message:" Unable to update Profile ",
                error:error.message,

        })
    }

}

//get all courses

exports.getEnrolledCourses = async (req, res) => {
  try {
    console.log("getEnrolledCourse backend 1")
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

      //progress calculate krne ke liye enrolled courses ki calulation hai 
      userDetails = userDetails.toObject() 
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }

      console.log("getEnrolledCourse backend 2")
    // userDetails = userDetails.toObject()
   

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }

    console.log("getEnrolledCourse backend 3")
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};


exports.instructorDashboard = async(req,res) =>{
  try{
       const courseDetails = await Course.find({instructor:req.user.id});
       
       const courseData = courseDetails.map((course)=>{
            const totalStudentsEnrolled = course.studentsEnrolled?.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            //create an new object with the additional field

            const courseDataWithStats = {
               _id : course._id,
               courseName : course.courseName,
               courseDescription : course.courseDescription,
               totalStudentsEnrolled,
               totalAmountGenerated,
            }

            return courseDataWithStats;

       })

       res.status(200).json({courses:courseData});
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Internal Server Error"});
  }
}
