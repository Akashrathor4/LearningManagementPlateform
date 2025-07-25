const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create SubSection

exports.createSubSection = async (req,res) =>{
    try{

         //fetch data from req body
         // Extract necessary information from the request body
        const { sectionId, title, description } = req.body;

         //extract video from files
         const video = req.files.videoFile;
        
        //  validation
        // 
         if(!sectionId || !title  || !description || !video  ){
            return res.status(400).json({
                success:false,
                message:"All Field are required ",
            });
         }
         //upload video to cloudinary
         const uploadDetails =await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        // create a subsection
         const subSectionDetails = await SubSection.create({
                  title:title,
                  timeDuration: `${uploadDetails.duration}`,
                  description:description,
                  videoUrl:uploadDetails.secure_url,
         })
        //update  Section with this sub section objectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                  {
                                    $push :{
                                        subSection:subSectionDetails._id,
                                    }
                                  },
                                  {
                                    new:true 
                                  }
        ).populate("subSection")
        //HW log updated section here ,  after adding populate query
        
        //return response

        return res.status(200).json({
              success:true,
              message:'Sub section Created Successfully',
              data:updatedSection,
        })


    }catch(error){

        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })

    }
}

//HW updated subsection
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      // if (req.files && req.files.video !== undefined) {
      //   const video = req.files.video
      //   const uploadDetails = await uploadImageToCloudinary(
      //     video,
      //     process.env.FOLDER_NAME
      //   )
      //   subSection.videoUrl = uploadDetails.secure_url
      //   subSection.timeDuration = `${uploadDetails.duration}`
      // }
  
      await subSection.save()
  
      const updatedSection = await Section.findById(sectionId).populate("subSection")


      return res.json({
        success: true,
        //we send updated section not course careful at front yha phase the frontend me direct course me daal di thi ye value
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }


  //HW delete subsection
  
  exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        //we send updated section not course careful at front yha phase the frontend me direct course me daal di thi ye value
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }

