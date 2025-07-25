const Course = require("../models/Course");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/user")
const Category = require("../models/Category");

const {uploadImageToCloudinary}= require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

//createCourse handler function

exports.createCourse = async(req,res) =>{
        try{
            console.log("ENTER1 backend")
              //fetch data
              const {courseName,courseDescription,whatYouWillLearn,price,category,tag,instructions,status} = req.body;
 
              //get thumbnail
              const thumbnail = req.files.thumbnailImage ;

              //validation
            //  
               if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail  ){
                return res.status(400).json({
                    success:false,
                    message:"All fields are mandatory",
                 }); 
               }

               console.log("ENTER2 backend")


               //check for instructor
               const instructorId = req.user.id;
               const instructorDetails = await User.findById(instructorId);
               console.log("Instructor Detail : ",instructorDetails );
               //todo : verify that userid and instructorDetaisl._id are same or different ? ?
            //    Ans same hai bhai   
               console.log("ENTER3 backend")
               if(!instructorDetails){
                   return res.status(404).json({
                    success:false,
                    message:'Instructor Details not found',
                   })
               }

               //check given category is valid or not
            //    No need if you made a dropdown
               const categoryDetails = await Category.findById(category);
               console.log("ENTER4 backend")
               if(!categoryDetails){
                     return res.status(404).json({
                    success:false,
                    message:'category Details not found',
                   })
               }

            //    upload image to cloudinary
            const thumbnailImage =await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
            // it will ki height and other custom property bhej rhe yaa nhi 
            
            console.log("ENTER5 backend")

            // create an entry for new courses
             const newCourse = await Course.create({
                courseName,
                courseDescription,
                instructor: instructorDetails._id,
                whatYouWillLearn:whatYouWillLearn,
                price,
                tag,
                category:categoryDetails._id,
                thumbnail:thumbnailImage.secure_url,
                instructions,
                status
             })

             console.log("ENTER6 backend")


             //add the new course to the user schema of instructor

             await User.findByIdAndUpdate(
                {_id:instructorDetails._id},
                {
                    $push :{
                        courses : newCourse._id,
                    }
                },
                {new:true},
             );

             console.log("ENTER7 backend")

             //update the tag ka schema 

             await Category.findByIdAndUpdate(
                {_id: category},
                {
                    //$set is a MongoDB update operator used to set or update the value of one or more fields in a document.
                    // $push is a MongoDB operator that appends a value to an array field
                    $push:{
                        courses:newCourse._id,
                    }
                },
                {new:true},
             );
                console.log("ENTER8 backend")
            //  return response
            return res.status(200).json({
                success:true,
                message:"courses created successfully",
                data:newCourse,
            });


        }catch(error){
                  console.error(error);
                  return res.status(500).json({
                    success:false,
                    message:"Failed to create course",
                    
                  })
        }
      };

      //get all courses handler function

       exports.getAllCourses = async(req,res)=>{
            try{
                 const allCourses = await Course.find({status:"Published"},{
                                         courseName:true,
                                         price:true,
                                         thumbnail:true,
                                         instructor:true,
                                         ratingAndReviews:true,
                                         studentsEnrolled:true,
                                                   })
                                         .populate("instructor")  
                                         .exec();  
                                         
                    return res.status(200).json({
                        success:true,
                        message:"Data for all courses fetched successfully",
                        data:allCourses,
                    })  
                                         


            }catch(error){
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:'Cannot Fetch Course data',
                    error:error.message,
                })
            }
        }



        // Edit Course Details
        exports.editCourse = async (req, res) => {
        try {
            // ,status
            console.log("Body",req.body);
            const { courseId  } = req.body
            // if (status) {
            //     course.status = status;
            // }
            // const updates = req.body
            //use below line becoz req.boby is not plain body
            const updates = { ...req.body };
            console.log("Update",updates);
            const course = await Course.findById(courseId)

            if (!course) {
            return res.status(404).json({ error: "Course not found" })
            }

            // If Thumbnail Image is found, update it
            // if (req.files) {
            // console.log("thumbnail update")
            // const thumbnail = req.files.thumbnailImage
            // const thumbnailImage = await uploadImageToCloudinary(
            //     thumbnail,
            //     process.env.FOLDER_NAME
            // )
            // course.thumbnail = thumbnailImage.secure_url
            // }

            // Update only the fields that are present in the request body
            for (const key in updates) {
            // hasOwnProperty checks whether the updates object directly contains a property named key,
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                // Receive stringified arrays/objects from a frontend form
                // Need to store or manipulate them in their original format on the backend
                //  instructions field is an array, not just a string.
                course[key] = JSON.parse(updates[key])
                } else {
                course[key] = updates[key]
                }
            }
            }
            //  save() function in case of update instead of making new entry in mongoosa save() vs create()
            await course.save()

            const updatedCourse = await Course.findOne({
            _id: courseId,
            })
            // .populate({
            //     path: "instructor",
            //     populate: {
            //     path: "additionalDetails",
            //     },
            // })
            .populate("category")
            // .populate("ratingAndReviews")
            // .populate({
            //     path: "courseContent",
            //     populate: {
            //     path: "subSection",
            //     },
            // })
            .exec()

            res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            })
        }
        }




 

       



//get one single CourseDetails
//use when catalog me jab specific category ke specific course ki jarurat pde tab 

exports.getCourseDetails = async(req,res)=>{
           try{
                  //get id 
                  const {courseId} = req.body;
                  //find course details
                  const courseDetails = await Course.findOne({ _id: courseId })
                            .populate("category")
                            .populate({
                                path: "courseContent",
                                populate: {
                                    path: "subSection",
                                    select: "-videoUrl",
                                }
                            })
                            .populate({
                                path: "instructor",
                                populate: {
                                    path: "additionalDetail",
                                    options: { strictPopulate: false }
                                }
                            })
                            .exec();


                      //validation
                      
                      if(!courseDetails ){
                        return res.status(400).json({
                            success:false,
                            message:`could not find the course with ${courseId}`,
                        })
                      }

                        if (courseDetails.status === "Draft") {
                        return res.status(403).json({
                            success: false,
                            message: `Accessing a draft course is forbidden`,
                        })
                        }


                        

                     return res.status(200).json({
                               success:true,
                               message:"Course Details fetched successfully",
                               data:courseDetails,
                     })


           }catch(error){
                   console.log(error);
                   return res.status(500).json({
                    success:false,
                    message:error.message,
                   })
           }
}

// ek course ki saari detail use in jab viddeo lecture dekhna ho student ko 

exports.getFullCourseDetails = async (req, res) => {
  try {

    console.log("setCourseSpecificDetails call reaches at backend 1")
    const { courseId } = req.body
    // console.log("courseId",courseId)
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetail", 
        },
      })
      .populate("category")
      // // .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
      console.log("CourseDetails->",courseDetails)
      console.log("setCourseSpecificDetails call reaches at backend 2")

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    if (courseDetails.status === "Draft") {
      return res.status(403).json({
        success: false,
        message: `Accessing a draft course is forbidden`,
      });
    }

    // let totalDurationInSeconds = 0
    // courseDetails.courseContent.forEach((content) => {
    //   content.subSection.forEach((subSection) => {
    //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
    //     totalDurationInSeconds += timeDurationInSeconds
    //   })
    // })

    let totalDurationInSeconds = 0;

   courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const rawDuration = subSection?.timeDuration;

        // Ensure duration is a valid number string before parsing
        const timeDurationInSeconds = parseInt(rawDuration);
        
        if (!isNaN(timeDurationInSeconds)) {
          totalDurationInSeconds += timeDurationInSeconds;
        }
      });
    });


    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}




// // Get a list of Courses for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    console.log("fetchInstructorCourses call comes to backend");

    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })
    
        console.log("fetchInstructorCourses call response gone to frontend");

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}



// // Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}





